/**
 * The clickable objects in the room: their labels, the screen each one opens,
 * and where the camera flies to when one is selected.
 */

type Vec3 = [number, number, number];

export type ObjectId = "monitor" | "vr" | "sketchbook" | "camera" | "books" | "phone" | "character" | "lamp";

/** The pop-up screens. "about" and "contact" have their own layouts. */
export type ScreenId = "work" | "games" | "art" | "photo" | "brand" | "about" | "contact";

export type RoomObject = {
  /** Name shown on hover. */
  label: string;
  /** Portfolio section it opens. */
  section: string;
  /** Screen that pops up after the camera arrives (none for the lamp cord). */
  screen?: ScreenId;
  /** Title in the pop-up window's title bar. */
  file?: string;
  /** Camera position and look-at point when zoomed in (world space, meters). */
  camera?: { position: Vec3; target: Vec3 };
};

export const OBJECTS: Record<ObjectId, RoomObject> = {
  monitor: {
    label: "Monitor",
    section: "User Interface",
    screen: "work",
    file: "work.exe",
    camera: { position: [-1.05, 1.36, 1.02], target: [-0.73, 1.15, 0.27] },
  },
  vr: {
    label: "VR headset",
    section: "Game Design",
    screen: "games",
    file: "games.exe",
    camera: { position: [-0.34, 1.3, 1.04], target: [-0.24, 0.8, 0.6] },
  },
  sketchbook: {
    label: "Sketchbook",
    section: "Mixed Media & Illustration",
    screen: "art",
    file: "mixed-media.exe",
    camera: { position: [-1.14, 1.2, 1.02], target: [-0.97, 0.76, 0.66] },
  },
  camera: {
    label: "Camera",
    section: "Photography & Video",
    screen: "photo",
    file: "photos.exe",
    camera: { position: [-1.4, 0.98, 0.88], target: [-0.95, 0.8, 0.44] },
  },
  books: {
    label: "Books",
    section: "Visual & Brand",
    screen: "brand",
    file: "brand.exe",
    camera: { position: [-0.36, 1.36, 0.88], target: [-0.14, 0.98, 0.27] },
  },
  phone: {
    label: "Phone",
    section: "Contact",
    screen: "contact",
    file: "contact.exe",
    camera: { position: [-1.34, 1.14, 0.9], target: [-1.18, 0.76, 0.45] },
  },
  character: {
    label: "Abdul",
    section: "About me",
    screen: "about",
    file: "about.exe",
    // Straight in front of where he turns to, so he sits in the middle with text either side.
    camera: { position: [-2.45, 1.22, 3.08], target: [-0.6, 0.98, 1.42] },
  },
  lamp: {
    label: "Pull cord",
    section: "Light / dark",
  },
};

/** Order of the scroll tour. */
export const TOUR: ObjectId[] = ["monitor", "vr", "sketchbook", "camera"];
