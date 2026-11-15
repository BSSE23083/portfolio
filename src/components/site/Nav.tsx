"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRoom } from "../store";

const LINKS = [
  { href: "/product", label: "Product" },
  { href: "/games", label: "Games" },
  { href: "/brand", label: "Brand" },
  { href: "/art", label: "Art" },
  { href: "/about", label: "About" },
];

/** Always-visible navigation, so nobody has to use the 3D room to get around. */
export function Nav() {
  const pathname = usePathname();
  const theme = useRoom((s) => s.theme);
  const toggleTheme = useRoom((s) => s.toggleTheme);
  const home = pathname === "/";

  return (
    <header className="fixed inset-x-0 top-0 z-40 border-b border-[var(--line)] bg-[var(--glass)] backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-6xl items-center gap-3 px-4 md:px-6">
        <Link href="/" className="font-display mr-auto text-lg text-[var(--text)]" aria-label="Abdul Samad Sohail, home">
          Abdul<span className="text-[var(--accent)]">.</span>
        </Link>
        <nav aria-label="Main" className="flex items-center gap-0.5 overflow-x-auto text-sm">
          {LINKS.map((link) => {
            const active = pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={active ? "page" : undefined}
                className={`rounded-full px-2.5 py-1.5 transition-colors hover:text-[var(--accent)] md:px-3 ${active ? "text-[var(--accent)]" : "text-[var(--text)]"}`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
        {home && (
          <a href="#portfolio" className="hidden rounded-full border border-[var(--line)] px-3 py-1.5 text-sm text-[var(--text)] hover:border-[var(--accent)] sm:block">
            Skip to portfolio ↓
          </a>
        )}
        <button
          onClick={toggleTheme}
          aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
          className="grid h-9 w-9 shrink-0 cursor-pointer place-items-center rounded-full border border-[var(--line)] text-[var(--text)] hover:border-[var(--accent)]"
        >
          <span aria-hidden>{theme === "dark" ? "☀" : "☾"}</span>
        </button>
      </div>
    </header>
  );
}
