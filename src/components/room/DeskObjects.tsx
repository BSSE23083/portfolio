"use client";

import { useRef } from "react";
import { useFrame, type ThreeElements } from "@react-three/fiber";
import * as THREE from "three";
import { COLORS } from "@/config/scene.config";
import { Box, Cyl, useCanvasTexture } from "./primitives";

type GroupProps = ThreeElements["group"];

/** Open laptop where the character types. The screen faces the chair (+z). */
export function Laptop(props: GroupProps) {
  const screen = useCanvasTexture(256, 160, (ctx, w, h) => {
    ctx.fillStyle = "#12131a";
    ctx.fillRect(0, 0, w, h);
    const colors = ["#e9b44c", "#7fb7be", "#f2ead9", "#e07a5f", "#9aa0b5"];
    for (let i = 0; i < 11; i++) {
      ctx.fillStyle = colors[i % colors.length];
      ctx.fillRect(14 + (i % 3) * 10, 14 + i * 12, 40 + ((i * 53) % 130), 5);
    }
  });
  return (
    <group {...props}>
      <Box size={[0.33, 0.014, 0.225]} position={[0, 0.007, 0]} color={COLORS.laptop} metalness={0.1} roughness={0.7} />
      <Box size={[0.29, 0.002, 0.11]} position={[0, 0.0145, -0.03]} color="#25262c" castShadow={false} />
      <Box size={[0.1, 0.002, 0.06]} position={[0, 0.0145, 0.07]} color="#7d8088" castShadow={false} />
      {/* Lid, hinged at the back edge and leaning away from the typist */}
      <group position={[0, 0.014, -0.11]} rotation={[-0.32, 0, 0]}>
        <Box size={[0.33, 0.215, 0.008]} position={[0, 0.1075, 0]} color={COLORS.laptop} metalness={0.1} roughness={0.7} />
        <mesh position={[0, 0.108, 0.0045]}>
          <planeGeometry args={[0.31, 0.195]} />
          <meshBasicMaterial map={screen} toneMapped={false} />
        </mesh>
      </group>
    </group>
  );
}

/** DSLR camera with lens (Photography & video). The lens points along +z. */
export function DSLRCamera(props: GroupProps) {
  const c = COLORS.cameraBody;
  return (
    <group {...props}>
      <Box size={[0.13, 0.085, 0.06]} position={[0, 0.0425, 0]} color={c} roughness={0.6} />
      <Box size={[0.035, 0.09, 0.075]} position={[-0.055, 0.045, 0.012]} color={c} roughness={0.6} />
      <Box size={[0.055, 0.03, 0.05]} position={[0.005, 0.1, -0.003]} color={c} roughness={0.6} />
      <Cyl radius={0.008} height={0.008} color="#b8b8be" position={[-0.05, 0.094, 0.01]} />
      {/* Lens */}
      <Cyl radius={0.039} height={0.085} segments={12} color="#111114" rotation={[Math.PI / 2, 0, 0]} position={[0.012, 0.044, 0.07]} />
      <Cyl radius={0.041} height={0.014} segments={12} color="#a8322a" rotation={[Math.PI / 2, 0, 0]} position={[0.012, 0.044, 0.1]} />
      <Cyl radius={0.03} height={0.004} segments={12} color="#2b3a55" metalness={0.8} roughness={0.2} rotation={[Math.PI / 2, 0, 0]} position={[0.012, 0.044, 0.113]} />
    </group>
  );
}

/** Phone lying flat (Contact). The screen lights up when `on` is true. */
export function Phone({ on = false, ...props }: GroupProps & { on?: boolean }) {
  return (
    <group {...props}>
      <Box size={[0.076, 0.009, 0.158]} position={[0, 0.0045, 0]} color={COLORS.phone} roughness={0.4} />
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.0092, 0]}>
        <planeGeometry args={[0.068, 0.148]} />
        <meshBasicMaterial color={on ? "#9fd0ff" : "#22252e"} toneMapped={!on} />
      </mesh>
    </group>
  );
}

