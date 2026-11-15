"use client";

import { COLORS } from "@/config/scene.config";
import { Box, Cyl } from "./primitives";

/** Top of the seat cushion, used to place the character. */
export const SEAT_TOP = 0.5;

/** Swivel office chair: five-wheel base, armrests, and a jacket over the back. Faces -z. */
export function Chair() {
  const c = COLORS.chair;
  return (
    <group>
      {/* Five-star base with wheels */}
      {[0, 1, 2, 3, 4].map((i) => {
        const a = (i / 5) * Math.PI * 2 + 0.3;
        return (
          <group key={i} rotation={[0, a, 0]}>
            <Box size={[0.3, 0.028, 0.045]} position={[0.16, 0.075, 0]} rotation={[0, 0, -0.08]} color={c} metalness={0.3} />
            <mesh position={[0.3, 0.032, 0]} castShadow>
              <icosahedronGeometry args={[0.032, 0]} />
              <meshStandardMaterial color="#111114" flatShading />
            </mesh>
          </group>
        );
      })}
      <Cyl radius={0.028} height={0.34} color="#55555c" metalness={0.6} roughness={0.4} position={[0, 0.25, 0]} />

      {/* Seat */}
      <Box size={[0.48, 0.075, 0.46]} position={[0, SEAT_TOP - 0.0375, 0]} color={COLORS.chairSeat} />

      {/* Backrest on a support bar */}
      <Box size={[0.05, 0.3, 0.03]} position={[0, 0.58, 0.2]} rotation={[0.12, 0, 0]} color={c} />
      <Box size={[0.44, 0.52, 0.06]} position={[0, 0.86, 0.215]} rotation={[0.1, 0, 0]} color={COLORS.chairSeat} />

      {/* Armrests */}
      {[-1, 1].map((side) => (
        <group key={side} position={[side * 0.275, 0, 0]}>
          <Box size={[0.03, 0.22, 0.03]} position={[0, 0.56, 0.06]} color={c} />
          <Box size={[0.055, 0.03, 0.27]} position={[0, 0.68, 0.02]} color={c} />
        </group>
      ))}

      <Jacket />
    </group>
  );
}

/** Jacket draped over the chair back, as in the sketch. */
function Jacket() {
  const j = COLORS.jacket;
  return (
    <group position={[0, 0, 0.228]} rotation={[0.1, 0, 0]}>
      <Box size={[0.5, 0.5, 0.05]} position={[0, 0.86, 0.035]} color={j} />
      <Box size={[0.5, 0.06, 0.13]} position={[0, 1.125, -0.01]} color={j} />
      <Box size={[0.46, 0.2, 0.03]} position={[0, 1.02, -0.07]} color={j} />
      {/* Sleeves hanging down the sides */}
      {[-1, 1].map((side) => (
        <Box key={side} size={[0.085, 0.44, 0.07]} position={[side * 0.262, 0.76, 0.02]} rotation={[0, 0, side * 0.07]} color={j} />
      ))}
      <Box size={[0.2, 0.05, 0.02]} position={[0, 1.1, 0.062]} color="#4c583f" />
    </group>
  );
}
