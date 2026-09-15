import { motion, type MotionValue } from "framer-motion";

/**
 * The crow from the Ortu app icon, rigged for animation.
 *
 * The icon is a flat crow on a sage disc with a long drop shadow. Dropping the
 * disc and shadow leaves eleven paths whose bounding box is 385x233 at (64,140)
 * in the original 512 grid — hence the viewBox. Path data is verbatim from
 * public/app-icon.svg; only the fills differ.
 *
 * What makes real animation possible is that the source artwork keeps its parts
 * on separate paths, so this is a rig rather than a sprite:
 *
 *   - the WING beats about its shoulder and partly folds on the upstroke;
 *   - the LEGS tuck up behind the body in flight and reach forward to land.
 *     They are drawn before the body precisely so tucking hides them behind it;
 *   - the HEAD turns about the neck. Beak, eye and eyelid are grouped with it,
 *     since a head that rotated away from its own beak would be a disaster.
 *
 * Head and body share a fill, so their z-order is invisible — which is why the
 * head group can be moved on top of the body to keep the group intact without
 * changing how the bird looks.
 *
 * Every animated value is a MotionValue written from the physics loop, so a bird
 * in flight causes zero React re-renders.
 */

// Drawn for a pale sage disc, where #4D4D4D reads as near-black. On #08090c
// that silhouette disappears, so the greys are lifted while their relationships
// — body darker than wing, upper beak lighter than lower — are kept. Feet move
// to the brand accent (from #FF873D, a hair off it).
const C = {
  body: "#6e7480",
  wing: "#888f9b",
  beakUpper: "#a6acb6",
  beakLower: "#8b919c",
  foot: "#ff8a3d",
  eye: "#ffffff",
  pupil: "#14161a"
};

/**
 * The shoulder, as a fraction of the wing's own bounding box.
 *
 * transform-box: fill-box resolves transform-origin against the element's bbox,
 * which for the wing is 204x119 at (222,190) in the artwork grid. The wing
 * path's first point, 245.765,192.409, is exactly where it meets the body — so
 * the joint lands at 11.6% / 2%. (Raw user-space coordinates would pivot the
 * wing about a point outside the bird entirely.)
 */
const WING_PIVOT = "11.6% 2%";

/** Each leg group's bbox starts at the hip, so 50% 0% is the joint. */
const HIP_PIVOT = "50% 0%";

/**
 * The neck, in viewBox coordinates.
 *
 * The head group holds beak, skull, eye and lid, so a fill-box origin would move
 * whenever the group's contents changed. transform-box: view-box measures from
 * the viewBox corner (64,140) instead, which is stable: the head bbox is 111x91
 * at (140,140), putting the neck at ~(245,225) = (181, 85) from that corner.
 */
const NECK_PIVOT = "181px 85px";

const fillBox = { transformBox: "fill-box" as const };
const viewBox = { transformBox: "view-box" as const };

export interface BirdRig {
  /** Wing rotation about the shoulder, degrees. Negative is raised. */
  wingAngle: MotionValue<number>;
  /** Wing foreshortening on the upstroke, where the wing partly folds. */
  wingFold: MotionValue<number>;
  /** 0 legs down and reaching, negative tucks them away behind the body. */
  legTuck: MotionValue<number>;
  /** Head rotation about the neck, degrees. */
  headTurn: MotionValue<number>;
  /** Eyelid, 0 open to 1 shut. */
  lid: MotionValue<number>;
}

interface OrtuBirdProps {
  rig: BirdRig;
  width: number;
  className?: string;
}

