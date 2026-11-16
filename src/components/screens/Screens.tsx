import type { ReactNode } from "react";
import type { ScreenId } from "@/config/objects";
import { ABOUT, CONTACT } from "@/content/about";
import sizes from "@/content/image-sizes.json";

/**
 * The content of each pop-up screen, laid out like Abdul's Figma file.
 * Images live in public/images (made from content/images-everythingelse by scripts/prepare-assets.py).
 */

type ImageName = keyof typeof sizes;

function Shot({ name, alt, className = "" }: { name: ImageName; alt: string; className?: string }) {
  const [width, height] = sizes[name];
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={`/images/${name}.webp`} alt={alt} width={width} height={height} loading="lazy" decoding="async" className={`block h-auto w-full ${className}`} />;
}

/** Images side by side at one shared height, filling the width exactly (no ragged edges). */
function JustifiedRow({ images }: { images: [ImageName, string][] }) {
  return (
    <div className="justified-row">
      {images.map(([name, alt]) => {
        const [width, height] = sizes[name];
        return (
          <div key={name} style={{ flex: width / height, aspectRatio: `${width} / ${height}` }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={`/images/${name}.webp`} alt={alt} loading="lazy" />
          </div>
        );
      })}
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

const RISHTAY_SCREENS: [ImageName, string][] = [
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
    <div className="pad mx-auto max-w-6xl">
      <div className="grid items-center gap-10 md:grid-cols-[1fr_1.15fr]">
        <div>
          <p className="text-dim text-sm">user interface</p>
          <h2 className="h-screen-title mt-1">Rishtay</h2>
          <Shot name="rishtay-logo" alt="Rishtay logo" className="mt-8 !w-36" />
          <div className="mt-8">
            <p className="text-dim mb-3 text-xs">button states</p>
            <div className="flex flex-wrap items-center gap-3">
              <Shot name="rishtay-button-default" alt="Button, default state" className="!w-32" />
              <Shot name="rishtay-button-pressed" alt="Button, pressed state" className="!w-36" />
              <Shot name="rishtay-button-disabled" alt="Button, disabled state" className="!w-36" />
            </div>
          </div>
        </div>
        <Shot name="rishtay-mockup" alt="Rishtay app shown on a phone" />
      </div>

      <h3 className="h-section mt-14">Screens</h3>
      <div className="grid grid-cols-2 gap-x-5 gap-y-8 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
        {RISHTAY_SCREENS.map(([name, alt]) => (
          <Shot key={name} name={name} alt={`Rishtay screen: ${alt}`} />
        ))}
      </div>
    </div>
  );
}

/* ---------- VR headset: games ---------- */

function GamesScreen() {
  return (
    <div className="pad grid min-h-full place-items-center text-center">
      <div>
        <p className="text-dim text-sm">game design</p>
        <h2 className="h-screen-title mt-3">Currently working on it ;)</h2>
      </div>
    </div>
  );
}

/* ---------- Sketchbook: mixed media (layout follows the Figma frame) ---------- */

function MixedMediaPage() {
  return (
    <div className="paper-dark px-[5%] pb-24 pt-14">
      <div className="mx-auto max-w-[60rem]">
        {/* Title in red script with a scribbled underline */}
        <div className="mx-auto w-[min(70%,26rem)]">
          <h2>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/title-mixed-media.png" alt="Mixed Media" className="block w-full" />
          </h2>
          <svg viewBox="0 0 300 22" className="-mt-[4%] block w-full" aria-hidden fill="none" stroke="#b8402f" strokeWidth="1.3" strokeLinecap="round">
            <path d="M12 9 C 80 3, 200 2, 290 7 C 200 8, 90 10, 20 15 C 100 11, 210 11, 284 13 C 190 15, 100 17, 40 19" />
          </svg>
        </div>

        {/* Pencil: text on the left, studies on the right */}
        <div className="mt-12 grid items-center gap-8 md:grid-cols-[0.82fr_1fr]">
          <p className="paper-text">
            My pencil sketches are where I explore the fundamentals of light, shadow, and anatomy. It&apos;s my space for slow,
            intentional observation mapping out the wireframes of the physical world before they ever transition into a
            digital canvas.
          </p>
          <Shot name="art-pencil-studies" alt="Sketchbook with pencil studies of a skull, an ear and an eye" />
        </div>
        <div className="mt-6 w-full md:-mt-4 md:w-[56%]">
          <Shot name="art-pencil-portraits" alt="Sketchbook with pencil portraits" />
        </div>

        {/* Oil: a taped paper note beside the ocean painting, dragons below */}
        <div className="mt-14 grid items-center gap-6 md:grid-cols-[1.25fr_1fr]">
          <div className="paper-note">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/texture-tape.webp" alt="" className="tape -right-[10%] -top-[4%] rotate-[14deg]" />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/texture-tape.webp" alt="" className="tape -bottom-[5%] -right-[8%] rotate-[24deg]" />
            <p className="paper-text">
              If sketching is the logic, oil painting is the atmosphere. I&apos;m drawn to the slow, meditative process of
              layering pigments and building texture over time. It allows me to step away from the pixel-perfect world and
              engage with the organic complexity of color and rendering in its most physical, vibrant form.
            </p>
          </div>
          <div className="mx-auto w-[62%] md:w-[68%]">
            <Shot name="art-oil-ocean" alt="Oil painting of the ocean, taped to the page" />
          </div>
        </div>
        <div className="mx-auto mt-8 w-full md:w-[64%]">
          <Shot name="art-oil-dragons" alt="Oil paintings of dragons, taped to the page" />
        </div>

        {/* Pen: centered text, then the big notebook */}
        <p className="paper-text mx-auto mt-14 max-w-[46rem] text-center">
          These are my pen sketches born at random moments, in the margins of notebooks or on the backs of receipts. Using pen
          and ink forces a certain level of confidence there is no undo button. I love the raw, unedited energy of capturing a
          face or a scene in a few rapid strokes, wherever inspiration happens to strike.
        </p>
        <div className="mx-auto mt-8 w-full md:w-[86%]">
          <Shot name="art-pen" alt="Sketchbook with pen sketches of hands, a car and a camera" />
        </div>
      </div>
    </div>
  );
}

const ILLUSTRATIONS: [ImageName, string][] = [
  ["illustration-venom", "Venom illustration"],
  ["illustration-mehran", "Mehran dashboard illustration"],
  ["illustration-civic", "Honda Civic illustration"],
  ["illustration-r34", "Skyline R34 illustration"],
  ["illustration-portrait", "Vector portrait illustration"],
  ["illustration-danny-zee", "Danny Zee poster illustration"],
];

function IllustrationsPage() {
  return (
    <div className="pad mx-auto max-w-5xl">
      <h2 className="h-screen-title text-center">Illustrations</h2>
      <div className="mt-10 grid grid-cols-2 gap-5 md:grid-cols-3">
        {ILLUSTRATIONS.map(([name, alt]) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img key={name} src={`/images/${name}.webp`} alt={alt} loading="lazy" className="block aspect-[3/4] w-full object-cover" />
        ))}
      </div>
    </div>
  );
}

