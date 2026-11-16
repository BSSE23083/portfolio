"use client";

import { useRef, type ReactNode } from "react";
import { useFrame, type ThreeElements, type ThreeEvent } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import { Select } from "@react-three/postprocessing";
import type * as THREE from "three";
import { BOUNCE } from "@/config/scene.config";
import { OBJECTS, type ObjectId } from "@/config/objects";
import { useRoom } from "../store";

type Props = Omit<ThreeElements["group"], "id"> & {
  id: ObjectId;
  /** Height of the hover label above the object's origin. */
  labelY?: number;
  /** Multiplies the hop height (1 = normal, 0 = no hop). */
  bounce?: number;
  /** Replaces the default "zoom to this object" click behavior. */
  onActivate?: () => void;
  children: ReactNode;
};

const ORDER = Object.keys(OBJECTS);

/**
 * Makes a 3D object clickable: a little hop every few seconds (so it reads as clickable),
 * outline + label on hover, pointer cursor, and a camera fly-to on click.
 */
export function Interactive({ id, labelY = 0.2, bounce = 1, onActivate, children, ...props }: Props) {
  const hovered = useRoom((s) => s.hovered === id);
  const focused = useRoom((s) => s.focus === id);
  const info = OBJECTS[id];
  const inner = useRef<THREE.Group>(null);
  const delay = (ORDER.indexOf(id) / ORDER.length) * BOUNCE.every; // objects hop one after another

  useFrame(({ clock }) => {
    if (!inner.current) return;
    const zoomedIn = useRoom.getState().focus !== null;
    const p = ((clock.elapsedTime + delay) % BOUNCE.every) / BOUNCE.duration;
    // two quick hops, the second smaller
    const hop = p < 1 && !zoomedIn ? Math.abs(Math.sin(p * Math.PI * 2)) * (1 - p) : 0;
    const scale = inner.current.parent ? inner.current.parent.scale.y || 1 : 1;
    inner.current.position.y = (hop * BOUNCE.height * bounce) / scale;
  });

  const over = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    useRoom.getState().setHovered(id);
    document.body.style.cursor = "pointer";
  };
  const out = () => {
    if (useRoom.getState().hovered === id) useRoom.getState().setHovered(null);
    document.body.style.cursor = "";
  };
  const click = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    if (e.delta > 6) return; // it was a drag, not a click
    if (onActivate) onActivate();
    else useRoom.getState().setFocus(id, "click");
  };

  return (
    <Select enabled={hovered}>
      <group {...props} onPointerOver={over} onPointerOut={out} onClick={click}>
        <group ref={inner}>{children}</group>
        {hovered && !focused && (
          <Html position={[0, labelY, 0]} center zIndexRange={[30, 0]} style={{ pointerEvents: "none" }}>
            <div className="room-label">
              <strong>{info.label}</strong>
              <span>{info.section}</span>
            </div>
          </Html>
        )}
      </group>
    </Select>
  );
}
