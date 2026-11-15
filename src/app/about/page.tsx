import type { Metadata } from "next";
import { Img } from "@/components/site/Img";
import { Page, Section } from "@/components/site/Page";
import { CONTACT } from "@/config/objects";

export const metadata: Metadata = { title: "About" };

const AWARDS = [
  { title: "1st position, GDG Code Rush ITU", year: "2026" },
  { title: "2nd position, SOFTEC UI/UX", year: "2026" },
];

// Roles and dates come from the old Figma portfolio. Please check the pairing is right.
const EXPERIENCE = [
  { role: "Teaching Assistant, Software Engineering & Software Requirement Engineering", place: "Information Technology University", dates: "Feb 2026 - Present" },
  { role: "Social Media Head", place: "ITU Media Club", dates: "Aug 2024 - Feb 2026" },
  { role: "Flutter App Dev Intern", place: "Granjur Technologies", dates: "July 2025 - Aug 2025" },
  { role: "Social Media Designer", place: "Homely Harbor", dates: "July 2024 - Dec 2024" },
  { role: "Lead Graphic Designer", place: "ITU Artist Society", dates: "Aug 2023 - Aug 2024" },
  { role: "Graphic Designer (freelance)", place: "Gourmet, Farmac, NodeLab", dates: "[PLACEHOLDER: dates]" },
];

const SKILLS = ["UI/UX design", "Visual design", "High-fidelity prototyping", "Wireframing", "User-centered design", "Requirement gathering", "Logo design", "Packaging design", "Color theory & grading", "Video editing", "Team collaboration"];
const TOOLS = ["Figma", "Photoshop", "Flutter & Dart", "C/C++", "Python"];
const LANGUAGES = ["English", "Urdu", "Punjabi"];

function Chips({ items }: { items: string[] }) {
  return (
    <ul className="flex flex-wrap gap-2">
      {items.map((item) => (
        <li key={item} className="rounded-full border border-[var(--line)] px-3 py-1 text-sm">
          {item}
        </li>
      ))}
    </ul>
  );
}

export default function AboutPage() {
  return (
    <Page
      kicker="About"
      title="Hello, I'm Abdul"
      intro="I'm a Bachelor's student in Software Engineering with a passion for UI/UX, programming, and visual design. I combine technical skills and creativity to craft functional, visually appealing, and user-friendly interfaces."
    >
      <div className="mt-14 grid gap-10 md:grid-cols-[18rem_1fr]">
        <Img name="about-portrait" className="rounded-3xl border border-[var(--line)]" />
        <div>
          <p className="max-w-2xl text-lg leading-relaxed text-[var(--muted)]">
            My experience spans Flutter development and UI design, allowing me to adapt from clean, minimalist layouts to vibrant
            visuals while keeping usability at the core. I&apos;m looking for product design and game UI/UX or level design roles.
          </p>
          <h2 className="kicker mt-10">Resume</h2>
          <div className="mt-3 flex flex-wrap gap-3">
            <a href="/resume/abdul-samad-sohail-product-design.pdf" className="site-button">
              Product design resume ↓
            </a>
            <a href="/resume/abdul-samad-sohail-game-design.pdf" className="site-button is-ghost">
              Game design resume ↓
            </a>
          </div>
          <p className="placeholder-note mt-3">PLACEHOLDER: add both PDFs to public/resume/</p>
        </div>
      </div>

      <Section title="Awards">
        <ul className="grid gap-4 sm:grid-cols-2">
          {AWARDS.map((award) => (
            <li key={award.title} className="card p-6">
              <p className="kicker">{award.year}</p>
              <p className="font-display mt-2 text-2xl">{award.title}</p>
            </li>
          ))}
        </ul>
      </Section>

      <Section title="Experience">
        <ul>
          {EXPERIENCE.map((job) => (
            <li key={job.role} className="grid gap-1 border-t border-[var(--line)] py-5 md:grid-cols-[14rem_1fr]">
              <p className="text-sm text-[var(--muted)]">{job.dates}</p>
              <div>
                <p className="text-lg">{job.role}</p>
                <p className="text-sm text-[var(--muted)]">{job.place}</p>
              </div>
            </li>
          ))}
        </ul>
      </Section>

      <Section title="Education">
        <div className="card p-6">
          <p className="kicker">2023 - 2027</p>
          <p className="font-display mt-2 text-2xl">BS Software Engineering</p>
          <p className="mt-1 text-[var(--muted)]">Information Technology University, Lahore</p>
        </div>
      </Section>

      <Section title="Skills & tools">
        <div className="space-y-6">
          <div>
            <h3 className="kicker mb-3">Skills</h3>
            <Chips items={SKILLS} />
          </div>
          <div>
            <h3 className="kicker mb-3">Tools</h3>
            <Chips items={TOOLS} />
          </div>
          <div>
            <h3 className="kicker mb-3">Languages</h3>
            <Chips items={LANGUAGES} />
          </div>
        </div>
      </Section>

      <Section id="contact" title="Contact" text="The quickest way to reach me is email.">
        <ul className="max-w-xl">
          {CONTACT.map((c) => (
            <li key={c.label} className="flex justify-between gap-4 border-t border-[var(--line)] py-4">
              <span className="text-[var(--muted)]">{c.label}</span>
              <a href={c.href} className="underline decoration-[var(--accent)] underline-offset-4 hover:text-[var(--accent)]">
                {c.value}
              </a>
            </li>
          ))}
        </ul>
      </Section>
    </Page>
  );
}
