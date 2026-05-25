"use client";

import { Line } from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { memo, useMemo, useRef } from "react";
import * as THREE from "three";
import { EarthAssetModel } from "./EarthAssetModel";
import { detailedLandPolygons } from "./globeTexture";
import { scrollRig } from "./scrollRig";

type Hub = {
  id: string;
  lat: number;
  lon: number;
};

const ORANGE = "#F26522";
const WHITE = "#FFFFFF";
const RADIUS = 1.72;

const fresnelVertexShader = `
  varying vec3 vNormal;
  varying vec3 vWorldPosition;

  void main() {
    vNormal = normalize(normalMatrix * normal);
    vec4 worldPosition = modelMatrix * vec4(position, 1.0);
    vWorldPosition = worldPosition.xyz;
    gl_Position = projectionMatrix * viewMatrix * worldPosition;
  }
`;

const fresnelFragmentShader = `
  uniform vec3 uColor;
  uniform float uOpacity;
  varying vec3 vNormal;
  varying vec3 vWorldPosition;

  void main() {
    vec3 viewDirection = normalize(cameraPosition - vWorldPosition);
    float fresnel = pow(1.0 - max(dot(vNormal, viewDirection), 0.0), 2.35);
    gl_FragColor = vec4(uColor, fresnel * uOpacity);
  }
`;

const hubs: Hub[] = [
  { id: "vietnam", lat: 10.8231, lon: 106.6297 },
  { id: "japan", lat: 35.6762, lon: 139.6503 },
  { id: "usa", lat: 39.8283, lon: -98.5795 },
  { id: "singapore", lat: 1.3521, lon: 103.8198 },
];

const routes = [
  ["vietnam", "japan"],
  ["vietnam", "usa"],
  ["vietnam", "singapore"],
] as const;

const coreIcons = [
  { id: "goal", lat: 18, lon: 105 },
  { id: "open", lat: 24, lon: 112 },
  { id: "balanced", lat: 11, lon: 116 },
  { id: "empowerment", lat: 5, lon: 103 },
  { id: "entrepreneurship", lat: 30, lon: 122 },
  { id: "results", lat: 15, lon: 96 },
];

const landPolygons = detailedLandPolygons;

function seeded(seed: number) {
  const x = Math.sin(seed * 127.1) * 43758.5453;
  return x - Math.floor(x);
}

function latLonToVector(lat: number, lon: number, radius = RADIUS) {
  const phi = THREE.MathUtils.degToRad(90 - lat);
  const theta = THREE.MathUtils.degToRad(lon + 180);
  return new THREE.Vector3(
    -radius * Math.sin(phi) * Math.cos(theta),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta),
  );
}

function buildDataArc(from: Hub, to: Hub) {
  const start = latLonToVector(from.lat, from.lon, RADIUS + 0.055);
  const end = latLonToVector(to.lat, to.lon, RADIUS + 0.055);
  const midpoint = start
    .clone()
    .add(end)
    .normalize()
    .multiplyScalar(RADIUS + start.distanceTo(end) * 0.5);
  const curve = new THREE.CatmullRomCurve3([start, midpoint, end], false, "catmullrom", 0.72);
  return { curve, points: curve.getPoints(112) };
}

function createParticleSources(count: number) {
  const flattened = landPolygons.flatMap((polygon) => polygon.points);
  return Array.from({ length: count }, (_, index) => {
    const [lon, lat] = flattened[index % flattened.length];
    const lonOffset = (seeded(index + 10) - 0.5) * 14;
    const latOffset = (seeded(index + 20) - 0.5) * 10;
    return latLonToVector(lat + latOffset, lon + lonOffset, RADIUS + 0.04);
  });
}

function createParticleTargets(count: number) {
  return Array.from({ length: count }, (_, index) => {
    const theta = seeded(index + 100) * Math.PI * 2;
    const phi = Math.acos(2 * seeded(index + 200) - 1);
    const radius = 2.4 + seeded(index + 300) * 4.4;
    return new THREE.Vector3(
      radius * Math.sin(phi) * Math.cos(theta),
      radius * Math.cos(phi),
      radius * Math.sin(phi) * Math.sin(theta),
    );
  });
}

