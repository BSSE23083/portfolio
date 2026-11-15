/**
 * Central place for everything you may want to tweak in the 3D room.
 * Units are meters. The room corner is at (0, 0, 0).
 *  - The window wall (left wall on screen) runs along -X.
 *  - The right wall runs along +Z.
 *  - Y is up.
 */

type Vec3 = [number, number, number];

export const ROOM = {
  wallLength: 4.6,
  height: 2.8,
  tileSize: 0.6,
  skirtingHeight: 0.08,
};

export const DESK = {
  /** Floor position of the desk's center. Back edge sits near the window wall, right end in the corner. */
  position: [-0.64, 0, 0.47] as Vec3,
  width: 1.2,
  depth: 0.6,
  height: 0.75,
  riserHeight: 0.12,
  riserDepth: 0.2,
};

/** Chair + character. Rotation is around Y; 0 means facing the window wall (the desk). */
export const SEAT = {
  position: [-0.6, 0, 1.04] as Vec3,
  rotationY: 0.06,
  /** Where the chair swivels to when the character waves at the camera. */
  waveRotationY: 2.3,
  waveSlideBack: 0.38,
};

export const LAMP = {
  /** Position of the lamp shade (hangs from the ceiling above the desk). */
  position: [-0.86, 1.72, 0.5] as Vec3,
};

export const CURTAINS = {
  rodY: 2.3,
  rodFrom: -2.98,
  rodTo: -0.22,
  left: { from: -2.86, to: -1.42 },
  right: { from: -1.3, to: -0.36 },
  folds: { left: 7, right: 5 },
};

export const CAMERA = {
  fov: 36,
  /** Low 3/4 view into the corner, matched to the sketch. */
  overview: {
    position: [-3.85, 1.8, 3.85] as Vec3,
    target: [-0.92, 0.78, 0.35] as Vec3,
  },
  /** How far the view turns with the mouse (subtle parallax, radians). */
  parallax: 0.035,
  /** Max drag rotation left/right, in radians (about 17 degrees). */
  dragLimit: 0.3,
  /** Seconds for the camera to fly to an object. */
  flyDuration: 1.5,
};

export const COLORS = {
  wall: "#e9e2d3",
  skirting: "#f3eee3",
  ceiling: "#ded7c8",
  tile: "#d9d2c3",
  grout: "#a79f90",
  curtain: "#a8977e",
  rod: "#4a4038",
  windowFrame: "#f1ece1",
  deskTop: "#c9a77c",
  deskFrame: "#26262b",
  riser: "#b9966c",
  cardboard: "#b88f5f",
  monitor: "#1d1d22",
  laptop: "#8d9097",
  cameraBody: "#1b1b1e",
  phone: "#16161a",
  paper: "#f2ead9",
  vr: "#e6e6ea",
  vrVisor: "#15151a",
  speaker: "#2c2c33",
  holder: "#d8c9b0",
  chair: "#2a2a30",
  chairSeat: "#34343c",
  jacket: "#5d6b4e",
  shirt: "#17171a",
  pants: "#77705f",
  skin: "#b98862",
  hair: "#101012",
  shoe: "#ececec",
  shoeSole: "#2a2a2a",
  glasses: "#151515",
  glassesRim: "#c9a45a",
  lampShade: "#23272b",
  books: ["#b5533c", "#3f6f73", "#d9a441", "#4a4f7a", "#7a8f5a", "#c97b5a"],
};

/** Lighting per theme. Dark (night, lamp on) is the default. */
export const LIGHTS = {
  dark: {
    background: "#0c0e17",
    ambient: { color: "#5f6ea8", intensity: 0.5 },
    moon: { color: "#7f9cff", intensity: 0.75, position: [-2.2, 2.2, -1.5] as Vec3 },
    fill: { color: "#39446e", intensity: 0.5, position: [-3, 2.5, 4] as Vec3 },
    lamp: { color: "#ffb86b", intensity: 15, glow: 1.3 },
    window: "#31457f",
    bloom: 0.35,
    vignette: 0.62,
  },
  light: {
    background: "#cfd9e6",
    ambient: { color: "#fff4e0", intensity: 1.15 },
    moon: { color: "#fff1d6", intensity: 2.0, position: [-2.2, 2.6, -1.5] as Vec3 },
    fill: { color: "#dfe9ff", intensity: 1.1, position: [-3, 2.5, 4] as Vec3 },
    lamp: { color: "#ffcf99", intensity: 4, glow: 0.5 },
    window: "#dcecff",
    bloom: 0.15,
    vignette: 0.3,
  },
};

export type ThemeName = keyof typeof LIGHTS;
