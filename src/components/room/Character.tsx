"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { COLORS } from "@/config/scene.config";
import { Box } from "./primitives";
import { SEAT_TOP } from "./Chair";

const damp = THREE.MathUtils.damp;

// Resting arm pose: upper arms angled forward, forearms reaching to the keyboard.
const UPPER_ARM = 0.35;
const FOREARM = 1.38;
const ARM_IN = 0.2; // how much the arms angle inward toward the laptop

/**
 * Low-poly Abdul, seated and typing. Faces -z (toward the desk).
 * `waving`: stops typing, raises the right arm and waves.
 */
export function Character({ waving = false }: { waving?: boolean }) {
  const torso = useRef<THREE.Group>(null);
  const head = useRef<THREE.Group>(null);
  const leftArm = useRef<THREE.Group>(null);
  const rightArm = useRef<THREE.Group>(null);
  const leftForearm = useRef<THREE.Group>(null);
  const rightForearm = useRef<THREE.Group>(null);
  const leftHand = useRef<THREE.Mesh>(null);
  const rightHand = useRef<THREE.Mesh>(null);

  useFrame((state, dt) => {
    const t = state.clock.elapsedTime;

    // Breathing
    if (torso.current) {
      torso.current.scale.y = 1 + Math.sin(t * 1.5) * 0.012;
      torso.current.rotation.x = -0.1 + Math.sin(t * 1.5) * 0.008;
    }

    // Head: small idle movements, plus gently following the cursor
    if (head.current) {
      const idleYaw = Math.sin(t * 0.37) * 0.07 + Math.sin(t * 0.11) * 0.05;
      const idlePitch = Math.sin(t * 0.53) * 0.035;
      const yaw = waving ? 0 : idleYaw - state.pointer.x * 0.3;
      const pitch = waving ? -0.05 : 0.2 + idlePitch - state.pointer.y * 0.12;
      head.current.rotation.y = damp(head.current.rotation.y, yaw, 4, dt);
      head.current.rotation.x = damp(head.current.rotation.x, pitch, 4, dt);
    }

    // Typing: quick, slightly irregular taps
    const tapL = waving ? 0 : Math.max(0, Math.sin(t * 13.1)) * Math.max(0, Math.sin(t * 2.3 + 1)) * 0.07;
    const tapR = waving ? 0 : Math.max(0, Math.sin(t * 11.7 + 2)) * Math.max(0, Math.sin(t * 1.9)) * 0.07;
    if (leftForearm.current) leftForearm.current.rotation.x = damp(leftForearm.current.rotation.x, FOREARM + tapL, 18, dt);
    if (leftHand.current) leftHand.current.rotation.x = tapL * 2;
    if (rightHand.current) rightHand.current.rotation.x = tapR * 2;

    // Right arm: types normally, lifts and waves when asked
    if (rightArm.current && rightForearm.current) {
      const arm = rightArm.current.rotation;
      const fore = rightForearm.current.rotation;
      if (waving) {
        arm.x = damp(arm.x, 0.3, 6, dt);
        arm.z = damp(arm.z, 2.2, 6, dt);
        fore.x = damp(fore.x, 0.2, 6, dt);
        fore.z = damp(fore.z, 0.55 + Math.sin(t * 9) * 0.4, 10, dt);
      } else {
        arm.x = damp(arm.x, UPPER_ARM, 6, dt);
        arm.z = damp(arm.z, 0, 6, dt);
        fore.x = damp(fore.x, FOREARM + tapR, 14, dt);
        fore.z = damp(fore.z, 0, 8, dt);
      }
    }
  });

  return (
    <group position={[0, SEAT_TOP, 0]}>
      <Legs />

      {/* Torso leans slightly toward the desk */}
      <group ref={torso} position={[0, 0.02, 0.04]} rotation={[-0.1, 0, 0]}>
        <Box size={[0.37, 0.47, 0.21]} position={[0, 0.235, 0]} color={COLORS.shirt} />
        <Box size={[0.085, 0.05, 0.085]} position={[0, 0.49, 0]} color={COLORS.skin} />

        <group ref={head} position={[0, 0.515, 0]}>
          <Head />
        </group>

        {/* Left arm */}
        <group ref={leftArm} position={[-0.225, 0.42, 0]} rotation={[UPPER_ARM, -ARM_IN, 0]}>
          <Arm forearmRef={leftForearm} handRef={leftHand} />
        </group>
        {/* Right arm */}
        <group ref={rightArm} position={[0.225, 0.42, 0]} rotation={[UPPER_ARM, ARM_IN, 0]}>
          <Arm forearmRef={rightForearm} handRef={rightHand} />
        </group>
      </group>
    </group>
  );
}

