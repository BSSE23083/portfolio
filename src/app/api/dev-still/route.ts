import { writeFile } from "node:fs/promises";
import path from "node:path";

/**
 * Development only. Saves a snapshot of the 3D room as public/room-still.jpg,
 * the picture shown on devices that cannot run WebGL. Press "P" on the home page to call it.
 */
export async function POST(request: Request) {
  if (process.env.NODE_ENV !== "development") return new Response(null, { status: 404 });
  const { dataUrl } = (await request.json()) as { dataUrl: string };
  const base64 = dataUrl.split(",")[1];
  if (!base64) return new Response("no image", { status: 400 });
  await writeFile(path.join(process.cwd(), "public", "room-still.jpg"), Buffer.from(base64, "base64"));
  return Response.json({ saved: true, bytes: base64.length });
}
