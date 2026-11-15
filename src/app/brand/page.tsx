import type { Metadata } from "next";
import { Page, ProjectCard } from "@/components/site/Page";

export const metadata: Metadata = { title: "Visual & Brand" };

export default function BrandPage() {
  return (
    <Page
      kicker="Visual & Brand"
      title="Logos, packaging & social"
      intro="Identity and visual design for clubs, brands and freelance clients including Gourmet, Farmac and NodeLab."
    >
      <div className="mt-14 grid gap-5 md:grid-cols-2">
        <ProjectCard
          image="brand-logofolio"
          title="Logofolio"
          text="A collection of logo designs. [PLACEHOLDER: one line on your approach to logo design, and which clients these were for.]"
          tags={["Logo design", "Identity"]}
        />
        <ProjectCard
          image="brand-fleur"
          title="Fleur"
          text="Packaging design. [PLACEHOLDER: what Fleur is and the idea behind the packaging.]"
          tags={["Packaging", "Print"]}
        />
        <ProjectCard
          image="brand-gourmet"
          title="Gourmet Furnishers"
          text="I developed social media content that translated their furniture collections into cohesive, visually engaging posts. Using Figma and Photoshop, I structured layouts, refined product visuals, and maintained a consistent visual direction across their social media presence."
          tags={["Social media", "Figma", "Photoshop"]}
        />
        <ProjectCard
          image="brand-itu-media-club"
          title="ITU Media Club"
          text="As Social Media Head, I architect the club's digital identity. I use Figma for structured layouts and Photoshop for high-fidelity asset manipulation, transforming campus events into cohesive, high-engagement visual campaigns."
          tags={["Social media", "Campaigns", "Leadership"]}
        />
      </div>
    </Page>
  );
}
