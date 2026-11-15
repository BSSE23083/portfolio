"use client";

import { create } from "zustand";
import type { ObjectId } from "@/config/objects";
import type { ThemeName } from "@/config/scene.config";

type RoomState = {
  /** "dark" (night, lamp on) is the default. Shared by the 3D room and the 2D pages. */
  theme: ThemeName;
  setTheme: (theme: ThemeName) => void;
  toggleTheme: () => void;

  /** Object the camera is zoomed in on (null = overview). */
  focus: ObjectId | null;
  /** Whether the focus came from scrolling (the tour) or from a click / key press. */
  focusSource: "scroll" | "click";
  setFocus: (focus: ObjectId | null, source?: "scroll" | "click") => void;

  /** Object under the cursor or keyboard focus. */
  hovered: ObjectId | null;
  setHovered: (hovered: ObjectId | null) => void;
};

export const useRoom = create<RoomState>((set) => ({
  theme: "dark",
  setTheme: (theme) => set({ theme }),
  toggleTheme: () => set((s) => ({ theme: s.theme === "dark" ? "light" : "dark" })),

  focus: null,
  focusSource: "click",
  setFocus: (focus, source = "click") => set({ focus, focusSource: source }),

  hovered: null,
  setHovered: (hovered) => set({ hovered }),
}));
