import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Footer } from "@/components/site/Footer";
import { Img } from "@/components/site/Img";
import { CASE_STUDIES } from "@/content/case-studies";

// The shared case study template: Cover, then the MDX body
// (Overview, Challenge, Research, Process, Final design, Outcome).

export function generateStaticParams() {
  return CASE_STUDIES.map((study) => ({ slug: study.slug }));
}
export const dynamicParams = false;

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const study = CASE_STUDIES.find((s) => s.slug === slug);
  return { title: study?.title ?? "Case study" };
}

const SECTIONS = ["Overview", "Challenge", "Research", "Process", "Final design", "Outcome"];

export default async function CaseStudyPage({ params }: Props) {
  const { slug } = await params;
  const index = CASE_STUDIES.findIndex((s) => s.slug === slug);
  if (index === -1) notFound();
  const study = CASE_STUDIES[index];
  const next = CASE_STUDIES[(index + 1) % CASE_STUDIES.length];
  const { default: Body } = await import(`@/content/case-studies/${slug}.mdx`);

  return (
    <>
      <main className="mx-auto max-w-6xl px-4 pb-24 pt-28 md:px-6 md:pt-36">
        {/* Cover */}
        <Link href="/product" className="text-sm text-[var(--muted)] hover:text-[var(--accent)]">
          ← All case studies
        </Link>
        <header className="mt-6 max-w-4xl">
          {study.award && <p className="kicker">{study.award}</p>}
          <h1 className="font-display mt-3 text-5xl leading-[1.05] md:text-7xl">{study.title}</h1>
          <p className="mt-6 text-lg leading-relaxed text-[var(--muted)]">{study.summary}</p>
        </header>
        <dl className="mt-10 grid grid-cols-2 gap-6 border-y border-[var(--line)] py-6 text-sm md:grid-cols-4">
          {[
            ["Role", study.role],
            ["Year", study.year],
            ["Tools", study.tools],
            ["Type", study.tags.join(", ")],
          ].map(([label, value]) => (
            <div key={label}>
              <dt className="kicker">{label}</dt>
              <dd className="mt-1.5">{value}</dd>
            </div>
          ))}
        </dl>
        <Img name={study.cover} className="mt-10 rounded-3xl border border-[var(--line)]" />

        {/* Body with a section list on the side */}
        <div className="mt-6 grid gap-10 lg:grid-cols-[13rem_1fr]">
          <nav aria-label="Sections" className="hidden lg:block">
            <ol className="sticky top-28 mt-14 space-y-2 text-sm text-[var(--muted)]">
              {SECTIONS.map((name, i) => (
                <li key={name}>
                  <span className="mr-2 font-mono text-xs text-[var(--accent)]">0{i + 1}</span>
                  {name}
                </li>
              ))}
            </ol>
          </nav>
          <article className="prose-case max-w-3xl">
            <Body />
          </article>
        </div>

        <Link href={`/product/${next.slug}`} className="card mt-20 flex items-center justify-between gap-6 p-6">
          <span>
            <span className="kicker">Next case study</span>
            <span className="font-display mt-2 block text-2xl">{next.title}</span>
          </span>
          <span className="text-2xl text-[var(--accent)]">→</span>
        </Link>
      </main>
      <Footer />
    </>
  );
}
