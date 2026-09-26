import {
  ECSN_FOOTPRINT,
  PLAN,
  PLAN_ORIGIN,
  PLAN_PADS,
  PLAN_ROOMS,
  PLAN_WALLS,
  ROOM_LABELS,
} from "./campus-data";
import {
  STOREY,
  W,
  D,
  planX,
  planZ,
  planLen,
  planToMap,
  pointInPolygon,
  shapeFrom,
  rng,
} from "./campus-space";

/** Level 2's floor, and how tall its walls run. */
export const FLOOR_Y = STOREY;
export const WALL_H = STOREY * 0.94;

/** Room 2.318 in plan pixels (inner faces of its four walls). */
const RM = { x0: 450, x1: 808, y0: 311, y1: 407 };
/** The double doorway from the hand-drawn plan: two openings with a wall stub between. */
const DOORWAYS: [number, number][] = [[559, 604], [626, 664]];
/** How far the door partition runs into the room (plan y). */
const STUB_TOP = 372;

export interface Interior {
  group: any;
  lights: any[];
}

function canvasTex(THREE: any, c: HTMLCanvasElement, aniso: number) {
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = aniso;
  return t;
}

function mk(w: number, h: number) {
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  return c;
}

/** Level 2's floor: polished lobby stone, warm office carpet, room numbers. */
function floorCanvas() {
  const w = 4096;
  const k = w / PLAN.w;
  const c = mk(w, Math.round(PLAN.h * k));
  const g = c.getContext("2d")!;
  g.fillStyle = "#efeae1";
  g.fillRect(0, 0, c.width, c.height);

  // stone tiles
  g.strokeStyle = "rgba(120,108,92,0.13)";
  g.lineWidth = 2;
  const step = 58 * k;
  for (let x = 0; x < c.width; x += step) {
    g.beginPath();
    g.moveTo(x, 0);
    g.lineTo(x, c.height);
    g.stroke();
  }
  for (let y = 0; y < c.height; y += step) {
    g.beginPath();
    g.moveTo(0, y);
    g.lineTo(c.width, y);
    g.stroke();
  }

  // carpeted room clusters
  g.fillStyle = "#d6c7b3";
  PLAN_ROOMS.forEach((poly) => {
    g.beginPath();
    poly.forEach(([x, y], i) =>
      i ? g.lineTo(x * k, y * k) : g.moveTo(x * k, y * k),
    );
    g.closePath();
    g.fill();
  });
  g.strokeStyle = "rgba(255,255,255,0.10)";
  g.lineWidth = 1.5;
  for (let y = 0; y < c.height; y += 10 * k) {
    g.beginPath();
    g.moveTo(0, y);
    g.lineTo(c.width, y);
    g.stroke();
  }

  g.textAlign = "center";
  g.textBaseline = "middle";
  ROOM_LABELS.forEach(([text, x, y]) => {
    const lobby = text === "MAIN LOBBY";
    g.fillStyle = lobby ? "rgba(70,62,54,0.55)" : "rgba(60,54,48,0.72)";
    g.font = `${lobby ? 700 : 600} ${(lobby ? 30 : 25) * k}px Montserrat, "Helvetica Neue", Arial, sans-serif`;
    if (lobby && "letterSpacing" in g) (g as any).letterSpacing = `${7 * k}px`;
    g.fillText(text, x * k, y * k);
    if ("letterSpacing" in g) (g as any).letterSpacing = "0px";
  });
  return c;
}

/** Polished charcoal floor tiles: a 2 x 2 patch with a slightly different tone per tile. */
function tileCanvas() {
  const c = mk(512, 512);
  const g = c.getContext("2d")!;
  const tones = ["#575a61", "#5e6168", "#5a5d64", "#53565d"];
  for (let i = 0; i < 4; i++) {
    const x = (i % 2) * 256;
    const y = Math.floor(i / 2) * 256;
    const grad = g.createLinearGradient(x, y, x + 256, y + 256);
    grad.addColorStop(0, tones[i]);
    grad.addColorStop(1, "#4a4d54");
    g.fillStyle = grad;
    g.fillRect(x, y, 256, 256);
    // faint stone veining
    g.strokeStyle = "rgba(255,255,255,0.06)";
    g.lineWidth = 1.5;
    for (let k = 0; k < 3; k++) {
      g.beginPath();
      g.moveTo(x + 20 + k * 70, y);
      g.bezierCurveTo(x + 90 + k * 40, y + 90, x + 30 + k * 60, y + 170, x + 120 + k * 50, y + 256);
      g.stroke();
    }
  }
  // grout
  g.fillStyle = "#33353a";
  g.fillRect(0, 0, 512, 3);
  g.fillRect(0, 254, 512, 4);
  g.fillRect(0, 509, 512, 3);
  g.fillRect(0, 0, 3, 512);
  g.fillRect(254, 0, 4, 512);
  g.fillRect(509, 0, 3, 512);
  return c;
}

