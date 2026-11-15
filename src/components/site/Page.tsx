import type { ReactNode } from "react";
import { Footer } from "./Footer";
import { Img, type ImageName } from "./Img";

/** Standard page frame for the 2D pages: heading block, content, footer. */
export function Page({ kicker, title, intro, children }: { kicker: string; title: string; intro: string; children: ReactNode }) {
  return (
    <>
      <main className="mx-auto max-w-6xl px-4 pb-24 pt-28 md:px-6 md:pt-36">
        <header className="max-w-3xl">
          <p className="kicker">{kicker}</p>
          <h1 className="font-display mt-3 text-5xl leading-[1.05] md:text-7xl">{title}</h1>
          <p className="mt-6 text-lg leading-relaxed text-[var(--muted)]">{intro}</p>
        </header>
        {children}
      </main>
      <Footer />
    </>
  );
}

/** A titled block within a page. `id` lets links jump to it (for example /art#photography). */
export function Section({ id, title, text, children }: { id?: string; title: string; text?: string; children: ReactNode }) {
  return (
    <section id={id} className="mt-20 scroll-mt-24">
      <h2 className="font-display text-3xl md:text-4xl">{title}</h2>
      {text && <p className="mt-3 max-w-3xl leading-relaxed text-[var(--muted)]">{text}</p>}
      <div className="mt-8">{children}</div>
    </section>
  );
}

/** A project tile: image, title, short text and tags. Becomes a link when `href` is given. */
export function ProjectCard({ image, title, text, tags = [], href, note }: { image: ImageName; title: string; text: string; tags?: string[]; href?: string; note?: string }) {
  const body = (
    <>
      <Img name={image} />
      <div className="p-5">
        <h3 className="font-display text-2xl">{title}</h3>
        <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">{text}</p>
        {note && <p className="placeholder-note mt-3">{note}</p>}
        {tags.length > 0 && (
          <ul className="mt-4 flex flex-wrap gap-2">
            {tags.map((tag) => (
              <li key={tag} className="rounded-full border border-[var(--line)] px-2.5 py-0.5 text-xs text-[var(--muted)]">
                {tag}
              </li>
            ))}
          </ul>
        )}
        {href && <p className="mt-4 text-sm font-semibold text-[var(--accent)]">Read case study →</p>}
      </div>
    </>
  );
  return href ? (
    <a href={href} className="card">
      {body}
    </a>
  ) : (
    <article className="card">{body}</article>
  );
}

export function Gallery({ names, columns = 3 }: { names: ImageName[]; columns?: 2 | 3 }) {
  return (
    <div className={`grid gap-4 ${columns === 3 ? "sm:grid-cols-2 lg:grid-cols-3" : "sm:grid-cols-2"}`}>
      {names.map((name) => (
        <Img key={name} name={name} className="rounded-2xl border border-[var(--line)]" />
      ))}
    </div>
  );
}
