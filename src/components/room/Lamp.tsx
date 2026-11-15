"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { COLORS, LAMP, LIGHTS, ROOM, type ThemeName } from "@/config/scene.config";
import { Cyl } from "./primitives";
import { Interactive } from "./Interactive";

/**
 * Pendant lamp hanging from the ceiling. Its warm light pooled on the desk is the focus of the scene.
 * Clicking the pull cord calls `onPull` (light/dark toggle).
 */
export function Lamp({ theme, onPull }: { theme: ThemeName; onPull?: () => void }) {
  const light = LIGHTS[theme].lamp;
  const [x, y, z] = LAMP.position;
  const cordLength = ROOM.height - y - 0.07;
  const pull = useRef<THREE.Group>(null);
  const tug = useRef(0);

  const target = useMemo(() => {
    const o = new THREE.Object3D();
    o.position.set(x + 0.12, 0, z);
    return o;
  }, [x, z]);

  // The pull cord dips when tugged, then springs back.
  useFrame((_, dt) => {
    tug.current = Math.max(0, tug.current - dt * 2.5);
    if (pull.current) pull.current.position.y = -Math.sin(tug.current * Math.PI) * 0.06;
  });

  const handlePull = () => {
    tug.current = 1;
    onPull?.();
  };

  return (
    <group position={[x, y, z]}>
      {/* Ceiling cord and mount */}
      <Cyl radius={0.005} height={cordLength} segments={5} color="#1a1a1d" position={[0, 0.07 + cordLength / 2, 0]} castShadow={false} />
      <Cyl radius={0.05} height={0.02} color={COLORS.lampShade} position={[0, 0.07 + cordLength - 0.01, 0]} castShadow={false} />

      {/* Shade: dark outside, warm inside */}
      <Cyl radius={0.03} height={0.05} color={COLORS.lampShade} position={[0, 0.065, 0]} castShadow={false} />
      <mesh position={[0, -0.03, 0]}>
        <cylinderGeometry args={[0.05, 0.2, 0.15, 12, 1, true]} />
        <meshStandardMaterial color={COLORS.lampShade} flatShading roughness={0.5} metalness={0.1} />
      </mesh>
      <mesh position={[0, -0.03, 0]}>
        <cylinderGeometry args={[0.048, 0.196, 0.15, 12, 1, true]} />
        <meshBasicMaterial color={light.color} side={THREE.BackSide} toneMapped={false} />
      </mesh>

      {/* Bulb (bright enough to bloom) */}
      <mesh position={[0, -0.05, 0]}>
        <icosahedronGeometry args={[0.04, 1]} />
        <meshBasicMaterial color={new THREE.Color(light.color).multiplyScalar(theme === "dark" ? 2.4 : 1.2)} toneMapped={false} />
      </mesh>

      {/* Pull cord (clickable, with a generous invisible hit area) */}
      <Interactive id="lamp" onActivate={handlePull} labelY={-0.42} position={[0.13, -0.1, 0.06]}>
        <group ref={pull}>
          <Cyl radius={0.003} height={0.3} segments={4} color="#d9d2c0" position={[0, -0.15, 0]} castShadow={false} />
          <mesh position={[0, -0.31, 0]}>
            <icosahedronGeometry args={[0.018, 0]} />
            <meshStandardMaterial color={COLORS.glassesRim} flatShading roughness={0.5} />
          </mesh>
          <mesh position={[0, -0.2, 0]} visible={false}>
            <boxGeometry args={[0.12, 0.34, 0.12]} />
          </mesh>
        </group>
      </Interactive>

      {/* The light itself: a soft-edged cone that pools on the desk, plus a faint glow */}
      <primitive object={target} position={[0.12, -y, 0]} />
      <spotLight
        position={[0, -0.05, 0]}
        target={target}
        color={light.color}
        intensity={light.intensity}
        angle={1.05}
        penumbra={0.85}
        decay={1.6}
        distance={7}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-bias={-0.0006}
        shadow-radius={5}
      />
      <pointLight position={[0, -0.02, 0]} color={light.color} intensity={light.glow} decay={2} distance={5} />
    </group>
  );
}
