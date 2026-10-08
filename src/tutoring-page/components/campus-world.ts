import {
  BUILDINGS,
  ECSN_FOOTPRINT,
  ECSN_ROOF,
  GRASS,
  ASPHALT,
  WATER,
  TREES,
  LAMPS,
  Pt,
} from "./campus-data";
import {
  SC,
  W,
  D,
  STOREY,
  toX,
  toZ,
  rng,
  pointInPolygon,
  shapeFrom,
  polygonArea,
} from "./campus-space";

/** ECSN keeps two full storeys (level 2 is the one we explore); the rest is the lid. */
export const ECSN_SHELL_H = STOREY * 2;
export const ECSN_LID_H = STOREY * 3;

// ---------------------------------------------------------------------------
// materials & textures
// ---------------------------------------------------------------------------

type FacadeKind = "brick" | "panel";

/**
 * A repeating storey-and-bay facade, plus a matching bump map so the wall
 * reads as genuinely coming forward of the recessed glass under the scene's
 * directional light, instead of the depth being only a painted-on shadow
 * that doesn't react to light or camera angle. Both canvases are drawn in
 * the same loop from the same coordinates, so the relief lines up exactly
 * with the windows it belongs to.
 *
 * The tile is `tileW` wide and two storeys tall in world units, which is
 * what ExtrudeGeometry's side UVs are measured in, so windows line up with
 * the storeys on every wall.
 */
function facadeTexture(
  THREE: any,
  wall: string,
  glass: string,
  kind: FacadeKind,
  aniso: number,
) {
  const c = document.createElement("canvas");
  c.width = 512;
  c.height = 512;
  const g = c.getContext("2d")!;
  g.fillStyle = wall;
  g.fillRect(0, 0, 512, 512);

  // Bump map: brighter = pushed toward the camera (the wall's own brick/panel
  // face and the sills it casts light onto), darker = pushed back (the glass
  // sitting behind its frame). Mid-grey is the wall's own resting height.
  const bc = document.createElement("canvas");
  bc.width = 512;
  bc.height = 512;
  const bg = bc.getContext("2d")!;
  bg.fillStyle = "#9a9a9a";
  bg.fillRect(0, 0, 512, 512);

  if (kind === "brick") {
    g.fillStyle = "rgba(0,0,0,0.055)";
    for (let y = 0; y < 512; y += 8) g.fillRect(0, y, 512, 1);
    g.fillStyle = "rgba(255,255,255,0.05)";
    for (let y = 4; y < 512; y += 16) g.fillRect(0, y, 512, 2);
    // coursing reads as a faint ridge in the relief too, not just a tint
    bg.fillStyle = "#8c8c8c";
    for (let y = 0; y < 512; y += 8) bg.fillRect(0, y, 512, 1);
  }

  const bays = 6;
  const bayW = 512 / bays;
  for (let s = 0; s < 2; s++) {
    const top = s * 256;
    // slab band between storeys — a ledge, so it sits proud like the wall
    g.fillStyle = "rgba(0,0,0,0.12)";
    g.fillRect(0, top + 238, 512, 18);
    g.fillStyle = "rgba(255,255,255,0.18)";
    g.fillRect(0, top + 236, 512, 3);
    bg.fillStyle = "#d6d6d6";
    bg.fillRect(0, top + 236, 512, 20);
    for (let b = 0; b < bays; b++) {
      // wide piers, narrow windows — this is a wall with punched openings
      // in it, not a glass curtain wall with a frame around it
      const x = b * bayW + 24;
      const w = bayW - 48;
      const y = top + 58;
      const h = 132;
      // recessed frame
      g.fillStyle = "rgba(0,0,0,0.36)";
      g.fillRect(x - 6, y - 6, w + 12, h + 12);
      // glass with a soft sky reflection
      const grad = g.createLinearGradient(0, y, 0, y + h);
      grad.addColorStop(0, "#c5dbe8");
      grad.addColorStop(0.45, glass);
      grad.addColorStop(1, "#22303d");
      g.fillStyle = grad;
      g.fillRect(x, y, w, h);
      // mullions
      g.fillStyle = "rgba(20,28,36,0.85)";
      g.fillRect(x + w / 2 - 2, y, 4, h);
      g.fillRect(x, y + h * 0.42, w, 3);
      // sill
      g.fillStyle = "rgba(255,255,255,0.45)";
      g.fillRect(x - 8, y + h + 4, w + 16, 7);

      // the whole window opening steps well back from the wall face...
      bg.fillStyle = "#333333";
      bg.fillRect(x - 6, y - 6, w + 12, h + 12);
      // ...the glass itself sits further back still, deep behind its frame...
      bg.fillStyle = "#080808";
      bg.fillRect(x, y, w, h);
      // ...and the mullions and sill are proud of the glass, level with the wall
      bg.fillStyle = "#b8b8b8";
      bg.fillRect(x + w / 2 - 2, y, 4, h);
      bg.fillRect(x, y + h * 0.42, w, 3);
      bg.fillStyle = "#f2f2f2";
      bg.fillRect(x - 8, y + h + 4, w + 16, 7);
    }
  }

  const makeTex = (canvas: HTMLCanvasElement, srgb: boolean) => {
    const t = new THREE.CanvasTexture(canvas);
    t.wrapS = t.wrapT = THREE.RepeatWrapping;
    if (srgb) t.colorSpace = THREE.SRGBColorSpace;
    t.anisotropy = aniso;
    t.flipY = false; // side UVs run v = 1 - z, so row 0 is the storey's top
    const tileW = 0.24;
    const tileH = STOREY * 2;
    t.repeat.set(1 / tileW, 1 / tileH);
    return t;
  };

  return { map: makeTex(c, true), bump: makeTex(bc, false) };
}