/* ---------- Camera: generative AI (rows as in the Figma frame) ---------- */

const AI = "AI-generated furniture and interior visual";

function GenAiScreen() {
  return (
    <div className="px-[5%] pb-20 pt-12">
      <h2 className="text-center text-sm tracking-[0.2em] text-[#cfc8b8]">generative ai</h2>
      <div className="mx-auto mt-10 max-w-[52rem]">
        <JustifiedRow images={[["genai-door-garden", AI]]} />
        <JustifiedRow images={[["genai-trolley-model", AI], ["genai-trolley", AI]]} />
        <JustifiedRow images={[["genai-doors", AI], ["genai-living-room", AI]]} />
        <JustifiedRow images={[["genai-library", AI], ["genai-desk", AI]]} />
        <JustifiedRow images={[["genai-cove-1", AI]]} />
        <JustifiedRow images={[["genai-cove-2", AI], ["genai-maison-bed", AI]]} />
        <JustifiedRow images={[["genai-round-tables", AI], ["genai-axis-table", AI]]} />
        <JustifiedRow images={[["genai-arch-dining", AI]]} />
      </div>
    </div>
  );
}

/* ---------- Books: three separate pages ---------- */

const LOGOS: [ImageName, string][] = [
  ["logo-abdul", "Abdul's personal logo"],
  ["logo-slice", "Slice logo"],
  ["logo-bonappetit", "Bonappetit logo"],
  ["logo-fleur", "Fleur logo"],
  ["logo-sunny-villa", "Sunny Villa logo"],
  ["rishtay-logo", "Rishtay logo"],
];

function LogofolioPage() {
  return (
    <div className="pad mx-auto max-w-5xl">
      <p className="text-center text-sm tracking-[0.2em] text-[#8d877a]">design</p>
      <h2 className="h-screen-title mt-2 text-center">Logofolio</h2>
      <div className="logo-grid mt-10">
        {LOGOS.map(([name, alt]) => (
          <div key={name} className="logo-cell">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={`/images/${name}.webp`} alt={alt} loading="lazy" />
          </div>
        ))}
      </div>
    </div>
  );
}

