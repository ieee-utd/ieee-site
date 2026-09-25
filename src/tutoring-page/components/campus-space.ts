import { MAP, PLAN_ORIGIN, Pt } from "./campus-data";

/** 1 world unit = 100 map pixels, roughly 42 m of campus. */
export const SC = 0.01;
export const W = MAP.w * SC;
export const D = MAP.h * SC;
export const METRE = 1 / 42;
export const STOREY = 0.085;

// Map pixels -> world. Shapes are drawn in the XY plane and then rotated flat,
// so a shape's Y runs opposite to world Z.
export const toX = (px: number) => px * SC - W / 2;
export const toZ = (py: number) => py * SC - D / 2;
export const toShapeY = (py: number) => D / 2 - py * SC;

// Floor-plan pixels -> world.
export const planX = (px: number) => toX(PLAN_ORIGIN.x + px * PLAN_ORIGIN.scale);
export const planZ = (py: number) => toZ(PLAN_ORIGIN.y + py * PLAN_ORIGIN.scale);
export const planLen = (l: number) => l * PLAN_ORIGIN.scale * SC;
export const planToMap = (px: number, py: number): Pt => [
  PLAN_ORIGIN.x + px * PLAN_ORIGIN.scale,
  PLAN_ORIGIN.y + py * PLAN_ORIGIN.scale,
];

/** Small deterministic RNG so the scene is identical on every load. */
export function rng(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function pointInPolygon(x: number, y: number, poly: Pt[]) {
  let inside = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const [xi, yi] = poly[i];
    const [xj, yj] = poly[j];
    if ((yi > y) !== (yj > y) && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) {
      inside = !inside;
    }
  }
  return inside;
}

/** A THREE.Shape (with holes) from map-pixel rings: [outer, ...holes]. */
export function shapeFrom(THREE: any, rings: Pt[][]) {
  const make = (ring: Pt[], Ctor: any) => {
    const s = new Ctor();
    ring.forEach(([px, py], i) => {
      const x = toX(px);
      const y = toShapeY(py);
      if (i === 0) s.moveTo(x, y);
      else s.lineTo(x, y);
    });
    s.closePath();
    return s;
  };
  const shape = make(rings[0], THREE.Shape);
  for (let i = 1; i < rings.length; i++) {
    shape.holes.push(make(rings[i], THREE.Path));
  }
  return shape;
}

export function polygonArea(poly: Pt[]) {
  let a = 0;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    a += (poly[j][0] + poly[i][0]) * (poly[j][1] - poly[i][1]);
  }
  return Math.abs(a / 2);
}
