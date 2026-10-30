import { planX, planZ, planLen } from "./campus-space";
import { FLOOR_Y } from "./campus-interior";

/**
 * The walking route to room 2.318, in plan pixels: in from the bottom left, up past
 * the two restrooms on the left, along the hallway, and in through the left-hand doorway.
 */
const ROUTE: [number, number][] = [
  [358, 842],
  [358, 432],
  [584, 432],
  [584, 346],
];
const WIDTH = 8; // plan px
const CORNER = 30; // plan px, how round the turns are
const LIFT = 0.0014;

/** Polyline with its corners rounded off, as dense points. */
function rounded(pts: [number, number][]) {
  const out: [number, number][] = [pts[0]];
  for (let i = 1; i < pts.length - 1; i++) {
    const [a, p, b] = [pts[i - 1], pts[i], pts[i + 1]];
    const la = Math.hypot(p[0] - a[0], p[1] - a[1]);
    const lb = Math.hypot(b[0] - p[0], b[1] - p[1]);
    const r = Math.min(CORNER, la / 2, lb / 2);
    const s: [number, number] = [p[0] + ((a[0] - p[0]) / la) * r, p[1] + ((a[1] - p[1]) / la) * r];
    const e: [number, number] = [p[0] + ((b[0] - p[0]) / lb) * r, p[1] + ((b[1] - p[1]) / lb) * r];
    for (let k = 0; k <= 10; k++) {
      const t = k / 10;
      const u = 1 - t;
      out.push([
        u * u * s[0] + 2 * u * t * p[0] + t * t * e[0],
        u * u * s[1] + 2 * u * t * p[1] + t * t * e[1],
      ]);
    }
  }
  out.push(pts[pts.length - 1]);
  return out;
}

export interface Route {
  group: any;
  /** progress 0..1 is how much of the line is drawn, fade 0..1 its opacity, time in seconds. */
  update: (progress: number, fade: number, time: number) => void;
}

