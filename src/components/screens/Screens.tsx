import type { ReactNode } from "react";
import type { ScreenId } from "@/config/objects";
import { ABOUT, CONTACT } from "@/content/about";

/**
 * The content of each pop-up screen. Images live in public/images
 * (made from content/images-everythingelse by scripts/prepare-assets.py).
 */

function Shot({ name, alt, className = "" }: { name: string; alt: string; className?: string }) {
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={`/images/${name}.webp`} alt={alt} loading="lazy" className={`shot ${className}`} />;
}

/** A clearly marked gap where content is still to come. */
function Slot({ label, ratio = "16 / 9" }: { label: string; ratio?: string }) {
  return (
    <div className="slot" style={{ aspectRatio: ratio }}>
      <span>
        PLACEHOLDER
        <br />
        {label}
      </span>
    </div>
  );
}

function Block({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="mt-12 first:mt-0">
      <h3 className="h-section">{title}</h3>
      {children}
    </section>
  );
}

/* ---------- Monitor: user interface ---------- */

const RISHTAY_SCREENS = [
  ["rishtay-signup", "Sign up"],
  ["rishtay-email", "Enter email"],
  ["rishtay-email-code", "Email code"],
  ["rishtay-welcome", "Welcome and house rules"],
  ["rishtay-about-you", "Tell us about yourself"],
  ["rishtay-interests", "Pick your interests"],
  ["rishtay-photo-empty", "Add a profile picture"],
  ["rishtay-photo", "Profile picture added"],
  ["rishtay-privacy", "Privacy settings"],
  ["rishtay-ready", "Ready to search"],
  ["rishtay-home", "Home: suggested profiles"],
  ["rishtay-profile", "Profile and compatibility"],
];

function WorkScreen() {
  return (
    <>
      <p className="text-dim text-sm">user interface</p>
      <h2 className="h-screen-title mt-1">Rishtay</h2>
      <div className="mt-6 grid items-center gap-8 md:grid-cols-[1fr_1.1fr]">
        <div>
          <Shot name="rishtay-logo" alt="Rishtay logo" className="!w-40" />
          <p className="text-body mt-5">
            [PLACEHOLDER: two or three sentences about Rishtay. What the app does, who it is for, and your role in designing
            it.]
          </p>
          <div className="mt-5 flex flex-wrap items-center gap-3">
            <Shot name="rishtay-button-default" alt="Button, default state" className="!w-32" />
            <Shot name="rishtay-button-pressed" alt="Button, pressed state" className="!w-36" />
            <Shot name="rishtay-button-disabled" alt="Button, disabled state" className="!w-36" />
          </div>
        </div>
        <Shot name="rishtay-mockup" alt="Rishtay app shown on a phone" />
      </div>

      <Block title="Screens">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
          {RISHTAY_SCREENS.map(([name, alt]) => (
            <Shot key={name} name={name} alt={`Rishtay screen: ${alt}`} />
          ))}
        </div>
      </Block>

      <Block title="More case studies">
        <div className="grid gap-4 md:grid-cols-2">
          <Slot label="SOFTEC UI/UX 2026 entry (2nd position): cover image and write-up" />
          <Slot label="GDG Code Rush ITU 2026 entry (1st position): cover image and write-up" />
        </div>
      </Block>
    </>
  );
}

/* ---------- VR headset: games ---------- */

function GamesScreen() {
  return (
    <>
      <p className="text-dim text-sm">game design</p>
      <h2 className="h-screen-title mt-1">VR Podium</h2>
      <p className="text-body mt-4 max-w-3xl">
        Final-year project. [PLACEHOLDER: what VR Podium is, who it is for, your role, the engine and the headset.]
      </p>
      <div className="mt-6">
        <Slot label="VR Podium: hero screenshot or video" ratio="21 / 9" />
      </div>
      <Block title="More game work">
        <div className="grid gap-4 md:grid-cols-2">
          <Slot label="Game UI redesign: before and after" />
          <Slot label="Level design breakdown: map and player flow" />
        </div>
      </Block>
    </>
  );
}

/* ---------- Sketchbook: mixed media + illustrations ---------- */

const ILLUSTRATIONS = [
  ["illustration-venom", "Venom illustration"],
  ["illustration-mehran", "Mehran dashboard illustration"],
  ["illustration-civic", "Honda Civic illustration"],
  ["illustration-r34", "Skyline R34 illustration"],
  ["illustration-portrait", "Vector portrait illustration"],
  ["illustration-danny-zee", "Danny Zee poster illustration"],
];

