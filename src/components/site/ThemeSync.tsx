"use client";

import { useEffect, useRef } from "react";
import { useRoom } from "../store";

/** Keeps the theme in the store, the <html data-theme> attribute and localStorage in step. */
export function ThemeSync() {
  const theme = useRoom((s) => s.theme);
  const loaded = useRef(false);

  useEffect(() => {
    if (!loaded.current) {
      loaded.current = true;
      // First run: adopt the theme saved from a previous visit.
      if (document.documentElement.dataset.theme === "light") {
        useRoom.getState().setTheme("light");
        return;
      }
    }
    document.documentElement.dataset.theme = theme;
    try {
      localStorage.setItem("theme", theme);
    } catch {}
  }, [theme]);

  return null;
}
