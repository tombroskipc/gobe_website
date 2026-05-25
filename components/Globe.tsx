"use client";

import { OrbitControls } from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { memo, useMemo, useRef } from "react";
import * as THREE from "three";
import { EarthAssetModel } from "./EarthAssetModel";

type GlobeProps = {
  className?: string;
  /**
   * Optional scroll-driven zoom value from 0..1.
   * It is intentionally clamped and subtle so the globe stays fully visible.
   */
  scrollZoom?: number;
};

const ORANGE = "#F26522";
const WHITE = "#FFFFFF";

function ConservativeScrollCamera({ scrollZoom = 0 }: { scrollZoom?: number }) {
  const { camera } = useThree();
  const target = useMemo(() => new THREE.Vector3(), []);

  useFrame(() => {
    const safeZoom = THREE.MathUtils.clamp(scrollZoom, 0, 1);
    const distance = THREE.MathUtils.lerp(5.15, 4.65, safeZoom);
    target.set(0, 0.04, distance);
    camera.position.lerp(target, 0.08);
    camera.lookAt(0, 0, 0);
  });

  return null;
}

function GlobeModel() {
  const group = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (!group.current) return;
    group.current.rotation.y = -0.95 + clock.elapsedTime * 0.035;
    group.current.rotation.x = -0.22;
  });

  return (
    <group ref={group}>
      <EarthAssetModel scale={1.85} />
    </group>
  );
}

function GlobeCanvas({ scrollZoom }: { scrollZoom?: number }) {
  const controls = useRef<any>(null);

  return (
    <Canvas
      camera={{ position: [0, 0.04, 5.15], fov: 38, near: 0.1, far: 40 }}
      dpr={[1, 1.75]}
      gl={{
        alpha: true,
        antialias: true,
        powerPreference: "high-performance",
      }}
    >
      <ambientLight intensity={1.35} />
      <hemisphereLight args={[WHITE, "#e7e7e7", 1.1]} />
      <directionalLight position={[4, 4, 4]} intensity={2.1} color={WHITE} />
      <pointLight position={[-3, 2, 3]} intensity={5.5} color={ORANGE} distance={8} />

      <ConservativeScrollCamera scrollZoom={scrollZoom} />
      <GlobeModel />

      <OrbitControls
        ref={controls}
        enableDamping
        dampingFactor={0.075}
        enablePan={false}
        enableZoom={false}
        autoRotate={false}
        rotateSpeed={0.72}
        minPolarAngle={0}
        maxPolarAngle={Math.PI}
      />
    </Canvas>
  );
}

function GlobeComponent({ className = "", scrollZoom = 0 }: GlobeProps) {
  return (
    <div className={`relative h-full min-h-[520px] w-full ${className}`}>
      <GlobeCanvas scrollZoom={scrollZoom} />
    </div>
  );
}

export const Globe = memo(GlobeComponent);
