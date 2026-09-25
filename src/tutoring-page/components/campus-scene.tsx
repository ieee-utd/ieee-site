import { useEffect, useRef } from "react";
import { W, D } from "./campus-space";
import { buildWorld } from "./campus-world";
import { buildInterior } from "./campus-interior";
import { BEATS, FOV, LOOP_SECONDS, Pose, cameraUp, makeRig } from "./campus-camera";

const SHADOW_SIZE = 4096;
// The shadow frustum only ever takes these half-widths. A continuously
// changing frustum makes every shadow edge crawl, so it steps between a few
// sizes instead (with hysteresis) and is snapped to whole shadow texels.
const SPANS = [0.3, 0.55, 1.0, 1.9, 3.6, 7.5];

const smooth = (t: number) => t * t * (3 - 2 * t);
/** Eases 0 below `a`, 1 above `b`. */
function ramp(t: number, [a, b]: number[]) {
  if (t <= a) return 0;
  if (t >= b) return 1;
  return smooth((t - a) / (b - a));
}
const nextFrame = () => new Promise<void>((r) => requestAnimationFrame(() => r()));

interface CampusSceneProps {
  playing: boolean;
  onPhase: (phase: number) => void;
  onReady: () => void;
  progressRef: React.RefObject<HTMLDivElement>;
}

