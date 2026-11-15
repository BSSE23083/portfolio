import type { Metadata } from "next";
import { Img } from "@/components/site/Img";
import { Gallery, Page, ProjectCard, Section } from "@/components/site/Page";

export const metadata: Metadata = { title: "Game Design" };

export default function GamesPage() {
  return (
    <Page
      kicker="Game Design"
      title="Games & VR"
      intro="Game UI/UX and level design, led by VR Podium, my final-year project. I care about interfaces that stay out of the player's way and levels that teach without a tutorial."
    >
      <Section
        title="VR Podium"
        text="Final-year project at ITU Lahore. [PLACEHOLDER: what VR Podium is, who it is for, and the problem it solves. Two or three sentences.]"
      >
        <Img name="games-vr-podium-hero" className="rounded-3xl border border-[var(--line)]" />
        <dl className="mt-6 grid grid-cols-2 gap-6 border-y border-[var(--line)] py-6 text-sm md:grid-cols-4">
          {[
            ["Role", "[PLACEHOLDER: your role]"],
            ["Team", "[PLACEHOLDER: team size]"],
            ["Engine", "[PLACEHOLDER: Unity / Unreal]"],
            ["Headset", "[PLACEHOLDER: target headset]"],
          ].map(([label, value]) => (
            <div key={label}>
              <dt className="kicker">{label}</dt>
              <dd className="mt-1.5">{value}</dd>
            </div>
          ))}
        </dl>
        <div className="mt-6">
          <Gallery columns={2} names={["games-vr-podium-1", "games-vr-podium-2"]} />
        </div>
      </Section>

      <Section title="More game work">
        <div className="grid gap-5 md:grid-cols-2">
          <ProjectCard
            image="games-ui-redesign"
            title="Game UI redesign"
            text="[PLACEHOLDER: which game you redesigned, what was wrong with the original UI, and what you changed.]"
            tags={["HUD", "Menus", "UI/UX"]}
          />
          <ProjectCard
            image="games-level-design"
            title="Level design breakdown"
            text="[PLACEHOLDER: the level, its goals, the player path, pacing and how you guide the player.]"
            tags={["Level design", "Pacing", "Blockout"]}
          />
        </div>
      </Section>
    </Page>
  );
}
