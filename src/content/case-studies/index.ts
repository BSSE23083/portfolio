import type { ImageName } from "@/components/site/Img";

/**
 * The list of product design case studies.
 * To add one: add an entry here and create a matching `<slug>.mdx` file in this folder.
 */
export type CaseStudy = {
  slug: string;
  title: string;
  summary: string;
  cover: ImageName;
  role: string;
  year: string;
  tools: string;
  award?: string;
  tags: string[];
};

export const CASE_STUDIES: CaseStudy[] = [
  {
    slug: "softec-2026",
    title: "[PLACEHOLDER: SOFTEC 2026 project name]",
    summary: "My entry for the SOFTEC 2026 UI/UX competition. [PLACEHOLDER: one-line summary of the product]",
    cover: "product-softec-cover",
    role: "UI/UX Designer",
    year: "2026",
    tools: "Figma",
    award: "2nd position, SOFTEC UI/UX 2026",
    tags: ["UI/UX", "Competition", "Award"],
  },
  {
    slug: "code-rush-2026",
    title: "[PLACEHOLDER: Code Rush 2026 project name]",
    summary: "My entry for GDG Code Rush at ITU. [PLACEHOLDER: one-line summary of the product]",
    cover: "product-coderush-cover",
    role: "UI/UX Designer",
    year: "2026",
    tools: "Figma",
    award: "1st position, GDG Code Rush ITU 2026",
    tags: ["UI/UX", "Competition", "Award"],
  },
  {
    slug: "rishtay",
    title: "Rishtay",
    summary: "User interface design for the Rishtay app. [PLACEHOLDER: one-line summary of what the app does]",
    cover: "product-rishtay-cover",
    role: "UI Designer",
    year: "[PLACEHOLDER: year]",
    tools: "Figma",
    tags: ["Mobile app", "UI design"],
  },
];
