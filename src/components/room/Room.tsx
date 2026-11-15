"use client";

import * as THREE from "three";
import { COLORS, LIGHTS, ROOM, type ThemeName } from "@/config/scene.config";
import { Box, useCanvasTexture } from "./primitives";

/** Walls, skirting boards, tiled floor, ceiling and the window behind the curtains. */
export function Room({ theme }: { theme: ThemeName }) {
  const L = ROOM.wallLength;
  const H = ROOM.height;

  // One tile drawn once, then repeated across the floor (a single draw call).
  const tiles = useCanvasTexture(256, 256, (ctx, w, h) => {
    ctx.fillStyle = COLORS.grout;
    ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = COLORS.tile;
    ctx.fillRect(3, 3, w - 6, h - 6);
    // faint variation so the tiles don't look flat
    ctx.fillStyle = "rgba(255,255,255,0.06)";
    ctx.fillRect(3, 3, w - 6, (h - 6) / 2);
  });
  tiles.wrapS = tiles.wrapT = THREE.RepeatWrapping;
  tiles.repeat.set(L / ROOM.tileSize, L / ROOM.tileSize);

  return (
    <group>
      {/* Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-L / 2, 0, L / 2]} receiveShadow>
        <planeGeometry args={[L, L]} />
        <meshStandardMaterial map={tiles} roughness={0.55} />
      </mesh>

      {/* Window wall (left on screen) and right wall */}
      <Box size={[L, H, 0.1]} position={[-L / 2, H / 2, -0.05]} color={COLORS.wall} castShadow={false} />
      <Box size={[0.1, H, L]} position={[0.05, H / 2, L / 2]} color={COLORS.wall} castShadow={false} />

      {/* Skirting boards */}
      <Box size={[L, ROOM.skirtingHeight, 0.02]} position={[-L / 2, ROOM.skirtingHeight / 2, 0.01]} color={COLORS.skirting} castShadow={false} />
      <Box size={[0.02, ROOM.skirtingHeight, L]} position={[-0.01, ROOM.skirtingHeight / 2, L / 2]} color={COLORS.skirting} castShadow={false} />

      {/* Ceiling */}
      <Box size={[L, 0.1, L]} position={[-L / 2, H + 0.05, L / 2]} color={COLORS.ceiling} castShadow={false} />

      <Window theme={theme} />
    </group>
  );
}

/** The window behind the curtains. Its glass glows: moonlight at night, daylight by day. */
function Window({ theme }: { theme: ThemeName }) {
  const cx = -1.62;
  const cy = 1.5;
  const w = 1.5;
  const h = 1.3;
  return (
    <group position={[cx, cy, 0]}>
      <mesh position={[0, 0, 0.006]}>
        <planeGeometry args={[w, h]} />
        <meshBasicMaterial color={LIGHTS[theme].window} toneMapped={false} />
      </mesh>
      {/* Frame */}
      <Box size={[w + 0.1, 0.05, 0.04]} position={[0, h / 2, 0.02]} color={COLORS.windowFrame} />
      <Box size={[w + 0.1, 0.05, 0.04]} position={[0, -h / 2, 0.02]} color={COLORS.windowFrame} />
      <Box size={[0.05, h, 0.04]} position={[-w / 2, 0, 0.02]} color={COLORS.windowFrame} />
      <Box size={[0.05, h, 0.04]} position={[w / 2, 0, 0.02]} color={COLORS.windowFrame} />
      <Box size={[0.035, h, 0.03]} position={[0, 0, 0.02]} color={COLORS.windowFrame} />
      <Box size={[w, 0.035, 0.03]} position={[0, 0.12, 0.02]} color={COLORS.windowFrame} />
    </group>
  );
}
