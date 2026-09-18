import { useEffect, useMemo, useRef, useState } from "react";
import { motion, useMotionValue, useTransform, type MotionValue } from "framer-motion";
import OrtuBird, { type BirdRig } from "./OrtuBird";

/**
 * The Ortu crow, flying out of the logo and living on the page.
 *
 * WHAT IT DOES
 *
 *   It is born in the navbar logo. The logo is this same crow on a sage disc,
 *   and the bird is exactly the logo crow's size and colour, so it is placed over
 *   the logo's crow and the logo's own copy is hidden underneath
 *   (data-empty on data-bird-nest). After a moment it flies out.
 *
 *   HERO mode, while you are at the top of the page: it sits on the hero's
 *   download button, breathes, blinks, looks about, hops, and often takes a
 *   flight of one to three random waypoints around the hero before coming back.
 *
 *   ORBIT mode, as soon as you start scrolling: it circles the navbar's download
 *   button, and every so often lands on top of it for a while before circling
 *   again. (It can sit there only because it is logo-sized: at its old size the
 *   button's top edge put the bird at y = -12px, out of sight.)
 *
 *   Every 45-75s it flies home to the logo, lands back in the badge, sits there
 *   for a few seconds, then flies out again. It shifts into the logo's colours
 *   as it comes in, so the landing is indistinguishable from the logo itself.
 *
 * HOW IT FLIES
 *
 *   A small flight simulation, not a set of tweens. Every frame it integrates
 *   steering, gravity, the lift its own wingbeat makes, and drag; its pose is
 *   derived from the resulting velocity. It pitches to its flight path, banks
 *   into turns, tucks its legs once airborne, reaches them forward to land, and
 *   holds its head level while its body pitches. Two rules keep it sane:
 *
 *   1. STEERING ALWAYS DOMINATES, so gravity can never strand it or throw it off
 *      screen. Gravity and lift supply character — the flap-and-glide undulation
 *      of a real bird's path — never control.
 *   2. THE FLAP IS A CLOSED LOOP, not an animation: it beats harder when below
 *      where it wants to be and glides when above.
 *
 * It never intercepts a click, it is aria-hidden, it renders nothing under
 * prefers-reduced-motion, and it renders nothing on the server, so the
 * prerendered HTML — logo included — is untouched. The simulation writes only
 * to MotionValues, so a bird in flight causes zero React re-renders.
 *
 * Markup anchors: data-bird-nest (the logo), data-bird-perch="primary" (the hero
 * download button), data-bird-zone="hero" (its home range), data-bird-orbit="nav"
 * (the navbar download button, circled and sat on).
 */

/** Height/width of the extracted artwork. */
const RATIO = 233 / 385;

/** How far the feet sink into a perch, px. Small, because the bird is. */
const FOOT_OVERLAP = 2;

/** Never let any part of the bird go above this line. */
const SAFE_TOP = 2;

const PHYS = {
  /** Downward pull, px/s². Gentle — this is a bird, not a brick. */
  gravity: 470,
  drag: 0.95,
  maxSpeed: 720,
  /** Ceiling on steering acceleration, px/s². */
  maxForce: 4200,
  steerGain: 3.2,
  /** Distance at which the bird starts easing off, px. */
  arriveRadius: 200,
  /**
   * Short final needs its own, much tighter radius: reusing arriveRadius here
   * commands only ~74px/s at the start of the flare and decays from there, which
   * made the bird crawl the last stretch and turned landing into an 8s affair.
   */
  flareRadius: 82,
  flareCap: 200,
  /**
   * Peak upward acceleration at mid-downstroke. Averaged over a cycle this is
   * lift * (2/pi) * DOWNSTROKE ~= 0.24x, so it must be roughly 4x gravity for a
   * flapping bird to climb and a gliding one to sink.
   */
  flapLift: 2250,
  flapThrust: 620,
  cruiseHz: 6.5,
  climbHz: 11,
  flareHz: 4.5
} as const;

/** The lap it flies around the navbar button once you start scrolling. */
const ORBIT = {
  /** rad/s — about a six second lap. */
  speed: 1.1,
  ry: 30,
  /** Sits the ellipse below the button so the top of the lap clears the window. */
  drop: 18,
  /** Chasing a nearby moving point needs a tighter arrive radius than cruising. */
  radius: 74,
  cap: 290
} as const;

/** Scroll distance that sends it to the navbar, and the one that brings it back. */
const SCROLL_OUT = 80;
const SCROLL_HOME = 30;

/** Fraction of the wingbeat spent on the downstroke — the fast, powerful half. */
const DOWNSTROKE = 0.38;
const WING = { up: -38, down: 26, glide: -7, folded: 1 };

/** Load-up before launch, seconds. */
const CROUCH = 0.13;