function ArtScreen() {
  return (
    <>
      <h2 className="h-screen-title">Mixed Media</h2>

      <div className="mt-8 grid items-center gap-8 md:grid-cols-2">
        <p className="text-body">
          My pencil sketches are where I explore the fundamentals of light, shadow, and anatomy. It&apos;s my space for slow,
          intentional observation mapping out the wireframes of the physical world before they ever transition into a digital
          canvas.
        </p>
        <div className="grid grid-cols-2 items-center gap-4">
          <Shot name="art-pencil-portraits" alt="Sketchbook with pencil portraits" />
          <Shot name="art-pencil-studies" alt="Sketchbook with pencil studies of a skull, an ear and an eye" />
        </div>
      </div>

      <div className="mt-12 grid items-center gap-8 md:grid-cols-2">
        <Shot name="art-pen" alt="Sketchbook with pen sketches of hands, a car and a camera" className="md:order-none" />
        <p className="text-body">
          These are my pen sketches born at random moments, in the margins of notebooks or on the backs of receipts. Using pen
          and ink forces a certain level of confidence there is no undo button. I love the raw, unedited energy of capturing a
          face or a scene in a few rapid strokes, wherever inspiration happens to strike.
        </p>
      </div>

      <div className="mt-12 grid items-center gap-8 md:grid-cols-2">
        <p className="text-body">
          If sketching is the logic, oil painting is the atmosphere. I&apos;m drawn to the slow, meditative process of layering
          pigments and building texture over time. It allows me to step away from the pixel-perfect world and engage with the
          organic complexity of color and rendering in its most physical, vibrant form.
        </p>
        <div className="grid grid-cols-[1.6fr_1fr] items-center gap-4">
          <Shot name="art-oil-dragons" alt="Oil paintings of dragons, taped to the page" />
          <Shot name="art-oil-ocean" alt="Oil painting of the ocean, taped to the page" />
        </div>
      </div>

      <Block title="Illustrations">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
          {ILLUSTRATIONS.map(([name, alt]) => (
            <Shot key={name} name={name} alt={alt} />
          ))}
        </div>
      </Block>
    </>
  );
}

/* ---------- Camera: photography ---------- */

function PhotoScreen() {
  return (
    <>
      <p className="text-dim text-sm">photography &amp; video</p>
      <h2 className="h-screen-title mt-1">Photos</h2>
      <p className="text-body mt-4 max-w-3xl">[PLACEHOLDER: one or two lines about what you like to shoot and your camera.]</p>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3, 4, 5, 6].map((n) => (
          <Slot key={n} label={`Photograph ${n}`} ratio="3 / 2" />
        ))}
      </div>
      <Block title="Video reel">
        <Slot label="Video reel: send a YouTube or Vimeo link" />
      </Block>
    </>
  );
}

/* ---------- Books: logos, packaging, social, generative AI ---------- */

const LOGOS = [
  ["logo-abdul", "Abdul's personal logo"],
  ["logo-slice", "Slice logo"],
  ["logo-bonappetit", "Bonappetit logo"],
  ["logo-fleur", "Fleur logo"],
  ["logo-sunny-villa", "Sunny Villa logo"],
];
const GOURMET = [
  ["gourmet-claudia-chair", "Claudia chair"],
  ["gourmet-luna-chair", "Luna chair"],
  ["gourmet-nexa-chair", "Nexa chair"],
  ["gourmet-cove-dining", "Cove dining"],
  ["gourmet-claudia-bed", "Claudia bed set"],
  ["gourmet-aura", "Aura dining table"],
  ["gourmet-axis", "Axis center table set"],
  ["gourmet-doors", "Doors"],
  ["gourmet-14-august", "14 August, Independence Day"],
];
const GEN_AI = [
  "genai-cove-1",
  "genai-living-room",
  "genai-library",
  "genai-maison-bed",
  "genai-arch-dining",
  "genai-axis-table",
  "genai-door-garden",
  "genai-doors",
  "genai-round-tables",
  "genai-desk",
  "genai-trolley",
  "genai-cove-2",
  "genai-trolley-model",
];

