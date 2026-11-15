import type { Metadata } from "next";
import { Page, ProjectCard } from "@/components/site/Page";
import { CASE_STUDIES } from "@/content/case-studies";

export const metadata: Metadata = { title: "Product Design" };

export default function ProductPage() {
  return (
    <Page
      kicker="Product Design"
      title="Case studies"
      intro="How I take a product from a problem to a finished interface: research, flows, wireframes and final UI. Two of these won awards in 2026."
    >
      <div className="mt-14 grid gap-5 md:grid-cols-2">
        {CASE_STUDIES.map((study) => (
          <ProjectCard
            key={study.slug}
            href={`/product/${study.slug}`}
            image={study.cover}
            title={study.title}
            text={study.summary}
            tags={study.award ? [study.award, ...study.tags] : study.tags}
          />
        ))}
      </div>
    </Page>
  );
}