/** Vertical wood boards for the counters' bases. */
function woodCanvas() {
  const c = mk(256, 256);
  const g = c.getContext("2d")!;
  const r = rng(11);
  for (let x = 0; x < 256; x += 32) {
    g.fillStyle = `hsl(28, 42%, ${34 + r() * 8}%)`;
    g.fillRect(x, 0, 31, 256);
    g.fillStyle = "rgba(0,0,0,0.10)";
    for (let i = 0; i < 7; i++) g.fillRect(x + 3 + i * 4, 0, 1, 256);
    g.fillStyle = "rgba(255,220,170,0.06)";
    g.fillRect(x + 12, 0, 3, 256);
  }
  g.fillStyle = "rgba(20,10,0,0.45)";
  for (let x = 31; x < 256; x += 32) g.fillRect(x, 0, 1.5, 256);
  return c;
}

function pictogram(kind: "f" | "m") {
  const c = mk(128, 128);
  const g = c.getContext("2d")!;
  g.fillStyle = "#2b2f36";
  g.beginPath();
  (g as any).roundRect(4, 4, 120, 120, 18);
  g.fill();
  g.fillStyle = "#fff";
  g.beginPath();
  g.arc(64, 36, 12, 0, 6.29);
  g.fill();
  if (kind === "f") {
    g.beginPath();
    g.moveTo(64, 52);
    g.lineTo(38, 100);
    g.lineTo(90, 100);
    g.closePath();
    g.fill();
  } else {
    g.beginPath();
    (g as any).roundRect(46, 52, 36, 34, 6);
    g.fill();
    g.fillRect(50, 84, 10, 22);
    g.fillRect(68, 84, 10, 22);
  }
  return c;
}

function signCanvas(kind: "ieee" | "door" | "poster", tint = "#00629b") {
  const isDoor = kind === "door";
  const c = mk(512, isDoor ? 192 : 256);
  const g = c.getContext("2d")!;
  g.textAlign = "center";
  g.textBaseline = "middle";
  if (kind === "ieee") {
    g.fillStyle = "rgba(255,255,255,0.0)";
    g.fillRect(0, 0, c.width, c.height);
    g.fillStyle = "#ffffff";
    g.font = '800 132px Montserrat, "Helvetica Neue", Arial, sans-serif';
    g.fillText("IEEE", 256, 92);
    g.fillStyle = "#f4b400";
    g.fillRect(96, 160, 320, 8);
    g.fillStyle = "#ffffff";
    g.font = '600 38px Montserrat, "Helvetica Neue", Arial, sans-serif';
    g.fillText("TUTORING  ·  ECSN 2.318", 256, 208);
  } else if (isDoor) {
    g.fillStyle = "#1f2a36";
    g.fillRect(0, 0, 512, 192);
    g.fillStyle = "#f4b400";
    g.fillRect(0, 0, 14, 192);
    g.fillStyle = "#fff";
    g.font = '800 96px Montserrat, "Helvetica Neue", Arial, sans-serif';
    g.fillText("2.318", 270, 70);
    g.fillStyle = "#c8d3de";
    g.font = '600 32px Montserrat, "Helvetica Neue", Arial, sans-serif';
    g.fillText("IEEE TUTORING · OPEN", 270, 148);
  } else {
    g.fillStyle = tint;
    g.fillRect(0, 0, 512, 256);
    g.fillStyle = "rgba(255,255,255,0.9)";
    g.fillRect(36, 40, 440, 14);
    g.fillRect(36, 74, 300, 10);
    g.fillStyle = "rgba(255,255,255,0.35)";
    for (let i = 0; i < 5; i++) g.fillRect(36, 120 + i * 24, 440 - (i % 2) * 90, 8);
  }
  return c;
}

