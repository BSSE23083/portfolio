"use client";

import type { ReactNode } from "react";
import type { ThreeElements, ThreeEvent } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import { Select } from "@react-three/postprocessing";
import { OBJECTS, type ObjectId } from "@/config/objects";
import { useRoom } from "../store";

type Props = Omit<ThreeElements["group"], "id"> & {
  id: ObjectId;
  /** Height of the hover label above the object's origin. */
  labelY?: number;
  /** Replaces the default "zoom to this object" click behavior. */
  onActivate?: () => void;
  children: ReactNode;
};

/**
 * Makes a 3D object clickable: outline + label on hover, pointer cursor,
 * and a camera fly-to on click.
 */
export function Interactive({ id, labelY = 0.2, onActivate, children, ...props }: Props) {
  const hovered = useRoom((s) => s.hovered === id);
  const focused = useRoom((s) => s.focus === id);
  const info = OBJECTS[id];

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
        {children}
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
