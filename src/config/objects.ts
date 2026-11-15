/**
 * The clickable objects in the room: their labels, where they lead,
 * and where the camera flies to when one is selected.
 */

type Vec3 = [number, number, number];

export type ObjectId = "monitor" | "vr" | "sketchbook" | "camera" | "books" | "phone" | "character" | "lamp";

export type RoomObject = {
  /** Name shown on hover. */
  label: string;
  /** Portfolio section it opens. */
  section: string;
  /** One line shown in the panel when zoomed in. */
  blurb: string;
  /** Page it leads to (none for the phone and the lamp cord). */
  href?: string;
  /** Camera position and look-at point when zoomed in (world space, meters). */
  camera?: { position: Vec3; target: Vec3 };
};

export const OBJECTS: Record<ObjectId, RoomObject> = {
  monitor: {
    label: "Monitor",
    section: "Product Design",
    blurb: "Case studies: research, flows and final UI for apps and products.",
    href: "/product",
    camera: { position: [-1.08, 1.36, 1.02], target: [-0.76, 1.15, 0.27] },
  },
  vr: {
    label: "VR headset",
    section: "Game Design",
    blurb: "VR Podium (final-year project), game UI and level design.",
    href: "/games",
    camera: { position: [-0.3, 1.28, 0.92], target: [-0.2, 0.8, 0.5] },
  },
  sketchbook: {
    label: "Sketchbook",
    section: "Art",
    blurb: "Pencil, pen and oil: sketches and paintings.",
    href: "/art",
    camera: { position: [-1.16, 1.22, 1.0], target: [-0.97, 0.76, 0.63] },
  },
  camera: {
    label: "Camera",
    section: "Photography & Video",
    blurb: "Photos and a video reel.",
    href: "/art#photography",
    camera: { position: [-1.36, 0.98, 0.9], target: [-0.9, 0.8, 0.43] },
  },
  books: {
    label: "Books",
    section: "Visual & Brand",
    blurb: "Logos, packaging, branding and social media design.",
    href: "/brand",
    camera: { position: [-0.36, 1.36, 0.88], target: [-0.14, 0.98, 0.27] },
  },
  phone: {
    label: "Phone",
    section: "Contact",
    blurb: "Say hello. I reply quickly.",
    camera: { position: [-1.34, 1.14, 0.9], target: [-1.18, 0.76, 0.45] },
  },
  character: {
    label: "Abdul",
    section: "About me",
    blurb: "Hello, I'm Abdul. Designer-developer at ITU Lahore.",
    href: "/about",
    camera: { position: [-1.95, 1.35, 2.7], target: [-0.66, 1.08, 1.4] },
  },
  lamp: {
    label: "Pull cord",
    section: "Light / dark",
    blurb: "",
  },
};

/** Order of the scroll tour. Scrolling steps through these, then into the 2D page. */
export const TOUR: ObjectId[] = ["monitor", "vr", "sketchbook", "camera"];

/** Contact links shown when the phone is selected. */
export const CONTACT = [
  { label: "Email", value: "abdul.samadcod1@gmail.com", href: "mailto:abdul.samadcod1@gmail.com" },
  { label: "Instagram", value: "@abdulsamad.sohail", href: "https://instagram.com/abdulsamad.sohail" },
  { label: "Phone", value: "+92 309 8346442", href: "tel:+923098346442" },
  { label: "LinkedIn", value: "[PLACEHOLDER: LinkedIn URL]", href: "#" },
];
