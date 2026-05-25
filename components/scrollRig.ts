export type RigVector = {
  x: number;
  y: number;
  z: number;
};

export const scrollRig = {
  camera: { x: 0, y: 0.2, z: 6.3 },
  target: { x: 0, y: 0, z: 0 },
  globe: { x: 0, y: 0, z: 0, scale: 1, tilt: -0.28, yaw: -0.86, autoRotate: 1 },
  arcReveal: 0.08,
  landGlow: 0.65,
  vietnamGlow: 0.35,
  networkGlow: 0.18,
  iconReveal: 0,
  particleReveal: 0,
  dissolve: 0,
  contactShift: 0,
};