export function buildInterior(
  THREE: any,
  mergeGeometries: (g: any[]) => any,
  aniso: number,
  track: <T extends { dispose: () => void }>(item: T) => T,
): Interior {
  const group = new THREE.Group();
  const lights: any[] = [];
  const rand = rng(318);

  const std = (opts: any) => track(new THREE.MeshStandardMaterial(opts));
  const wallMat = std({ color: "#f3efe7", roughness: 0.9 });
  const trimMat = std({ color: "#2c333b", roughness: 0.5, metalness: 0.4 });
  const steel = std({ color: "#cfd4da", roughness: 0.28, metalness: 0.85 });
  const glassMat = std({
    color: "#bfe0f2",
    roughness: 0.04,
    metalness: 0,
    transparent: true,
    opacity: 0.2,
    depthWrite: false,
  });

  const box = (
    w: number,
    h: number,
    d: number,
    x: number,
    y: number,
    z: number,
    mat: any,
    cast = true,
  ) => {
    const geo = track(new THREE.BoxGeometry(w, h, d));
    const m = new THREE.Mesh(geo, mat);
    m.position.set(x, y, z);
    m.castShadow = cast;
    m.receiveShadow = true;
    group.add(m);
    return m;
  };
  const plane = (
    w: number,
    h: number,
    tex: any,
    x: number,
    y: number,
    z: number,
    ry = 0,
    transparent = true,
  ) => {
    const geo = track(new THREE.PlaneGeometry(w, h));
    const mat = std({
      map: tex,
      transparent,
      roughness: 0.6,
      side: THREE.DoubleSide,
    });
    const m = new THREE.Mesh(geo, mat);
    m.position.set(x, y, z);
    m.rotation.y = ry;
    group.add(m);
    return m;
  };

  // ---- floor --------------------------------------------------------------
  const floorGeo = track(new THREE.ShapeGeometry(shapeFrom(THREE, [ECSN_FOOTPRINT])));
  const pos = floorGeo.attributes.position;
  const uv = floorGeo.attributes.uv;
  for (let i = 0; i < pos.count; i++) {
    const mapX = (pos.getX(i) + W / 2) / 0.01;
    const mapY = (D / 2 - pos.getY(i)) / 0.01;
    uv.setXY(
      i,
      (mapX - PLAN_ORIGIN.x) / PLAN_ORIGIN.scale / PLAN.w,
      1 - (mapY - PLAN_ORIGIN.y) / PLAN_ORIGIN.scale / PLAN.h,
    );
  }
  uv.needsUpdate = true;
  floorGeo.rotateX(-Math.PI / 2);
  const floorTex = track(canvasTex(THREE, floorCanvas(), aniso));
  const floor = new THREE.Mesh(
    floorGeo,
    std({ map: floorTex, roughness: 0.32, metalness: 0.02 }),
  );
  floor.position.y = FLOOR_Y;
  floor.receiveShadow = true;
  group.add(floor);

  // ---- walls (everything except room 2.318, which is built by hand) --------
  const roomWalls = (w: number[]) => {
    const cx = w[0] + w[2] / 2;
    const cy = w[1] + w[3] / 2;
    return cx > 428 && cx < 816 && cy > 298 && cy < 416;
  };
  // Solid built-ins (lift cores, stair, restroom fronts) are modelled below. The
  // detector also picked up their icons as wall segments, which would stand
  // inside them and poke through their tops.
  const solids: [number, number, number, number][] = [
    [376, 313, 72, 70],
    [1174, 313, 72, 70],
    [457, 218, 71, 69],
    ...PLAN_PADS,
  ];
  const insideSolid = (w: number[]) => {
    const cx = w[0] + w[2] / 2;
    const cy = w[1] + w[3] / 2;
    return solids.some(
      ([x, y, sw, sh]) => cx > x - 3 && cx < x + sw + 3 && cy > y - 3 && cy < y + sh + 3,
    );
  };
  const walls = PLAN_WALLS.filter((w) => {
    if (roomWalls(w) || insideSolid(w)) return false;
    const [mx, my] = planToMap(w[0] + w[2] / 2, w[1] + w[3] / 2);
    return pointInPolygon(mx, my, ECSN_FOOTPRINT);
  });
  const unit = track(new THREE.BoxGeometry(1, 1, 1));
  unit.translate(0, 0.5, 0);
  const wallsIM = new THREE.InstancedMesh(unit, wallMat, walls.length);
  const m4 = new THREE.Matrix4();
  const q = new THREE.Quaternion();
  const p = new THREE.Vector3();
  const s = new THREE.Vector3();
  walls.forEach((w, i) => {
    p.set(planX(w[0] + w[2] / 2), FLOOR_Y, planZ(w[1] + w[3] / 2));
    s.set(Math.max(planLen(w[2]), planLen(4)), WALL_H, Math.max(planLen(w[3]), planLen(4)));
    wallsIM.setMatrixAt(i, m4.compose(p, q, s));
  });
  wallsIM.castShadow = true;
  wallsIM.receiveShadow = true;
  group.add(wallsIM);

  // ---- restroom fronts ----------------------------------------------------
  const padMat = std({ color: "#e8750a", roughness: 0.55 });
  const tex = {
    f: track(canvasTex(THREE, pictogram("f"), aniso)),
    m: track(canvasTex(THREE, pictogram("m"), aniso)),
  };
  PLAN_PADS.forEach(([x, y, w, h]) => {
    const cx = planX(x + w / 2);
    const cz = planZ(y + h / 2);
    box(planLen(w), WALL_H, planLen(h), cx, FLOOR_Y + WALL_H / 2, cz, padMat);
    const left = x < 700;
    const faceX = planX(left ? x + w : x) + (left ? 0.0012 : -0.0012);
    plane(
      0.028,
      0.028,
      tex[y < 600 ? "f" : "m"],
      faceX,
      FLOOR_Y + WALL_H * 0.6,
      cz,
      left ? Math.PI / 2 : -Math.PI / 2,
    );
  });

  // ---- lifts --------------------------------------------------------------
  [376, 1174].forEach((x) => {
    const w = 72;
    const h = 70;
    const cx = planX(x + w / 2);
    const cz = planZ(313 + h / 2);
    box(planLen(w), WALL_H, planLen(h), cx, FLOOR_Y + WALL_H / 2, cz, std({ color: "#3a3f46", roughness: 0.6 }));
    const zFace = planZ(313 + h) + 0.0012;
    const dw = planLen(24);
    [-1, 1].forEach((sd) => {
      box(dw, WALL_H * 0.74, 0.0016, cx + sd * (dw / 2 + 0.0006), FLOOR_Y + WALL_H * 0.4, zFace, steel, false);
    });
    box(0.0018, WALL_H * 0.74, 0.0018, cx, FLOOR_Y + WALL_H * 0.4, zFace + 0.0003, trimMat, false);
    box(planLen(40), 0.006, 0.0016, cx, FLOOR_Y + WALL_H * 0.86, zFace, std({ color: "#ffd27a", emissive: "#ffb43a", emissiveIntensity: 0.9 }), false);
    box(0.006, 0.012, 0.0014, planX(x + w + 6), FLOOR_Y + WALL_H * 0.42, zFace, steel, false);
  });

  // ---- stair to level 3 ---------------------------------------------------
  {
    const steps = 11;
    const x0 = 457;
    const x1 = 528;
    const y0 = 218;
    const y1 = 287;
    const rise = (WALL_H * 1.05) / steps;
    const parts: any[] = [];
    // The flight climbs toward x0 (turned 180 degrees from the plan's icon).
    for (let i = 0; i < steps; i++) {
      const sx1 = x1 - ((x1 - x0) / steps) * i;
      const g = new THREE.BoxGeometry(planLen(sx1 - x0), rise * (i + 1), planLen(y1 - y0));
      g.translate(planX((x0 + sx1) / 2), FLOOR_Y + (rise * (i + 1)) / 2, planZ((y0 + y1) / 2));
      parts.push(g);
    }
    const geo = track(mergeGeometries(parts));
    parts.forEach((g) => g.dispose());
    const stair = new THREE.Mesh(geo, std({ color: "#d9d2c6", roughness: 0.7 }));
    stair.castShadow = stair.receiveShadow = true;
    group.add(stair);
    [y0, y1].forEach((yy) => {
      box(planLen(x1 - x0), 0.004, 0.0022, planX((x0 + x1) / 2), FLOOR_Y + WALL_H * 0.55, planZ(yy), steel);
    });
  }

  // ---- lobby furniture ----------------------------------------------------
  const potMat = std({ color: "#39424b", roughness: 0.5 });
  const leaf = std({ color: "#4f9a55", roughness: 0.9, flatShading: true });
  [[700, 255], [930, 255], [1040, 258], [520, 452], [1120, 452]].forEach(([x, y]) => {
    const pot = new THREE.Mesh(track(new THREE.CylinderGeometry(0.011, 0.009, 0.02, 14)), potMat);
    pot.position.set(planX(x), FLOOR_Y + 0.01, planZ(y));
    pot.castShadow = true;
    group.add(pot);
    for (let i = 0; i < 4; i++) {
      const bush = new THREE.Mesh(track(new THREE.IcosahedronGeometry(0.011 + rand() * 0.004, 1)), leaf);
      bush.position.set(
        planX(x) + (rand() - 0.5) * 0.012,
        FLOOR_Y + 0.026 + i * 0.006,
        planZ(y) + (rand() - 0.5) * 0.012,
      );
      bush.castShadow = true;
      group.add(bush);
    }
  });
  const benchWood = std({ color: "#a47a52", roughness: 0.65 });
  [[500, 476], [1140, 476]].forEach(([x, y]) => {
    box(planLen(36), 0.003, planLen(11), planX(x), FLOOR_Y + 0.0155, planZ(y), benchWood);
    [-1, 1].forEach((sd) => box(0.0016, 0.0155, planLen(9), planX(x) + sd * planLen(15), FLOOR_Y + 0.00775, planZ(y), steel));
  });

  // ---- room 2.318 ---------------------------------------------------------
  const rz0 = planZ(RM.y0 - 1.5);
  const rz1 = planZ(RM.y1 + 1.5);
  const rx0 = planX(RM.x0);
  const rx1 = planX(RM.x1);
  const rcx = (rx0 + rx1) / 2;
  const rcz = (planZ(RM.y0) + planZ(RM.y1)) / 2;
  const tk = 0.0065;

  // warm plank floor
  {
    const geo = track(new THREE.PlaneGeometry(rx1 - rx0, planZ(RM.y1) - planZ(RM.y0)));
    geo.rotateX(-Math.PI / 2);
    const t = track(canvasTex(THREE, tileCanvas(), aniso));
    t.wrapS = t.wrapT = THREE.RepeatWrapping;
    // each repeat holds 2 x 2 tiles, so a tile is 0.03 world units (about 1.3 m)
    t.repeat.set((rx1 - rx0) / 0.06, (planZ(RM.y1) - planZ(RM.y0)) / 0.06);
    const f = new THREE.Mesh(geo, std({ map: t, roughness: 0.3, metalness: 0.05 }));
    f.position.set(rcx, FLOOR_Y + 0.0012, rcz);
    f.receiveShadow = true;
    group.add(f);
  }

  // north wall: a full-height window onto the main lobby
  {
    const len = rx1 - rx0;
    box(len, 0.018, tk, rcx, FLOOR_Y + 0.009, rz0, wallMat);
    box(len, 0.008, tk, rcx, FLOOR_Y + WALL_H - 0.004, rz0, wallMat);
    box(len, WALL_H - 0.026, 0.0012, rcx, FLOOR_Y + 0.018 + (WALL_H - 0.026) / 2, rz0, glassMat, false);
    for (let x = RM.x0; x <= RM.x1; x += 46.4) {
      box(0.0022, WALL_H - 0.026, 0.0028, planX(x), FLOOR_Y + 0.018 + (WALL_H - 0.026) / 2, rz0, trimMat, false);
    }
    const ieee = track(canvasTex(THREE, signCanvas("ieee"), aniso));
    plane(0.13, 0.065, ieee, planX(660), FLOOR_Y + WALL_H * 0.56, rz0 - 0.0018, Math.PI);
    plane(0.13, 0.065, ieee, planX(520), FLOOR_Y + WALL_H * 0.56, rz0 - 0.0018, Math.PI);
  }

  // ---- layout, taken from the hand-drawn plan of the real room -------------
  // The sketch's coordinates are mapped onto the room's inner rectangle (plan px).
  const sx = (v: number) => RM.x0 + 2 + (v - 57) * 0.3715;
  const sy = (v: number) => RM.y0 + 2 + (v - 292) * 0.2556;
  const north = RM.y0 + 2;
  const south = RM.y1 - 2;

  // south wall: two open doorways with a wall stub between them
  {
    // Only the room-facing side of this wall is navy (#242B64). Box faces run
    // +x, -x, +y, -y, +z, -z, and the room lies on the -z side of this wall, so
    // the hallway side (+z), the tops and the ends stay white.
    const navy = std({ color: "#242B64", roughness: 0.85 });
    const southMat = [wallMat, wallMat, wallMat, wallMat, wallMat, navy];
    const seg = (a: number, b: number) =>
      box(planX(b) - planX(a), WALL_H, tk, (planX(a) + planX(b)) / 2, FLOOR_Y + WALL_H / 2, rz1, southMat);
    seg(RM.x0, DOORWAYS[0][0]);
    seg(DOORWAYS[1][1], RM.x1);
    const left = DOORWAYS[0][0];
    const right = DOORWAYS[1][1];
    box(planX(right) - planX(left), WALL_H * 0.22, tk, (planX(left) + planX(right)) / 2, FLOOR_Y + WALL_H * 0.89, rz1, southMat);
    // the partition that divides the two doors, running into the room
    const stub0 = DOORWAYS[0][1];
    const stub1 = DOORWAYS[1][0];
    box(planX(stub1) - planX(stub0), WALL_H, planLen(RM.y1 - STUB_TOP), (planX(stub0) + planX(stub1)) / 2, FLOOR_Y + WALL_H / 2, planZ((STUB_TOP + RM.y1) / 2), wallMat);
    [DOORWAYS[0][0], DOORWAYS[0][1], DOORWAYS[1][0], DOORWAYS[1][1]].forEach((x) =>
      box(0.0018, WALL_H * 0.8, tk * 1.1, planX(x), FLOOR_Y + WALL_H * 0.4, rz1, steel),
    );
    const doorSign = track(canvasTex(THREE, signCanvas("door"), aniso));
    plane(0.052, 0.0195, doorSign, planX(DOORWAYS[1][1] + 26), FLOOR_Y + WALL_H * 0.62, rz1 + 0.0035);
  }

  // east wall + posters
  {
    box(tk, WALL_H, rz1 - rz0, rx1, FLOOR_Y + WALL_H / 2, rcz, wallMat);
    const tints = ["#00629b", "#c0392b", "#1e8e5a"];
    tints.forEach((t, i) => {
      const tex2 = track(canvasTex(THREE, signCanvas("poster", t), aniso));
      plane(0.012, 0.017, tex2, rx1 - 0.0045, FLOOR_Y + WALL_H * 0.55, rz0 + 0.02 + i * 0.024, -Math.PI / 2);
    });
  }
  // west end wall
  box(tk, WALL_H, rz1 - rz0, rx0, FLOOR_Y + WALL_H / 2, rcz, wallMat);

  // Two large, connected whiteboards on each side of the doors. The pair on a side
  // shares one frame and one marker tray, with a thin divider where the boards meet.
  {
    const boardMat = std({ color: "#fbfbf9", roughness: 0.22 });
    const frameMat = std({ color: "#b9bec4", roughness: 0.35, metalness: 0.7 });
    const bh = 0.044;
    const cy = FLOOR_Y + WALL_H * 0.56;
    const zf = rz1 - tk / 2 - 0.0009; // just proud of the wall's inner face
    const pair = (x0: number, x1: number) => {
      const cx = (planX(x0) + planX(x1)) / 2;
      const w = planX(x1) - planX(x0);
      box(w, bh, 0.0016, cx, cy, zf, boardMat, false);
      // outer frame
      box(w + 0.0024, 0.0013, 0.0022, cx, cy + bh / 2 + 0.0004, zf - 0.0002, frameMat, false);
      box(w + 0.0024, 0.0013, 0.0022, cx, cy - bh / 2 - 0.0004, zf - 0.0002, frameMat, false);
      [x0, x1].forEach((x) => box(0.0013, bh + 0.0022, 0.0022, planX(x), cy, zf - 0.0002, frameMat, false));
      // the join between the two boards
      box(0.0009, bh, 0.0019, cx, cy, zf - 0.0001, frameMat, false);
      // marker tray along the bottom
      box(w, 0.0011, 0.0034, cx, cy - bh / 2 - 0.0016, zf - 0.0012, frameMat, false);
    };
    pair(RM.x0 + 4, DOORWAYS[0][0] - 4);
    pair(DOORWAYS[1][1] + 4, RM.x1 - 4);
  }

  // ---- furniture ----------------------------------------------------------
  const tableMat = std({ color: "#d6c3a0", roughness: 0.55 });
  const woodTex = track(canvasTex(THREE, woodCanvas(), aniso));
  woodTex.wrapS = woodTex.wrapT = THREE.RepeatWrapping;
  woodTex.repeat.set(1.4, 0.4);
  const counterMat = std({ map: woodTex, roughness: 0.6 });
  const counterTop = std({ color: "#20262d", roughness: 0.3 });
  const TABLE_H = 0.0195;

  /** A table or desk between two plan-pixel corners. */
  const tableFrom = (x0: number, y0: number, x1: number, y1: number, mat: any = tableMat) => {
    const w = planLen(x1 - x0);
    const d = planLen(y1 - y0);
    const cx = planX((x0 + x1) / 2);
    const cz = planZ((y0 + y1) / 2);
    const top = new THREE.BoxGeometry(w, 0.0026, d);
    top.translate(cx, FLOOR_Y + 0.0012 + TABLE_H, cz);
    const parts: any[] = [top];
    const inset = 0.0022;
    [-1, 1].forEach((a) =>
      [-1, 1].forEach((b) => {
        const leg = new THREE.BoxGeometry(0.0016, TABLE_H, 0.0016);
        leg.translate(cx + a * (w / 2 - inset), FLOOR_Y + 0.0012 + TABLE_H / 2, cz + b * (d / 2 - inset));
        parts.push(leg);
      }),
    );
    const geo = track(mergeGeometries(parts));
    parts.forEach((g) => g.dispose());
    const m = new THREE.Mesh(geo, mat);
    m.castShadow = m.receiveShadow = true;
    group.add(m);
  };

  /** A counter along the north wall, with a dark worktop. */
  const counterFrom = (x0: number, x1: number, depth: number) => {
    const w = planLen(x1 - x0);
    const cx = planX((x0 + x1) / 2);
    const cz = planZ(north + depth / 2);
    box(w, 0.022, planLen(depth), cx, FLOOR_Y + 0.011, cz, counterMat);
    box(w + 0.001, 0.0022, planLen(depth) + 0.001, cx, FLOOR_Y + 0.0231, cz, counterTop, false);
  };

  /** A solid full-height wall stub, between two plan-pixel corners. */
  const stubFrom = (x0: number, y0: number, x1: number, y1: number) =>
    box(planLen(x1 - x0), WALL_H, planLen(y1 - y0), planX((x0 + x1) / 2), FLOOR_Y + WALL_H / 2, planZ((y0 + y1) / 2), wallMat);

  // long black desk against the west wall, with four monitors along it
  {
    const deskX0 = RM.x0 + 2;
    const deskX1 = sx(112);
    tableFrom(deskX0, north, deskX1, south, std({ color: "#17181b", roughness: 0.4 }));
    const bezel = std({ color: "#0d0e10", roughness: 0.35, metalness: 0.3 });
    const glow = std({ color: "#0b1118", emissive: "#4f8fd0", emissiveIntensity: 0.7, roughness: 0.15 });
    const deskTop = FLOOR_Y + 0.0012 + TABLE_H + 0.0013;
    const cx = planX((deskX0 + deskX1) / 2);
    [0.14, 0.38, 0.62, 0.86].forEach((f) => {
      const cz = planZ(north + (south - north) * f);
      const g = new THREE.Group();
      g.position.set(cx, deskTop, cz);
      // stand: foot, neck, then the panel facing east, into the room
      const foot = new THREE.Mesh(track(new THREE.BoxGeometry(0.0045, 0.0005, 0.0055)), bezel);
      foot.position.set(0.0004, 0.00025, 0);
      const neck = new THREE.Mesh(track(new THREE.BoxGeometry(0.0009, 0.0052, 0.0009)), bezel);
      neck.position.set(-0.0002, 0.003, 0);
      const panel = new THREE.Mesh(track(new THREE.BoxGeometry(0.0007, 0.0078, 0.0128)), bezel);
      panel.position.set(0, 0.0074, 0);
      const screen = new THREE.Mesh(track(new THREE.PlaneGeometry(0.0118, 0.0068)), glow);
      screen.rotation.y = Math.PI / 2;
      screen.position.set(0.00039, 0.0074, 0);
      g.add(foot, neck, panel, screen);
      g.traverse((o: any) => (o.castShadow = true));
      group.add(g);
    });
  }
  // counters under the window, and the wall stubs between them
  counterFrom(sx(125), sx(415), 7);
  stubFrom(sx(418), north - 1, sx(465), sy(330));
  counterFrom(sx(465), sx(548), 8);
  stubFrom(sx(713), north - 1, sx(770), sy(360));
  counterFrom(sx(770), sx(1005), 8);
  // table jutting out from the north wall, chairs either side
  tableFrom(sx(595), sy(297), sx(660), sy(407));
  // left cluster: a long table with two tables running off it
  tableFrom(sx(198), sy(352), sx(258), sy(585));
  tableFrom(sx(260), sy(395), sx(392), sy(460));
  tableFrom(sx(260), sy(460), sx(392), sy(520));
  // right cluster, mirrored
  tableFrom(sx(862), sy(380), sx(945), sy(582));
  tableFrom(sx(722), sy(425), sx(866), sy(490));
  tableFrom(sx(722), sy(490), sx(866), sy(550));

  // chairs: [x, y, heading]. Heading 0 faces south, PI north, PI/2 east, -PI/2 west.
  const H = Math.PI / 2;
  // the two lab-height chairs pulled in tight to the monitor desk (its east edge is at plan x ~472)
  const labChairs: [number, number, number][] = [[480, sy(425), -H], [480, sy(500), -H]];
  const chairs: [number, number, number][] = [
    // left cluster
    [sx(165), sy(382), H], [sx(165), sy(558), H],
    [sx(292), sy(370), 0], [sx(355), sy(370), 0],
    [sx(303), sy(547), Math.PI], [sx(378), sy(548), Math.PI],
    // right cluster
    [sx(970), sy(435), -H], [sx(970), sy(523), -H],
    [sx(760), sy(395), 0], [sx(837), sy(390), 0],
    [sx(755), sy(583), Math.PI], [sx(835), sy(578), Math.PI],
    // centre table
    [sx(578), sy(310), H], [sx(578), sy(378), H],
    [sx(680), sy(320), -H], [sx(682), sy(385), -H],
    // by the counter
    [sx(497), sy(340), Math.PI],
  ];
  {
    // Standard rolling chair: five-star base on casters, gas lift, seat, tilted back, arms.
    const standard = () => {
      const parts: any[] = [];
      for (let i = 0; i < 5; i++) {
        const a = (i / 5) * Math.PI * 2;
        const leg = new THREE.BoxGeometry(0.0058, 0.0007, 0.0008);
        leg.translate(0.0029, 0, 0);
        leg.rotateY(a);
        leg.translate(0, 0.0026, 0);
        parts.push(leg);
        const caster = new THREE.SphereGeometry(0.00095, 8, 6);
        caster.translate(Math.cos(a) * 0.0058, 0.001, -Math.sin(a) * 0.0058);
        parts.push(caster);
      }
      const lift = new THREE.CylinderGeometry(0.0008, 0.0011, 0.0075, 8);
      lift.translate(0, 0.0064, 0);
      parts.push(lift);
      const seat = new THREE.BoxGeometry(0.0108, 0.0028, 0.0108);
      seat.translate(0, 0.0112, 0);
      parts.push(seat);
      const back = new THREE.BoxGeometry(0.0098, 0.0118, 0.0018);
      back.rotateX(-0.12);
      back.translate(0, 0.0192, -0.0049);
      parts.push(back);
      const head = new THREE.BoxGeometry(0.0052, 0.0028, 0.0016);
      head.rotateX(-0.12);
      head.translate(0, 0.0272, -0.0055);
      parts.push(head);
      [-1, 1].forEach((sd) => {
        const arm = new THREE.BoxGeometry(0.0013, 0.0011, 0.0058);
        arm.translate(sd * 0.0059, 0.0158, -0.0004);
        parts.push(arm);
        const post = new THREE.BoxGeometry(0.0011, 0.0034, 0.0011);
        post.translate(sd * 0.0059, 0.0135, 0.0012);
        parts.push(post);
      });
      return parts;
    };

    // Lab-height rolling chair: tall gas lift, footring, round seat and a low back.
    const lab = () => {
      const parts: any[] = [];
      for (let i = 0; i < 5; i++) {
        const a = (i / 5) * Math.PI * 2;
        const leg = new THREE.BoxGeometry(0.0062, 0.0007, 0.0008);
        leg.translate(0.0031, 0, 0);
        leg.rotateY(a);
        leg.translate(0, 0.0026, 0);
        parts.push(leg);
        const caster = new THREE.SphereGeometry(0.00095, 8, 6);
        caster.translate(Math.cos(a) * 0.0062, 0.001, -Math.sin(a) * 0.0062);
        parts.push(caster);
      }
      const lift = new THREE.CylinderGeometry(0.0008, 0.0012, 0.0112, 8);
      lift.translate(0, 0.0086, 0);
      parts.push(lift);
      const ring = new THREE.TorusGeometry(0.0046, 0.0004, 6, 20);
      ring.rotateX(Math.PI / 2);
      ring.translate(0, 0.0078, 0);
      parts.push(ring);
      for (let i = 0; i < 3; i++) {
        const spoke = new THREE.BoxGeometry(0.0046, 0.0005, 0.0006);
        spoke.translate(0.0023, 0, 0);
        spoke.rotateY((i / 3) * Math.PI * 2);
        spoke.translate(0, 0.0078, 0);
        parts.push(spoke);
      }
      const seat = new THREE.CylinderGeometry(0.0057, 0.0057, 0.0028, 20);
      seat.translate(0, 0.0156, 0);
      parts.push(seat);
      const back = new THREE.BoxGeometry(0.0084, 0.0064, 0.0016);
      back.rotateX(-0.1);
      back.translate(0, 0.0216, -0.0053);
      parts.push(back);
      const stem = new THREE.BoxGeometry(0.0012, 0.0036, 0.0012);
      stem.translate(0, 0.0182, -0.0046);
      parts.push(stem);
      return parts;
    };

    const chairMat = std({ color: "#17181b", roughness: 0.55 });
    const e = new THREE.Euler();
    const place = (parts: any[], list: [number, number, number][], swivel: number) => {
      const geo = track(mergeGeometries(parts));
      parts.forEach((g) => g.dispose());
      const im = new THREE.InstancedMesh(geo, chairMat, list.length);
      list.forEach(([x, y, r], i) => {
        p.set(planX(x), FLOOR_Y + 0.0012, planZ(y));
        e.set(0, r + (rand() - 0.5) * swivel, 0);
        q.setFromEuler(e);
        s.set(1, 1, 1);
        im.setMatrixAt(i, m4.compose(p, q, s));
      });
      im.castShadow = im.receiveShadow = true;
      group.add(im);
    };
    place(standard(), chairs, 0.6);
    // the monitor chairs stay square to the desk
    place(lab(), labChairs, 0.1);
  }

  // laptops at the two clusters, screens facing whoever sits behind them
  {
    const lapMat = std({ color: "#8f979f", roughness: 0.4, metalness: 0.6 });
    const scr = std({ color: "#0f1720", emissive: "#3a76b0", emissiveIntensity: 0.55, roughness: 0.2 });
    const laptop = (x: number, y: number, heading: number) => {
      const g = new THREE.Group();
      g.position.set(planX(x), FLOOR_Y + 0.0012 + TABLE_H + 0.0013, planZ(y));
      g.rotation.y = heading;
      const base = new THREE.Mesh(track(new THREE.BoxGeometry(0.0085, 0.0007, 0.0058)), lapMat);
      const lid = new THREE.Mesh(track(new THREE.BoxGeometry(0.0085, 0.0056, 0.0006)), scr);
      lid.position.set(0, 0.0032, 0.0028);
      lid.rotation.x = -0.28;
      g.add(base, lid);
      g.traverse((o: any) => (o.castShadow = true));
      group.add(g);
    };
    [[sx(300), sy(410), 0], [sx(360), sy(410), 0], [sx(305), sy(505), Math.PI], [sx(378), sy(505), Math.PI],
     [sx(760), sy(440), 0], [sx(836), sy(440), 0], [sx(758), sy(535), Math.PI], [sx(835), sy(535), Math.PI]]
      .forEach(([x, y, r]) => laptop(x, y, r));
  }

  // ---- lights -------------------------------------------------------------
  [485, 590, 695, 780].forEach((x) => {
    const l = new THREE.PointLight(0xfff0dc, 0, 0.26, 2);
    l.position.set(planX(x), FLOOR_Y + WALL_H * 0.92, rcz);
    group.add(l);
    lights.push(l);
  });

  return { group, lights };
}
