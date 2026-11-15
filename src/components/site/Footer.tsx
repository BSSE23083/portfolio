import { CONTACT } from "@/config/objects";

export function Footer() {
  return (
    <footer className="relative z-10 border-t border-[var(--line)] bg-[var(--bg)] px-4 py-10 md:px-6">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 text-sm text-[var(--muted)] md:flex-row md:items-center md:justify-between">
        <p>© 2026 Abdul Samad Sohail. Designed and built in Lahore.</p>
        <ul className="flex flex-wrap gap-x-5 gap-y-2">
          {CONTACT.filter((c) => c.href !== "#").map((c) => (
            <li key={c.label}>
              <a href={c.href} className="hover:text-[var(--accent)]">
                {c.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </footer>
  );
}
