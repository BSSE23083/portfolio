"use client";

import type { ObjectId } from "@/config/objects";
import { useRoom } from "../store";

/** Each button moves the camera to an object in the room. */
const BUTTONS: { label: string; target: ObjectId }[] = [
  { label: "about", target: "character" },
  { label: "work", target: "monitor" },
  { label: "contact", target: "phone" },
];

export function Nav() {
  const focus = useRoom((s) => s.focus);
  const setFocus = useRoom((s) => s.setFocus);

  return (
    <header className="pointer-events-none fixed inset-x-0 top-3 z-40 px-3 md:top-4 md:px-6">
      <div className="navbar pointer-events-auto mx-auto flex h-14 max-w-5xl items-center gap-2 px-4 md:h-16 md:px-7">
        <button onClick={() => setFocus(null)} aria-label="Back to the desk (home)" className="shrink-0 cursor-pointer">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo-navy.png" alt="Abdul Samad Sohail logo" className="h-8 w-auto md:h-10" />
        </button>

        <nav aria-label="Main" className="mx-auto flex items-center gap-2 md:gap-3">
          {BUTTONS.map((button) => (
            <button
              key={button.label}
              onClick={() => setFocus(button.target)}
              aria-current={focus === button.target ? "true" : undefined}
              className={`nav-button max-md:!min-w-0 max-md:!px-3 ${focus === button.target ? "is-active" : ""}`}
            >
              {button.label}
            </button>
          ))}
        </nav>

        {/* "Portfolio" in Birds of Paradise (rasterized: see scripts/prepare-assets.py) */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/wordmark-portfolio.png" alt="Portfolio" className="hidden h-9 w-auto shrink-0 sm:block md:h-11" />
      </div>
    </header>
  );
}
