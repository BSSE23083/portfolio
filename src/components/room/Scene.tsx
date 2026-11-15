"use client";

import { useRef, useState } from "react";
import { useFrame, useThree, type ThreeEvent } from "@react-three/fiber";
import { Bloom, EffectComposer, Vignette } from "@react-three/postprocessing";
import * as THREE from "three";
import { CAMERA, LIGHTS, SEAT, type ThemeName } from "@/config/scene.config";
import { Room } from "./Room";
import { Curtains } from "./Curtains";
import { Desk, DESK_TOP, RISER_TOP } from "./Desk";
import { Monitor } from "./Monitor";
import { Books, DSLRCamera, Holder, Laptop, Phone, Sketchbook, Speaker, VRHeadset } from "./DeskObjects";
import { Chair } from "./Chair";
import { Character } from "./Character";
import { Lamp } from "./Lamp";

const damp = THREE.MathUtils.damp;

export function Scene({ theme, onToggleTheme }: { theme: ThemeName; onToggleTheme: () => void }) {
  const lights = LIGHTS[theme];
  return (
    <>
      <color attach="background" args={[lights.background]} />
      <CameraRig />

      {/* Lighting: cool, dim fill from the window side; the lamp adds the warm pool */}
      <ambientLight color={lights.ambient.color} intensity={lights.ambient.intensity} />
      <directionalLight color={lights.moon.color} intensity={lights.moon.intensity} position={lights.moon.position} />
      <directionalLight color={lights.fill.color} intensity={lights.fill.intensity} position={lights.fill.position} />
      <Lamp theme={theme} onPull={onToggleTheme} />

      <Room theme={theme} />
      <Curtains />

      <Desk>
        {/* On the riser, left to right */}
        <Speaker position={[-0.53, RISER_TOP, -0.2]} rotation={[0, 0.25, 0]} />
        <Holder kind="pencils" position={[-0.435, RISER_TOP, -0.19]} />
        <Monitor position={[-0.1, RISER_TOP, -0.2]} rotation={[0, 0.1, 0]} />
        <Speaker position={[0.245, RISER_TOP, -0.2]} rotation={[0, -0.15, 0]} />
        <Holder kind="brushes" position={[0.335, RISER_TOP, -0.19]} />
        <Holder kind="pencils" position={[0.4, RISER_TOP, -0.14]} scale={0.6} />
        <Books position={[0.42, RISER_TOP, -0.2]} />

        {/* On the desktop */}
        <Speaker size={[0.07, 0.07, 0.07]} position={[-0.5, DESK_TOP, -0.04]} rotation={[0, 0.5, 0]} />
        <Phone position={[-0.5, DESK_TOP, 0.17]} rotation={[0, 0.35, 0]} />
        <DSLRCamera position={[-0.35, DESK_TOP, -0.01]} rotation={[0, -0.55, 0]} />
        <Sketchbook position={[-0.24, DESK_TOP, 0.165]} rotation={[0, 0.12, 0]} />
        <Laptop position={[0.12, DESK_TOP, 0.13]} />
        <VRHeadset position={[0.45, DESK_TOP, 0.06]} rotation={[0, -0.5, 0]} />
      </Desk>

      <SeatedAbdul />

      <EffectComposer multisampling={4}>
        <Bloom intensity={lights.bloom} luminanceThreshold={1} luminanceSmoothing={0.2} mipmapBlur />
        <Vignette eskil={false} offset={0.25} darkness={lights.vignette} />
      </EffectComposer>
    </>
  );
}

/** Chair + character. Clicking him swivels the chair toward the camera and he waves. */
function SeatedAbdul() {
  const group = useRef<THREE.Group>(null);
  const [waving, setWaving] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useFrame((_, dt) => {
    if (!group.current) return;
    const g = group.current;
    g.rotation.y = damp(g.rotation.y, waving ? SEAT.waveRotationY : SEAT.rotationY, 3.2, dt);
    g.position.z = damp(g.position.z, SEAT.position[2] + (waving ? SEAT.waveSlideBack : 0), 3.2, dt);
  });

  const wave = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    setWaving(true);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setWaving(false), 4200);
  };

  return (
    <group
      ref={group}
      position={SEAT.position}
      rotation={[0, SEAT.rotationY, 0]}
      onClick={wave}
      onPointerOver={() => (document.body.style.cursor = "pointer")}
      onPointerOut={() => (document.body.style.cursor = "")}
    >
      <Chair />
      <Character waving={waving} />
    </group>
  );
}

/** Holds the camera at the overview position with a subtle mouse parallax. */
function CameraRig() {
  const camera = useThree((s) => s.camera) as THREE.PerspectiveCamera;
  const size = useThree((s) => s.size);
  const offset = useRef({ x: 0, y: 0 });
  const target = useRef(new THREE.Vector3());

  useFrame((state, dt) => {
    // Keep the room in frame on tall (phone) screens by widening the view.
    const aspect = size.width / size.height;
    const fov = aspect >= 1.2 ? CAMERA.fov : Math.min(72, CAMERA.fov * (1.2 / aspect) * 0.95);
    if (Math.abs(camera.fov - fov) > 0.01) {
      camera.fov = fov;
      camera.updateProjectionMatrix();
    }

    offset.current.x = damp(offset.current.x, state.pointer.x * CAMERA.parallax, 2.5, dt);
    offset.current.y = damp(offset.current.y, state.pointer.y * CAMERA.parallax * 0.5, 2.5, dt);
    const [px, py, pz] = CAMERA.overview.position;
    camera.position.set(px + offset.current.x, py + offset.current.y, pz + offset.current.x * 0.6);
    target.current.set(...CAMERA.overview.target);
    camera.lookAt(target.current);
  });
  return null;
}
