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
  /** A dense, hand-painted-looking scatter of grass blades, tiled seamlessly. */
  const grassCanvas = () => {
    const w = 512;
    const c = document.createElement("canvas");
    c.width = c.height = w;
    const g = c.getContext("2d")!;
    g.fillStyle = "#5f9b47";
    g.fillRect(0, 0, w, w);
    const r = rng(7781);
    const palette = ["#4f8a3c", "#5f9b47", "#73b558", "#447530", "#86c86a"];
    const blade = (x: number, y: number) => {
      const len = 11 + r() * 15;
      const ang = -Math.PI / 2 + (r() - 0.5) * 1.3;
      const bend = (r() - 0.5) * 7;
      const x2 = x + Math.cos(ang) * len;
      const y2 = y + Math.sin(ang) * len;
      g.strokeStyle = palette[Math.floor(r() * palette.length)];
      g.lineWidth = 2 + r() * 2.2;
      g.lineCap = "round";
      g.beginPath();
      g.moveTo(x, y);
      g.quadraticCurveTo((x + x2) / 2 + bend, (y + y2) / 2, x2, y2);
      g.stroke();
    };
    // Every blade is drawn up to 4 times, wrapped across whichever edges it's
    // near, so the tile has no visible seam when it repeats.
    for (let i = 0; i < 1100; i++) {
      const x = r() * w;
      const y = r() * w;
      const dx = x < w / 2 ? w : -w;
      const dy = y < w / 2 ? w : -w;
      blade(x, y);
      blade(x + dx, y);
      blade(x, y + dy);
      blade(x + dx, y + dy);
    }
    return c;
  };
  const grassTex = track(new THREE.CanvasTexture(grassCanvas()));
  grassTex.colorSpace = THREE.SRGBColorSpace;
  grassTex.wrapS = grassTex.wrapT = THREE.RepeatWrapping;
  grassTex.anisotropy = aniso;
  grassTex.repeat.set(5, 5);

  /** Banded concrete paving, like the striped promenade sections on campus. */
  const asphaltCanvas = () => {
    const w = 128;
    const h = 512;
    const c = document.createElement("canvas");
    c.width = w;
    c.height = h;
    const g = c.getContext("2d")!;
    const bands = 18;
    const bandH = h / bands;
    const r = rng(4120);
    for (let i = 0; i < bands; i++) {
      const light = i % 2 === 0;
      g.fillStyle = light ? "#6b7078" : "#53575e";
      g.fillRect(0, i * bandH, w, bandH);
      // a soft seam line between bands
      g.fillStyle = "rgba(0,0,0,0.18)";
      g.fillRect(0, i * bandH, w, 2);
    }
    // light speckle so each band doesn't read as a flat, perfect fill
    for (let i = 0; i < 900; i++) {
      g.fillStyle = `rgba(255,255,255,${0.02 + r() * 0.03})`;
      g.fillRect(r() * w, r() * h, 1.5, 1.5);
    }
    return c;
  };
  const asphaltTex = track(new THREE.CanvasTexture(asphaltCanvas()));
  asphaltTex.colorSpace = THREE.SRGBColorSpace;
  asphaltTex.wrapS = asphaltTex.wrapT = THREE.RepeatWrapping;
  asphaltTex.anisotropy = aniso;
  asphaltTex.repeat.set(3, 2.4);

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
    track(new THREE.MeshStandardMaterial({ map: grassTex, roughness: 1 })),
  );
  layer(
    ASPHALT,
    0.0016,
    track(new THREE.MeshStandardMaterial({ map: asphaltTex, roughness: 0.92 })),
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
  // A plain icosahedron reads as a geometric ball, so its corners are nudged
  // in and out (by a hash of their own position, so coincident corners from
  // neighbouring faces move together and the shell stays sealed) into a
  // lumpy, irregular clump before it's ever instanced.
  const canopyGeo = track(new THREE.IcosahedronGeometry(1, 1));
  {
    const posAttr = canopyGeo.attributes.position;
    const v = new THREE.Vector3();
    const hashNoise = (x: number, y: number, z: number) => {
      const s = Math.sin(x * 12.9898 + y * 78.233 + z * 37.719) * 43758.5453;
      return s - Math.floor(s);
    };
    for (let i = 0; i < posAttr.count; i++) {
      v.fromBufferAttribute(posAttr, i);
      const n = 0.78 + hashNoise(v.x, v.y, v.z) * 0.4;
      v.multiplyScalar(n);
      posAttr.setXYZ(i, v.x, v.y, v.z);
    }
    posAttr.needsUpdate = true;
    canopyGeo.computeVertexNormals();
  }
  const trunkGeo = track(new THREE.CylinderGeometry(0.16, 0.24, 1, 6));
  trunkGeo.translate(0, 0.5, 0);
  const canopyMat = track(
    new THREE.MeshStandardMaterial({ roughness: 0.9, flatShading: true }),
  );
  const trunkMat = track(
    new THREE.MeshStandardMaterial({ color: "#6b5340", roughness: 1 }),
  );
  const canopies = new THREE.InstancedMesh(canopyGeo, canopyMat, TREES.length);
  // A second, smaller lobe offset to one side of each tree breaks the
  // single-blob silhouette into an irregular, multi-lobed clump of foliage.
  const lobes = new THREE.InstancedMesh(canopyGeo, canopyMat, TREES.length);
  const trunks = new THREE.InstancedMesh(trunkGeo, trunkMat, TREES.length);
  canopies.castShadow = trunks.castShadow = lobes.castShadow = true;
  canopies.receiveShadow = lobes.receiveShadow = true;
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
    const mainCY = trunkH + R * 0.62;
    e.set(0, rand() * 6.28, 0);
    q.setFromEuler(e);
    p.set(toX(x), mainCY, toZ(y));
    s.set(R, R * (0.78 + rand() * 0.12), R);
    canopies.setMatrixAt(i, m4.compose(p, q, s));
    col.set(palette[Math.floor(rand() * palette.length)]);
    col.offsetHSL(0, 0, (rand() - 0.5) * 0.05);
    canopies.setColorAt(i, col);

    const lobeAngle = rand() * Math.PI * 2;
    const lobeDist = R * (0.42 + rand() * 0.26);
    const lobeR = R * (0.5 + rand() * 0.22);
    e.set(0, rand() * 6.28, 0);
    q.setFromEuler(e);
    p.set(
      toX(x) + Math.cos(lobeAngle) * lobeDist,
      mainCY + (rand() - 0.35) * R * 0.32,
      toZ(y) + Math.sin(lobeAngle) * lobeDist,
    );
    s.set(lobeR, lobeR * (0.82 + rand() * 0.18), lobeR);
    lobes.setMatrixAt(i, m4.compose(p, q, s));
    col.offsetHSL(0, 0, (rand() - 0.5) * 0.04);
    lobes.setColorAt(i, col);
  });
  scene.add(canopies);
  scene.add(lobes);
  scene.add(trunks);

  // ---- grass tufts: a light, short scatter for a bit of ambient motion ----
  // A flat tapered triangle, instanced a few times per grass patch and swayed
  // in the vertex shader by a time uniform the caller updates each frame.
  let grassMaterial: any = null;
  {
    const bladeGeo = track(new THREE.BufferGeometry());
    bladeGeo.setAttribute(
      "position",
      new THREE.Float32BufferAttribute([-0.5, 0, 0, 0.5, 0, 0, 0, 1, 0], 3),
    );
    bladeGeo.setIndex([0, 1, 2]);
    bladeGeo.computeVertexNormals();

    const bladeMat = track(
      new THREE.MeshStandardMaterial({
        color: "#86b85f",
        roughness: 0.85,
        side: THREE.DoubleSide,
        flatShading: true,
      }),
    );
    bladeMat.onBeforeCompile = (shader: any) => {
      shader.uniforms.uTime = { value: 0 };
      shader.vertexShader =
        "uniform float uTime;\n" +
        shader.vertexShader.replace(
          "#include <begin_vertex>",
          `#include <begin_vertex>
  #ifdef USE_INSTANCING
  float windPhase = instanceMatrix[3].x * 9.0 + instanceMatrix[3].z * 7.0;
  #else
  float windPhase = 0.0;
  #endif
  float sway = sin(uTime * 1.6 + windPhase) * 0.05 * max(transformed.y, 0.0);
  transformed.x += sway;
  transformed.z += sway * 0.4;`,
        );
      bladeMat.userData.shader = shader;
    };
    grassMaterial = bladeMat;

    const spots: Pt[] = [];
    GRASS.forEach((patch) => {
      const [outer, ...holes] = patch;
      const area = polygonArea(outer);
      const count = Math.min(18, Math.round(area / 1200));
      if (count <= 0) return;
      const xs = outer.map((v) => v[0]);
      const ys = outer.map((v) => v[1]);
      const x0 = Math.min(...xs);
      const x1 = Math.max(...xs);
      const y0 = Math.min(...ys);
      const y1 = Math.max(...ys);
      let tries = 0;
      let placed = 0;
      while (placed < count && tries++ < count * 14) {
        const px = x0 + rand() * (x1 - x0);
        const py = y0 + rand() * (y1 - y0);
        if (!pointInPolygon(px, py, outer)) continue;
        if (holes.some((h) => pointInPolygon(px, py, h))) continue;
        spots.push([px, py]);
        placed++;
      }
    });

    const BLADES_PER_TUFT = 3;
    const blades = new THREE.InstancedMesh(
      bladeGeo,
      bladeMat,
      spots.length * BLADES_PER_TUFT,
    );
    blades.receiveShadow = true;
    let bi = 0;
    spots.forEach(([gx, gy]) => {
      for (let k = 0; k < BLADES_PER_TUFT; k++) {
        const ang = rand() * Math.PI * 2;
        const off = rand() * 0.01;
        e.set(0, ang, 0);
        q.setFromEuler(e);
        p.set(toX(gx) + Math.cos(ang) * off, 0.0014, toZ(gy) + Math.sin(ang) * off);
        s.set(0.011 + rand() * 0.006, 0.016 + rand() * 0.012, 1);
        blades.setMatrixAt(bi++, m4.compose(p, q, s));
      }
    });
    scene.add(blades);
  }

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

  const scatterUnits = (poly: Pt[], top: number, lid: boolean, density = 1) => {
    const xs = poly.map((v) => v[0]);
    const ys = poly.map((v) => v[1]);
    const x0 = Math.min(...xs);
    const x1 = Math.max(...xs);
    const y0 = Math.min(...ys);
    const y1 = Math.max(...ys);
    const want = Math.min(28, Math.round((polygonArea(poly) / 1900) * density) + 1);
    let tries = 0;
    let placed = 0;
    while (placed < want && tries++ < Math.round(60 * density)) {
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
  // ECSN is the building the camera actually lands on, so its roof gets a
  // denser scatter of vents/units/skylights than the backdrop buildings.
  scatterUnits(ECSN_FOOTPRINT, ECSN_SHELL_H + ECSN_LID_H, true, 2.4);

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
    grassMaterial,
  };
}