const OrtuBird = ({ rig, width, className = "" }: OrtuBirdProps) => (
  <svg
    viewBox="64 140 385 233"
    width={width}
    height={width * (233 / 385)}
    className={className}
    aria-hidden="true"
    focusable="false"
  >
    {/* Legs first, so tucking them rotates them behind the body. */}
    <motion.g style={{ ...fillBox, transformOrigin: HIP_PIVOT, rotate: rig.legTuck }}>
      <path fill={C.body} d="M268.689,298.644l0.34,0.64l13.41,25.567c0,0,1.295,2.984,0.763,4.048 c-0.532,1.063-4.265-0.75-7.605,0.804c-3.339,1.554-4.524,3.666-4.524,3.666s-2.562-0.545-2.657-2.657s-24.504-25.813-24.79-24.804 c-0.273,1.009,25.049-7.251,25.049-7.251L268.689,298.644z" />
      <path fill={C.foot} d="M282.167,328.15c0,0,2.344,4.565,2.344,7.223c0,0.777-0.137,1.09-1.853,1.99l-15.36,5.233 c6.555,6.733,4.157,10.358,0.137,13.615c0.423-6.623-2.276-7.005-5.411-8.981c-1.158,2.317-2.371,3.121-1.608,9.771 s6.364,10.876,6.364,10.876s-5.479,2.808-10.562-2.29c-5.083-5.083-2.808-12.102-2.808-12.102 c-8.082,12.484-1.54,13.178,2.576,18.235c-15.074,1.376-15.223-14.91-10.807-18.589c-4.852,5.629-6.161,12.02-0.464,18.672 c-9.295,1.254-11.748-8.463-6.378-18.317c4.238-7.55,24.831-16.218,33.976-18.916l-2.126-3.707 c0.736-4.062,4.361-5.342,12.007-2.725L282.167,328.15z" />
    </motion.g>
    <motion.g style={{ ...fillBox, transformOrigin: HIP_PIVOT, rotate: rig.legTuck }}>
      <path fill={C.body} d="M305.009,298.644l0.34,0.64l13.424,25.567c0,0,1.295,2.984,0.763,4.048 c-0.532,1.063-4.265-0.75-7.605,0.804c-3.339,1.554-4.524,3.666-4.524,3.666s-2.562-0.545-2.657-2.657s-24.504-25.813-24.79-24.804 c-0.286,1.009,25.049-7.251,25.049-7.251V298.644z" />
      <path fill={C.foot} d="M318.473,328.15c0,0,2.344,4.565,2.344,7.223c0,0.777-0.122,1.09-1.853,1.99l-15.346,5.233 c6.555,6.733,4.157,10.358,0.137,13.615c0.423-6.623-2.276-7.005-5.411-8.981c-1.158,2.317-2.371,3.121-1.608,9.771 c0.763,6.65,6.364,10.876,6.364,10.876s-5.479,2.808-10.563-2.29c-5.083-5.083-2.808-12.102-2.808-12.102 c-8.082,12.484-1.54,13.178,2.576,18.235c-15.074,1.376-15.223-14.91-10.807-18.589c-4.852,5.629-6.161,12.02-0.464,18.672 c-9.295,1.254-11.748-8.463-6.378-18.317c4.238-7.55,24.831-16.218,33.976-18.916l-2.126-3.707c0.75-4.062,4.361-5.342,12.007-2.725 L318.473,328.15z" />
    </motion.g>

    <path fill={C.body} d="M283.475,212.538c71.836,73.908,88.941,81.962,150.078,115.803 c30.215,11.489,4.961,15.891-16.231,11.421c-44.429-9.377-120.122-32.777-135.387-29.193 c-23.182,10.385-56.028,1.867-79.755-22.528c-28.157-28.974-32.777-69.356-10.331-90.195 c22.446-20.852,63.468-14.269,91.625,14.705L283.475,212.538L283.475,212.538z" />

    <motion.path
      fill={C.wing}
      d="M245.765,192.409c-31.1,12.743-28.198,53.438-7.891,68.838 c62.583,47.469,186.944,46.037,186.944,46.037c-105.39-55.618-147.952-127.632-179.053-114.889V192.409z"
      style={{
        ...fillBox,
        transformOrigin: WING_PIVOT,
        rotate: rig.wingAngle,
        scaleX: rig.wingFold
      }}
    />

    {/* Beak, skull, eye and lid turn together about the neck. */}
    <motion.g style={{ ...viewBox, transformOrigin: NECK_PIVOT, rotate: rig.headTurn }}>
      <path fill={C.beakUpper} d="M83.939,187.04l-18.371,20.62l29.193-14.732l51.04-14.133l0.682-12.906 c-0.968-0.654-4.02-1.963-2.74-5.125l-59.789,26.263L83.939,187.04z" />
      <path fill={C.beakLower} d="M64.518,207.946l30.228-15.006l51.04-14.133l2.685,9.827L96.6,199.51l-32.082,8.449V207.946z" />
      <path fill={C.body} d="M224.164,161.145l25.363,29.042l-66.808,39.673c-14.324,0.79-19.271-34.331-39.087-42.74 c-8.204-3.475-0.027-3.761-0.027-13.452c0-8.954-2.29-10.712,2.276-16.096c20.688-24.381,66.494-23.345,78.296,3.571 L224.164,161.145L224.164,161.145z" />
      <path fill={C.eye} d="M162.263,161.213c4.238,0,7.686,3.434,7.686,7.686c0,4.238-3.434,7.686-7.686,7.686 c-4.238,0-7.686-3.434-7.686-7.686C154.576,164.661,158.01,161.213,162.263,161.213z" />
      <path fill={C.pupil} d="M160.981,165.26c2.14,0,3.857,1.731,3.857,3.857s-1.731,3.857-3.857,3.857s-3.857-1.731-3.857-3.857 S158.856,165.26,160.981,165.26z" />
      {/* the lid is simply the head colour drawn over the eye */}
      <motion.ellipse
        cx="162"
        cy="169"
        rx="8.6"
        ry="8.6"
        fill={C.body}
        style={{ ...fillBox, transformOrigin: "50% 50%", scaleY: rig.lid }}
      />
    </motion.g>
  </svg>
);

export default OrtuBird;
