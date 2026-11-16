"use client";

import { useEffect, useRef } from "react";
import { useRoom } from "../store";

/** Remembers the day / night choice (lamp cord) between visits. */
export function ThemeSync() {
  const theme = useRoom((s) => s.theme);
  const loaded = useRef(false);

  useEffect(() => {
    if (!loaded.current) {
      loaded.current = true;
      try {
        if (localStorage.getItem("theme") === "light") {
          useRoom.getState().setTheme("light");
          return;
        }
      } catch {}
    }
    document.documentElement.dataset.theme = theme;
    try {
      localStorage.setItem("theme", theme);
    } catch {}
  }, [theme]);

  return null;
}
