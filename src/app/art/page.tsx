import type { Metadata } from "next";
import { Img } from "@/components/site/Img";
import { Gallery, Page, Section } from "@/components/site/Page";

export const metadata: Metadata = { title: "Art & Photography" };

export default function ArtPage() {
  return (
    <Page
      kicker="Art"
      title="Sketches, paint & photos"
      intro="The work I make away from the screen: pencil, pen and oil, plus photography and video."
    >
      <Section
        title="Pencil"
        text="My pencil sketches are where I explore the fundamentals of light, shadow, and anatomy. It's my space for slow, intentional observation, mapping out the wireframes of the physical world before they ever transition into a digital canvas."
      >
        <Gallery names={["art-pencil-1", "art-pencil-2", "art-pencil-3"]} />
      </Section>

      <Section
        title="Pen"
        text="These are my pen sketches, born at random moments, in the margins of notebooks or on the backs of receipts. Using pen and ink forces a certain level of confidence: there is no undo button. I love the raw, unedited energy of capturing a face or a scene in a few rapid strokes, wherever inspiration happens to strike."
      >
        <Gallery names={["art-pen-1", "art-pen-2", "art-pen-3"]} />
      </Section>

      <Section
        title="Oil"
        text="If sketching is the logic, oil painting is the atmosphere. I'm drawn to the slow, meditative process of layering pigments and building texture over time. It allows me to step away from the pixel-perfect world and engage with the organic complexity of color and rendering in its most physical, vibrant form."
      >
        <Gallery names={["art-oil-1", "art-oil-2", "art-oil-3"]} />
      </Section>

      <Section title="Illustrations" text="Digital illustrations: Venom, Mehran and Civic.">
        <Gallery names={["art-illustration-venom", "art-illustration-mehran", "art-illustration-civic"]} />
      </Section>

      <Section id="photography" title="Photography" text="[PLACEHOLDER: one or two lines about what you like to photograph and the camera you use.]">
        <Gallery names={["photo-1", "photo-2", "photo-3", "photo-4", "photo-5", "photo-6"]} />
      </Section>

      <Section id="video" title="Video reel" text="[PLACEHOLDER: one line about your video work. Send a YouTube or Vimeo link and it will be embedded here.]">
        <Img name="video-reel" className="rounded-3xl border border-[var(--line)]" />
      </Section>
    </Page>
  );
}
