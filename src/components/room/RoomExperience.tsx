"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Canvas } from "@react-three/fiber";
import { PerformanceMonitor } from "@react-three/drei";
import { CAMERA } from "@/config/scene.config";
import { CONTACT, OBJECTS, TOUR, type ObjectId } from "@/config/objects";
import { useRoom } from "../store";
import { Scene } from "./Scene";

/** Objects listed in the on-screen "Explore" menu (also the keyboard / screen reader route into the room). */
const MENU: ObjectId[] = ["monitor", "vr", "sketchbook", "camera", "books", "phone", "character"];

/**
 * The home page's 3D room.
 * Scrolling steps the camera through the tour (monitor, VR headset, sketchbook, camera);
 * after the last stop the page scrolls on into the normal 2D content.
 */
export default function RoomExperience() {
  const wrapper = useRef<HTMLDivElement>(null);
  const lockUntil = useRef(0);
  const lastIndex = useRef(0);
  const [ready, setReady] = useState(false);
  const [visible, setVisible] = useState(true);
  const [lite, setLite] = useState(false);
  const [touched, setTouched] = useState(false);
  const [showSketch, setShowSketch] = useState(false);

  const focus = useRoom((s) => s.focus);
  const focusSource = useRoom((s) => s.focusSource);
  const setFocus = useRoom((s) => s.setFocus);
  const setHovered = useRoom((s) => s.setHovered);
  const toggleTheme = useRoom((s) => s.toggleTheme);
  const theme = useRoom((s) => s.theme);

  // Lighter rendering on phones and touch devices.
  useEffect(() => {
    const param = new URLSearchParams(window.location.search).get("quality"); // ?quality=low or ?quality=high to force
    if (param) setLite(param === "low");
    else setLite(window.matchMedia("(pointer: coarse)").matches || window.innerWidth < 768);
  }, []);

  // Scroll position -> tour stop.
  useEffect(() => {
    const onScroll = () => {
      if (performance.now() < lockUntil.current) return;
      const index = Math.min(TOUR.length, Math.max(0, Math.round(window.scrollY / window.innerHeight)));
      if (index === lastIndex.current) return;
      lastIndex.current = index;
      setFocus(index === 0 ? null : TOUR[index - 1], "scroll");
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [setFocus]);

  // Click / keyboard selection -> keep the scroll position in step with the tour.
  useEffect(() => {
    if (focusSource !== "click") return;
    setTouched(true);
    const tourIndex = focus ? TOUR.indexOf(focus) + 1 : 0;
    if (focus && tourIndex === 0) return; // not a tour stop (phone, books, Abdul): stay where we are
    lastIndex.current = tourIndex;
    lockUntil.current = performance.now() + 1200;
    window.scrollTo({ top: tourIndex * window.innerHeight, behavior: "smooth" });
  }, [focus, focusSource]);

  // Stop rendering when the room is scrolled out of view.
  useEffect(() => {
    if (!wrapper.current) return;
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold: 0.01 });
    observer.observe(wrapper.current);
    return () => observer.disconnect();
  }, []);

  // Escape returns to the desk. In development, "S" overlays the reference sketch.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setFocus(null);
      if (process.env.NODE_ENV === "development" && e.key.toLowerCase() === "s" && !e.ctrlKey && !e.metaKey) {
        setShowSketch((v) => !v);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [setFocus]);

  const info = focus ? OBJECTS[focus] : null;

  return (
    <div ref={wrapper} style={{ height: `${(TOUR.length + 1) * 100}dvh` }} className="relative">
      <div className="sticky top-0 h-dvh w-full overflow-hidden">
        <Canvas
          shadows
          dpr={lite ? [1, 1.25] : [1, 1.5]}
          frameloop={visible ? "always" : "never"}
          camera={{ fov: CAMERA.fov, near: 0.1, far: 30, position: CAMERA.overview.position }}
          gl={{ antialias: lite, powerPreference: "high-performance" }}
          style={{ touchAction: "pan-y" }}
          onCreated={() => setReady(true)}
          onPointerMissed={() => setHovered(null)}
          aria-label="3D model of Abdul's desk. Use the Explore menu to visit each object."
          role="img"
        >
          <Suspense fallback={null}>
            {/* If the frame rate stays low, switch off the heavier effects automatically. */}
            <PerformanceMonitor bounds={() => [35, 200]} flipflops={1} onDecline={() => setLite(true)} />
            <Scene lite={lite} />
          </Suspense>
        </Canvas>

        {showSketch && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src="/dev/room-sketch.jpg" alt="" className="pointer-events-none absolute inset-0 h-full w-full object-contain opacity-40 mix-blend-difference" />
        )}

        {/* Loading screen */}
        <div
          aria-hidden={ready}
          className={`pointer-events-none absolute inset-0 z-30 grid place-items-center bg-[var(--bg)] transition-opacity duration-700 ${ready ? "opacity-0" : "opacity-100"}`}
        >
          <div className="text-center">
            <div className="mx-auto h-10 w-10 animate-pulse rounded-full bg-[var(--accent)] shadow-[0_0_40px_var(--accent)]" />
            <p className="mt-4 text-sm text-[var(--muted)]">Switching on the lamp…</p>
          </div>
        </div>

        {/* Intro (overview only) */}
        <div className={`pointer-events-none absolute left-5 top-20 max-w-[18rem] transition-opacity duration-500 md:left-10 md:top-24 md:max-w-sm ${focus ? "opacity-0" : "opacity-100"}`}>
          <p className="room-kicker">Abdul Samad Sohail</p>
          <h1 className="font-display mt-2 text-3xl leading-[1.08] text-[var(--room-text)] md:text-[2.75rem]">
            I design and build interactive experiences, from apps to games.
          </h1>
        </div>

        {/* First-load hint */}
        <div className={`pointer-events-none absolute inset-x-0 bottom-24 flex justify-center transition-opacity duration-700 md:bottom-8 ${focus || touched ? "opacity-0" : "opacity-100"}`}>
          <p className="room-chip">Click around my desk to explore · scroll for a tour</p>
        </div>

        {/* Back to desk */}
        {focus && (
          <button onClick={() => setFocus(null)} className="room-button absolute left-5 top-20 md:left-10 md:top-24">
            ← Back to desk
          </button>
        )}

        {/* Panel for the selected object */}
        {info && focus && (
          <div className="room-panel absolute inset-x-4 bottom-24 md:inset-x-auto md:bottom-10 md:left-10 md:w-[22rem]" role="dialog" aria-label={info.section}>
            <p className="room-kicker">{info.label}</p>
            <h2 className="font-display mt-1 text-2xl text-[var(--text)]">{info.section}</h2>
            <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">{info.blurb}</p>
            {focus === "phone" && (
              <ul className="mt-4 space-y-2 text-sm">
                {CONTACT.map((c) => (
                  <li key={c.label} className="flex justify-between gap-4 border-t border-[var(--line)] pt-2">
                    <span className="text-[var(--muted)]">{c.label}</span>
                    <a href={c.href} className="text-[var(--text)] underline decoration-[var(--accent)] underline-offset-4 hover:text-[var(--accent)]">
                      {c.value}
                    </a>
                  </li>
                ))}
              </ul>
            )}
            {info.href && (
              <Link href={info.href} className="site-button mt-5">
                Enter {info.section} →
              </Link>
            )}
          </div>
        )}

        {/* Explore menu: every object, reachable by keyboard and large enough to tap */}
        <nav aria-label="Explore the desk" className="absolute inset-x-0 bottom-4 z-10 flex gap-2 overflow-x-auto px-4 md:inset-x-auto md:bottom-auto md:right-6 md:top-1/2 md:-translate-y-1/2 md:flex-col md:overflow-visible md:px-0">
          {MENU.map((id) => (
            <button
              key={id}
              onClick={() => setFocus(focus === id ? null : id)}
              onFocus={() => setHovered(id)}
              onBlur={() => setHovered(null)}
              onMouseEnter={() => setHovered(id)}
              onMouseLeave={() => setHovered(null)}
              aria-pressed={focus === id}
              aria-label={`${OBJECTS[id].label}: ${OBJECTS[id].section}`}
              className={`room-menu-item ${focus === id ? "is-active" : ""}`}
            >
              <span className="room-menu-dot" />
              <span className="room-menu-text">{OBJECTS[id].section}</span>
            </button>
          ))}
          <button onClick={toggleTheme} aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode (lamp pull cord)`} className="room-menu-item">
            <span className="room-menu-dot" />
            <span className="room-menu-text">{theme === "dark" ? "Day mode" : "Night mode"}</span>
          </button>
        </nav>
      </div>
    </div>
  );
}