function PackagingPage() {
  return (
    <div className="pad">
      <p className="text-center text-sm tracking-[0.2em] text-[#8d877a]">packaging</p>
      <h2 className="h-screen-title mt-2 text-center">Fleur</h2>
      <div className="mx-auto mt-10 max-w-[46rem]">
        <Shot name="fleur-packaging" alt="Fleur packaging design: logo, patterns, boxes and mockups" />
      </div>
    </div>
  );
}

const GOURMET: [ImageName, string][] = [
  ["gourmet-claudia-bed", "Claudia bed set"],
  ["gourmet-axis", "Axis center table set"],
  ["gourmet-aura", "Aura dining table"],
  ["gourmet-claudia-chair", "Claudia chair"],
  ["gourmet-luna-chair", "Luna chair"],
  ["gourmet-cove-dining", "Cove dining"],
  ["gourmet-14-august", "14 August, Independence Day"],
  ["gourmet-doors", "Doors"],
  ["gourmet-nexa-chair", "Nexa chair"],
];

/** Social: full-width bands, in the same order as the Figma frame. */
function SocialPage() {
  return (
    <div>
      {/* ITU Media Club */}
      <div className="grid items-center gap-8 bg-[#e4e3c0] py-12 pl-[7%] text-[#2a2a22] md:grid-cols-[0.9fr_1.4fr]">
        <p className="text-body max-w-[26rem] pr-[7%] md:pr-0">
          As the Social Media Head at ITU <strong>Media Club</strong>, I architect the club&apos;s digital identity. I use
          Figma for structured layouts and Photoshop for high-fidelity asset manipulation, transforming campus events into
          cohesive, high-engagement visual campaigns.
        </p>
        <Shot name="imc-laptop" alt="ITU Media Club design file open on a laptop" />
      </div>
      <Shot name="imc-mockup" alt="ITU Media Club posts shown on a phone" />
      <div className="bg-[linear-gradient(#e4e3c0,#b3a78a)] px-[10%] py-16">
        <Shot name="imc-team" alt="ITU Media Club team and event covers" />
      </div>

      {/* Gourmet Furnishers */}
      <Shot name="genai-arch-dining" alt="Dining table under an arch, made for Gourmet Furnishers" />
      <div className="bg-[linear-gradient(#7a3a24,#2c120b)] px-[8%] pb-20 pt-12 text-[#f1e9d8]">
        <p className="text-body mx-auto max-w-[44rem] text-center">
          For <strong>Gourmet Furnishers</strong>, I developed social media content that translated their furniture collections
          into cohesive, visually engaging posts. Using Figma and Photoshop, I structured layouts, refined product visuals,
          and maintained a consistent visual direction across their social media presence.
        </p>
        <div className="mx-auto mt-12 grid max-w-[48rem] grid-cols-3 gap-3 md:gap-6">
          {GOURMET.map(([name, alt]) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img key={name} src={`/images/${name}.webp`} alt={`Gourmet Furnishers social post: ${alt}`} loading="lazy" className="block aspect-[4/5] w-full object-cover" />
          ))}
        </div>
      </div>
    </div>
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

/** One page of a screen. A screen with several pages shows page buttons under the title bar. */
type Page = { label: string; tone?: "cream" | "dark"; render: () => ReactNode };

/** `frameless` screens open edge to edge on black, with a back button and floating page buttons. */
export const SCREENS: Record<ScreenId, { frameless?: boolean; pages: Page[] }> = {
  work: { pages: [{ label: "Rishtay", render: () => <WorkScreen /> }] },
  games: { pages: [{ label: "Games", render: () => <GamesScreen /> }] },
  art: {
    frameless: true,
    pages: [
      { label: "mixed media", tone: "dark", render: () => <MixedMediaPage /> },
      { label: "illustrations", tone: "dark", render: () => <IllustrationsPage /> },
    ],
  },
  genai: { frameless: true, pages: [{ label: "Generative AI", tone: "dark", render: () => <GenAiScreen /> }] },
  brand: {
    frameless: true,
    pages: [
      { label: "logofolio", tone: "dark", render: () => <LogofolioPage /> },
      { label: "packaging", tone: "dark", render: () => <PackagingPage /> },
      { label: "social", tone: "dark", render: () => <SocialPage /> },
    ],
  },
  about: {
    pages: [
      {
        label: "About",
        render: () => (
          <div className="pad">
            <h2 className="h-screen-title mb-5">{ABOUT.heading}</h2>
            <AboutLeft />
            <AboutRight />
          </div>
        ),
      },
    ],
  },
  contact: {
    pages: [
      {
        label: "Contact",
        render: () => (
          <div className="pad">
            <h2 className="h-screen-title mb-4">Contact</h2>
            <ContactList />
          </div>
        ),
      },
    ],
  },
};
