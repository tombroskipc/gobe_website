"use client";

import { Line } from "@react-three/drei";
import { useFrame, useLoader } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader.js";
import { detailedLandPolygons } from "./globeTexture";

type EarthAssetModelProps = {
  opacity?: number;
  scale?: number;
  density?: number;
};

type Route = {
  from: [number, number];
  to: [number, number];
};

const MODEL_PATH = "/earth-asset/base.obj";
const ORANGE = "#F26522";
const HOT_ORANGE = "#ff9a45";
const SOFT_ORANGE = "#ffb274";
const DEEP_SPACE = "#020713";
const BASE_RADIUS = 1;

const routes: Route[] = [
  { from: [106.63, 10.82], to: [139.65, 35.67] },
  { from: [106.63, 10.82], to: [103.82, 1.35] },
  { from: [106.63, 10.82], to: [-122.41, 37.77] },
  { from: [106.63, 10.82], to: [-74.0, 40.71] },
  { from: [139.65, 35.67], to: [-0.12, 51.5] },
];

function seeded(seed: number) {
  const value = Math.sin(seed * 127.1) * 43758.5453123;
  return value - Math.floor(value);
}

function latLonToVector(lat: number, lon: number, radius = BASE_RADIUS) {
  const phi = THREE.MathUtils.degToRad(90 - lat);
  const theta = THREE.MathUtils.degToRad(lon + 180);

  return new THREE.Vector3(
    -radius * Math.sin(phi) * Math.cos(theta),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta),
  );
}

function pointInPolygon(lon: number, lat: number, points: Array<[number, number]>) {
  let inside = false;

  for (let index = 0, previous = points.length - 1; index < points.length; previous = index++) {
    const [currentLon, currentLat] = points[index];
    const [previousLon, previousLat] = points[previous];
    const crossesLatitude = currentLat > lat !== previousLat > lat;
    const projectedLon =
      ((previousLon - currentLon) * (lat - currentLat)) / (previousLat - currentLat + Number.EPSILON) + currentLon;

    if (crossesLatitude && lon < projectedLon) {
      inside = !inside;
    }
  }

  return inside;
}

function buildLandDotPositions(maxDots: number) {
  const positions: number[] = [];
  const latStep = 1.18;
  const lonStep = 1.28;

  for (let polygonIndex = 0; polygonIndex < detailedLandPolygons.length; polygonIndex += 1) {
    if (positions.length / 3 >= maxDots) break;

    const points = detailedLandPolygons[polygonIndex].points;
    if (points.length < 3) continue;

    const lons = points.map(([lon]) => lon);
    const lats = points.map(([, lat]) => lat);
    const minLon = Math.max(-180, Math.min(...lons));
    const maxLon = Math.min(180, Math.max(...lons));
    const minLat = Math.max(-86, Math.min(...lats));
    const maxLat = Math.min(86, Math.max(...lats));
    const latStart = Math.floor(minLat / latStep) * latStep;
    const lonStart = Math.floor(minLon / lonStep) * lonStep;

    for (let lat = latStart; lat <= maxLat; lat += latStep) {
      const row = Math.round((lat + 90) / latStep);
      const offset = row % 2 === 0 ? lonStep * 0.5 : 0;

      for (let lon = lonStart + offset; lon <= maxLon; lon += lonStep) {
        if (positions.length / 3 >= maxDots) break;
        if (!pointInPolygon(lon, lat, points)) continue;

        const jitterLon = (seeded(positions.length + polygonIndex * 17) - 0.5) * 0.34;
        const jitterLat = (seeded(positions.length + polygonIndex * 29) - 0.5) * 0.26;
        const point = latLonToVector(lat + jitterLat, lon + jitterLon, BASE_RADIUS + 0.018);

        positions.push(point.x, point.y, point.z);
      }
    }
  }

  return new Float32Array(positions);
}

