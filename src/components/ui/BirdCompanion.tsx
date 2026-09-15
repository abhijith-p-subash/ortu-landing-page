import { useEffect, useMemo, useRef, useState } from "react";
import { motion, useMotionValue } from "framer-motion";
import OrtuBird, { type BirdRig } from "./OrtuBird";

/**
 * The Ortu crow, off its badge and flying under its own power.
 *
 * A small flight simulation rather than a set of tweens: every frame the bird
 * integrates steering, gravity, the lift its own wingbeat makes, and drag, and
 * its pose is *derived* from the resulting velocity — it pitches to its flight
 * path, banks into turns, tucks its legs once airborne, reaches them forward to
 * land, and holds its head level while its body pitches, the way birds do.
 *
 * Two rules keep it well behaved:
 *
 *  1. STEERING ALWAYS DOMINATES, so gravity can never strand it or throw it off
 *     screen. Gravity and lift supply character — the flap-and-glide undulation
 *     that makes a real bird's path wavy — never control.
 *  2. THE FLAP IS A CLOSED LOOP, not an animation. It beats harder when below
 *     where it wants to be and holds its wings out to glide when above. That one
 *     rule produces the rise-and-fall of real flight for free.
 *
 * It lives in two modes, decided by whether the hero's download button is on
 * screen:
 *
 *   HERO   — it perches on that button, preens, glances about, hops to draw the
 *            eye back to it, and now and then takes a short flight around the
 *            hero before returning.
 *   ORBIT  — once the hero has scrolled away it flies a slow ellipse around the
 *            navbar's download button. It circles rather than lands because the
 *            bird perches ABOVE its target, and that button sits ~18px from the
 *            top of the window: landing on it put the bird at y = -12px, out of
 *            sight. Circling keeps it beside the call to action and visible.
 *
 * Markup anchors: data-bird-perch="primary" (what it lands on),
 * data-bird-zone="hero" (its home range), data-bird-orbit="nav" (what it circles).
 *
 * It never intercepts a click, it is aria-hidden, it renders nothing under
 * prefers-reduced-motion, and it renders nothing on the server so the
 * prerendered HTML is untouched. The simulation writes only to MotionValues, so
 * a bird in flight causes zero React re-renders.
 */

/** Height/width of the extracted artwork. */
const RATIO = 233 / 385;

/** How far the feet sink into the perch, px. */
const FOOT_OVERLAP = 4;

/** Never let any part of the bird go above this line. */
const SAFE_TOP = 8;

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

/** The lap it flies around the navbar button once the hero is gone. */
const ORBIT = {
  /** rad/s — about a six second lap. */
  speed: 1.1,
  ry: 30,
  /** Sits the ellipse below the button's baseline so the top of the lap clears the window. */
  drop: 18,
  /** Chasing a nearby moving point needs a tighter arrive radius than cruising. */
  radius: 74,
  cap: 290
} as const;

/** Fraction of the wingbeat spent on the downstroke — the fast, powerful half. */
const DOWNSTROKE = 0.38;
const WING = { up: -38, down: 26, glide: -7, folded: 1 };

/** Load-up before launch, seconds. */
const CROUCH = 0.13;

const rand = (min: number, max: number) => min + Math.random() * (max - min);
const wait = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));
const clamp = (v: number, lo: number, hi: number) => (v < lo ? lo : v > hi ? hi : v);
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
/** Frame-rate independent smoothing factor. */
const approach = (rate: number, dt: number) => 1 - Math.exp(-rate * dt);
const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

type Phase = "waiting" | "crouch" | "cruise" | "flare" | "hop" | "perched" | "orbit";
type Mode = "hero" | "orbit";