export default function CampusScene({
  playing,
  onPhase,
  onReady,
  progressRef,
}: CampusSceneProps) {
  const hostRef = useRef<HTMLDivElement>(null);
  // Kept in refs so changing them never tears down the WebGL context.
  const playingRef = useRef(playing);
  const phaseRef = useRef(-1);
  const onPhaseRef = useRef(onPhase);
  const onReadyRef = useRef(onReady);

  playingRef.current = playing;
  onPhaseRef.current = onPhase;
  onReadyRef.current = onReady;

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    let disposed = false;
    let cleanup = () => {};

    (async () => {
      const [THREE, utils, env] = await Promise.all([
        import("three"),
        import("three/examples/jsm/utils/BufferGeometryUtils.js"),
        import("three/examples/jsm/environments/RoomEnvironment.js"),
      ]);
      if (disposed || !hostRef.current) return;

      const renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: "high-performance",
        // the ground layers sit millimetres apart, so a linear depth buffer z-fights
        logarithmicDepthBuffer: true,
      });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setSize(host.clientWidth, host.clientHeight, false);
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 0.92;
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      renderer.domElement.style.width = "100%";
      renderer.domElement.style.height = "100%";
      renderer.domElement.style.display = "block";
      host.appendChild(renderer.domElement);

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(FOV, 1, 0.008, 90);

      const disposables: { dispose: () => void }[] = [];
      const track = <T extends { dispose: () => void }>(item: T) => {
        disposables.push(item);
        return item;
      };
      // Registered straight away so an early unmount still releases the GL context.
      let raf = 0;
      let ro: ResizeObserver | null = null;
      cleanup = () => {
        cancelAnimationFrame(raf);
        if (ro) ro.disconnect();
        disposables.forEach((d) => d.dispose());
        renderer.dispose();
        if (renderer.domElement.parentNode) {
          renderer.domElement.parentNode.removeChild(renderer.domElement);
        }
      };

      // ---- lighting -----------------------------------------------------
      const pmrem = new THREE.PMREMGenerator(renderer);
      const envRT = pmrem.fromScene(new env.RoomEnvironment(), 0.04);
      scene.environment = envRT.texture;
      scene.environmentIntensity = 0.32;
      track(envRT);
      track(pmrem);

      scene.add(new THREE.HemisphereLight(0xcfe0f2, 0x8d8474, 0.62));
      const sun = new THREE.DirectionalLight(0xffefd6, 4.2);
      sun.castShadow = true;
      sun.shadow.mapSize.set(SHADOW_SIZE, SHADOW_SIZE);
      sun.shadow.bias = -0.0004;
      sun.shadow.normalBias = 0.0015;
      const sc = sun.shadow.camera;
      sc.near = 1;
      sc.far = 34;
      scene.add(sun);
      scene.add(sun.target);

      // The sun never changes direction: only the window it shadows moves.
      const sunDir = new THREE.Vector3(-0.55, 1, 0.45).normalize();
      const sunRight = new THREE.Vector3(0, 1, 0).cross(sunDir).normalize();
      const sunUp = new THREE.Vector3().crossVectors(sunDir, sunRight).normalize();
      const sunCentre = new THREE.Vector3();

      // ---- the world, built from scratch --------------------------------
      // Built in stages, a frame apart, so no single task blocks the page.
      const aniso = renderer.capabilities.getMaxAnisotropy();
      const world = buildWorld(THREE, utils.mergeGeometries, scene, aniso, track);
      await nextFrame();
      if (disposed) return;
      const interior = buildInterior(THREE, utils.mergeGeometries, aniso, track);
      scene.add(interior.group);
      await nextFrame();
      if (disposed) return;

      // ---- camera ---------------------------------------------------------
      let rig = makeRig(13);
      const pose: Pose = { pos: [0, 13, 0], look: [0, 0, 0], fov: FOV };
      const camPos = new THREE.Vector3();
      const camLook = new THREE.Vector3();

      const resize = () => {
        const el = hostRef.current;
        if (!el || !el.clientWidth) return;
        const aspect = el.clientWidth / el.clientHeight;
        camera.aspect = aspect;
        camera.updateProjectionMatrix();
        renderer.setSize(el.clientWidth, el.clientHeight, false);
        // Fill the frame with map at t=0 whatever the container's shape: fit the
        // tighter axis so the map covers the view and no empty space shows.
        const half = Math.tan((FOV * Math.PI) / 360);
        rig = makeRig(Math.min(D / 2 / half, W / 2 / (half * aspect)) + 0.06);
      };
      resize();
      ro = new ResizeObserver(resize);
      ro.observe(host);

      const lidBaseY = world.lid.position.y;
      let spanIndex = SPANS.length - 1;
      let lastSpan = 0;

      /** Poses the camera, the sun and every animated part for loop time t. */
      const apply = (t: number) => {
        rig.sample(t, pose);
        camPos.set(pose.pos[0], pose.pos[1], pose.pos[2]);
        camLook.set(pose.look[0], pose.look[1], pose.look[2]);
        camera.position.copy(camPos);
        const up = cameraUp(pose.pos, pose.look);
        camera.up.set(up[0], up[1], up[2]);
        camera.lookAt(camLook);
        if (Math.abs(camera.fov - pose.fov) > 0.005) {
          camera.fov = pose.fov;
          camera.updateProjectionMatrix();
        }

        // Shadow window: quantised size, snapped to shadow texels, fixed direction.
        const want = camPos.distanceTo(camLook) * 0.85;
        while (spanIndex < SPANS.length - 1 && want > SPANS[spanIndex]) spanIndex++;
        while (spanIndex > 0 && want < SPANS[spanIndex - 1] * 0.75) spanIndex--;
        const span = SPANS[spanIndex];
        if (span !== lastSpan) {
          lastSpan = span;
          sc.left = -span;
          sc.right = span;
          sc.top = span;
          sc.bottom = -span;
          sc.updateProjectionMatrix();
        }
        const texel = (2 * span) / SHADOW_SIZE;
        sunCentre.copy(camLook);
        const r = Math.round(sunCentre.dot(sunRight) / texel) * texel;
        const u = Math.round(sunCentre.dot(sunUp) / texel) * texel;
        sunCentre
          .addScaledVector(sunRight, r - sunCentre.dot(sunRight))
          .addScaledVector(sunUp, u - sunCentre.dot(sunUp));
        sun.target.position.copy(sunCentre);
        sun.position.copy(sunCentre).addScaledVector(sunDir, 14);

        // ECSN's upper floors lift clear (far enough that their shadow leaves
        // the interior too), then settle back once the camera has climbed out.
        const off = ramp(t, BEATS.roofOff) * (1 - ramp(t, BEATS.roofOn));
        const fade =
          ramp(t, [BEATS.roofOff[0] + 0.03, BEATS.roofOff[1]]) *
          (1 - ramp(t, [BEATS.roofOn[0], BEATS.roofOn[1] - 0.02]));
        world.lid.position.y = lidBaseY + off * 2.6;
        world.lidMaterials.forEach((m) => {
          m.opacity = 1 - fade;
          m.depthWrite = fade < 0.02;
        });
        world.lid.visible = fade < 0.995;

        // Room lights come up as the camera comes down into the building.
        const glow = ramp(t, BEATS.lightsUp) * (1 - ramp(t, BEATS.lightsDown));
        interior.lights.forEach((l) => (l.intensity = glow * 0.022));

        if (progressRef.current) {
          progressRef.current.style.transform = "scaleX(" + t + ")";
        }
        const c = BEATS.captions;
        const phase = t < c[0] ? 0 : t < c[1] ? 1 : t < c[2] ? 2 : t < c[3] ? 3 : 4;
        if (phase !== phaseRef.current) {
          phaseRef.current = phase;
          onPhaseRef.current(phase);
        }
      };

      // Warm-up: compile every shader and upload every texture and shadow map
      // now, off-screen, so the first visible frame isn't the expensive one.
      apply(0);
      renderer.compile(scene, camera);
      renderer.render(scene, camera);
      [0.32, 0.6, 0.78].forEach((t) => {
        apply(t);
        renderer.render(scene, camera);
      });
      apply(0);
      renderer.render(scene, camera);
      await nextFrame();
      if (disposed) return;
      onReadyRef.current();

      // ---- run ------------------------------------------------------------
      // Loop time only advances while the scene is on screen, so scrolling
      // away and back resumes where it left off instead of snapping to the start.
      let last = 0;
      let elapsed = 0;
      const frame = (now: number) => {
        raf = requestAnimationFrame(frame);
        if (!playingRef.current) {
          last = 0;
          return;
        }
        const dt = last ? Math.min((now - last) / 1000, 0.1) : 0;
        last = now;
        elapsed = (elapsed + dt) % LOOP_SECONDS;
        apply(elapsed / LOOP_SECONDS);
        renderer.render(scene, camera);
      };
      raf = requestAnimationFrame(frame);
    })();

    return () => {
      disposed = true;
      cleanup();
    };
  }, [progressRef]);

  return <div ref={hostRef} style={{ position: "absolute", inset: 0 }} />;
}
