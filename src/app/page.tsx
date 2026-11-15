import Link from "next/link";
import RoomExperience from "@/components/room/RoomExperience";
import { Footer } from "@/components/site/Footer";

const SECTIONS = [
  { href: "/product", title: "Product Design", text: "Case studies for apps and products: research, flows and final UI.", object: "Monitor" },
  { href: "/games", title: "Game Design", text: "VR Podium (final-year project), game UI and level design.", object: "VR headset" },
  { href: "/brand", title: "Visual & Brand", text: "Logos, packaging, branding and social media design.", object: "Books" },
  { href: "/art", title: "Art & Photography", text: "Sketches, oil paintings, photography and video.", object: "Sketchbook & camera" },
  { href: "/about", title: "About", text: "Bio, awards, experience, resumes and contact.", object: "Abdul" },
];

export default function Home() {
  return (
    <main>
      <RoomExperience />

      {/* Normal 2D content: the room tour scrolls into this */}
      <section id="portfolio" className="relative z-10 scroll-mt-14 bg-[var(--bg)] px-4 py-24 md:px-6">
        <div className="mx-auto max-w-6xl">
          <p className="kicker">Portfolio</p>
          <h2 className="font-display mt-3 max-w-3xl text-4xl leading-[1.08] md:text-6xl">
            I design and build interactive experiences, from apps to games.
          </h2>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-[var(--muted)]">
            I&apos;m Abdul Samad Sohail, a final-year Software Engineering student at ITU Lahore and an award-winning UI/UX
            designer. I work across product design, game UI/UX and level design, with photography, branding and art on the
            side.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/product" className="site-button">
              See product work →
            </Link>
            <Link href="/about" className="site-button is-ghost">
              About me &amp; resume
            </Link>
          </div>

          <div className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {SECTIONS.map((s) => (
              <Link key={s.href} href={s.href} className="card p-6">
                <p className="kicker">{s.object}</p>
                <h3 className="font-display mt-3 text-2xl">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">{s.text}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