/** Launch speed of a hop — ~2.8 body-heights for a logo-sized bird. */
const HOP_VY = -140;

/** A wing-flutter on the spot, s. What it does instead of hopping where there
 *  is no room above — on the navbar button, ~5px under the top of the window. */
const FLUTTER = 0.45;

/**
 * Where the crow is drawn inside the 512-unit app icon — the same box the rigged
 * bird's viewBox was cut from, so a bird placed in this box at the logo's scale
 * lines up with the logo's crow exactly.
 */
const ICON = { grid: 512, left: 64, top: 140, width: 385 } as const;

/** How long it sits in the logo on first load, ms. */
const NEST_FIRST: [number, number] = [1100, 1600];
/** How often it goes home to the logo, ms. */
const NEST_EVERY: [number, number] = [45000, 75000];
/** How long it stays there, ms. */
const NEST_STAY: [number, number] = [6000, 11000];

/** Drop shadow strength in flight. None in the badge, where the logo has none. */
const SHADOW = 0.5;

const rand = (min: number, max: number) => min + Math.random() * (max - min);
const wait = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));
const clamp = (v: number, lo: number, hi: number) => (v < lo ? lo : v > hi ? hi : v);
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
/** Frame-rate independent smoothing factor. */
const approach = (rate: number, dt: number) => 1 - Math.exp(-rate * dt);
const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

/**
 * Ease a MotionValue toward a target, snapping once it is close. An exponential
 * approach never quite arrives, so without the snap the value would change —
 * and the drop-shadow filter repaint — on every frame forever.
 */
const ease = (mv: MotionValue<number>, target: number, rate: number, dt: number) => {
  const v = mv.get();
  mv.set(Math.abs(target - v) < 0.002 ? target : lerp(v, target, approach(rate, dt)));
};

type Phase = "waiting" | "nest" | "crouch" | "cruise" | "flare" | "hop" | "perched" | "orbit";
type Mode = "hero" | "orbit";
/** What it is heading for, or sitting on. */
type Perch = "none" | "hero" | "nav" | "nest";
type Pt = { x: number; y: number };

