"use client";

import { useMemo } from "react";
import * as THREE from "three";
import { COLORS, CURTAINS } from "@/config/scene.config";
import { Cyl } from "./primitives";

const Z = 0.1; // distance of the curtains from the wall
const BOTTOM = 0.02;

/** Curtain rod with round finials and two long folded curtains reaching the floor. */
export function Curtains() {
  const { rodY, rodFrom, rodTo, left, right, folds } = CURTAINS;
  const rodLength = rodTo - rodFrom;
  return (
    <group>
      <Cyl
        radius={0.013}
        height={rodLength}
        color={COLORS.rod}
        rotation={[0, 0, Math.PI / 2]}
        position={[(rodFrom + rodTo) / 2, rodY, Z]}
        metalness={0.4}
      />
      {[rodFrom, rodTo].map((x) => (
        <mesh key={x} position={[x, rodY, Z]} castShadow>
          <icosahedronGeometry args={[0.04, 1]} />
          <meshStandardMaterial color={COLORS.rod} flatShading metalness={0.4} roughness={0.6} />
        </mesh>
      ))}
      {/* Wall brackets */}
      {[rodFrom + 0.15, rodTo - 0.15].map((x) => (
        <Cyl key={x} radius={0.008} height={Z} color={COLORS.rod} rotation={[Math.PI / 2, 0, 0]} position={[x, rodY, Z / 2]} />
      ))}
      <Curtain from={left.from} to={left.to} folds={folds.left} seed={1} />
      <Curtain from={right.from} to={right.to} folds={folds.right} seed={2} />
    </group>
  );
}

/** One curtain: a plane pushed in and out to make low-poly folds. */
function Curtain({ from, to, folds, seed }: { from: number; to: number; folds: number; seed: number }) {
  const width = to - from;
  const height = CURTAINS.rodY - BOTTOM;

  const geometry = useMemo(() => {
    const geo = new THREE.PlaneGeometry(width, height, folds * 4, 6);
    const pos = geo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const y = pos.getY(i);
      const u = x / width + 0.5; // 0..1 across
      const v = y / height + 0.5; // 0 bottom..1 top
      // folds get a little deeper and looser toward the floor
      const depth = 0.03 + (1 - v) * 0.018;
      const wobble = Math.sin((u * 3 + seed) * 5.1 + v * 2.2) * 0.008 * (1 - v);
      pos.setZ(i, Math.sin(u * folds * Math.PI * 2 + seed) * depth + wobble);
      // slightly uneven hem
      if (v < 0.01) pos.setY(i, y + Math.sin(u * 23 + seed * 3) * 0.012);
    }
    geo.computeVertexNormals();
    return geo;
  }, [width, height, folds, seed]);

  return (
    <mesh geometry={geometry} position={[(from + to) / 2, BOTTOM + height / 2, Z]} castShadow receiveShadow>
      <meshStandardMaterial color={COLORS.curtain} flatShading side={THREE.DoubleSide} roughness={0.95} />
    </mesh>
  );
}