/** Open sketchbook with a pencil (Art). */
export function Sketchbook({ flipping = false, ...props }: GroupProps & { flipping?: boolean }) {
  const flip = useRef<THREE.Group>(null);
  const progress = useRef(0);

  // While selected, a page turns from right to left every few seconds.
  useFrame((_, dt) => {
    if (!flip.current) return;
    progress.current = flipping ? (progress.current + dt / 2.6) % 1 : 0;
    const turn = Math.min(1, progress.current / 0.45); // turn takes the first 45% of the cycle
    const eased = turn * turn * (3 - 2 * turn);
    flip.current.visible = flipping && turn < 1;
    flip.current.rotation.z = eased * Math.PI;
  });

  const page = useCanvasTexture(256, 340, (ctx, w, h) => {
    ctx.fillStyle = COLORS.paper;
    ctx.fillRect(0, 0, w, h);
    ctx.strokeStyle = "rgba(40,40,45,0.75)";
    ctx.lineWidth = 2.5;
    ctx.lineCap = "round";
    // a quick loose face sketch
    ctx.beginPath();
    ctx.ellipse(128, 150, 62, 80, 0, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(70, 120);
    ctx.quadraticCurveTo(128, 40, 190, 118);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(98, 150);
    ctx.lineTo(120, 150);
    ctx.moveTo(138, 150);
    ctx.lineTo(160, 150);
    ctx.moveTo(110, 195);
    ctx.quadraticCurveTo(128, 206, 148, 195);
    ctx.stroke();
    ctx.lineWidth = 1.2;
    for (let i = 0; i < 9; i++) {
      ctx.beginPath();
      ctx.moveTo(40 + i * 6, 270 + i * 3);
      ctx.lineTo(90 + i * 6, 250 + i * 3);
      ctx.stroke();
    }
  });
  return (
    <group {...props}>
      <Box size={[0.42, 0.006, 0.29]} position={[0, 0.003, 0]} color="#3a3530" />
      {[-1, 1].map((side) => (
        <group key={side} position={[side * 0.1, 0.006, 0]} rotation={[0, 0, side * -0.035]}>
          <Box size={[0.198, 0.008, 0.275]} position={[0, 0.004, 0]} color={COLORS.paper} />
          {side === -1 && (
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.0085, 0]}>
              <planeGeometry args={[0.19, 0.265]} />
              <meshStandardMaterial map={page} roughness={0.9} />
            </mesh>
          )}
        </group>
      ))}
      {/* The turning page, hinged at the spine */}
      <group ref={flip} position={[0, 0.016, 0]} visible={false}>
        <Box size={[0.195, 0.002, 0.27]} position={[0.0975, 0, 0]} color="#fbf5e6" castShadow={false} />
      </group>
      {/* Pencil */}
      <group position={[0.09, 0.02, 0.02]} rotation={[0, 0.9, 0]}>
        <Cyl radius={0.0045} height={0.16} segments={6} color="#e0b23c" rotation={[Math.PI / 2, 0, 0]} />
        <Cyl radius={[0.0045, 0.0005]} height={0.016} segments={6} color="#3a3530" rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, -0.088]} />
      </group>
    </group>
  );
}

/** VR headset (Game Design + VR Podium). The visor faces +z. */
export function VRHeadset(props: GroupProps) {
  return (
    <group {...props}>
      <Box size={[0.185, 0.1, 0.085]} position={[0, 0.055, 0.02]} color={COLORS.vr} roughness={0.5} />
      <Box size={[0.165, 0.075, 0.012]} position={[0, 0.055, 0.066]} color={COLORS.vrVisor} roughness={0.25} />
      <Box size={[0.15, 0.08, 0.03]} position={[0, 0.055, -0.035]} color="#2a2a30" />
      {/* Head strap: sides, back and top */}
      {[-1, 1].map((side) => (
        <Box key={side} size={[0.012, 0.03, 0.15]} position={[side * 0.092, 0.06, -0.1]} rotation={[0, side * -0.12, 0]} color="#d2d2d8" />
      ))}
      <Box size={[0.17, 0.045, 0.02]} position={[0, 0.06, -0.178]} color="#d2d2d8" />
      <Box size={[0.03, 0.012, 0.19]} position={[0, 0.11, -0.085]} rotation={[0.1, 0, 0]} color="#d2d2d8" />
    </group>
  );
}

