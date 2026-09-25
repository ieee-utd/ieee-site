import { ECSN_FOOTPRINT } from "./campus-data";
import { W, D, planX, planZ, toX, toZ, pointInPolygon } from "./campus-space";
import { FLOOR_Y } from "./campus-interior";

export type V3 = [number, number, number];
export interface Key {
  t: number;
  pos: V3;
  look: V3;
  fov: number;
}
export interface Pose {
  pos: V3;
  look: V3;
  fov: number;
}

export const FOV = 35;
/** How much of the map the opening shot fills; <1 keeps the map's edge out of frame. */
export const START_FILL = 0.84;
export const LOOP_SECONDS = 40;
const EYE = FLOOR_Y + 0.038;

export const ROOM_CX = planX(622);
export const ROOM_CZ = planZ(359);
const pl = (px: number, py: number, h: number): V3 => [planX(px), h, planZ(py)];

/** Loop moments other systems key off (roof, room lights, captions). */
export const BEATS = {
  roofOff: [0.25, 0.38],
  // the roof only comes back once the camera is well above where it lands
  roofOn: [0.955, 0.995],
  lightsUp: [0.42, 0.56],
  lightsDown: [0.84, 0.9],
  captions: [0.17, 0.35, 0.52, 0.86],
};

/**
 * The camera move. It opens square-on so the scene reads as the flat campus
 * map, tilts to reveal the massing, lifts ECSN's upper floors off, drops to eye
 * level in the lobby and walks through the door of 2.318, then rises back out.
 * The first key is not repeated at t = 1; the path is cyclic.
 */
export function cameraPath(fitY: number): Key[] {
  const startY = fitY * START_FILL;
  const ex = toX(620);
  const ez = toZ(385);
  return [
    { t: 0.0, pos: [0, startY, 0.05], look: [0, 0, 0], fov: FOV },
    { t: 0.06, pos: [-0.05, startY * 0.9, 0.12], look: [-0.1, 0, -0.03], fov: FOV },
    // drop nearly straight down first: tilting while still high would show the map's far edge
    { t: 0.13, pos: [ex + 0.5, 5.6, ez + 0.9], look: [ex + 0.2, 0.05, ez - 0.1], fov: FOV },
    { t: 0.19, pos: [ex + 1.2, 3.9, ez + 1.9], look: [ex, 0.1, ez], fov: FOV },
    { t: 0.31, pos: [ex + 0.35, 2.1, ez + 1.45], look: [ex, 0.12, ez], fov: FOV },
    { t: 0.4, pos: [ROOM_CX - 0.3, 1.0, ROOM_CZ + 0.95], look: [ROOM_CX, 0.09, ROOM_CZ], fov: 38 },
    { t: 0.48, pos: [ROOM_CX + 0.6, 0.42, ROOM_CZ + 0.62], look: [ROOM_CX - 0.05, 0.09, ROOM_CZ + 0.03], fov: 44 },
    // Drop into the hallway in front of the left doorway. Coming from above rather
    // than along the hallway keeps the camera clear of the two open door leaves.
    { t: 0.55, pos: pl(584, 452, FLOOR_Y + 0.13), look: pl(584, 410, EYE), fov: 50 },
    { t: 0.62, pos: pl(583, 438, EYE), look: pl(584, 395, EYE - 0.004), fov: 56 },
    { t: 0.68, pos: pl(583, 420, EYE), look: pl(590, 372, EYE - 0.006), fov: 58 },
    { t: 0.75, pos: pl(590, 378, EYE + 0.004), look: pl(505, 352, EYE - 0.01), fov: 60 },
    { t: 0.81, pos: pl(590, 360, EYE + 0.012), look: pl(700, 335, EYE), fov: 58 },
    { t: 0.855, pos: pl(600, 362, FLOOR_Y + 0.16), look: pl(660, 335, FLOOR_Y + 0.03), fov: 50 },
    { t: 0.9, pos: [ROOM_CX, 0.85, ROOM_CZ + 0.3], look: [ROOM_CX, 0.09, ROOM_CZ], fov: 42 },
    // the climb back out is spaced geometrically, so it reads as one steady zoom-out
    { t: 0.925, pos: [ex + 0.9, 2.5, ez + 2.0], look: [ex, 0.1, ez], fov: FOV },
    { t: 0.95, pos: [ex + 0.6, 4.6, ez + 2.3], look: [ex, 0.08, ez], fov: FOV },
    { t: 0.975, pos: [ex + 0.3, 8.2, ez + 1.4], look: [ex * 0.5, 0.04, ez * 0.5], fov: FOV },
  ];
}