function CameraRig() {
  const { camera } = useThree();
  const cameraTarget = useMemo(() => new THREE.Vector3(), []);
  const lookTarget = useMemo(() => new THREE.Vector3(), []);

  useFrame(() => {
    cameraTarget.set(scrollRig.camera.x, scrollRig.camera.y, scrollRig.camera.z);
    camera.position.lerp(cameraTarget, 0.08);
    lookTarget.set(scrollRig.target.x, scrollRig.target.y, scrollRig.target.z);
    camera.lookAt(lookTarget);
  });

  return null;
}

function GlobeSystem() {
  const globe = useRef<THREE.Group>(null);
  const groupPosition = useMemo(() => new THREE.Vector3(), []);

  useFrame(({ clock, pointer }) => {
    if (!globe.current) return;

    groupPosition.set(scrollRig.globe.x, scrollRig.globe.y, scrollRig.globe.z);
    globe.current.position.lerp(groupPosition, 0.08);
    globe.current.scale.setScalar(THREE.MathUtils.lerp(globe.current.scale.x, scrollRig.globe.scale, 0.08));
    globe.current.rotation.x = scrollRig.globe.tilt + pointer.y * 0.045;
    globe.current.rotation.y =
      scrollRig.globe.yaw + clock.elapsedTime * 0.055 * scrollRig.globe.autoRotate + pointer.x * 0.08;
    globe.current.visible = scrollRig.dissolve < 0.97;
  });

  return (
    <group>
      <group ref={globe}>
        <EarthAssetModel scale={RADIUS} />
        <DataArcs />
        <HubNodes />
        <CoreValueIcons />
      </group>

      <DissolveParticles />
    </group>
  );
}

function DataArcs() {
  const hubMap = useMemo(() => new Map(hubs.map((hub) => [hub.id, hub])), []);
  const arcs = useMemo(
    () =>
      routes.map(([fromId, toId], index) => {
        const from = hubMap.get(fromId);
        const to = hubMap.get(toId);
        if (!from || !to) throw new Error("Invalid hub route");
        return { ...buildDataArc(from, to), index };
      }),
    [hubMap],
  );

  return (
    <>
      {arcs.map((arc) => (
        <DataArc key={arc.index} arc={arc} />
      ))}
    </>
  );
}

function DataArc({
  arc,
}: {
  arc: {
    curve: THREE.CatmullRomCurve3;
    points: THREE.Vector3[];
    index: number;
  };
}) {
  const pulse = useRef<THREE.Mesh>(null);
  const line = useRef<any>(null);

  useFrame(({ clock }) => {
    const opacity = (0.12 + scrollRig.arcReveal * 0.82) * (1 - scrollRig.dissolve);
    if (line.current?.material) {
      line.current.material.opacity = opacity;
      line.current.material.linewidth = 1.2 + scrollRig.networkGlow * 2.5;
    }
    if (pulse.current) {
      const progress = (clock.elapsedTime * (0.12 + scrollRig.networkGlow * 0.13) + arc.index * 0.27) % 1;
      pulse.current.position.copy(arc.curve.getPoint(progress));
      pulse.current.visible = scrollRig.arcReveal > 0.12 && scrollRig.dissolve < 0.82;
      pulse.current.scale.setScalar(1 + scrollRig.networkGlow * 0.72);
    }
  });

  return (
    <group>
      <Line ref={line} points={arc.points} color={ORANGE} lineWidth={1.5} transparent opacity={0.2} />
      <mesh ref={pulse}>
        <sphereGeometry args={[0.034, 16, 16]} />
        <meshBasicMaterial color={ORANGE} toneMapped={false} />
      </mesh>
    </group>
  );
}

function HubNodes() {
  return (
    <>
      {hubs.map((hub) => (
        <HubPin key={hub.id} hub={hub} />
      ))}
    </>
  );
}