function createLatitudeLine(lat: number) {
  return Array.from({ length: 181 }, (_, index) => {
    const lon = -180 + index * 2;
    return latLonToVector(lat, lon, BASE_RADIUS + 0.006);
  });
}

function createLongitudeLine(lon: number) {
  return Array.from({ length: 105 }, (_, index) => {
    const lat = -78 + index * 1.5;
    return latLonToVector(lat, lon, BASE_RADIUS + 0.008);
  });
}

function createArc(from: [number, number], to: [number, number], index: number) {
  const start = latLonToVector(from[1], from[0], BASE_RADIUS + 0.055);
  const end = latLonToVector(to[1], to[0], BASE_RADIUS + 0.055);
  const lift = 0.3 + index * 0.035;
  const midpoint = start
    .clone()
    .add(end)
    .normalize()
    .multiplyScalar(BASE_RADIUS + start.distanceTo(end) * (0.42 + lift));
  const curve = new THREE.CatmullRomCurve3([start, midpoint, end], false, "catmullrom", 0.68);

  return {
    curve,
    points: curve.getPoints(112),
  };
}

function createNormalizedAsset(source: THREE.Group, opacity: number) {
  const clone = source.clone(true);

  clone.traverse((child) => {
    if (!(child instanceof THREE.Mesh)) return;
    child.material = new THREE.MeshBasicMaterial({
      color: HOT_ORANGE,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      opacity: opacity * 0.015,
      transparent: true,
      wireframe: true,
      toneMapped: false,
    });
    child.castShadow = false;
    child.receiveShadow = false;
    child.frustumCulled = true;
  });

  const box = new THREE.Box3().setFromObject(clone);
  const center = box.getCenter(new THREE.Vector3());
  const size = box.getSize(new THREE.Vector3());
  const maxDimension = Math.max(size.x, size.y, size.z) || 1;

  clone.position.sub(center);
  clone.scale.multiplyScalar(2 / maxDimension);

  const normalized = new THREE.Group();
  normalized.add(clone);

  return normalized;
}

function DataArc({
  arc,
  index,
  opacity,
}: {
  arc: ReturnType<typeof createArc>;
  index: number;
  opacity: number;
}) {
  const pulse = useRef<THREE.Mesh>(null);
  const line = useRef<any>(null);

  useFrame(({ clock }) => {
    const pulseProgress = (clock.elapsedTime * 0.18 + index * 0.19) % 1;
    const shimmer = 0.58 + Math.sin(clock.elapsedTime * 1.35 + index) * 0.18;

    if (line.current?.material) {
      line.current.material.opacity = opacity * (0.3 + shimmer * 0.24);
    }

    if (pulse.current) {
      pulse.current.position.copy(arc.curve.getPoint(pulseProgress));
      pulse.current.scale.setScalar(0.72 + shimmer * 0.46);
    }
  });

  return (
    <group>
      <Line ref={line} points={arc.points} color={HOT_ORANGE} lineWidth={1.35} transparent opacity={opacity * 0.42} />
      <mesh ref={pulse}>
        <sphereGeometry args={[0.024, 14, 14]} />
        <meshBasicMaterial
          color={SOFT_ORANGE}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          toneMapped={false}
        />
      </mesh>
    </group>
  );
}

function HudRings({ opacity }: { opacity: number }) {
  const ring = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (!ring.current) return;
    ring.current.rotation.y = clock.elapsedTime * 0.11;
    ring.current.rotation.z = Math.sin(clock.elapsedTime * 0.32) * 0.07;
  });

  const material = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: HOT_ORANGE,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        opacity: opacity * 0.11,
        transparent: true,
        toneMapped: false,
      }),
    [opacity],
  );

  return (
    <group ref={ring}>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.05, 0.0025, 8, 160]} />
        <primitive object={material} attach="material" />
      </mesh>
      <mesh rotation={[0.22, Math.PI / 2, 0.08]}>
        <torusGeometry args={[1.09, 0.0022, 8, 160]} />
        <meshBasicMaterial
          color={HOT_ORANGE}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          opacity={opacity * 0.09}
          transparent
          toneMapped={false}
        />
      </mesh>
      <mesh rotation={[0.62, 0.08, Math.PI / 2]}>
        <torusGeometry args={[1.16, 0.0018, 8, 160]} />
        <meshBasicMaterial
          color={SOFT_ORANGE}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          opacity={opacity * 0.075}
          transparent
          toneMapped={false}
        />
      </mesh>
    </group>
  );
}