/**
 * Monotone cubic Hermite slopes (Fritsch-Carlson / PCHIP) over a cyclic list of
 * unevenly spaced samples. Unlike Catmull-Rom this never overshoots a key, so
 * the camera cannot dip through the floor between two low keys, and the speed
 * stays continuous across keys however unevenly they are spaced in time.
 */
function slopes(values: number[], times: number[]) {
  const n = values.length;
  const dt: number[] = [];
  const delta: number[] = [];
  for (let i = 0; i < n; i++) {
    const j = (i + 1) % n;
    const span = j === 0 ? times[0] + 1 - times[i] : times[j] - times[i];
    dt.push(span);
    delta.push((values[j] - values[i]) / span);
  }
  const m: number[] = [];
  for (let i = 0; i < n; i++) {
    const p = (i + n - 1) % n;
    if (delta[p] * delta[i] <= 0) {
      m.push(0);
    } else {
      const w1 = 2 * dt[i] + dt[p];
      const w2 = dt[i] + 2 * dt[p];
      m.push((w1 + w2) / (w1 / delta[p] + w2 / delta[i]));
    }
  }
  return { m, dt };
}

interface Curve {
  times: number[];
  values: number[];
  m: number[];
  dt: number[];
}

function curve(values: number[], times: number[]): Curve {
  const { m, dt } = slopes(values, times);
  return { times, values, m, dt };
}

function evalCurve(c: Curve, t: number) {
  const n = c.values.length;
  // find the segment; the last one wraps round to the first key
  let i = n - 1;
  for (let k = 0; k < n - 1; k++) {
    if (t < c.times[k + 1]) {
      i = k;
      break;
    }
  }
  const j = (i + 1) % n;
  const dt = c.dt[i];
  const local = t >= c.times[i] ? t - c.times[i] : t + 1 - c.times[i];
  const f = local / dt;
  const f2 = f * f;
  const f3 = f2 * f;
  return (
    (2 * f3 - 3 * f2 + 1) * c.values[i] +
    (f3 - 2 * f2 + f) * dt * c.m[i] +
    (-2 * f3 + 3 * f2) * c.values[j] +
    (f3 - f2) * dt * c.m[j]
  );
}

/**
 * The camera's up vector for a pose. A plain lookAt uses world-up, which is
 * nearly parallel to the view when the camera looks straight down: the frame
 * then spins wildly on tiny movements and swings the map's corners into view.
 * Near vertical, this blends over to "screen-up is north" so the top-down
 * shots stay upright and the roll eases in only as the camera tilts.
 */
export function cameraUp(pos: V3, look: V3): V3 {
  const fx = look[0] - pos[0];
  const fy = look[1] - pos[1];
  const fz = look[2] - pos[2];
  const len = Math.hypot(fx, fy, fz) || 1;
  const hor = Math.hypot(fx, fz) / len; // 0 looking straight down, 1 level
  const w = smoothstep(0.1, 0.55, hor);
  // horizontal heading, falling back to north when it is ill-defined
  let hx = (fx / len) * w;
  let hz = (fz / len) * w - (1 - w);
  const hl = Math.hypot(hx, hz) || 1;
  hx /= hl;
  hz /= hl;
  const ux = hx * (1 - w);
  const uy = w;
  const uz = hz * (1 - w);
  const ul = Math.hypot(ux, uy, uz) || 1;
  return [ux / ul, uy / ul, uz / ul];
}

function smoothstep(a: number, b: number, x: number) {
  const t = Math.min(Math.max((x - a) / (b - a), 0), 1);
  return t * t * (3 - 2 * t);
}

export interface CameraRig {
  sample: (t: number, out: Pose) => void;
}

export function makeRig(startY: number): CameraRig {
  const keys = cameraPath(startY);
  const times = keys.map((k) => k.t);
  const comps: Curve[] = [];
  for (let a = 0; a < 3; a++) comps.push(curve(keys.map((k) => k.pos[a]), times));
  for (let a = 0; a < 3; a++) comps.push(curve(keys.map((k) => k.look[a]), times));
  comps.push(curve(keys.map((k) => k.fov), times));

  return {
    sample(t, out) {
      const v = comps.map((c) => evalCurve(c, t));
      out.pos = [v[0], v[1], v[2]];
      out.look = [v[3], v[4], v[5]];
      out.fov = v[6];
      // Belt and braces: never sink into the ground or through level 2's floor.
      const over = pointInPolygon(
        (out.pos[0] + W / 2) / 0.01,
        (out.pos[2] + D / 2) / 0.01,
        ECSN_FOOTPRINT,
      );
      out.pos[1] = Math.max(out.pos[1], over ? FLOOR_Y + 0.012 : 0.012);
    },
  };
}