function HubPin({ hub }: { hub: Hub }) {
  const ref = useRef<THREE.Group>(null);
  const position = useMemo(() => latLonToVector(hub.lat, hub.lon, RADIUS + 0.08), [hub.lat, hub.lon]);

  useFrame(({ clock, camera }) => {
    if (!ref.current) return;
    const glow = hub.id === "vietnam" ? scrollRig.vietnamGlow : scrollRig.networkGlow;
    ref.current.lookAt(camera.position);
    ref.current.scale.setScalar((1 + glow * 0.34 + Math.sin(clock.elapsedTime * 2.3) * 0.04) * (1 - scrollRig.dissolve));
    ref.current.visible = scrollRig.dissolve < 0.86;
  });

  return (
    <group ref={ref} position={position}>
      <mesh>
        <sphereGeometry args={[0.052, 20, 20]} />
        <meshBasicMaterial color={ORANGE} toneMapped={false} />
      </mesh>
      <mesh>
        <torusGeometry args={[0.14, 0.007, 8, 48]} />
        <meshBasicMaterial color={ORANGE} transparent opacity={0.88} toneMapped={false} />
      </mesh>
    </group>
  );
}

function CoreValueIcons() {
  return (
    <>
      {coreIcons.map((node) => (
        <CoreIcon key={node.id} node={node} />
      ))}
    </>
  );
}

function CoreIcon({ node }: { node: { id: string; lat: number; lon: number } }) {
  const ref = useRef<THREE.Group>(null);
  const base = useMemo(() => latLonToVector(node.lat, node.lon, RADIUS + 0.16), [node.lat, node.lon]);
  const lifted = useMemo(() => latLonToVector(node.lat, node.lon, RADIUS + 0.52), [node.lat, node.lon]);

  useFrame(({ camera }) => {
    if (!ref.current) return;
    ref.current.position.lerpVectors(base, lifted, scrollRig.iconReveal);
    ref.current.lookAt(camera.position);
    ref.current.scale.setScalar(scrollRig.iconReveal * (1 - scrollRig.dissolve));
    ref.current.visible = scrollRig.iconReveal > 0.03 && scrollRig.dissolve < 0.8;
  });

  return (
    <group ref={ref} visible={false}>
      <mesh>
        <octahedronGeometry args={[0.1, 0]} />
        <meshBasicMaterial color={ORANGE} toneMapped={false} />
      </mesh>
    </group>
  );
}

function DissolveParticles() {
  const ref = useRef<THREE.InstancedMesh>(null);
  const source = useMemo(() => createParticleSources(520), []);
  const targets = useMemo(() => createParticleTargets(source.length), [source.length]);
  const matrix = useMemo(() => new THREE.Matrix4(), []);
  const position = useMemo(() => new THREE.Vector3(), []);
  const scale = useMemo(() => new THREE.Vector3(), []);
  const quaternion = useMemo(() => new THREE.Quaternion(), []);
  const geometry = useMemo(() => new THREE.SphereGeometry(1, 8, 8), []);
  const material = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: ORANGE,
        opacity: 0.78,
        toneMapped: false,
        transparent: true,
      }),
    [],
  );

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const dissolve = scrollRig.dissolve;
    for (let index = 0; index < source.length; index += 1) {
      const jitter = Math.sin(clock.elapsedTime * 1.7 + index) * 0.035 * dissolve;
      position.copy(source[index]).lerp(targets[index], dissolve);
      position.x += jitter;
      scale.setScalar(0.01 + dissolve * 0.024);
      matrix.compose(position, quaternion, scale);
      ref.current.setMatrixAt(index, matrix);
    }
    ref.current.instanceMatrix.needsUpdate = true;
    ref.current.visible = dissolve > 0.02;
  });

  return <instancedMesh ref={ref} args={[geometry, material, source.length]} visible={false} />;
}

function SceneLights() {
  return (
    <>
      <ambientLight intensity={1.4} />
      <hemisphereLight args={[WHITE, "#e5e5e5", 1.35]} />
      <directionalLight position={[4, 5, 4]} intensity={2.5} color={WHITE} />
      <pointLight position={[-3.6, 1.6, 3.2]} intensity={12} color={ORANGE} distance={8} />
    </>
  );
}

function SceneContents() {
  return (
    <>
      <CameraRig />
      <SceneLights />
      <GlobeSystem />
    </>
  );
}

function GlobeSceneComponent() {
  return (
    <div className="fixed inset-0 z-0">
      <Canvas
        camera={{ position: [0, 0.2, 6.3], fov: 42, near: 0.1, far: 80 }}
        dpr={[1, 1.7]}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      >
        <SceneContents />
      </Canvas>
    </div>
  );
}

export const GlobeScene = memo(GlobeSceneComponent);