// How far the bump map pushes the wall's piers/sills out from the recessed
// glass, in world units. Small relative to a storey (STOREY = 0.085), but
// enough for the sun to carve real highlight/shadow across each facade.
const FACADE_BUMP_SCALE = 0.042;

function mix(hex: string, to: string, t: number) {
  const a = parseInt(hex.slice(1), 16);
  const b = parseInt(to.slice(1), 16);
  const ch = (s: number) =>
    Math.round(((a >> s) & 255) * (1 - t) + ((b >> s) & 255) * t);
  return "#" + ((1 << 24) | (ch(16) << 16) | (ch(8) << 8) | ch(0)).toString(16).slice(1);
}

// ---------------------------------------------------------------------------
// world
// ---------------------------------------------------------------------------

export interface World {
  /** ECSN's upper storeys and roof, lifted away to open the dollhouse. */
  lid: any;
  lidMaterials: any[];
  /** Every mesh that should cast shadows only while the lid is closed. */
  lidMeshes: any[];
}

export function buildWorld(
  THREE: any,
  mergeGeometries: (g: any[]) => any,
  scene: any,
  aniso: number,
  track: <T extends { dispose: () => void }>(item: T) => T,
): World {
  const rand = rng(20260925);

  // ---- diorama base -------------------------------------------------------
  const baseMats = [
    "#b9b2a5",
    "#b9b2a5",
    "#dcd8cf",
    "#a29b8e",
    "#c4bdb0",
    "#c4bdb0",
  ].map((c) =>
    track(new THREE.MeshStandardMaterial({ color: c, roughness: 0.95 })),
  );
  const baseGeo = track(new THREE.BoxGeometry(W, 0.16, D));
  const base = new THREE.Mesh(baseGeo, baseMats);
  base.position.y = -0.08;
  base.receiveShadow = true;
  scene.add(base);

  // soft contact shadow under the slab so it floats rather than clips
  const sc = document.createElement("canvas");
  sc.width = sc.height = 256;
  const sg = sc.getContext("2d")!;
  const rad = sg.createRadialGradient(128, 128, 20, 128, 128, 128);
  rad.addColorStop(0, "rgba(10,25,40,0.5)");
  rad.addColorStop(1, "rgba(10,25,40,0)");
  sg.fillStyle = rad;
  sg.fillRect(0, 0, 256, 256);
  const shadowTex = track(new THREE.CanvasTexture(sc));
  const shadowGeo = track(new THREE.PlaneGeometry(W * 1.35, D * 1.5));
  shadowGeo.rotateX(-Math.PI / 2);
  const shadow = new THREE.Mesh(
    shadowGeo,
    track(
      new THREE.MeshBasicMaterial({
        map: shadowTex,
        transparent: true,
        depthWrite: false,
      }),
    ),
  );
  shadow.position.y = -0.165;
  scene.add(shadow);

  // ---- ground cover -------------------------------------------------------
  const layer = (rings: Pt[][][], lift: number, mat: any) => {
    const geos = rings.map((r) => {
      const g = new THREE.ShapeGeometry(shapeFrom(THREE, r));
      g.rotateX(-Math.PI / 2);
      g.translate(0, lift, 0);
      return g;
    });
    const merged = track(mergeGeometries(geos));
    geos.forEach((g) => g.dispose());
    const mesh = new THREE.Mesh(merged, mat);
    mesh.receiveShadow = true;
    scene.add(mesh);
  };
  layer(
    GRASS,
    0.0012,
    track(new THREE.MeshStandardMaterial({ color: "#7dae5c", roughness: 1 })),
  );
  layer(
    ASPHALT,
    0.0016,
    track(new THREE.MeshStandardMaterial({ color: "#4a4f57", roughness: 0.92 })),
  );
  layer(
    WATER,
    0.002,
    track(
      new THREE.MeshStandardMaterial({
        color: "#6fbde6",
        roughness: 0.08,
        metalness: 0.15,
      }),
    ),
  );

  // ---- trees --------------------------------------------------------------
  const canopyGeo = track(new THREE.IcosahedronGeometry(1, 1));
  const trunkGeo = track(new THREE.CylinderGeometry(0.16, 0.24, 1, 6));
  trunkGeo.translate(0, 0.5, 0);
  const canopyMat = track(
    new THREE.MeshStandardMaterial({ roughness: 0.9, flatShading: true }),
  );
  const trunkMat = track(
    new THREE.MeshStandardMaterial({ color: "#6b5340", roughness: 1 }),
  );
  const canopies = new THREE.InstancedMesh(canopyGeo, canopyMat, TREES.length);
  const trunks = new THREE.InstancedMesh(trunkGeo, trunkMat, TREES.length);
  canopies.castShadow = trunks.castShadow = true;
  canopies.receiveShadow = true;
  const m4 = new THREE.Matrix4();
  const q = new THREE.Quaternion();
  const e = new THREE.Euler();
  const p = new THREE.Vector3();
  const s = new THREE.Vector3();
  const col = new THREE.Color();
  const palette = ["#4f8f4a", "#5d9c52", "#468543", "#6aa85a", "#3f7a3e"];
  TREES.forEach(([x, y, r], i) => {
    const R = Math.max(r * 1.45, 4.2) * SC;
    const trunkH = R * 0.9;
    e.set(0, rand() * 6.28, 0);
    q.setFromEuler(e);
    p.set(toX(x), 0, toZ(y));
    s.set(R * 0.13, trunkH, R * 0.13);
    trunks.setMatrixAt(i, m4.compose(p, q, s));
    p.set(toX(x), trunkH + R * 0.62, toZ(y));
    s.set(R, R * (0.78 + rand() * 0.12), R);
    canopies.setMatrixAt(i, m4.compose(p, q, s));
    col.set(palette[Math.floor(rand() * palette.length)]);
    col.offsetHSL(0, 0, (rand() - 0.5) * 0.05);
    canopies.setColorAt(i, col);
  });
  scene.add(canopies);
  scene.add(trunks);

  // ---- buildings ----------------------------------------------------------
  const roofUnits: {
    x: number;
    y: number;
    z: number;
    w: number;
    h: number;
    d: number;
    lid: boolean;
    kind: "box" | "stack" | "sky";
  }[] = [];

  const scatterUnits = (poly: Pt[], top: number, lid: boolean) => {
    const xs = poly.map((v) => v[0]);
    const ys = poly.map((v) => v[1]);
    const x0 = Math.min(...xs);
    const x1 = Math.max(...xs);
    const y0 = Math.min(...ys);
    const y1 = Math.max(...ys);
    const want = Math.min(16, Math.round(polygonArea(poly) / 1900) + 1);
    let tries = 0;
    let placed = 0;
    while (placed < want && tries++ < 60) {
      const px = x0 + rand() * (x1 - x0);
      const py = y0 + rand() * (y1 - y0);
      const hw = 5 + rand() * 7;
      const hd = 4 + rand() * 6;
      const ok =
        pointInPolygon(px - hw - 4, py - hd - 4, poly) &&
        pointInPolygon(px + hw + 4, py - hd - 4, poly) &&
        pointInPolygon(px - hw - 4, py + hd + 4, poly) &&
        pointInPolygon(px + hw + 4, py + hd + 4, poly);
      if (!ok) continue;
      const roll = rand();
      const kind = roll < 0.5 ? "box" : roll < 0.75 ? "stack" : "sky";
      roofUnits.push({
        x: toX(px),
        y: top,
        z: toZ(py),
        w: (kind === "stack" ? Math.min(hw, hd) * 0.7 : hw) * 2 * SC,
        h: kind === "sky" ? 0.004 : kind === "stack" ? 0.03 + rand() * 0.02 : 0.018 + rand() * 0.02,
        d: (kind === "stack" ? Math.min(hw, hd) * 0.7 : hd) * 2 * SC,
        lid,
        kind,
      });
      placed++;
    }
  };

  const facades = new Map<string, { map: any; bump: any }>();
  const facadeFor = (roof: string, kind: FacadeKind) => {
    const key = roof + kind;
    let pair = facades.get(key);
    if (!pair) {
      const built = facadeTexture(
        THREE,
        kind === "brick" ? mix(roof, "#e9dccf", 0.45) : mix(roof, "#f4f1ec", 0.55),
        "#5f7f96",
        kind,
        aniso,
      );
      pair = { map: track(built.map), bump: track(built.bump) };
      facades.set(key, pair);
    }
    return pair;
  };

  const extrude = (
    poly: Pt[],
    height: number,
    bevel: boolean,
    y: number,
  ) => {
    const bt = bevel ? 0.0028 : 0;
    const geo = track(
      new THREE.ExtrudeGeometry(shapeFrom(THREE, [poly]), {
        depth: Math.max(height - bt * 2, 0.001),
        bevelEnabled: bevel,
        bevelThickness: bt,
        bevelSize: bt * 0.9,
        bevelOffset: -bt * 0.9,
        bevelSegments: 1,
        curveSegments: 1,
      }),
    );
    geo.translate(0, 0, bt);
    geo.rotateX(-Math.PI / 2);
    geo.translate(0, y, 0);
    return geo;
  };

  BUILDINGS.forEach((b) => {
    const height = b.storeys * STOREY;
    // warm terracotta roofs read as brick; everything else as pale panel
    const rgb = parseInt(b.roof.slice(1), 16);
    const kind: FacadeKind =
      (rgb >> 16) - (rgb & 255) > 24 ? "brick" : "panel";
    const roofMat = track(
      new THREE.MeshStandardMaterial({ color: b.roof, roughness: 0.85 }),
    );
    const facade = facadeFor(b.roof, kind);
    const wallMat = track(
      new THREE.MeshStandardMaterial({
        map: facade.map,
        bumpMap: facade.bump,
        bumpScale: FACADE_BUMP_SCALE,
        roughness: 0.8,
      }),
    );
    const mesh = new THREE.Mesh(extrude(b.poly, height, true, 0), [
      roofMat,
      wallMat,
    ]);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    scene.add(mesh);
    scatterUnits(b.poly, height, false);
  });

  // ---- ECSN: shell, open to the sky, plus a liftable lid ------------------
  const ecsnFacade = facadeFor(ECSN_ROOF, "brick");
  const ecsnWall = track(
    new THREE.MeshStandardMaterial({
      map: ecsnFacade.map,
      bumpMap: ecsnFacade.bump,
      bumpScale: FACADE_BUMP_SCALE,
      roughness: 0.8,
      side: THREE.DoubleSide,
    }),
  );
  const hidden = track(new THREE.MeshBasicMaterial({ visible: false }));
  const shell = new THREE.Mesh(extrude(ECSN_FOOTPRINT, ECSN_SHELL_H, false, 0), [
    hidden,
    ecsnWall,
  ]);
  shell.castShadow = true;
  shell.receiveShadow = true;
  scene.add(shell);

  const lidRoof = track(
    new THREE.MeshStandardMaterial({
      color: ECSN_ROOF,
      roughness: 0.85,
      transparent: true,
    }),
  );
  const lidWall = track(
    new THREE.MeshStandardMaterial({
      map: ecsnFacade.map,
      bumpMap: ecsnFacade.bump,
      bumpScale: FACADE_BUMP_SCALE,
      roughness: 0.8,
      transparent: true,
    }),
  );
  const lid = new THREE.Group();
  const lidMesh = new THREE.Mesh(
    extrude(ECSN_FOOTPRINT, ECSN_LID_H, true, ECSN_SHELL_H),
    [lidRoof, lidWall],
  );
  lidMesh.castShadow = true;
  lid.add(lidMesh);
  scatterUnits(ECSN_FOOTPRINT, ECSN_SHELL_H + ECSN_LID_H, true);

  // ---- rooftop plant: units, vent stacks and skylights ---------------------
  const boxGeo = track(new THREE.BoxGeometry(1, 1, 1));
  boxGeo.translate(0, 0.5, 0);
  const cylGeo = track(new THREE.CylinderGeometry(0.5, 0.5, 1, 12));
  cylGeo.translate(0, 0.5, 0);
  const geos: Record<string, any> = { box: boxGeo, stack: cylGeo, sky: boxGeo };
  const look: Record<string, any> = {
    box: { color: "#c9cdd1", roughness: 0.55, metalness: 0.35 },
    stack: { color: "#9aa1a8", roughness: 0.4, metalness: 0.6 },
    sky: { color: "#8fc4e3", roughness: 0.08, metalness: 0.2, emissive: "#3f86b5", emissiveIntensity: 0.25 },
  };
  const lidMats: any[] = [];
  const lidUnits: any[] = [];
  (["box", "stack", "sky"] as const).forEach((kind) => {
    const solid = track(new THREE.MeshStandardMaterial(look[kind]));
    const fade = track(new THREE.MeshStandardMaterial({ ...look[kind], transparent: true }));
    lidMats.push(fade);
    [false, true].forEach((isLid) => {
      const list = roofUnits.filter((u) => u.kind === kind && u.lid === isLid);
      if (!list.length) return;
      const im = new THREE.InstancedMesh(geos[kind], isLid ? fade : solid, list.length);
      list.forEach((u, i) => {
        p.set(u.x, u.y, u.z);
        q.identity();
        s.set(u.w, u.h, u.d);
        im.setMatrixAt(i, m4.compose(p, q, s));
      });
      im.castShadow = true;
      (isLid ? lid : scene).add(im);
      if (isLid) lidUnits.push(im);
    });
  });

  // ---- street lamps -----------------------------------------------------------
  {
    const poleGeo = track(new THREE.CylinderGeometry(0.0009, 0.0013, 1, 8));
    poleGeo.translate(0, 0.5, 0);
    const headGeo = track(new THREE.SphereGeometry(0.0034, 10, 8));
    const poles = new THREE.InstancedMesh(
      poleGeo,
      track(new THREE.MeshStandardMaterial({ color: "#2f353c", roughness: 0.5, metalness: 0.5 })),
      LAMPS.length,
    );
    const heads = new THREE.InstancedMesh(
      headGeo,
      track(new THREE.MeshStandardMaterial({ color: "#fff3d0", emissive: "#ffd98a", emissiveIntensity: 0.8 })),
      LAMPS.length,
    );
    LAMPS.forEach(([x, y], i) => {
      q.identity();
      p.set(toX(x), 0, toZ(y));
      s.set(1, 0.085, 1);
      poles.setMatrixAt(i, m4.compose(p, q, s));
      p.set(toX(x), 0.088, toZ(y));
      s.set(1, 1, 1);
      heads.setMatrixAt(i, m4.compose(p, q, s));
    });
    poles.castShadow = true;
    scene.add(poles);
    scene.add(heads);
  }

  // ---- parked cars ----------------------------------------------------------
  {
    const lots = [
      { x0: 10, x1: 116, y0: 10, y1: 465 },
      { x0: 1245, x1: 1398, y0: 96, y1: 250 },
    ];
    const inAsphalt = (x: number, y: number) =>
      ASPHALT.some(
        (r) =>
          pointInPolygon(x, y, r[0]) &&
          !r.slice(1).some((hole) => pointInPolygon(x, y, hole)),
      );
    const body = new THREE.BoxGeometry(0.104, 0.019, 0.043);
    body.translate(0, 0.0115, 0);
    const cabin = new THREE.BoxGeometry(0.056, 0.014, 0.038);
    cabin.translate(-0.004, 0.0275, 0);
    const carGeo = track(mergeGeometries([body, cabin]));
    body.dispose();
    cabin.dispose();
    const cars: [number, number, number][] = [];
    lots.forEach((lot) => {
      for (let y = lot.y0; y < lot.y1; y += 15) {
        for (let x = lot.x0; x < lot.x1; x += 22) {
          const px = x + (rand() - 0.5) * 3;
          const py = y + (rand() - 0.5) * 2;
          if (rand() < 0.42) continue;
          if (
            inAsphalt(px - 9, py - 4) &&
            inAsphalt(px + 9, py - 4) &&
            inAsphalt(px - 9, py + 4) &&
            inAsphalt(px + 9, py + 4)
          ) {
            cars.push([px, py, rand()]);
          }
        }
      }
    });
    if (cars.length) {
      const carMat = track(new THREE.MeshStandardMaterial({ roughness: 0.35, metalness: 0.5 }));
      const im = new THREE.InstancedMesh(carGeo, carMat, cars.length);
      const hues = ["#c9ced4", "#2f3a48", "#a4262c", "#e8e6e1", "#3c6a91", "#1d1f22", "#6b7480"];
      cars.forEach(([x, y, r], i) => {
        q.identity();
        p.set(toX(x), 0.0022, toZ(y));
        s.set(1, 1, 1);
        im.setMatrixAt(i, m4.compose(p, q, s));
        col.set(hues[Math.floor(r * hues.length)]);
        im.setColorAt(i, col);
      });
      im.castShadow = true;
      scene.add(im);
    }
  }

  scene.add(lid);
  const lidMeshes = [lidMesh, ...lidUnits];
  return {
    lid,
    lidMaterials: [lidRoof, lidWall, ...lidMats],
    lidMeshes,
  };
}
