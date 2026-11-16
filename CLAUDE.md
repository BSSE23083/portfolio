# Portfolio Website: 3D Room Home Page

Project brief and **all decisions agreed with Abdul** (2026-11-16). Read this fully before building.
Where this file and the original brief disagree, this file wins.

## Revision 2 (2026-11-16): these decisions override anything below that conflicts

Abdul reviewed the first build and changed direction:

- **The home screen is only the 3D room.** No 2D section below it and no separate pages. The old `/product`, `/games`, `/brand`, `/art`, `/about` routes and the MDX case studies were removed.
- **Sections open as pop-up windows over the room.** Click an object: camera flies in, waits 1 second (`CAMERA.screenDelay`), then the screen slides up from below (ease-in). Content is in `src/components/screens/Screens.tsx`; the window frame is `Window.tsx`.
- **Look: Abdul's Figma style**, not a new design: cream `#ecdcb8`, navy `#2b4066`, red-orange `#c9502e`, retro windows with a grey title bar and three dots ("about.exe"). Mixed Media uses dark crumpled paper with red type.
- **Fonts:** headings Code 7x5 (`src/fonts/Code7x5.ttf`); body Consolas via the system font stack (the Consolas files are Microsoft's and are not shipped); navbar "Portfolio" wordmark is a rasterized PNG of Birds of Paradise (personal-use font, file not shipped). `fonts/Consolas-Font` and `fonts/birds_of_paradise` are git-ignored.
- **Navbar:** cream pill with logo, `about` (camera to Abdul), `work` (monitor), `contact` (phone), and the wordmark.
- **About:** camera centers on Abdul; heading above him, two windows left and right (bio/education/tools/certifications/languages, and experience/skills/contact). Text is in `src/content/about.ts`. On small screens it is one pop-up.
- **Home text:** "Hello" (Code 7x5) + "I'm Abdul Samad" (Consolas) on the left over a dark gradient.
- **Room:** plain floor with a small rug (no tiles); every clickable object does a small hop every few seconds (`BOUNCE`); desk objects must not overlap; the monitor screen has no text.
- **Loading:** Abdul's logo fading in and out.
- **Scroll** still steps the tour (monitor, VR headset, sketchbook, camera) but only moves the camera; a chip offers "open".
- **Content:** Abdul's images are in `content/images-everythingelse/`. `python scripts/prepare-assets.py` converts them to `public/images/*.webp` and builds the logo and wordmark files. Object-to-screen mapping is in `src/config/objects.ts`.
- **Still placeholders:** Rishtay description, SOFTEC and Code Rush case studies, all of Games (VR Podium), Photography and video, Gen AI blurb, LinkedIn.
- Abdul runs his own `npm run dev` on port 3000; use that server for testing instead of starting another.

## Project overview
Personal portfolio for **Abdul Samad Sohail**, a final-year BS Software Engineering student at ITU Lahore and an award-winning UI/UX designer (SOFTEC 2026, GDG ITU Code Rush 2026). Targets **product design** and **game UI/UX / level design** roles; also does photography, video, branding, and art.

Core identity line: **"I design and build interactive experiences, from apps to games."**

The home page is an interactive **3D, low-poly recreation of his real room corner**: he sits at his desk typing on a laptop under a warm hanging lamp. Desk objects are clickable doors into portfolio sections. Everything else is fast, readable 2D pages.

**The 3D room is Abdul's main focus.** Take the time needed to make it great. Target: v1 by end of December 2026.

## Working mode (agreed)
- **Work in checkpoints** (changed 2026-11-16 to save tokens): build a part, stop, let Abdul review. Done so far: 3D room and character, interactions and scroll tour, nav, 2D pages and MDX case study template (all with placeholders). Remaining: real content, still-image fallback for weak devices, performance check on a visible screen, GitHub + Vercel deploy. Content pulled from Figma is in content/figma-notes.md; placeholders are listed in content/PLACEHOLDERS.md (regenerate with `npm run placeholders`).
- **3D room first**, then 2D pages.
- Commit after each step with a clear message (git is initialized locally; GitHub comes at the end).
- Keep 3D objects as separate, well-named components (`Desk.tsx`, `Monitor.tsx`, `Character.tsx`, ...).
- Keep all tunable values (dimensions, colors, lights, camera positions, tour stops) in one central config: `scene.config.ts`.
- Prefer simple, readable code. Abdul is a designer-developer and will tweak things himself.
- Self-test in the built-in browser (desktop + mobile widths) and compare the room against the sketch before handing off.

## Reference: the sketch is the source of truth
`reference/room-sketch.jpg`. **Follow the sketch closely** for layout, proportions and object placement.
Build a dev-only **sketch overlay toggle** (sketch drawn semi-transparently over the canvas) to line up camera, corner, desk and curtains.

### Camera
- **Low 3/4 view** into the room corner (Abdul's correction: low, not high). Slightly looking down at the desk.
- The wall corner line is a little right of center. Desk + chair occupy the upper-middle of the frame; empty tiled floor fills the lower part.
- Ceiling out of frame; the hanging lamp's cord comes down from above the top edge.

### Layout (as drawn in the sketch)
- **Left wall = window wall.** Curtain rod with round finials, two long folded curtains to the floor, a dark strip of window visible in the gap between them.
- **The desk's back is against the left (window) wall**, its right end in the corner against the right wall. The right curtain hangs **behind** the desk (its folds are visible under the desktop).
- **Chair** in front of the desk's right half, turned toward the desk; its back faces the viewer's right; a **jacket draped over the chair back**.
- Walls: plain off-white, thin skirting boards. Floor: large square tiles aligned with the walls (diagonal on screen), visible grout.

### Desk
- Dark metal frame, light wooden/laminate top. Default 120 × 60 × 75 cm (W × D × H).
- Raised riser along the back (~12 cm), lower shelf near the floor.
- **Under the desk: boxes and stacked books/files. NO PC tower.**

### On the desk (left → right, per sketch)
- On/near the riser: tall upright item at far left (phone stand or small speaker), pencil holder, small speaker cube, **monitor** (center-left), tall speaker, brush holder, small cup, **upright books/folders** at the right end.
- On the desktop: **phone** lying flat (front-left), **DSLR with lens** (in front of the monitor), **open sketchbook with pencil** (front-center), **laptop** (center-right, where the character types), **VR headset** (right).

### Added (not in sketch)
- **Character** seated in the chair, typing on the laptop; jacket stays draped behind.
- **Hanging pendant lamp** above the laptop/sketchbook, with a clickable pull cord.

## Character
- Low-poly stylized Abdul, built and animated in code.
- **Black hair, light-brown skin, Clubmaster glasses**, black t-shirt, baggy pants, sneakers. No detailed face needed.
- Animations: idle typing, subtle breathing, occasional small head movements, head gently follows the cursor, **turns toward camera and waves when clicked** (About).

## Visual style and lighting
- Stylized low-poly, warm and cozy indie-game room. Consistent detail level, flat or soft shading.
- Palette: warm off-whites, soft woods and greys, dark metal, a few accent colors on objects.
- **Dark mode is the default:** night; pendant lamp's warm (~2700K) light pooled on the desk is the visual focus; cool, dim moonlight from the window; soft shadows; subtle bloom on the bulb; gentle vignette.
- **Light mode:** daytime version of the room. Toggled by pulling the lamp cord (and synced with the 2D site theme).

## Interactions
| Object | Section | Behavior |
|---|---|---|
| Monitor | Product Design `/product` | Camera flies to screen; screen shows case study thumbnails |
| VR headset | Games + VR Podium FYP `/games` | Camera moves in, fade into games |
| DSLR camera | Photography & video `/art#photography` | Zoom toward lens/viewfinder |
| Sketchbook | Art `/art` | Zoom in; pages can flip |
| Upright books/folders | Visual & Brand `/brand` | One book slides out |
| Phone | Contact | Screen lights up with links |
| Character | About `/about` | Turns and waves |
| Lamp pull cord | Light/dark mode | Toggle |

- **Scroll / pinch = guided tour:** overview → **monitor** → **VR headset** → **sketchbook** → **camera** → then the page scrolls down into a normal 2D intro section (intro line + quick links). Scrolling up reverses.
- **Click any object** to jump straight to it (including phone, books, character, lamp cord).
- **Drag = small, limited rotation** only; the composition must never break.
- Hover: outline/glow + small text label + pointer cursor.
- At each stop: smooth GSAP camera move and a panel with the section name and an "Enter" button.
- Always show **"Back to desk"** when zoomed in.
- First load: subtle hint "Click around my desk to explore."

## Pages
- `/`: 3D room + 2D intro section below (identity line, quick links)
- `/product`, `/games`, `/brand`, `/art`, `/about` (bio, awards, experience, two resume downloads: Product and Game, contact)
- MDX case studies with one shared template: Cover → Overview → Challenge → Research → Process → Final design → Outcome
- **New design**, dark and warm to match the room. Do NOT reuse the old Figma portfolio's colors or design.
- **Clearly marked placeholders** wherever content is missing. Abdul will supply real content.
  - Every missing image gets a **placeholder image** in its real slot, at the intended aspect ratio, labeled with what goes there (e.g. "PLACEHOLDER: VR Podium hero screenshot, 16:9"). Store them in `public/placeholders/` and reference them from content files so Abdul can swap them by replacing one file.
  - Missing text gets placeholder text clearly marked `[PLACEHOLDER: ...]`.
  - Keep a running list of every placeholder in `content/PLACEHOLDERS.md` (what it is, where it's used, file path) so Abdul knows exactly what to send.

## Content source: old Figma portfolio
https://www.figma.com/design/EKBSoLSqZouNOxsCRlGUDu/Portfolio?node-id=0-1&t=wfVRAkyRJI3EFHLS-1
- Use it **only for content** (bio, projects, case study text, awards, experience). Ignore its colors and layout.
- **Access confirmed (2026-11-16):** the link opens view-only in the built-in browser with no sign-in. Figma renders on a canvas, so read it from screenshots: click the canvas, zoom/pan, and screenshot each frame. If it needs sign-in or isn't viewable, ask Abdul to set sharing to "Anyone with the link can view" or export frames as PNGs into `reference/figma/` and paste text into `reference/content.md`.
- Save extracted content to `content/` so it's reusable; mark anything uncertain.

## Tech stack
- Next.js (App Router) + TypeScript, Tailwind CSS, MDX
- React Three Fiber, Drei, @react-three/postprocessing, GSAP
- Hosting: Vercel free tier, `*.vercel.app` subdomain (no custom domain). Deployed from GitHub.
- Environment: Windows, Node 22, npm 10, git installed. GitHub CLI (`gh`) is NOT installed; use plain git.

## Usability and performance
- Nav bar always visible (Product · Games · Brand · Art · About) + "Skip to portfolio".
- Light loading screen; interactive within a few seconds on a normal connection.
- Every clickable 3D object reachable by keyboard, with screen reader labels.
- Mobile: lower pixel ratio, fewer effects, large tap targets; still-image + buttons fallback on weak devices.
- Low draw calls (merge/instance), capped DPR, compressed assets, lazy-load heavy parts.
- 2D pages fast and readable without the 3D scene.

## Build steps
1. Setup: Next.js + deps, folder structure, `scene.config.ts`, git init.
2. Room + camera: walls, skirting, tiles, ceiling, real scale; low 3/4 camera; sketch overlay toggle.
3. Window + curtains.
4. Desk (frame, top, riser, lower shelf) + under-desk boxes and books/files (no PC).
5. Desk objects.
6. Chair + jacket.
7. Character + animations.
8. Lighting and mood: dark default, light mode, shadows, post-processing.
9. Interactions: hover, click fly-to, scroll tour, limited rotation, back button, lamp cord, object effects.
10. Home 2D intro section + persistent nav + skip button.
11. Content extraction from Figma, 2D pages, MDX case study template, placeholders.
12. Loading screen + keyboard/screen reader access.
13. Mobile + performance pass.
14. Self-test in browser (desktop + mobile, compare to sketch) and fix.
15. Hand off to Abdul for review; then GitHub repo + Vercel deploy (Abdul creates the accounts).

## Still needed from Abdul (later, not blocking)
- Viewable Figma access (if the link doesn't open)
- Real content not in Figma: images, art, photos, video reel link, resume PDFs (Product + Game)
- Room photos / real desk measurements (optional; defaults used otherwise)
- GitHub and Vercel accounts (step 15)
