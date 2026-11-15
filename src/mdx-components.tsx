import type { MDXComponents } from "mdx/types";
import { Img, type ImageName } from "@/components/site/Img";

/** Components available inside every .mdx case study. */
function Figure({ name, caption }: { name: ImageName; caption?: string }) {
  return (
    <figure className="my-8">
      <Img name={name} className="rounded-2xl border border-[var(--line)]" />
      {caption && <figcaption className="mt-3 text-center text-sm text-[var(--muted)]">{caption}</figcaption>}
    </figure>
  );
}

const components: MDXComponents = { Figure };

export function useMDXComponents(): MDXComponents {
  return components;
}