/** A cup holding pencils or brushes. */
export function Holder({ kind, ...props }: GroupProps & { kind: "pencils" | "brushes" }) {
  const sticks =
    kind === "pencils"
      ? ["#e0b23c", "#c94f3d", "#3f6f73", "#2a2a2e", "#e0b23c"]
      : ["#a9825a", "#8a6b4a", "#c9b08a", "#a9825a"];
  return (
    <group {...props}>
      <Cyl radius={[0.036, 0.03]} height={0.09} segments={9} color={kind === "pencils" ? COLORS.holder : "#7c8a8f"} position={[0, 0.045, 0]} />
      {sticks.map((color, i) => {
        const a = (i / sticks.length) * Math.PI * 2;
        return (
          <group key={i} position={[Math.cos(a) * 0.014, 0.05, Math.sin(a) * 0.014]} rotation={[Math.sin(a) * 0.22, 0, -Math.cos(a) * 0.22]}>
            <Cyl radius={0.0045} height={0.15} segments={5} color={color} position={[0, 0.05, 0]} />
            {kind === "brushes" && <Cyl radius={[0.002, 0.007]} height={0.03} segments={5} color="#2a2420" position={[0, 0.138, 0]} />}
          </group>
        );
      })}
    </group>
  );
}

/** Speaker box with two drivers on its front (+z). */
export function Speaker({ size = [0.075, 0.2, 0.085], ...props }: GroupProps & { size?: [number, number, number] }) {
  const [w, h, d] = size;
  const tall = h > w * 1.5;
  return (
    <group {...props}>
      <Box size={size} position={[0, h / 2, 0]} color={COLORS.speaker} roughness={0.7} />
      <Cyl radius={w * 0.33} height={0.006} segments={10} color="#0f0f12" rotation={[Math.PI / 2, 0, 0]} position={[0, tall ? h * 0.32 : h / 2, d / 2]} />
      {tall && <Cyl radius={w * 0.2} height={0.006} segments={10} color="#0f0f12" rotation={[Math.PI / 2, 0, 0]} position={[0, h * 0.74, d / 2]} />}
    </group>
  );
}

const BOOKS = [
  { t: 0.03, h: 0.25, d: 0.17 },
  { t: 0.022, h: 0.23, d: 0.16 },
  { t: 0.034, h: 0.26, d: 0.18 },
  { t: 0.02, h: 0.21, d: 0.15 },
  { t: 0.028, h: 0.24, d: 0.17 },
  { t: 0.024, h: 0.2, d: 0.15 },
];

/** Upright books/folders (Visual & Brand). `pulled` slides one book out. */
export function Books({ pulled = false, ...props }: GroupProps & { pulled?: boolean }) {
  const book = useRef<THREE.Mesh>(null);
  const PULLED = 2; // which book slides out

  useFrame((_, dt) => {
    if (!book.current) return;
    const b = book.current;
    b.position.z = THREE.MathUtils.damp(b.position.z, pulled ? 0.1 : 0, 5, dt);
    b.position.y = THREE.MathUtils.damp(b.position.y, BOOKS[PULLED].h / 2 + (pulled ? 0.02 : 0), 5, dt);
    b.rotation.x = THREE.MathUtils.damp(b.rotation.x, pulled ? 0.2 : 0, 5, dt);
  });

  let x = 0;
  return (
    <group {...props}>
      {BOOKS.map((spec, i) => {
        const cx = x + spec.t / 2;
        x += spec.t + 0.002;
        return (
          <Box
            key={i}
            ref={i === PULLED ? book : undefined}
            size={[spec.t, spec.h, spec.d]}
            position={[cx, spec.h / 2, i === PULLED ? 0 : (spec.d - 0.18) / 2]}
            rotation={[0, 0, i === BOOKS.length - 1 ? -0.1 : 0]}
            color={COLORS.books[i % COLORS.books.length]}
          />
        );
      })}
    </group>
  );
}
