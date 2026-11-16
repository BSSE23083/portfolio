"use client";

import { Suspense, useCallback, useEffect, useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { PerformanceMonitor } from "@react-three/drei";
import { CAMERA } from "@/config/scene.config";
import { OBJECTS, TOUR, type ObjectId } from "@/config/objects";
import { ABOUT } from "@/content/about";
import { useRoom } from "../store";
import { AboutLeft, AboutRight, ContactList, SCREENS } from "../screens/Screens";
import { Window } from "../screens/Window";
import { Scene } from "./Scene";

/** Objects listed in the on-screen "Explore" menu (also the keyboard / screen reader route into the room). */
const MENU: ObjectId[] = ["monitor", "vr", "sketchbook", "camera", "books", "phone", "character"];

/**
 * The home page: only the 3D room.
 *  - Click an object (or a navbar button): the camera flies to it, waits a second, then its screen pops up from below.
 *  - Scroll: steps the camera through the tour (monitor, VR headset, sketchbook, camera) without opening screens.
 */
export default function RoomExperience() {
  const [ready, setReady] = useState(false);
  const [lite, setLite] = useState(false);
  const [touched, setTouched] = useState(false);
  const [screenOpen, setScreenOpen] = useState(false);
  const [shown, setShown] = useState<ObjectId | null>(null); // keeps a screen's content while it slides away
  const [showSketch, setShowSketch] = useState(false);
  const [paused, setPaused] = useState(false);
  const [still, setStill] = useState(false); // true when the device cannot run the 3D room
  const [page, setPage] = useState(0); // which page of a multi-page screen (the books) is showing
  const screenOpenRef = useRef(false);

  const focus = useRoom((s) => s.focus);
  const focusSource = useRoom((s) => s.focusSource);
  const setFocus = useRoom((s) => s.setFocus);
  const setHovered = useRoom((s) => s.setHovered);
  const toggleTheme = useRoom((s) => s.toggleTheme);
  const theme = useRoom((s) => s.theme);

  // Lighter rendering on phones and touch devices. ?quality=low or ?quality=high forces it.
  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    // No WebGL (or ?still=1 to preview): show a still picture of the room instead. Every screen still opens.
    const probe = document.createElement("canvas");
    if (query.has("still") || !(probe.getContext("webgl2") || probe.getContext("webgl"))) {
      setStill(true);
      setReady(true);
    }
    const param = query.get("quality");
    if (param) setLite(param === "low");
    else setLite(window.matchMedia("(pointer: coarse)").matches || window.innerWidth < 768);
  }, []);

  // After a click: camera flies in, pauses on the object, then the screen pops up.
  useEffect(() => {
    setScreenOpen(false);
    if (!focus) return;
    setTouched(true);
    setShown(focus);
    setPage(0);
    if (focusSource !== "click" || !OBJECTS[focus].screen) return;
    const wait = (CAMERA.flyDuration + CAMERA.screenDelay) * 1000;
    const timer = setTimeout(() => setScreenOpen(true), wait);
    return () => clearTimeout(timer);
  }, [focus, focusSource]);

  useEffect(() => {
    screenOpenRef.current = screenOpen;
  }, [screenOpen]);

  // Once a screen fully covers the room, stop drawing the 3D scene behind it (keeps scrolling smooth).
  const covers = screenOpen && shown !== "character" && shown !== "phone";
  useEffect(() => {
    if (!covers) {
      setPaused(false);
      return;
    }
    const timer = setTimeout(() => setPaused(true), 700);
    return () => clearTimeout(timer);
  }, [covers]);

  // Scroll / swipe = guided tour through the desk.
  const step = useCallback(
    (direction: 1 | -1) => {
      const current = useRoom.getState().focus;
      const index = current ? TOUR.indexOf(current) + 1 : 0; // 0 = overview
      let next = index + direction;
      if (next > TOUR.length) next = 0; // past the last stop: back to the desk
      if (next < 0) return; // already at the desk
      setFocus(next === 0 ? null : TOUR[next - 1], "scroll");
    },
    [setFocus],
  );

  useEffect(() => {
    let cooldown = 0;
    let touchY: number | null = null;
    const insideWindow = (target: EventTarget | null) => target instanceof Element && target.closest("[data-scroll]");

    const onWheel = (e: WheelEvent) => {
      if (screenOpenRef.current || insideWindow(e.target)) return;
      if (Math.abs(e.deltaY) < 10 || performance.now() < cooldown) return;
      cooldown = performance.now() + 1100;
      step(e.deltaY > 0 ? 1 : -1);
    };
    const onTouchStart = (e: TouchEvent) => {
      touchY = screenOpenRef.current || insideWindow(e.target) ? null : e.touches[0].clientY;
    };
    const onTouchEnd = (e: TouchEvent) => {
      if (touchY === null) return;
      const dy = touchY - e.changedTouches[0].clientY;
      if (Math.abs(dy) > 60) step(dy > 0 ? 1 : -1);
      touchY = null;
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setFocus(null);
      if (process.env.NODE_ENV === "development" && e.key.toLowerCase() === "s" && !e.ctrlKey && !e.metaKey) {
        setShowSketch((v) => !v);
      }
      // Development only: "P" saves the current view as public/room-still.jpg (the fallback picture).
      if (process.env.NODE_ENV === "development" && e.key.toLowerCase() === "p" && !e.ctrlKey && !e.metaKey) {
        window.dispatchEvent(new Event("capture-still")); // handled by <DevStillCapture /> in Scene.tsx
      }
    };
    window.addEventListener("wheel", onWheel, { passive: true });
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchend", onTouchEnd, { passive: true });
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchend", onTouchEnd);
      window.removeEventListener("keydown", onKey);
    };
  }, [step, setFocus]);

  const close = () => setFocus(null);
  const shownInfo = shown ? OBJECTS[shown] : null;
  const shownScreen = shownInfo?.screen ? SCREENS[shownInfo.screen] : null;
  const shownPage = shownScreen ? shownScreen.pages[Math.min(page, shownScreen.pages.length - 1)] : null;
  const isAbout = shown === "character";
  const isContact = shown === "phone";
  const touring = focus !== null && focusSource === "scroll";
  const frameless = Boolean(shownScreen?.frameless);

  return (
    <div className="fixed inset-0 overflow-hidden">
      {still ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src="/room-still.jpg" alt="Abdul at his desk under a warm lamp" className="absolute inset-0 h-full w-full object-cover object-[62%_center]" />
      ) : (
      <Canvas
        shadows
        dpr={lite ? [1, 1.25] : [1, 1.5]}
        frameloop={paused ? "never" : "always"}
        camera={{ fov: CAMERA.fov, near: 0.1, far: 30, position: CAMERA.overview.position }}
        gl={{ antialias: lite, powerPreference: "high-performance" }}
        style={{ touchAction: "none" }}
        onCreated={() => setReady(true)}
        onPointerMissed={() => setHovered(null)}
        aria-label="3D model of Abdul's desk. Use the navigation or the Explore menu to visit each object."
        role="img"
      >
        <Suspense fallback={null}>
          {/* If the frame rate stays low, switch off the heavier effects automatically. */}
          <PerformanceMonitor bounds={() => [35, 200]} flipflops={1} onDecline={() => setLite(true)} />
          <Scene lite={lite} />
        </Suspense>
      </Canvas>
      )}

      {showSketch && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src="/dev/room-sketch.jpg" alt="" className="pointer-events-none absolute inset-0 h-full w-full object-contain opacity-40 mix-blend-difference" />
      )}

      {/* Home text with a dark gradient behind it (overview only) */}
      <div className={`pointer-events-none absolute inset-0 transition-opacity duration-700 ${focus ? "opacity-0" : "opacity-100"}`}>
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(6,7,12,0.92)_0%,rgba(6,7,12,0.7)_26%,rgba(6,7,12,0)_46%)] md:bg-[linear-gradient(105deg,rgba(6,7,12,0.92)_0%,rgba(6,7,12,0.72)_26%,rgba(6,7,12,0)_58%)]" />
        {/* Phones: in the clear space above the desk. Wide screens: left, just below the middle. */}
        <div className="absolute left-6 top-[21%] -translate-y-1/2 md:left-16 md:top-[54%]">
          <h1 className="font-heading text-[clamp(3.25rem,6.6vw,6rem)] leading-none text-[var(--cream)]">Hello</h1>
          <p className="mt-1 text-[clamp(1.1rem,2.1vw,1.9rem)] leading-tight text-[var(--cream)] md:mt-2">I&apos;m Abdul Samad</p>
        </div>
      </div>

      {/* Loading: logo fading in and out */}
      <div
        aria-hidden={ready}
        className={`pointer-events-none absolute inset-0 z-50 grid place-items-center bg-[var(--night)] transition-opacity duration-700 ${ready ? "opacity-0" : "opacity-100"}`}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/logo-cream.png" alt="Loading" className="loader-logo h-28 w-auto" />
      </div>

      {/* First-load hint */}
      <div className={`pointer-events-none absolute inset-x-0 bottom-24 flex justify-center transition-opacity duration-700 md:bottom-8 ${focus || touched || !ready ? "opacity-0" : "opacity-100"}`}>
        <p className="room-chip">
          <span className="hidden md:inline">Click around my desk to explore · scroll for a tour</span>
          <span className="md:hidden">Tap around my desk · swipe for a tour</span>
        </p>
      </div>

      {/* While touring by scroll: name of the stop and a button to open its screen */}
      {touring && focus && !screenOpen && (
        <div className="absolute inset-x-0 bottom-24 z-10 flex justify-center gap-2 md:bottom-8">
          <button onClick={close} className="room-chip">
            ← desk
          </button>
          <button onClick={() => setScreenOpen(true)} className="room-chip">
            <span className="font-heading text-xs">{OBJECTS[focus].section}</span> · open
          </button>
        </div>
      )}

      {/* About: heading above him, text either side (wide screens) */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 top-24 z-20 hidden lg:block">
        <h2 className={`rise font-heading absolute inset-x-0 top-2 text-center text-4xl text-[var(--cream)] [text-shadow:0_3px_0_#111] ${screenOpen && isAbout ? "is-open" : ""}`}>
          {ABOUT.heading}
        </h2>
        <div className={`rise absolute bottom-6 left-6 top-20 w-[30vw] max-w-[27rem] ${screenOpen && isAbout ? "is-open" : ""}`}>
          <Window file="about.exe" onClose={close} className="max-h-full">
            <AboutLeft />
          </Window>
        </div>
        <div className={`rise absolute bottom-6 right-6 top-20 w-[30vw] max-w-[27rem] ${screenOpen && isAbout ? "is-open" : ""}`}>
          <Window file="experience.exe" onClose={close} className="max-h-full">
            <AboutRight />
          </Window>
        </div>
      </div>

      {/* Contact: a small card beside the phone */}
      <div className={`rise absolute inset-x-4 bottom-24 z-20 md:inset-x-auto md:bottom-12 md:right-[8vw] md:w-[26rem] ${screenOpen && isContact ? "is-open" : ""}`}>
        <Window file="contact.exe" onClose={close}>
          <h2 className="h-screen-title mb-4">Contact</h2>
          <ContactList />
        </Window>
      </div>

      {/* Every other screen pops up from below (About too, on small screens) */}
      <div
        className={`sheet ${frameless ? "is-full" : ""} ${isAbout ? "lg:hidden" : ""} ${screenOpen && !isContact ? "is-open" : ""}`}
        role="dialog"
        aria-label={shownInfo?.section}
        aria-hidden={!screenOpen}
      >
        {frameless && shownScreen ? (
          <>
            {/* No window frame: the work on a black screen, a back button, and page buttons floating at the bottom */}
            <div key={page} data-scroll className="fullscreen">
              {shownPage?.render()}
            </div>
            <button onClick={close} className="float-button float-back">
              ← back
            </button>
            {shownScreen.pages.length > 1 && (
              <div className="float-pages" role="tablist" aria-label="Pages">
                {shownScreen.pages.map((p, i) => (
                  <button key={p.label} role="tab" aria-selected={i === page} onClick={() => setPage(i)} className={`float-button ${i === page ? "is-active" : ""}`}>
                    {p.label}
                  </button>
                ))}
              </div>
            )}
          </>
        ) : (
          <Window file={shownInfo?.file ?? ""} onClose={close} flush tone={shownPage?.tone}>
            {shownPage && !isContact && shownPage.render()}
          </Window>
        )}
      </div>

      {/* Explore menu: every object, reachable by keyboard and large enough to tap */}
      <nav
        aria-label="Explore the desk"
        className={`absolute inset-x-0 bottom-4 z-10 flex gap-2 overflow-x-auto px-4 transition-opacity md:inset-x-auto md:bottom-auto md:right-5 md:top-1/2 md:-translate-y-1/2 md:flex-col md:overflow-visible md:px-0 ${screenOpen ? "pointer-events-none opacity-0" : ""}`}
      >
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
        <button onClick={toggleTheme} aria-label={`Switch to ${theme === "dark" ? "day" : "night"} (lamp pull cord)`} className="room-menu-item">
          <span className="room-menu-dot" />
          <span className="room-menu-text">{theme === "dark" ? "Day mode" : "Night mode"}</span>
        </button>
      </nav>
    </div>
  );
}