const BirdCompanion = () => {
  const [enabled, setEnabled] = useState(false);
  const [size, setSize] = useState(46);

  // ── what the renderer reads ──────────────────────────────────────────
  const x = useMotionValue(-200);
  const y = useMotionValue(120);
  const flip = useMotionValue(1); // +1 faces left (as drawn), -1 faces right
  const pitch = useMotionValue(0);
  const roll = useMotionValue(1); // vertical squash, standing in for bank
  const bob = useMotionValue(0);

  const wingAngle = useMotionValue<number>(WING.folded);
  const wingFold = useMotionValue(1);
  const legTuck = useMotionValue(0);
  const headTurn = useMotionValue(0);
  const lid = useMotionValue(0);

  const rig: BirdRig = useMemo(
    () => ({ wingAngle, wingFold, legTuck, headTurn, lid }),
    [wingAngle, wingFold, legTuck, headTurn, lid]
  );

  // ── simulation state (refs: never triggers a render) ─────────────────
  const sim = useRef({
    px: -200,
    py: 120,
    vx: 0,
    vy: 0,
    phase: "waiting" as Phase,
    mode: "hero" as Mode,
    /** What to become once the crouch releases. */
    launchTo: "cruise" as Phase,
    /** Only true when the target is a real perch — otherwise it hovers instead. */
    landing: true,
    flapPhase: 0,
    pitchSmooth: 0,
    rollSmooth: 1,
    headAim: 0,
    heading: Math.PI,
    orbitA: Math.PI,
    target: { x: 0, y: 0 },
    hasTarget: false,
    crouchT: 0,
    hopT: 0,
    settleT: 99,
    t: 0
  });

  const sizeRef = useRef(46);
  const mobileRef = useRef(false);
  const perchEl = useRef<HTMLElement | null>(null);
  const zoneEl = useRef<HTMLElement | null>(null);
  const orbitEl = useRef<HTMLElement | null>(null);
  /** Stable landing spot along the perch's width. */
  const frac = useRef(rand(0.32, 0.72));

  const phaseIs = (p: Phase) => sim.current.phase === p;

  /* ── enablement & sizing ────────────────────────────────────────────── */
  useEffect(() => {
    const evaluate = () => {
      const w = window.innerWidth;
      mobileRef.current = w < 640;
      sizeRef.current = w < 640 ? 32 : w < 1280 ? 40 : 46;
      setSize(sizeRef.current);
      setEnabled(!window.matchMedia("(prefers-reduced-motion: reduce)").matches);
    };
    evaluate();
    window.addEventListener("resize", evaluate);
    return () => window.removeEventListener("resize", evaluate);
  }, []);

  const findAnchors = () => {
    perchEl.current = document.querySelector('[data-bird-perch="primary"]');
    zoneEl.current = document.querySelector('[data-bird-zone="hero"]');
    orbitEl.current = document.querySelector('[data-bird-orbit="nav"]');
  };

  /**
   * Where the bird would sit on the hero button, or null if it cannot be seen
   * there — which is also the signal that the hero has scrolled away.
   */
  const heroSpot = () => {
    const el = perchEl.current;
    if (!el) return null;
    const r = el.getBoundingClientRect();
    const w = sizeRef.current;
    const h = w * RATIO;
    if (r.width < 40) return null;
    const top = r.top - h + FOOT_OVERLAP;
    if (top < SAFE_TOP) return null;
    if (r.top > window.innerHeight - 40 || r.bottom < 70) return null;
    return {
      x: clamp(
        r.left + r.width * frac.current - w / 2,
        8,
        Math.max(8, window.innerWidth - w - 8)
      ),
      y: top
    };
  };

  /** A point on the lap around the navbar button. */
  const orbitPoint = (angle: number) => {
    const w = sizeRef.current;
    const h = w * RATIO;
    const el = orbitEl.current;
    const r = el?.getBoundingClientRect();
    const cx = r && r.width ? r.left + r.width / 2 : window.innerWidth - 120;
    const cy = r && r.width ? r.bottom + ORBIT.drop : 70;
    const rx = Math.max(46, (r?.width ?? 120) * 0.62);
    return {
      x: clamp(cx + rx * Math.cos(angle) - w / 2, 8, Math.max(8, window.innerWidth - w - 8)),
      y: Math.max(SAFE_TOP, cy + ORBIT.ry * Math.sin(angle) - h / 2)
    };
  };

  /* ── the simulation ─────────────────────────────────────────────────── */
  useEffect(() => {
    if (!enabled) return;
    const s = sim.current;
    let raf = 0;
    let last = performance.now();

    const step = (now: number) => {
      // Clamp dt so a backgrounded tab cannot integrate one huge leap on return.
      const dt = Math.min(0.032, (now - last) / 1000) || 0.016;
      last = now;
      s.t += dt;

      /* ── which mode are we in? ─────────────────────────────────────── */
      const spot = heroSpot();
      if (s.phase !== "waiting") {
        if (spot && s.mode === "orbit") {
          // hero is back — go home and land
          s.mode = "hero";
          s.landing = true;
          s.target = spot;
          s.hasTarget = true;
          if (s.phase === "orbit") s.phase = "cruise";
        } else if (!spot && s.mode === "hero") {
          // hero has gone — take station on the navbar button
          s.mode = "orbit";
          s.landing = false;
          if (s.phase === "perched") {
            s.crouchT = 0;
            s.launchTo = "orbit";
            s.phase = "crouch";
            s.target = orbitPoint(s.orbitA);
          } else {
            s.phase = "orbit";
          }
          s.hasTarget = true;
        }
      }

      /* ── perched ───────────────────────────────────────────────────── */
      if (s.phase === "perched") {
        if (spot) {
          s.px = spot.x;
          s.py = spot.y;
          s.target = spot;
          x.set(s.px);
          y.set(s.py);
        }

        // touchdown settle: a damped bounce that decays away
        s.settleT += dt;
        const settle =
          s.settleT < 0.75 ? -7 * Math.exp(-7 * s.settleT) * Math.cos(15 * s.settleT) : 0;
        bob.set(Math.sin(s.t * 1.7) * 0.7 + settle); // breathing + settle
        roll.set(1 + Math.sin(s.t * 1.7) * 0.007);

        pitch.set(lerp(pitch.get(), 0, approach(6, dt)));
        wingAngle.set(lerp(wingAngle.get(), WING.folded, approach(9, dt)));
        wingFold.set(lerp(wingFold.get(), 1, approach(9, dt)));
        legTuck.set(lerp(legTuck.get(), 0, approach(9, dt)));
        headTurn.set(lerp(headTurn.get(), s.headAim, approach(7, dt)));
        raf = requestAnimationFrame(step);
        return;
      }

      /* ── crouch: load the legs before launching ────────────────────── */
      if (s.phase === "crouch") {
        s.crouchT += dt;
        const k = Math.min(1, s.crouchT / CROUCH);
        bob.set(k * 3.5); // sink onto the legs
        roll.set(1 - k * 0.07); // and compress
        wingAngle.set(lerp(wingAngle.get(), WING.up, approach(14, dt)));
        headTurn.set(lerp(headTurn.get(), -6, approach(10, dt)));
        if (s.crouchT >= CROUCH) {
          const dx0 = s.target.x - s.px;
          const dy0 = s.target.y - s.py;
          const d0 = Math.hypot(dx0, dy0) || 1;
          s.vx = (dx0 / d0) * 210;
          s.vy = (dy0 / d0) * 90 - 170; // spring up and away
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

      /* ── orbit: chase a point travelling round the navbar button ───── */
      const orbiting = s.phase === "orbit";
      if (orbiting) {
        s.orbitA += ORBIT.speed * dt;
        s.target = orbitPoint(s.orbitA);
      }

      /* ── airborne ──────────────────────────────────────────────────── */
      const dx = s.target.x - s.px;
      const dy = s.target.y - s.py;
      const dist = Math.hypot(dx, dy);

      // Only a real perch gets a flare; everywhere else it simply arrives and
      // hovers, so it never "lands" on thin air.
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

      /* touchdown */
      const landed =
        (hopping && s.vy > 0 && s.py >= s.target.y - 1) || (flaring && dist < 6 && sp < 90);
      if (landed) {
        s.px = s.target.x;
        s.py = s.target.y;
        s.vx = 0;
        s.vy = 0;
        s.phase = "perched";
        s.settleT = 0;
        s.headAim = 0;
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

    findAnchors();
    const onResize = () => findAnchors();
    window.addEventListener("resize", onResize);

    const settleOn = (tx: number, ty: number) => {
      s.px = tx;
      s.py = ty;
      s.vx = 0;
      s.vy = 0;
      s.phase = "perched";
      s.settleT = 0;
    };

    /** Fly home to the hero button and wait until it is down again. */
    const goHome = async () => {
      const spot = heroSpot();
      if (!spot) return;
      s.landing = true;
      s.target = spot;
      s.hasTarget = true;
      if (phaseIs("perched")) {
        s.crouchT = 0;
        s.launchTo = "cruise";
        s.phase = "crouch";
      } else if (phaseIs("flare")) {
        s.phase = "cruise";
      }
      const deadline = performance.now() + 9000;
      while (!cancelled && !phaseIs("perched") && performance.now() < deadline) {
        await wait(60);
      }
      if (!cancelled && !phaseIs("perched") && s.mode === "hero") {
        settleOn(spot.x, spot.y); // never leave it adrift
      }
    };

    /** A short flight around the hero, then back to the button. */
    const roamHero = async () => {
      const zone = zoneEl.current?.getBoundingClientRect();
      if (!zone) return;
      const w = sizeRef.current;
      const h = w * RATIO;
      const top = Math.max(SAFE_TOP + 40, zone.top + 40);
      const bottom = Math.min(window.innerHeight - h - 40, zone.bottom - 60);
      if (bottom <= top) return;

      const legs = Math.random() < 0.6 ? 1 : 2;
      for (let i = 0; i < legs && !cancelled; i++) {
        s.landing = false; // a waypoint is not a perch — arrive and hover
        s.target = {
          x: clamp(rand(zone.left + 20, zone.right - w - 20), 8, window.innerWidth - w - 8),
          y: rand(top, bottom)
        };
        s.hasTarget = true;
        if (phaseIs("perched")) {
          s.crouchT = 0;
          s.launchTo = "cruise";
          s.phase = "crouch";
        }
        await wait(rand(1500, 2400));
        if (cancelled || s.mode !== "hero") return;
      }
      await goHome();
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

    /** A hop in place — the nudge that points back at the download button. */
    const hop = async () => {
      if (!phaseIs("perched")) return;
      s.phase = "hop";
      s.hopT = 0;
      s.vy = -225;
      s.vx = rand(-26, 26);
      s.hasTarget = true;
      const deadline = performance.now() + 2200;
      while (!cancelled && !phaseIs("perched") && performance.now() < deadline) {
        await wait(50);
      }
    };

    const live = async () => {
      await wait(420); // let layout settle before reading a rect
      findAnchors();

      let spot = heroSpot();
      for (let i = 0; !spot && i < 25 && !cancelled; i++) {
        await wait(120);
        findAnchors();
        spot = heroSpot();
      }
      if (!spot || cancelled) return;

      // enter from off-screen, above and to the left
      s.px = -180;
      s.py = Math.max(40, spot.y - 190);
      s.vx = 300;
      s.vy = 40;
      x.set(s.px);
      y.set(s.py);
      s.mode = "hero";
      s.landing = true;
      s.phase = "cruise";
      await goHome();

      while (!cancelled) {
        await wait(rand(2400, 5200));
        if (cancelled) break;
        if (document.hidden) continue;
        // Circling the navbar is self-sustaining; leave it be until the hero
        // comes back into view.
        if (s.mode !== "hero" || !phaseIs("perched")) continue;

        // On a phone the bird crosses far more of the screen relative to the
        // content, so it travels less and idles more.
        const flyChance = mobileRef.current ? 0.08 : 0.2;
        const roll = Math.random();
        if (roll < flyChance) await roamHero();
        else if (roll < flyChance + 0.3) await blink();
        else if (roll < flyChance + 0.56) await look();
        else await hop();
      }
    };

    void live();
    return () => {
      cancelled = true;
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
      <motion.div style={{ scaleX: flip }}>
        <motion.div style={{ rotate: pitch, scaleY: roll, y: bob }}>
          <OrtuBird
            rig={rig}
            width={size}
            className="drop-shadow-[0_6px_14px_rgba(0,0,0,0.55)]"
          />
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default BirdCompanion;
