"use client";

import { Suspense, useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import * as THREE from "three";
import { CAMERA, type ThemeName } from "@/config/scene.config";
import { Scene } from "./Scene";

/** The 3D room. Dark (night) is the default; pulling the lamp cord toggles light mode. */
export default function RoomCanvas() {
  const [theme, setTheme] = useState<ThemeName>("dark");
  const [showSketch, setShowSketch] = useState(false);

  // Dev helper: press "S" to overlay the reference sketch and compare the framing.
  useEffect(() => {
    if (process.env.NODE_ENV !== "development") return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === "s" && !e.ctrlKey && !e.metaKey) setShowSketch((v) => !v);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div className="relative h-full w-full">
      <Canvas
        shadows={{ type: THREE.PCFSoftShadowMap }}
        dpr={[1, 1.75]}
        camera={{ fov: CAMERA.fov, near: 0.1, far: 30, position: CAMERA.overview.position }}
        gl={{ antialias: true, powerPreference: "high-performance" }}
      >
        <Suspense fallback={null}>
          <Scene theme={theme} onToggleTheme={() => setTheme((t) => (t === "dark" ? "light" : "dark"))} />
        </Suspense>
      </Canvas>

      {showSketch && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src="/dev/room-sketch.jpg"
          alt=""
          className="pointer-events-none absolute inset-0 h-full w-full object-contain opacity-40 mix-blend-difference"
        />
      )}
    </div>
  );
}
