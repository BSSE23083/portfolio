"use client";

import { useEffect, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Bloom, EffectComposer, N8AO, Outline, Selection, ToneMapping, Vignette } from "@react-three/postprocessing";
import { ToneMappingMode } from "postprocessing";
import gsap from "gsap";
import * as THREE from "three";
import { CAMERA, LIGHTS, SEAT } from "@/config/scene.config";
import { OBJECTS } from "@/config/objects";
import { useRoom } from "../store";
import { Room } from "./Room";
import { Curtains } from "./Curtains";
import { Desk, DESK_TOP, RISER_TOP } from "./Desk";
import { Monitor } from "./Monitor";
import { Books, DSLRCamera, Holder, Laptop, Phone, Sketchbook, Speaker, VRHeadset } from "./DeskObjects";
import { Chair } from "./Chair";
import { Character } from "./Character";
import { Lamp } from "./Lamp";
import { Interactive } from "./Interactive";

const damp = THREE.MathUtils.damp;

// Camera moves follow real time even if a frame is slow (no slow-motion catch-up).
gsap.ticker.lagSmoothing(0);

/** `lite` turns off the heavier effects (used on phones and weaker devices). */
export function Scene({ lite = false }: { lite?: boolean }) {
  const theme = useRoom((s) => s.theme);
  const toggleTheme = useRoom((s) => s.toggleTheme);
  const focus = useRoom((s) => s.focus);
  const lights = LIGHTS[theme];

  return (
    <Selection>
      <color attach="background" args={[lights.background]} />
      <CameraRig />

      {/* Lighting: cool, dim fill from the window side; the lamp adds the warm pool */}
      <ambientLight color={lights.ambient.color} intensity={lights.ambient.intensity} />
      <directionalLight color={lights.moon.color} intensity={lights.moon.intensity} position={lights.moon.position} />
      <directionalLight color={lights.fill.color} intensity={lights.fill.intensity} position={lights.fill.position} />
      <Lamp theme={theme} onPull={toggleTheme} />

      <Room theme={theme} />
      <Curtains />

      <Desk>
        {/* On the riser, left to right */}
        <Speaker position={[-0.53, RISER_TOP, -0.2]} rotation={[0, 0.25, 0]} />
        <Holder kind="pencils" position={[-0.435, RISER_TOP, -0.19]} />
        <Interactive id="monitor" labelY={0.56} position={[-0.1, RISER_TOP, -0.2]} rotation={[0, 0.1, 0]}>
          <Monitor />
        </Interactive>
        <Speaker position={[0.245, RISER_TOP, -0.2]} rotation={[0, -0.15, 0]} />
        <Holder kind="brushes" position={[0.335, RISER_TOP, -0.19]} />
        <Holder kind="pencils" position={[0.4, RISER_TOP, -0.14]} scale={0.6} />
        <Interactive id="books" labelY={0.36} position={[0.42, RISER_TOP, -0.2]}>
          <Books pulled={focus === "books"} />
        </Interactive>

        {/* On the desktop */}
        <Speaker size={[0.07, 0.07, 0.07]} position={[0.275, DESK_TOP, -0.055]} rotation={[0, -0.3, 0]} />
        <Interactive id="phone" labelY={0.14} position={[-0.55, DESK_TOP, -0.02]} rotation={[0, 0.1, 0]}>
          <Phone on={focus === "phone"} />
        </Interactive>
        <Interactive id="camera" labelY={0.22} position={[-0.27, DESK_TOP, -0.04]} rotation={[0, -0.55, 0]}>
          <DSLRCamera />
        </Interactive>
        <Interactive id="sketchbook" labelY={0.14} position={[-0.33, DESK_TOP, 0.175]} rotation={[0, 0.12, 0]} scale={0.9}>
          <Sketchbook flipping={focus === "sketchbook"} />
        </Interactive>
        <Laptop position={[0.04, DESK_TOP, 0.13]} />
        <Interactive id="vr" labelY={0.22} position={[0.45, DESK_TOP, 0.06]} rotation={[0, -0.5, 0]}>
          <VRHeadset />
        </Interactive>
      </Desk>

      <SeatedAbdul waving={focus === "character"} />

      <EffectComposer multisampling={lite ? 0 : 4} autoClear={false} enableNormalPass={false}>
        {lite ? <></> : <N8AO aoRadius={0.35} intensity={1.6} distanceFalloff={0.6} quality="medium" halfRes />}
        <Outline blur edgeStrength={5} visibleEdgeColor={0xffd9a0} hiddenEdgeColor={0x8a6a3a} xRay />
        {lite ? <></> : <Bloom intensity={lights.bloom} luminanceThreshold={1} luminanceSmoothing={0.2} mipmapBlur />}
        <Vignette eskil={false} offset={0.25} darkness={lights.vignette} />
        <ToneMapping mode={ToneMappingMode.ACES_FILMIC} />
      </EffectComposer>
    </Selection>
  );
}

