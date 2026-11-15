"use client";

import { useMemo } from "react";
import * as THREE from "three";
import type { ThreeElements } from "@react-three/fiber";

type MeshProps = ThreeElements["mesh"];

type BoxProps = MeshProps & {
  size: [number, number, number];
  color: string;
  emissive?: string;
  emissiveIntensity?: number;
  roughness?: number;
  metalness?: number;
};

/** A flat-shaded low-poly box. Most of the room is built from these. */
export function Box({ size, color, emissive, emissiveIntensity = 1, roughness = 0.85, metalness = 0, ...props }: BoxProps) {
  return (
    <mesh castShadow receiveShadow {...props}>
      <boxGeometry args={size} />
      <meshStandardMaterial
        color={color}
        flatShading
        roughness={roughness}
        metalness={metalness}
        emissive={emissive ?? "#000000"}
        emissiveIntensity={emissive ? emissiveIntensity : 0}
      />
    </mesh>
  );
}

type CylProps = MeshProps & {
  radius: number | [number, number];
  height: number;
  color: string;
  segments?: number;
  open?: boolean;
  emissive?: string;
  emissiveIntensity?: number;
  roughness?: number;
  metalness?: number;
};

/** A flat-shaded low-poly cylinder (or cone when given two radii: [top, bottom]). */
export function Cyl({ radius, height, color, segments = 10, open = false, emissive, emissiveIntensity = 1, roughness = 0.8, metalness = 0, ...props }: CylProps) {
  const [top, bottom] = Array.isArray(radius) ? radius : [radius, radius];
  return (
    <mesh castShadow receiveShadow {...props}>
      <cylinderGeometry args={[top, bottom, height, segments, 1, open]} />
      <meshStandardMaterial
        color={color}
        flatShading
        roughness={roughness}
        metalness={metalness}
        side={open ? THREE.DoubleSide : THREE.FrontSide}
        emissive={emissive ?? "#000000"}
        emissiveIntensity={emissive ? emissiveIntensity : 0}
      />
    </mesh>
  );
}

/** Draws onto a 2D canvas once and returns it as a texture (used for screens, tiles, paper). */
export function useCanvasTexture(
  width: number,
  height: number,
  draw: (ctx: CanvasRenderingContext2D, w: number, h: number) => void,
  deps: unknown[] = [],
) {
  return useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d")!;
    draw(ctx, width, height);
    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.anisotropy = 4;
    return texture;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}