function BrandScreen() {
  return (
    <>
      <p className="text-dim text-sm">design</p>
      <h2 className="h-screen-title mt-1">Logofolio</h2>
      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {LOGOS.map(([name, alt]) => (
          <div key={name} className="grid aspect-square place-items-center rounded-xl bg-[var(--navy)] p-6">
            <Shot name={name} alt={alt} className="!w-auto max-h-full max-w-full !rounded-none" />
          </div>
        ))}
      </div>

      <Block title="Packaging: Fleur">
        <div className="mx-auto max-w-2xl">
          <Shot name="fleur-packaging" alt="Fleur packaging design: logo, patterns, boxes and mockups" className="frame" />
        </div>
      </Block>

      <Block title="Social: Gourmet Furnishers">
        <p className="text-body mb-5 max-w-3xl">
          For Gourmet Furnishers, I developed social media content that translated their furniture collections into cohesive,
          visually engaging posts. Using Figma and Photoshop, I structured layouts, refined product visuals, and maintained a
          consistent visual direction across their social media presence.
        </p>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
          {GOURMET.map(([name, alt]) => (
            <Shot key={name} name={name} alt={`Gourmet Furnishers social post: ${alt}`} />
          ))}
        </div>
      </Block>

      <Block title="Social: ITU Media Club">
        <p className="text-body mb-5 max-w-3xl">
          As the Social Media Head at ITU Media Club, I architect the club&apos;s digital identity. I use Figma for structured
          layouts and Photoshop for high-fidelity asset manipulation, transforming campus events into cohesive, high-engagement
          visual campaigns.
        </p>
        <div className="grid items-center gap-4 md:grid-cols-[1.3fr_1fr]">
          <div className="grid gap-4">
            <Shot name="imc-mockup" alt="ITU Media Club posts shown on a phone" />
            <Shot name="imc-team" alt="ITU Media Club team and event covers" />
          </div>
          <Shot name="imc-laptop" alt="ITU Media Club design file open on a laptop" />
        </div>
      </Block>

      <Block title="Generative AI">
        <p className="text-body mb-5 max-w-3xl">
          Product and interior visuals made with generative AI. [PLACEHOLDER: one or two lines on how you use AI in your
          workflow and which tools.]
        </p>
        <div className="columns-2 gap-4 md:columns-3 [&>*]:mb-4">
          {GEN_AI.map((name) => (
            <Shot key={name} name={name} alt="AI-generated furniture and interior visual" />
          ))}
        </div>
      </Block>
    </>
  );
}

/* ---------- Character: about (two halves, shown either side of him on wide screens) ---------- */

export function AboutLeft() {
  return (
    <>
      <p className="text-body">{ABOUT.bio}</p>
      <Block title="Education">
        <p className="text-body">
          <strong>{ABOUT.education.school}</strong>
          <br />
          {ABOUT.education.degree}
        </p>
      </Block>
      <Block title="Tools/Frameworks">
        <p className="text-dim mb-1.5 text-xs">Design</p>
        <div className="flex flex-wrap gap-1.5">
          {ABOUT.tools.design.map((tool) => (
            <span key={tool} className="chip">
              {tool}
            </span>
          ))}
        </div>
        <p className="text-dim mb-1.5 mt-3 text-xs">Dev</p>
        <div className="flex flex-wrap gap-1.5">
          {ABOUT.tools.dev.map((tool) => (
            <span key={tool} className="chip">
              {tool}
            </span>
          ))}
        </div>
      </Block>
      <Block title="Certifications">
        <ul className="text-body">
          {ABOUT.certifications.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </Block>
      <Block title="Languages">
        <ul className="bullet-list flex flex-wrap gap-x-5">
          {ABOUT.languages.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </Block>
    </>
  );
}

export function AboutRight() {
  return (
    <>
      <Block title="Experience">
        <ul className="timeline">
          {ABOUT.experience.map((job) => (
            <li key={job.role}>
              <strong>{job.role}</strong>
              {job.detail && (
                <>
                  <br />
                  <strong>{job.detail}</strong>
                </>
              )}
              <br />
              {job.place}
              <br />
              <span className="text-dim">{job.dates}</span>
            </li>
          ))}
        </ul>
      </Block>
      <Block title="Skills">
        <ul className="bullet-list">
          {ABOUT.skills.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </Block>
      <Block title="Contact">
        <ContactList />
      </Block>
    </>
  );
}

export function ContactList() {
  return (
    <ul className="text-body space-y-1.5">
      {CONTACT.map((c) => (
        <li key={c.label}>
          <span className="text-dim mr-2 inline-block w-20">{c.label}</span>
          <a href={c.href} className="font-bold underline decoration-[var(--red)] underline-offset-4 hover:text-[var(--red)]">
            {c.value}
          </a>
        </li>
      ))}
    </ul>
  );
}

/** Picks the content for a screen. `dark` screens use the crumpled-paper look. */
export const SCREENS: Record<ScreenId, { dark?: boolean; render: () => ReactNode }> = {
  work: { render: () => <WorkScreen /> },
  games: { render: () => <GamesScreen /> },
  art: { dark: true, render: () => <ArtScreen /> },
  photo: { render: () => <PhotoScreen /> },
  brand: { render: () => <BrandScreen /> },
  about: {
    render: () => (
      <>
        <h2 className="h-screen-title mb-5">{ABOUT.heading}</h2>
        <AboutLeft />
        <AboutRight />
      </>
    ),
  },
  contact: {
    render: () => (
      <>
        <h2 className="h-screen-title mb-4">Contact</h2>
        <ContactList />
      </>
    ),
  },
};
