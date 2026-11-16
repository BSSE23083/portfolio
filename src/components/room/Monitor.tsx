"use client";

import type { ThreeElements } from "@react-three/fiber";
import { COLORS } from "@/config/scene.config";
import { Box, useCanvasTexture } from "./primitives";

const THUMBS = ["#e07a5f", "#3d7a80", "#e9b44c", "#5b5f97"];

/** Monitor on the riser. Its screen shows case study thumbnails (Product Design). */
export function Monitor(props: ThreeElements["group"]) {
  const screen = useCanvasTexture(512, 288, (ctx, w, h) => {
    ctx.fillStyle = "#15161c";
    ctx.fillRect(0, 0, w, h);
    // Simple layout blocks only (no text: it looked blurry at this size)
    ctx.fillStyle = "#f2ead9";
    ctx.fillRect(24, 26, 150, 12);
    ctx.fillStyle = "#5a5f73";
    ctx.fillRect(24, 48, 90, 8);
    THUMBS.forEach((color, i) => {
      const x = 24 + (i % 2) * 238;
      const y = 76 + Math.floor(i / 2) * 100;
      ctx.fillStyle = color;
      ctx.fillRect(x, y, 226, 88);
      ctx.fillStyle = "rgba(0,0,0,0.25)";
      ctx.fillRect(x, y + 62, 226, 26);
      ctx.fillStyle = "rgba(255,255,255,0.85)";
      ctx.fillRect(x + 10, y + 72, 90, 6);
    });
  });

  return (
    <group {...props}>
      <Box size={[0.22, 0.012, 0.15]} position={[0, 0.006, 0]} color={COLORS.monitor} />
      <Box size={[0.035, 0.14, 0.025]} position={[0, 0.07, -0.03]} color={COLORS.monitor} />
      <group position={[0, 0.3, 0]} rotation={[-0.05, 0, 0]}>
        <Box size={[0.58, 0.345, 0.024]} color={COLORS.monitor} />
        <mesh position={[0, 0.004, 0.0125]}>
          <planeGeometry args={[0.555, 0.312]} />
          <meshBasicMaterial map={screen} toneMapped={false} />
        </mesh>
      </group>
    </group>
  );
}
