import images from "@/content/images.json";

export type ImageName = keyof typeof images;

/**
 * Shows an image from src/content/images.json.
 * Until a real file is supplied (a "src" on that entry), it shows the labeled placeholder.
 */
export function Img({ name, className = "" }: { name: ImageName; className?: string }) {
  const info = images[name] as { label: string; ratio: string; src?: string };
  const [w, h] = info.ratio.split(":").map(Number);
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={info.src ?? `/placeholders/${name}.svg`}
      alt={info.src ? info.label : `Placeholder: ${info.label}`}
      loading="lazy"
      style={{ aspectRatio: `${w} / ${h}` }}
      className={`block w-full bg-[var(--surface)] object-cover ${className}`}
    />
  );
}
