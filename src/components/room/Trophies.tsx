"use client";

import { useMemo, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import * as THREE from "three";
import { BOUNCE, COLORS, TROPHIES } from "@/config/scene.config";
import { useRoom } from "../store";
import { Box } from "./primitives";

/**
 * A small side table with two award shields.
 * They hop like the other objects but are not clickable: hovering shows which competition each is from.
 */
export function Trophies() {
  const [hovered, setHovered] = useState<number | null>(null);
  const shields = useRef<(THREE.Group | null)[]>([]);

  // Shield outline, extruded into a thin plaque.
  const shieldGeometry = useMemo(() => {
    const shape = new THREE.Shape();
    shape.moveTo(-0.055, 0.07);
    shape.lineTo(0.055, 0.07);
    shape.lineTo(0.055, 0.005);
    shape.quadraticCurveTo(0.05, -0.05, 0, -0.08);
    shape.quadraticCurveTo(-0.05, -0.05, -0.055, 0.005);
    shape.closePath();
    const geometry = new THREE.ExtrudeGeometry(shape, { depth: 0.014, bevelEnabled: false, curveSegments: 3 });
    geometry.translate(0, 0, -0.007);
    return geometry;
  }, []);

  useFrame(({ clock }) => {
    const zoomedIn = useRoom.getState().focus !== null;
    shields.current.forEach((group, i) => {
      if (!group) return;
      const p = ((clock.elapsedTime + 1.3 + i * 0.35) % BOUNCE.every) / BOUNCE.duration;
      const hop = p < 1 && !zoomedIn ? Math.abs(Math.sin(p * Math.PI * 2)) * (1 - p) : 0;
      group.position.y = TABLE_TOP + hop * BOUNCE.height;
    });
  });

  return (
    <group position={TROPHIES.position}>
      {/* Side table: same wood and dark metal as the desk */}
      <Box size={[0.36, 0.025, 0.46]} position={[0, TABLE_TOP - 0.0125, 0]} color={COLORS.deskTop} roughness={0.6} />
      {[-1, 1].map((x) =>
        [-1, 1].map((z) => (
          <Box key={`${x}${z}`} size={[0.025, TABLE_TOP - 0.025, 0.025]} position={[x * 0.16, (TABLE_TOP - 0.025) / 2, z * 0.21]} color={COLORS.deskFrame} roughness={0.75} />
        )),
      )}
      <Box size={[0.32, 0.018, 0.42]} position={[0, 0.14, 0]} color={COLORS.riser} />

      {TROPHIES.awards.map((award, i) => (
        <group
          key={award.title}
          ref={(el) => {
            shields.current[i] = el;
          }}
          position={[-0.02, TABLE_TOP, i === 0 ? -0.11 : 0.11]}
          rotation={[0, TROPHIES.facing, 0]}
          scale={hovered === i ? 1.12 : 1}
          onPointerOver={(e) => {
            e.stopPropagation();
            setHovered(i);
          }}
          onPointerOut={() => setHovered((current) => (current === i ? null : current))}
        >
          <mesh position={[0, 0.12, 0]} visible={false}>
            <boxGeometry args={[0.16, 0.26, 0.1]} />
          </mesh>
          {/* Wooden base and stand */}
          <Box size={[0.1, 0.022, 0.06]} position={[0, 0.011, 0]} color="#3a2a1f" />
          <Box size={[0.02, 0.035, 0.02]} position={[0, 0.038, 0]} color="#3a2a1f" />
          {/* Shield with a darker inner plate */}
          <mesh geometry={shieldGeometry} position={[0, 0.135, 0]} rotation={[-0.12, 0, 0]} castShadow>
            <meshStandardMaterial color={award.color} flatShading roughness={0.45} metalness={0.25} emissive={award.color} emissiveIntensity={0.22} />
          </mesh>
          <mesh geometry={shieldGeometry} position={[0, 0.137, 0.006]} rotation={[-0.12, 0, 0]} scale={[0.68, 0.68, 0.6]}>
            <meshStandardMaterial color="#2b2118" flatShading roughness={0.8} />
          </mesh>
          <Box size={[0.03, 0.03, 0.006]} position={[0, 0.142, 0.014]} rotation={[-0.12, 0, Math.PI / 4]} color={award.color} emissive={award.color} emissiveIntensity={0.3} castShadow={false} />

          {hovered === i && (
            <Html position={[0, 0.3, 0]} center zIndexRange={[30, 0]} style={{ pointerEvents: "none" }}>
              <div className="room-label">
                <strong>{award.title}</strong>
                <span>{award.event}</span>
              </div>
            </Html>
          )}
        </group>
      ))}
    </group>
  );
}

const TABLE_TOP = 0.55;