export function EarthAssetModel({ opacity = 1, scale = 1, density = 1 }: EarthAssetModelProps) {
  const source = useLoader(OBJLoader, MODEL_PATH);
  const root = useRef<THREE.Group>(null);
  const dotsMaterial = useRef<THREE.PointsMaterial>(null);
  const assetShell = useMemo(() => createNormalizedAsset(source, opacity), [opacity, source]);
  const dotGeometry = useMemo(() => {
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(buildLandDotPositions(Math.round(11800 * density)), 3));
    return geometry;
  }, [density]);
  const latitudeLines = useMemo(() => [-60, -30, 0, 30, 60].map(createLatitudeLine), []);
  const longitudeLines = useMemo(() => [-150, -120, -90, -60, -30, 0, 30, 60, 90, 120, 150, 180].map(createLongitudeLine), []);
  const arcs = useMemo(() => routes.map((route, index) => createArc(route.from, route.to, index)), []);

  useFrame(({ clock }) => {
    if (root.current) {
      root.current.rotation.x = -0.34 + Math.sin(clock.elapsedTime * 0.18) * 0.018;
      root.current.rotation.z = 0.07 + Math.sin(clock.elapsedTime * 0.13) * 0.012;
    }

    if (dotsMaterial.current) {
      dotsMaterial.current.opacity = opacity * (0.94 + Math.sin(clock.elapsedTime * 2.2) * 0.06);
      dotsMaterial.current.size = 0.021 + Math.sin(clock.elapsedTime * 1.9) * 0.0014;
    }
  });

  return (
    <group ref={root} scale={scale} rotation={[-0.34, -0.58, 0.07]}>
      <mesh>
        <sphereGeometry args={[BASE_RADIUS * 0.996, 72, 36]} />
        <meshBasicMaterial color={DEEP_SPACE} depthWrite opacity={opacity * 0.78} transparent />
      </mesh>

      <primitive object={assetShell} />

      <points geometry={dotGeometry}>
        <pointsMaterial
          ref={dotsMaterial}
          color={ORANGE}
          size={0.021}
          sizeAttenuation
          transparent
          opacity={opacity * 0.9}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          toneMapped={false}
        />
      </points>

      <mesh>
        <sphereGeometry args={[BASE_RADIUS + 0.012, 72, 36]} />
        <meshBasicMaterial
          color={HOT_ORANGE}
          wireframe
          transparent
          opacity={opacity * 0.032}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          toneMapped={false}
        />
      </mesh>

      {latitudeLines.map((points, index) => (
        <Line
          key={`lat-${index}`}
          points={points}
          color={HOT_ORANGE}
          lineWidth={0.48}
          transparent
          opacity={opacity * 0.065}
        />
      ))}

      {longitudeLines.map((points, index) => (
        <Line
          key={`lon-${index}`}
          points={points}
          color={HOT_ORANGE}
          lineWidth={0.42}
          transparent
          opacity={opacity * 0.055}
        />
      ))}

      {arcs.map((arc, index) => (
        <DataArc key={index} arc={arc} index={index} opacity={opacity} />
      ))}

      <HudRings opacity={opacity} />

      <pointLight position={[1.2, 1.2, 1.8]} color={ORANGE} intensity={opacity * 3.4} distance={4.5} />
    </group>
  );
}