function Arm({ forearmRef, handRef }: { forearmRef: React.RefObject<THREE.Group | null>; handRef: React.RefObject<THREE.Mesh | null> }) {
  return (
    <>
      {/* Short t-shirt sleeve, then bare arm */}
      <Box size={[0.105, 0.16, 0.115]} position={[0, -0.06, 0]} color={COLORS.shirt} />
      <Box size={[0.08, 0.14, 0.085]} position={[0, -0.2, 0]} color={COLORS.skin} />
      <group ref={forearmRef} position={[0, -0.27, 0]} rotation={[FOREARM, 0, 0]}>
        <Box size={[0.072, 0.25, 0.078]} position={[0, -0.125, 0]} color={COLORS.skin} />
        <Box ref={handRef} size={[0.075, 0.075, 0.035]} position={[0, -0.285, 0.005]} color={COLORS.skin} />
      </group>
    </>
  );
}

function Head() {
  const g = COLORS.glasses;
  return (
    <>
      <Box size={[0.185, 0.21, 0.2]} position={[0, 0.105, 0]} color={COLORS.skin} />
      {/* Hair: top, back, sides and a short fringe */}
      <Box size={[0.2, 0.07, 0.215]} position={[0, 0.225, 0.005]} color={COLORS.hair} />
      <Box size={[0.2, 0.16, 0.05]} position={[0, 0.15, 0.09]} color={COLORS.hair} />
      {[-1, 1].map((side) => (
        <Box key={side} size={[0.02, 0.1, 0.13]} position={[side * 0.095, 0.17, 0.03]} color={COLORS.hair} />
      ))}
      <Box size={[0.19, 0.035, 0.03]} position={[0, 0.2, -0.098]} rotation={[0.25, 0, 0]} color={COLORS.hair} />
      {/* Ears and nose */}
      {[-1, 1].map((side) => (
        <Box key={side} size={[0.015, 0.045, 0.03]} position={[side * 0.098, 0.1, 0.0]} color={COLORS.skin} />
      ))}
      <Box size={[0.025, 0.045, 0.025]} position={[0, 0.095, -0.108]} color={COLORS.skin} />

      {/* Clubmaster glasses: thick dark brow bar, thin gold lower rims */}
      <group position={[0, 0.125, -0.104]}>
        {[-1, 1].map((side) => (
          <group key={side} position={[side * 0.046, 0, 0]}>
            <Box size={[0.076, 0.02, 0.012]} position={[0, 0.014, 0]} color={g} />
            <Box size={[0.066, 0.005, 0.008]} position={[0, -0.03, 0]} color={COLORS.glassesRim} metalness={0.7} roughness={0.3} />
            <Box size={[0.005, 0.04, 0.008]} position={[side * 0.033, -0.01, 0]} color={COLORS.glassesRim} metalness={0.7} roughness={0.3} />
            <Box size={[0.005, 0.04, 0.008]} position={[side * -0.033, -0.01, 0]} color={COLORS.glassesRim} metalness={0.7} roughness={0.3} />
            <mesh position={[0, -0.008, 0]}>
              <planeGeometry args={[0.062, 0.04]} />
              <meshStandardMaterial color="#9fb7c9" transparent opacity={0.28} roughness={0.1} side={THREE.DoubleSide} />
            </mesh>
            {/* Temple arm */}
            <Box size={[0.006, 0.01, 0.12]} position={[side * 0.05, 0.012, 0.06]} color={g} />
          </group>
        ))}
        <Box size={[0.02, 0.006, 0.008]} position={[0, 0.006, 0]} color={COLORS.glassesRim} metalness={0.7} roughness={0.3} />
      </group>
    </>
  );
}

/** Baggy pants and sneakers. Thighs rest on the seat, shins drop to the floor. */
function Legs() {
  return (
    <>
      <Box size={[0.36, 0.14, 0.2]} position={[0, 0.07, 0.03]} color={COLORS.pants} />
      {[-1, 1].map((side) => (
        <group key={side} position={[side * 0.105, 0, 0]}>
          <Box size={[0.165, 0.15, 0.44]} position={[0, 0.07, -0.2]} color={COLORS.pants} />
          <Box size={[0.155, 0.44, 0.165]} position={[0, -0.2, -0.345]} rotation={[-0.05, 0, 0]} color={COLORS.pants} />
          {/* Sneaker: white upper, dark sole */}
          <Box size={[0.11, 0.065, 0.25]} position={[0, -0.435, -0.37]} color={COLORS.shoe} />
          <Box size={[0.115, 0.025, 0.26]} position={[0, -0.485, -0.37]} color={COLORS.shoeSole} />
        </group>
      ))}
    </>
  );
}