/** A blue "directions" line that draws itself along the route, like a maps app. */
export function buildRoute(
  THREE: any,
  track: <T extends { dispose: () => void }>(item: T) => T,
): Route {
  const group = new THREE.Group();
  const pts = rounded(ROUTE);

  const half = planLen(WIDTH) / 2;
  const position: number[] = [];
  const dist: number[] = [];
  const side: number[] = [];
  let run = 0;
  pts.forEach(([x, y], i) => {
    const prev = pts[Math.max(i - 1, 0)];
    const next = pts[Math.min(i + 1, pts.length - 1)];
    let tx = planX(next[0]) - planX(prev[0]);
    let tz = planZ(next[1]) - planZ(prev[1]);
    const len = Math.hypot(tx, tz) || 1;
    tx /= len;
    tz /= len;
    if (i > 0) run += Math.hypot(planX(x) - planX(prev[0]), planZ(y) - planZ(prev[1]));
    [-1, 1].forEach((sd) => {
      position.push(planX(x) - tz * half * sd, FLOOR_Y + LIFT, planZ(y) + tx * half * sd);
      dist.push(run);
      side.push(sd);
    });
  });
  const index: number[] = [];
  for (let i = 0; i < pts.length - 1; i++) {
    const a = i * 2;
    index.push(a, a + 1, a + 2, a + 1, a + 3, a + 2);
  }
  const geo = track(new THREE.BufferGeometry());
  geo.setAttribute("position", new THREE.Float32BufferAttribute(position, 3));
  geo.setAttribute("aDist", new THREE.Float32BufferAttribute(dist, 1));
  geo.setAttribute("aSide", new THREE.Float32BufferAttribute(side, 1));
  geo.setIndex(index);
  const total = run;

  const mat = track(
    new THREE.MeshBasicMaterial({
      color: "#2f7bff",
      transparent: true,
      side: THREE.DoubleSide,
      depthWrite: false,
      polygonOffset: true,
      polygonOffsetFactor: -4,
      polygonOffsetUnits: -4,
      toneMapped: false,
    }),
  );
  mat.onBeforeCompile = (shader: any) => {
    shader.uniforms.uProgress = { value: 0 };
    shader.uniforms.uTime = { value: 0 };
    shader.vertexShader = shader.vertexShader
      .replace(
        "#include <common>",
        "#include <common>\nattribute float aDist;\nattribute float aSide;\nvarying float vDist;\nvarying float vSide;",
      )
      .replace("#include <begin_vertex>", "#include <begin_vertex>\nvDist = aDist;\nvSide = aSide;");
    shader.fragmentShader = shader.fragmentShader
      .replace(
        "#include <common>",
        "#include <common>\nuniform float uProgress;\nuniform float uTime;\nvarying float vDist;\nvarying float vSide;",
      )
      .replace(
        "#include <clipping_planes_fragment>",
        "#include <clipping_planes_fragment>\nif (vDist > uProgress) discard;",
      )
      .replace(
        "#include <color_fragment>",
        `#include <color_fragment>
        // frosted glass: translucent body, brighter toward the middle, a thin
        // light rim, and one slow soft sheen that glides along the line
        float a = abs(vSide);
        float body = 1.0 - smoothstep(0.0, 1.0, a);
        float rim = smoothstep(0.72, 0.9, a) * (1.0 - smoothstep(0.9, 1.0, a));
        float sheen = pow(0.5 + 0.5 * sin((vDist - uTime * 0.12) * 14.0), 6.0);
        vec3 deep = vec3(0.16, 0.42, 0.95);
        vec3 light = vec3(0.62, 0.82, 1.0);
        diffuseColor.rgb = mix(deep, light, body * 0.45 + rim * 0.55 + sheen * 0.18);
        diffuseColor.a *= (0.5 + 0.2 * body + 0.3 * rim) * (1.0 - smoothstep(0.94, 1.0, a));`,
      );
    mat.userData.shader = shader;
  };
  const ribbon = new THREE.Mesh(geo, mat);
  ribbon.renderOrder = 5;
  group.add(ribbon);

  // destination pin where the line ends inside the room
  const end = ROUTE[ROUTE.length - 1];
  const pinR = planLen(WIDTH) * 1.05;
  const ringGeo = track(new THREE.CircleGeometry(pinR, 32));
  const dotGeo = track(new THREE.CircleGeometry(pinR * 0.62, 32));
  const ringMat = track(
    new THREE.MeshBasicMaterial({ color: "#cfe3ff", transparent: true, depthWrite: false, toneMapped: false }),
  );
  const dotMat = track(
    new THREE.MeshBasicMaterial({ color: "#2f7bff", transparent: true, depthWrite: false, toneMapped: false }),
  );
  const pin = new THREE.Group();
  [
    [ringGeo, ringMat, 6],
    [dotGeo, dotMat, 7],
  ].forEach(([g, m, order]: any) => {
    const mesh = new THREE.Mesh(g, m);
    mesh.rotation.x = -Math.PI / 2;
    mesh.renderOrder = order;
    pin.add(mesh);
  });
  pin.position.set(planX(end[0]), FLOOR_Y + LIFT * 2, planZ(end[1]));
  group.add(pin);
  group.visible = false;

  return {
    group,
    update(progress, fade, time) {
      group.visible = progress > 0 && fade > 0.003;
      if (!group.visible) return;
      const sh = mat.userData.shader;
      if (sh) {
        sh.uniforms.uProgress.value = progress * total;
        sh.uniforms.uTime.value = time;
      }
      mat.opacity = fade;
      ringMat.opacity = fade * 0.55;
      dotMat.opacity = fade * 0.9;
      const pop = Math.min(Math.max((progress - 0.94) / 0.06, 0), 1);
      pin.visible = pop > 0;
      const s = 0.4 + 0.6 * pop * (2 - pop);
      pin.scale.set(s, s, s);
    },
  };
}