const BirdCompanion = () => {
  const [enabled, setEnabled] = useState(false);
  const [size, setSize] = useState(24);

  // ── what the renderer reads ──────────────────────────────────────────
  const x = useMotionValue(-200);
  const y = useMotionValue(120);
  const flip = useMotionValue(1); // +1 faces left (as drawn), -1 faces right
  const pitch = useMotionValue(0);
  const roll = useMotionValue(1); // vertical squash, standing in for bank
  const bob = useMotionValue(0);
  /** Follows the logo if it grows on hover. Scales from the top-left, so x/y
   *  keep meaning "top-left of the bird". */
  const scale = useMotionValue(1);
  const shadowAlpha = useMotionValue(0);
  const filter = useTransform(
    shadowAlpha,
    (a) => `drop-shadow(0 3px 6px rgba(0,0,0,${a.toFixed(3)}))`
  );

  const wingAngle = useMotionValue<number>(WING.folded);
  const wingFold = useMotionValue(1);
  const legTuck = useMotionValue(0);
  const headTurn = useMotionValue(0);
  const lid = useMotionValue(0);
  const tone = useMotionValue(0);

  const rig: BirdRig = useMemo(
    () => ({ wingAngle, wingFold, legTuck, headTurn, lid, tone }),
    [wingAngle, wingFold, legTuck, headTurn, lid, tone]
  );

  // ── simulation state (refs: never triggers a render) ─────────────────
  const sim = useRef({
    px: -200,
    py: 120,
    vx: 0,
    vy: 0,
    phase: "waiting" as Phase,
    mode: "hero" as Mode,
    perch: "nest" as Perch,
    /** What to become once the crouch releases. */
    launchTo: "cruise" as Phase,
    /** Only true when heading for a real perch — otherwise it arrives and hovers. */
    landing: true,
    /** Set while it flies home to the logo; nothing may redirect it. */
    homing: false,
    flapPhase: 0,
    pitchSmooth: 0,
    rollSmooth: 1,
    headAim: 0,
    heading: Math.PI,
    orbitA: Math.PI,
    orbitSince: 0,
    nextNestAt: 0,
    target: { x: 0, y: 0 } as Pt,
    hasTarget: false,
    crouchT: 0,
    hopT: 0,
    flutterT: 0,
    settleT: 99,
    t: 0
  });

  const sizeRef = useRef(24);
  const mobileRef = useRef(false);
  const perchEl = useRef<HTMLElement | null>(null);
  const zoneEl = useRef<HTMLElement | null>(null);
  const orbitEl = useRef<HTMLElement | null>(null);
  const nestEl = useRef<HTMLElement | null>(null);
  /** Stable landing spot along the hero button. */
  const frac = useRef(rand(0.32, 0.72));

  const phaseIs = (p: Phase) => sim.current.phase === p;

  /* ── enablement & sizing ────────────────────────────────────────────── */
  useEffect(() => {
    const evaluate = () => {
      mobileRef.current = window.innerWidth < 640;
      // Exactly the logo crow's size. offsetWidth ignores the logo's hover
      // transform, so this is the resting size, not the hovered one.
      const nest = document.querySelector<HTMLElement>("[data-bird-nest]");
      const logo = nest?.offsetWidth || 32;
      sizeRef.current = (ICON.width * logo) / ICON.grid;
      setSize(sizeRef.current);
      setEnabled(!window.matchMedia("(prefers-reduced-motion: reduce)").matches);
    };
    evaluate();
    window.addEventListener("resize", evaluate);
    return () => window.removeEventListener("resize", evaluate);
  }, []);

  /* ── anchors ────────────────────────────────────────────────────────── */
  const findAnchors = () => {
    perchEl.current = document.querySelector('[data-bird-perch="primary"]');
    zoneEl.current = document.querySelector('[data-bird-zone="hero"]');
    orbitEl.current = document.querySelector('[data-bird-orbit="nav"]');
    nestEl.current = document.querySelector("[data-bird-nest]");
  };

  /** Hide or restore the logo's own crow while the real one is in its place. */
  const setNestEmpty = (empty: boolean) => {
    const el = nestEl.current;
    if (!el) return;
    if (empty) el.dataset.empty = "true";
    else delete el.dataset.empty;
  };

  /**
   * Exactly where the logo draws its crow. Read from the live rect every frame,
   * so it follows the navbar as it condenses on scroll and the logo on hover.
   */
  const nestSpot = () => {
    const el = nestEl.current;
    if (!el) return null;
    const r = el.getBoundingClientRect();
    if (!r.width) return null;
    const k = r.width / ICON.grid;
    return {
      x: r.left + ICON.left * k,
      y: r.top + ICON.top * k,
      scale: (ICON.width * k) / sizeRef.current
    };
  };

  /** A seat on the hero download button, or null if it is not really on screen. */
  const heroSpot = (): Pt | null => {
    const el = perchEl.current;
    if (!el) return null;
    const r = el.getBoundingClientRect();
    const w = sizeRef.current;
    if (r.width < 40) return null;
    const top = r.top - w * RATIO + FOOT_OVERLAP;
    if (top < SAFE_TOP + 60) return null; // tucked under the navbar
    if (r.top > window.innerHeight - 40 || r.bottom < 70) return null;
    return {
      x: clamp(r.left + r.width * frac.current - w / 2, 8, Math.max(8, window.innerWidth - w - 8)),
      y: top
    };
  };

  /** A seat on the navbar download button. Fits only because the bird is tiny. */
  const navSpot = (): Pt | null => {
    const el = orbitEl.current;
    if (!el) return null;
    const r = el.getBoundingClientRect();
    if (!r.width) return null;
    const w = sizeRef.current;
    const top = r.top - w * RATIO + FOOT_OVERLAP;
    if (top < 0) return null;
    return { x: r.left + r.width * 0.62 - w / 2, y: top };
  };

  /** A point on the lap around the navbar button. */
  const orbitPoint = (angle: number): Pt => {
    const w = sizeRef.current;
    const h = w * RATIO;
    const r = orbitEl.current?.getBoundingClientRect();
    const cx = r && r.width ? r.left + r.width / 2 : window.innerWidth - 120;
    const cy = r && r.width ? r.bottom + ORBIT.drop : 70;
    const rx = Math.max(40, (r?.width ?? 120) * 0.62);
    return {
      x: clamp(cx + rx * Math.cos(angle) - w / 2, 8, Math.max(8, window.innerWidth - w - 8)),
      y: Math.max(SAFE_TOP, cy + ORBIT.ry * Math.sin(angle) - h / 2)
    };
  };

  const spotFor = (p: Perch): Pt | null =>
    p === "hero" ? heroSpot() : p === "nav" ? navSpot() : p === "nest" ? nestSpot() : null;

  /** Top of the page -> hero; start scrolling -> orbit. Hysteresis stops flapping. */
  const wantMode = (current: Mode): Mode => {
    const sy = window.scrollY;
    const hero = heroSpot();
    if (current === "hero") return sy > SCROLL_OUT || !hero ? "orbit" : "hero";
    return sy < SCROLL_HOME && hero ? "hero" : "orbit";
  };

  /* ── the simulation ─────────────────────────────────────────────────── */
  useEffect(() => {
    if (!enabled) return;
    const s = sim.current;
    let raf = 0;
    let last = performance.now();

    const switchMode = (m: Mode, now: number) => {
      s.mode = m;
      if (m === "hero") {
        const h = heroSpot();
        if (!h) return;
        s.perch = "hero";
        s.landing = true;
        s.target = h;
        s.hasTarget = true;
        if (s.phase === "perched") {
          s.crouchT = 0;
          s.launchTo = "cruise";
          s.phase = "crouch";
        } else if (s.phase === "crouch") {
          s.launchTo = "cruise";
        } else {
          s.phase = "cruise";
        }
      } else {
        s.perch = "none";
        s.landing = false;
        s.orbitSince = now;
        s.hasTarget = true;
        if (s.phase === "perched") {
          s.crouchT = 0;
          s.launchTo = "orbit";
          s.phase = "crouch";
          s.target = orbitPoint(s.orbitA);
        } else if (s.phase === "crouch") {
          s.launchTo = "orbit";
        } else {
          s.phase = "orbit";
        }
      }
    };

    const step = (now: number) => {
      // Clamp dt so a backgrounded tab cannot integrate one huge leap on return.
      const dt = Math.min(0.032, (now - last) / 1000) || 0.016;
      last = now;
      s.t += dt;

      /* ── which mode? (never while it is in, or heading for, the logo) ── */
      if (s.phase !== "waiting" && s.phase !== "nest" && !s.homing) {
        const m = wantMode(s.mode);
        if (m !== s.mode) switchMode(m, now);
      }

      /* ── sitting in the logo ───────────────────────────────────────── */
      if (s.phase === "nest") {
        const n = nestSpot();
        s.settleT += dt;
        if (n) {
          // ease the last pixel or two in after touchdown, then lock on
          const k = s.settleT < 0.35 ? approach(16, dt) : 1;
          s.px = lerp(s.px, n.x, k);
          s.py = lerp(s.py, n.y, k);
          x.set(s.px);
          y.set(s.py);
          scale.set(n.scale);
        }
        ease(tone, 0, 10, dt);
        ease(shadowAlpha, 0, 10, dt);
        ease(flip, 1, 9, dt); // faces left, as the logo does
        ease(pitch, 0, 9, dt);
        roll.set(1 + Math.sin(s.t * 1.7) * 0.007);
        bob.set(Math.sin(s.t * 1.7) * 0.35); // breathing
        ease(wingAngle, WING.folded, 10, dt);
        ease(wingFold, 1, 10, dt);
        ease(legTuck, 0, 10, dt);
        headTurn.set(lerp(headTurn.get(), s.headAim, approach(7, dt)));
        raf = requestAnimationFrame(step);
        return;
      }

      /* ── perched on a button ───────────────────────────────────────── */
      if (s.phase === "perched") {
        const spot = spotFor(s.perch);
        s.settleT += dt;
        if (spot) {
          const k = s.settleT < 0.35 ? approach(16, dt) : 1;
          s.px = lerp(s.px, spot.x, k);
          s.py = lerp(s.py, spot.y, k);
          s.target = spot;
          x.set(s.px);
          y.set(s.py);
        }
        // touchdown settle: a damped bounce that decays away, plus breathing
        const settle =
          s.settleT < 0.75 ? -3.5 * Math.exp(-7 * s.settleT) * Math.cos(15 * s.settleT) : 0;
        bob.set(Math.sin(s.t * 1.7) * 0.35 + settle);
        roll.set(1 + Math.sin(s.t * 1.7) * 0.007);

        ease(pitch, 0, 6, dt);
        if (s.flutterT > 0) {
          // a few quick beats with the feet planted
          s.flutterT -= dt;
          const p = (((FLUTTER - s.flutterT) * 9) % 1 + 1) % 1;
          wingAngle.set(
            p < DOWNSTROKE
              ? lerp(WING.up, WING.down * 0.6, easeInOut(p / DOWNSTROKE))
              : lerp(WING.down * 0.6, WING.up, easeInOut((p - DOWNSTROKE) / (1 - DOWNSTROKE)))
          );
        } else {
          ease(wingAngle, WING.folded, 9, dt);
        }
        ease(wingFold, 1, 9, dt);
        ease(legTuck, 0, 9, dt);
        headTurn.set(lerp(headTurn.get(), s.headAim, approach(7, dt)));
        ease(scale, 1, 6, dt);
        ease(tone, 1, 6, dt);
        ease(shadowAlpha, SHADOW, 6, dt);
        raf = requestAnimationFrame(step);
        return;
      }

      /* ── crouch: load the legs before launching ────────────────────── */
      if (s.phase === "crouch") {
        s.crouchT += dt;
        const k = Math.min(1, s.crouchT / CROUCH);
        bob.set(k * 1.8); // sink onto the legs
        roll.set(1 - k * 0.07); // and compress
        wingAngle.set(lerp(wingAngle.get(), WING.up, approach(14, dt)));
        headTurn.set(lerp(headTurn.get(), -6, approach(10, dt)));
        if (s.crouchT >= CROUCH) {
          const dx0 = s.target.x - s.px;
          const dy0 = s.target.y - s.py;
          const d0 = Math.hypot(dx0, dy0) || 1;
          // Spring up and away — but only as high as there is room for. From a
          // seat ~5px under the top of the window a full 170px/s spring drove
          // the bird into the edge, where it scraped along for most of a second.
          const headroom = Math.max(0, s.py - SAFE_TOP);
          const spring = Math.min(170, Math.sqrt(1.2 * PHYS.gravity * headroom));
          s.vx = (dx0 / d0) * 210;
          s.vy = (dy0 / d0) * 90 - spring;
          s.phase = s.launchTo;
          s.launchTo = "cruise";
          bob.set(0);
        }
        raf = requestAnimationFrame(step);
        return;
      }

      if (!s.hasTarget) {
        raf = requestAnimationFrame(step);
        return;
      }

      /* ── keep moving targets fresh ─────────────────────────────────── */
      const orbiting = s.phase === "orbit";
      if (orbiting) {
        s.orbitA += ORBIT.speed * dt;
        s.target = orbitPoint(s.orbitA);
      } else if (s.landing && s.phase !== "hop") {
        // perches move: the page scrolls, the navbar condenses
        const live = spotFor(s.perch);
        if (live) s.target = live;
      }

      /* ── airborne ──────────────────────────────────────────────────── */
      const dx = s.target.x - s.px;
      const dy = s.target.y - s.py;
      const dist = Math.hypot(dx, dy);

      // Only a real perch gets a flare; waypoints are arrived at and hovered.
      if (s.landing && s.phase === "cruise" && dist < PHYS.flareRadius) s.phase = "flare";
      const flaring = s.phase === "flare";
      const hopping = s.phase === "hop";
      if (hopping) s.hopT += dt;

      /* steering — arrive. A hop is deliberately near-ballistic: steering is cut
         right back so gravity shapes the arc, which is what a hop is. */
      const radius = flaring ? PHYS.flareRadius : orbiting ? ORBIT.radius : PHYS.arriveRadius;
      const cap = flaring ? PHYS.flareCap : orbiting ? ORBIT.cap : PHYS.maxSpeed;
      const want = dist < radius ? cap * (dist / radius) : cap;
      const ux = dist > 0.001 ? dx / dist : 0;
      const uy = dist > 0.001 ? dy / dist : 0;
      const steerScale = hopping ? 0.18 : 1;
      let ax = (ux * want - s.vx) * PHYS.steerGain * steerScale;
      let ay = (uy * want - s.vy) * PHYS.steerGain * steerScale;
      const mag = Math.hypot(ax, ay);
      if (mag > PHYS.maxForce) {
        ax = (ax / mag) * PHYS.maxForce;
        ay = (ay / mag) * PHYS.maxForce;
      }

      /* wingbeat — closed loop on altitude, which is what undulates the path */
      const needsHeight = dy < -8 || s.vy > 70;
      const hz = hopping
        ? s.hopT < 0.22 // two quick power strokes to push off, then nothing
          ? PHYS.climbHz
          : 0
        : flaring
          ? PHYS.flareHz
          : !orbiting && dist < 14
            ? 0
            : needsHeight
              ? PHYS.climbHz
              : PHYS.cruiseHz;
      s.flapPhase = (s.flapPhase + hz * dt) % 1;

      let lift = 0;
      if (hz > 0) {
        const p = s.flapPhase;
        if (p < DOWNSTROKE) {
          const t = p / DOWNSTROKE;
          wingAngle.set(lerp(WING.up, WING.down, easeInOut(t)));
          wingFold.set(1);
          lift = Math.sin(Math.PI * t); // peaks mid-downstroke
        } else {
          const t = (p - DOWNSTROKE) / (1 - DOWNSTROKE);
          wingAngle.set(lerp(WING.down, WING.up, easeInOut(t)));
          wingFold.set(lerp(1, 0.84, Math.sin(Math.PI * t))); // partly folds
        }
      } else {
        wingAngle.set(lerp(wingAngle.get(), WING.glide, approach(7, dt)));
        wingFold.set(lerp(wingFold.get(), 1, approach(7, dt)));
      }

      /* integrate.
         Arrive-steering is proportional, so a constant downward force leaves a
         standing error it can never quite cancel — the bird would hover a
         stubborn ~25px short of its perch forever. On short final it unloads its
         own weight, exactly as a landing bird does: gravity and wing force fade
         out together, leaving pure steering. Never applied mid-hop, where
         gravity is the entire point. */
      // Near the top of the window it glides rather than beats: full downstrokes
      // there bounced it into the edge, where it scraped along for half a second.
      // Steering still lifts it to a perch up there; wing lift just stops fighting.
      lift *= clamp((s.py - SAFE_TOP) / 24, 0.15, 1);

      const settleScale = flaring ? clamp(dist / PHYS.flareRadius, 0, 1) : 1;
      const fx =
        ax + Math.cos(s.heading) * PHYS.flapThrust * lift * settleScale - PHYS.drag * s.vx;
      const fy =
        ay + PHYS.gravity * settleScale - PHYS.flapLift * lift * settleScale - PHYS.drag * s.vy;

      s.vx += fx * dt;
      s.vy += fy * dt;
      let sp = Math.hypot(s.vx, s.vy);
      if (sp > PHYS.maxSpeed) {
        s.vx = (s.vx / sp) * PHYS.maxSpeed;
        s.vy = (s.vy / sp) * PHYS.maxSpeed;
        sp = PHYS.maxSpeed;
      }
      s.px += s.vx * dt;
      s.py += s.vy * dt;
      // Never let it leave the window, whatever the forces are doing.
      const w = sizeRef.current;
      s.px = clamp(s.px, 4, Math.max(4, window.innerWidth - w - 4));
      s.py = clamp(s.py, SAFE_TOP, Math.max(SAFE_TOP, window.innerHeight - w * RATIO - 4));
      x.set(s.px);
      y.set(s.py);

      /* pose from motion */
      if (sp > 26) {
        s.heading = Math.atan2(s.vy, s.vx);
        // Art faces -x, so local pitch is atan2(-vy, |vx|) whichever way it
        // travels; the mirror is handled separately by `flip`.
        const wantPitch = clamp((Math.atan2(-s.vy, Math.abs(s.vx)) * 180) / Math.PI, -42, 42);
        s.pitchSmooth = lerp(
          s.pitchSmooth,
          flaring ? clamp(wantPitch + 22, -42, 46) : wantPitch,
          approach(9, dt)
        );

        const wantFlip = s.vx > 24 ? -1 : s.vx < -24 ? 1 : flip.get();
        flip.set(lerp(flip.get(), wantFlip, approach(7, dt)));

        // Bank: sharper turns squash the silhouette, reading as roll.
        const turn = Math.abs(ax * s.vy - ay * s.vx) / (sp * sp + 1);
        s.rollSmooth = lerp(s.rollSmooth, 1 - clamp(turn * 0.5, 0, 0.14), approach(7, dt));
      } else {
        s.pitchSmooth = lerp(s.pitchSmooth, flaring ? 16 : 0, approach(7, dt));
        s.rollSmooth = lerp(s.rollSmooth, 1, approach(7, dt));
      }
      pitch.set(s.pitchSmooth);
      roll.set(s.rollSmooth);
      bob.set(0);

      // Birds hold their head level while the body pitches — counter-rotating a
      // little is the cheapest thing that reads as "alive".
      headTurn.set(lerp(headTurn.get(), -s.pitchSmooth * 0.4, approach(10, dt)));

      // Legs tuck once properly airborne, and reach forward on short final.
      legTuck.set(
        lerp(legTuck.get(), flaring || (s.landing && dist < 40) ? 0 : -52, approach(5, dt))
      );

      // Coming home to the logo, it takes on the logo's colours and drops its
      // shadow on the way in, so touchdown is indistinguishable from the badge.
      const nearNest = s.perch === "nest" && dist < 160;
      ease(tone, nearNest ? 0 : 1, 4, dt);
      ease(shadowAlpha, nearNest ? 0 : SHADOW, 4, dt);
      ease(scale, 1, 4, dt);

      /* touchdown — it then eases the last pixel or two in from where it is */
      const landed =
        (hopping && s.vy > 0 && s.py >= s.target.y - 1) || (flaring && dist < 6 && sp < 90);
      if (landed) {
        s.vx = 0;
        s.vy = 0;
        s.settleT = 0;
        s.headAim = 0;
        if (s.perch === "nest") {
          s.phase = "nest";
          setNestEmpty(true); // it takes the logo crow's place
        } else {
          s.phase = "perched";
        }
      }

      raf = requestAnimationFrame(step);
    };

    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
    // motion values are stable; `enabled` is the only real input
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled]);

  /* ── what it decides to do ──────────────────────────────────────────── */
  useEffect(() => {
    if (!enabled) return;
    const s = sim.current;
    let cancelled = false;
    let nestTimer = 0;

    findAnchors();
    const onResize = () => findAnchors();
    window.addEventListener("resize", onResize);

    /** Wait until `done()` or the deadline; report which. */
    const until = async (done: () => boolean, ms: number) => {
      const deadline = performance.now() + ms;
      while (!cancelled && !done() && performance.now() < deadline) await wait(50);
      return done();
    };

    const blink = async () => {
      lid.set(1);
      await wait(105);
      lid.set(0);
      if (Math.random() < 0.35) {
        await wait(150);
        lid.set(1);
        await wait(95);
        lid.set(0);
      }
    };

    /** A glance around — the head turns, holds, and comes back. */
    const look = async () => {
      s.headAim = rand(-13, 13);
      await wait(rand(700, 1500));
      if (Math.random() < 0.5) {
        s.headAim = rand(-13, 13);
        await wait(rand(600, 1200));
      }
      s.headAim = 0;
    };

    /** A hop in place — the nudge that points back at the button it sits on.
     *  Where there is no room above (the navbar button), a wing-flutter instead. */
    const hop = async () => {
      if (!phaseIs("perched")) return;
      if (s.perch === "nav") {
        s.flutterT = FLUTTER;
        await wait(FLUTTER * 1000 + 80);
        return;
      }
      s.phase = "hop";
      s.hopT = 0;
      s.vy = HOP_VY;
      s.vx = rand(-18, 18);
      s.hasTarget = true;
      await until(() => phaseIs("perched"), 2200);
    };

    /** Leave the logo for wherever the page says it belongs right now. */
    const leaveNest = () => {
      const home = window.scrollY <= SCROLL_OUT ? heroSpot() : null;
      s.homing = false;
      if (home) {
        s.mode = "hero";
        s.perch = "hero";
        s.landing = true;
        s.target = home;
        s.launchTo = "cruise";
      } else {
        s.mode = "orbit";
        s.perch = "none";
        s.landing = false;
        s.target = orbitPoint(s.orbitA);
        s.launchTo = "orbit";
        s.orbitSince = performance.now();
      }
      s.hasTarget = true;
      s.crouchT = 0;
      s.phase = "crouch";
      s.nextNestAt = performance.now() + rand(NEST_EVERY[0], NEST_EVERY[1]);
      // let the logo's crow back in once the real one is well clear of it
      window.clearTimeout(nestTimer);
      nestTimer = window.setTimeout(() => setNestEmpty(false), 1800);
    };

    /** Sit in the badge for a while, quietly alive. */
    const stayInNest = async (ms: number) => {
      const end = performance.now() + ms;
      while (!cancelled && performance.now() < end) {
        await wait(rand(1400, 2600));
        if (cancelled) return;
        if (Math.random() < 0.5) await blink();
        else await look();
      }
    };

    /** Fly home to the logo and land back in it. */
    const goToNest = async () => {
      const n = nestSpot();
      if (!n) {
        s.nextNestAt = performance.now() + rand(NEST_EVERY[0], NEST_EVERY[1]);
        return false;
      }
      s.homing = true;
      s.perch = "nest";
      s.landing = true;
      s.target = n;
      s.hasTarget = true;
      if (phaseIs("perched")) {
        s.crouchT = 0;
        s.launchTo = "cruise";
        s.phase = "crouch";
      } else {
        s.phase = "cruise";
      }
      const ok = await until(() => phaseIs("nest"), 10000);
      if (!ok && !cancelled) {
        // a landing that never quite happened: set it down rather than strand it
        s.vx = 0;
        s.vy = 0;
        s.settleT = 0;
        s.phase = "nest";
        setNestEmpty(true);
      }
      return true;
    };

    /** One to three random waypoints around the hero, then back to the button. */
    const roamHero = async () => {
      const zone = zoneEl.current?.getBoundingClientRect();
      if (!zone) return;
      const w = sizeRef.current;
      const top = Math.max(SAFE_TOP + 90, zone.top + 90); // keep clear of the navbar
      const bottom = Math.min(window.innerHeight - w * RATIO - 40, zone.bottom - 60);
      if (bottom <= top) return;

      const legs = 1 + Math.floor(Math.random() * 3);
      for (let i = 0; i < legs && !cancelled; i++) {
        if (s.mode !== "hero" || s.homing) return;
        s.perch = "none";
        s.landing = false; // a waypoint is not a perch — arrive and hover
        s.target = {
          x: clamp(rand(zone.left + 24, zone.right - w - 24), 8, window.innerWidth - w - 8),
          y: rand(top, bottom)
        };
        s.hasTarget = true;
        if (phaseIs("perched")) {
          s.crouchT = 0;
          s.launchTo = "cruise";
          s.phase = "crouch";
        } else if (phaseIs("flare")) {
          s.phase = "cruise";
        }
        await wait(rand(1300, 2200));
      }
      if (cancelled || s.mode !== "hero" || s.homing) return;

      const home = heroSpot();
      if (!home) return;
      s.perch = "hero";
      s.landing = true;
      s.target = home;
      if (!phaseIs("crouch")) s.phase = "cruise";
      await until(() => phaseIs("perched") || s.mode !== "hero", 9000);
    };

    /** From circling, drop onto the navbar button for a while. */
    const landOnNav = async () => {
      const spot = navSpot();
      if (!spot) return;
      s.perch = "nav";
      s.landing = true;
      s.target = spot;
      s.hasTarget = true;
      s.phase = "cruise";
      await until(() => phaseIs("perched") || s.mode !== "orbit", 8000);
    };

    const resumeOrbit = () => {
      s.perch = "none";
      s.landing = false;
      s.orbitSince = performance.now();
      s.target = orbitPoint(s.orbitA);
      s.hasTarget = true;
      s.crouchT = 0;
      s.launchTo = "orbit";
      s.phase = "crouch";
    };

    const idle = async () => {
      let orbitFor = rand(6000, 11000);
      while (!cancelled) {
        await wait(rand(1800, 3600));
        if (cancelled) break;
        if (document.hidden || s.homing || phaseIs("nest") || phaseIs("crouch")) continue;

        // Now and then, go home to the logo for a while and come out again.
        if (performance.now() > s.nextNestAt && (phaseIs("perched") || phaseIs("orbit"))) {
          if (await goToNest()) {
            if (cancelled) return;
            await stayInNest(rand(NEST_STAY[0], NEST_STAY[1]));
            if (cancelled) return;
            leaveNest();
          }
          continue;
        }

        if (s.mode === "hero") {
          if (!phaseIs("perched")) continue;
          const flyChance = mobileRef.current ? 0.2 : 0.34;
          const roll = Math.random();
          if (roll < flyChance) await roamHero();
          else if (roll < flyChance + 0.24) await blink();
          else if (roll < flyChance + 0.46) await look();
          else await hop();
        } else if (phaseIs("orbit")) {
          if (performance.now() - s.orbitSince > orbitFor) {
            await landOnNav();
            orbitFor = rand(6000, 11000);
          }
        } else if (phaseIs("perched") && s.perch === "nav") {
          const roll = Math.random();
          if (roll < 0.28) resumeOrbit();
          else if (roll < 0.52) await blink();
          else if (roll < 0.78) await look();
          else await hop();
        }
      }
    };

    const live = async () => {
      await wait(420); // let layout settle before reading a rect
      findAnchors();
      s.nextNestAt = performance.now() + rand(NEST_EVERY[0], NEST_EVERY[1]);

      /* ── born in the logo ──────────────────────────────────────────── */
      const n = nestSpot();
      if (n && !cancelled) {
        s.px = n.x;
        s.py = n.y;
        x.set(s.px);
        y.set(s.py);
        scale.set(n.scale);
        tone.set(0);
        shadowAlpha.set(0);
        s.perch = "nest";
        s.settleT = 1;
        s.phase = "nest";
        setNestEmpty(true); // the same frame it takes the logo crow's place

        await wait(rand(NEST_FIRST[0], NEST_FIRST[1]));
        if (cancelled) return;
        s.headAim = 9; // a glance toward the page
        await wait(420);
        await blink();
        s.headAim = 0;
        await wait(260);
        if (cancelled) return;
        leaveNest();
        await idle();
        return;
      }

      /* ── no logo to start from: enter from off-screen instead ──────── */
      let spot = heroSpot();
      for (let i = 0; !spot && i < 25 && !cancelled; i++) {
        await wait(120);
        findAnchors();
        spot = heroSpot();
      }
      if (!spot || cancelled) return;
      s.px = -120;
      s.py = Math.max(40, spot.y - 190);
      s.vx = 300;
      s.vy = 40;
      x.set(s.px);
      y.set(s.py);
      tone.set(1);
      s.mode = "hero";
      s.perch = "hero";
      s.landing = true;
      s.target = spot;
      s.hasTarget = true;
      s.phase = "cruise";
      await idle();
    };

    void live();
    return () => {
      cancelled = true;
      window.clearTimeout(nestTimer);
      setNestEmpty(false); // never leave the logo without its crow
      window.removeEventListener("resize", onResize);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled]);

  if (!enabled) return null;

  return (
    <motion.div
      aria-hidden="true"
      style={{ x, y }}
      className="pointer-events-none fixed left-0 top-0 z-[60] will-change-transform"
    >
      <motion.div style={{ scale, transformOrigin: "0 0" }}>
        <motion.div style={{ scaleX: flip }}>
          <motion.div style={{ rotate: pitch, scaleY: roll, y: bob, filter }}>
            <OrtuBird rig={rig} width={size} />
          </motion.div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default BirdCompanion;
