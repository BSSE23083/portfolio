"use client";

import type { ReactNode } from "react";
import { COLORS, DESK } from "@/config/scene.config";
import { Box } from "./primitives";

const W = DESK.width;
const D = DESK.depth;
const T = DESK.height; // top surface height
const LEG = 0.03;

/** Height of the desktop surface and of the riser surface, for placing objects. */
export const DESK_TOP = T;
export const RISER_TOP = T + DESK.riserHeight;

/**
 * Metal-frame desk with a wooden top, a riser along the back and lower shelves.
 * Children are placed in desk space: x from -0.6 (left) to 0.6 (right), z from -0.3 (wall) to 0.3 (front).
 */
export function Desk({ children }: { children?: ReactNode }) {
  const frame = COLORS.deskFrame;
  const legX = W / 2 - LEG / 2;
  const legZ = D / 2 - LEG / 2;
  const midX = 0.26; // divider between the wide left bay and the shelf bay on the right
  const legH = T - 0.03;

  return (
    <group position={DESK.position}>
      {/* Top */}
      <Box size={[W, 0.03, D]} position={[0, T - 0.015, 0]} color={COLORS.deskTop} roughness={0.6} />

      {/* Legs */}
      {[-legX, midX, legX].map((x) =>
        [-legZ, legZ].map((z) => (
          <Box key={`${x}${z}`} size={[LEG, legH, LEG]} position={[x, legH / 2, z]} color={frame} metalness={0.1} roughness={0.75} />
        )),
      )}

      {/* Rails: under the top and near the floor */}
      {[T - 0.045, 0.1].map((y) => (
        <group key={y}>
          <Box size={[W, LEG, LEG]} position={[0, y, -legZ]} color={frame} metalness={0.1} roughness={0.75} />
          {/* Front rail: full width under the top, right bay only near the floor (leaves leg room) */}
          {y > 0.2 ? (
            <Box size={[W, LEG, LEG]} position={[0, y, legZ]} color={frame} metalness={0.1} roughness={0.75} />
          ) : (
            <Box size={[legX - midX, LEG, LEG]} position={[(midX + legX) / 2, y, legZ]} color={frame} metalness={0.1} roughness={0.75} />
          )}
          {[-legX, midX, legX].map((x) => (
            <Box key={x} size={[LEG, LEG, D]} position={[x, y, 0]} color={frame} metalness={0.1} roughness={0.75} />
          ))}
        </group>
      ))}

      {/* Lower shelf (left bay) and two shelves (right bay) */}
      <Box size={[midX + legX, 0.018, D / 2 - 0.02]} position={[(midX - legX) / 2, 0.124, -D / 4]} color={COLORS.riser} />
      <Box size={[legX - midX, 0.018, D - 0.04]} position={[(midX + legX) / 2, 0.124, 0]} color={COLORS.riser} />
      <Box size={[legX - midX, 0.018, D - 0.04]} position={[(midX + legX) / 2, 0.43, 0]} color={COLORS.riser} />
      <Box size={[legX - midX, LEG, LEG]} position={[(midX + legX) / 2, 0.41, legZ]} color={frame} metalness={0.1} roughness={0.75} />

      {/* Riser along the back of the desktop */}
      <Box size={[W - 0.06, 0.018, DESK.riserDepth]} position={[0, RISER_TOP - 0.009, -D / 2 + DESK.riserDepth / 2]} color={COLORS.riser} roughness={0.6} />
      {[-0.55, 0, 0.55].map((x) => (
        <Box key={x} size={[0.018, DESK.riserHeight - 0.018, DESK.riserDepth - 0.02]} position={[x, T + (DESK.riserHeight - 0.018) / 2, -D / 2 + DESK.riserDepth / 2]} color={COLORS.riser} />
      ))}

      <UnderDesk />
      {children}
    </group>
  );
}

/** Boxes and stacked books/files under the desk (no PC). */
function UnderDesk() {
  const shelf = 0.133;
  const b = COLORS.books;
  return (
    <group>
      {/* Left bay: cardboard boxes */}
      <Box size={[0.32, 0.26, 0.25]} position={[-0.41, shelf + 0.13, -0.15]} rotation={[0, 0.05, 0]} color={COLORS.cardboard} />
      <Box size={[0.3, 0.012, 0.05]} position={[-0.41, shelf + 0.262, -0.15]} rotation={[0, 0.05, 0]} color="#d8c7a6" />
      <Box size={[0.24, 0.17, 0.22]} position={[-0.06, shelf + 0.085, -0.16]} rotation={[0, -0.06, 0]} color="#a37f55" />
      <Box size={[0.18, 0.1, 0.18]} position={[-0.07, shelf + 0.22, -0.16]} rotation={[0, 0.2, 0]} color="#c4a172" />

      {/* Right bay, lower shelf: stacked books */}
      {[
        { h: 0.035, c: b[1], r: 0.05 },
        { h: 0.03, c: b[2], r: -0.08 },
        { h: 0.04, c: b[0], r: 0.1 },
        { h: 0.025, c: b[4], r: -0.03 },
      ].reduce<{ y: number; items: ReactNode[] }>(
        (acc, book, i) => {
          acc.items.push(
            <Box key={i} size={[0.24, book.h, 0.3]} position={[0.425, acc.y + book.h / 2, 0.02]} rotation={[0, book.r, 0]} color={book.c} />,
          );
          acc.y += book.h;
          return acc;
        },
        { y: shelf, items: [] },
      ).items}

      {/* Right bay, upper shelf: files and a small box */}
      <Box size={[0.26, 0.05, 0.32]} position={[0.42, 0.464, 0.0]} rotation={[0, -0.05, 0]} color="#d9d2c0" />
      <Box size={[0.25, 0.04, 0.31]} position={[0.425, 0.509, 0.0]} rotation={[0, 0.06, 0]} color={b[3]} />
      <Box size={[0.16, 0.09, 0.2]} position={[0.43, 0.574, -0.03]} rotation={[0, 0.25, 0]} color={COLORS.cardboard} />
    </group>
  );
}