/** Chair + character. When selected, the chair swivels toward the camera and he waves. */
function SeatedAbdul({ waving }: { waving: boolean }) {
  const group = useRef<THREE.Group>(null);
  const faceLight = useRef<THREE.PointLight>(null);

  useFrame((_, dt) => {
    // A soft warm light on his face fades in while he waves (otherwise he is a silhouette against the lamp).
    if (faceLight.current) faceLight.current.intensity = damp(faceLight.current.intensity, waving ? 1.6 : 0, 3, dt);
    if (!group.current) return;
    const g = group.current;
    g.rotation.y = damp(g.rotation.y, waving ? SEAT.waveRotationY : SEAT.rotationY, 3.2, dt);
    g.position.z = damp(g.position.z, SEAT.position[2] + (waving ? SEAT.waveSlideBack : 0), 3.2, dt);
  });

  return (
    <group ref={group} position={SEAT.position} rotation={[0, SEAT.rotationY, 0]}>
      <pointLight ref={faceLight} position={[0.25, 1.45, -1.0]} color="#ffd9b0" intensity={0} distance={3} decay={1.5} />
      <Interactive id="character" labelY={1.5}>
        <Chair />
        <Character waving={waving} />
      </Interactive>
    </group>
  );
}

/**
 * Moves the camera: flies to the selected object (GSAP), allows a small drag rotation,
 * and adds a subtle mouse parallax.
 */
function CameraRig() {
  const camera = useThree((s) => s.camera) as THREE.PerspectiveCamera;
  const gl = useThree((s) => s.gl);
  const size = useThree((s) => s.size);
  const focus = useRoom((s) => s.focus);

  const rig = useRef({
    position: new THREE.Vector3(...CAMERA.overview.position),
    target: new THREE.Vector3(...CAMERA.overview.target),
  });
  const drag = useRef({ active: false, x: 0, y: 0, yaw: 0, pitch: 0, yawNow: 0, pitchNow: 0 });
  const focused = useRef(false);

  // Fly to the selected object, or back to the overview.
  useEffect(() => {
    const stop = (focus && OBJECTS[focus].camera) || CAMERA.overview;
    focused.current = Boolean(focus);
    drag.current.yaw = 0;
    drag.current.pitch = 0;
    const [px, py, pz] = stop.position;
    const [tx, ty, tz] = stop.target;
    const options = { duration: CAMERA.flyDuration, ease: "power3.inOut", overwrite: true };
    gsap.to(rig.current.position, { x: px, y: py, z: pz, ...options });
    gsap.to(rig.current.target, { x: tx, y: ty, z: tz, ...options });
  }, [focus]);

  // Drag to rotate a little (limited so the composition never breaks).
  useEffect(() => {
    const el = gl.domElement;
    const d = drag.current;
    const down = (e: PointerEvent) => {
      d.active = true;
      d.x = e.clientX;
      d.y = e.clientY;
    };
    const move = (e: PointerEvent) => {
      if (!d.active) return;
      const limit = focused.current ? CAMERA.dragLimit * 0.5 : CAMERA.dragLimit;
      d.yaw = THREE.MathUtils.clamp(d.yaw - (e.clientX - d.x) * 0.004, -limit, limit);
      d.pitch = THREE.MathUtils.clamp(d.pitch + (e.clientY - d.y) * 0.002, -limit * 0.35, limit * 0.35);
      d.x = e.clientX;
      d.y = e.clientY;
    };
    const up = () => (d.active = false);
    el.addEventListener("pointerdown", down);
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
    window.addEventListener("pointercancel", up);
    return () => {
      el.removeEventListener("pointerdown", down);
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
      window.removeEventListener("pointercancel", up);
    };
  }, [gl]);

  const offset = useRef(new THREE.Vector3());
  const spherical = useRef(new THREE.Spherical());

  useFrame((state, dt) => {
    // Keep the room in frame on tall (phone) screens by widening the view.
    const aspect = size.width / size.height;
    const fov = aspect >= 1.2 ? CAMERA.fov : Math.min(74, CAMERA.fov * (1.2 / aspect) * 0.95);
    if (Math.abs(camera.fov - fov) > 0.01) {
      camera.fov = fov;
      camera.updateProjectionMatrix();
    }

    const d = drag.current;
    const parallax = focused.current ? CAMERA.parallax * 0.4 : CAMERA.parallax;
    d.yawNow = damp(d.yawNow, d.yaw - state.pointer.x * parallax, 4, dt);
    d.pitchNow = damp(d.pitchNow, d.pitch + state.pointer.y * parallax * 0.4, 4, dt);

    // Rotate the camera around its look-at point by the drag / parallax amount.
    offset.current.copy(rig.current.position).sub(rig.current.target);
    spherical.current.setFromVector3(offset.current);
    spherical.current.theta += d.yawNow;
    spherical.current.phi = THREE.MathUtils.clamp(spherical.current.phi - d.pitchNow, 0.25, 1.52);
    offset.current.setFromSpherical(spherical.current);
    camera.position.copy(rig.current.target).add(offset.current);
    camera.lookAt(rig.current.target);
  });
  return null;
}
