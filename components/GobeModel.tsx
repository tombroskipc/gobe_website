"use client";

import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { memo, useMemo, useRef } from "react";
import * as THREE from "three";

const CAMERA_POSITION = new THREE.Vector3(0, 3.05, 5.6);
const CAMERA_TARGET = new THREE.Vector3(0, 0.42, 0);
const CAMERA_FOV = 34;
const LOGO_ORANGE = "#F26522";
const HOT_ORANGE = "#ff8c3a";
const SOFT_ORANGE = "#ffc092";
const GLASS_BLUE = "#edf5fb";
const WATER_BLUE = "#b9e7ff";
const ISLAND_SAND = "#e4ad77";
const AUTO_ROTATE_SPEED = 0.026;
const DOME_RADIUS = 1.72;
const EARTH_CUT_Y = 0.02;
const EARTH_MAP_TEXTURE = "/textures/sara-earth/earthmap.jpg";
const EARTH_LIGHTS_TEXTURE = "/textures/sara-earth/earth_lights.png";
const EARTH_CLOUDS_TEXTURE = "/textures/sara-earth/cloud_combined.jpg";

interface GobeModelProps {
  scale?: number;
  autoRotate?: boolean;
  className?: string;
}

function configureEarthTexture(texture: THREE.Texture, colorSpace?: THREE.ColorSpace) {
  texture.colorSpace = colorSpace ?? THREE.NoColorSpace;
  texture.anisotropy = 8;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  texture.needsUpdate = true;
}

function withLocalHemisphereClip<T extends THREE.Material>(material: T) {
  material.onBeforeCompile = (shader) => {
    shader.vertexShader = `
      varying vec3 vLocalPosition;
      ${shader.vertexShader.replace("#include <begin_vertex>", "#include <begin_vertex>\n        vLocalPosition = position;")}
    `;
    shader.fragmentShader = `
      varying vec3 vLocalPosition;
      ${shader.fragmentShader.replace("void main() {", `void main() {\n        if (vLocalPosition.y > ${EARTH_CUT_Y.toFixed(3)}) discard;`)}
    `;
  };
  material.customProgramCacheKey = () => `local-hemisphere-clip-${EARTH_CUT_Y}`;

  return material;
}

function createFresnelEarthMaterial() {
  return new THREE.ShaderMaterial({
    uniforms: {
      color1: { value: new THREE.Color("#3ABEF9") },
      color2: { value: new THREE.Color("#000000") },
      fresnelBias: { value: 0.2 },
      fresnelScale: { value: 1.0 },
      fresnelPower: { value: 8.0 },
      cutY: { value: EARTH_CUT_Y },
    },
    vertexShader: `
      uniform float fresnelBias;
      uniform float fresnelScale;
      uniform float fresnelPower;

      varying float vReflectionFactor;
      varying vec3 vLocalPosition;

      void main() {
        vLocalPosition = position;
        vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
        vec4 worldPosition = modelMatrix * vec4(position, 1.0);
        vec3 worldNormal = normalize(mat3(modelMatrix[0].xyz, modelMatrix[1].xyz, modelMatrix[2].xyz) * normal);
        vec3 eyeVector = worldPosition.xyz - cameraPosition;

        vReflectionFactor = fresnelBias + fresnelScale * pow(1.0 + dot(normalize(eyeVector), worldNormal), fresnelPower);
        gl_Position = projectionMatrix * mvPosition;
      }
    `,
    fragmentShader: `
      uniform vec3 color1;
      uniform vec3 color2;
      uniform float cutY;

      varying float vReflectionFactor;
      varying vec3 vLocalPosition;

      void main() {
        if (vLocalPosition.y > cutY) discard;
        float fresnel = clamp(vReflectionFactor, 0.0, 1.0);
        gl_FragColor = vec4(mix(color2, color1, vec3(fresnel)), fresnel * 0.78);
      }
    `,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    transparent: true,
  });
}

function createCurveLine(points: THREE.Vector3[], color: string, opacity: number) {
  const curve = new THREE.CatmullRomCurve3(points, true, "catmullrom", 0.55);
  const geometry = new THREE.BufferGeometry().setFromPoints(curve.getPoints(120));
  const material = new THREE.LineBasicMaterial({
    color,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    opacity,
    transparent: true,
    toneMapped: false,
  });
  const line = new THREE.Line(geometry, material);
  line.renderOrder = 20;

  return line;
}

function createRoadGeometry() {
  const curve = new THREE.CatmullRomCurve3(
    [
      new THREE.Vector3(-0.72, 0.2, 0.2),
      new THREE.Vector3(-0.36, 0.2, -0.54),
      new THREE.Vector3(0.36, 0.2, -0.48),
      new THREE.Vector3(0.68, 0.2, -0.05),
      new THREE.Vector3(0.48, 0.2, 0.52),
      new THREE.Vector3(-0.18, 0.2, 0.62),
      new THREE.Vector3(-0.7, 0.2, 0.2),
    ],
    true,
    "catmullrom",
    0.58,
  );

  return new THREE.TubeGeometry(curve, 140, 0.018, 8, true);
}

function createBrandLogoTexture() {
  if (typeof document === "undefined") {
    return new THREE.Texture();
  }

  const canvas = document.createElement("canvas");
  canvas.width = 1024;
  canvas.height = 512;

  const context = canvas.getContext("2d");
  if (!context) {
    return new THREE.Texture();
  }

  context.clearRect(0, 0, canvas.width, canvas.height);
  context.textAlign = "center";
  context.textBaseline = "middle";
  context.fillStyle = LOGO_ORANGE;
  context.shadowColor = "rgba(242, 101, 34, 0.36)";
  context.shadowBlur = 18;
  context.font = "900 250px Arial Black, Impact, sans-serif";
  context.fillText("GO", 476, 205);

  context.shadowBlur = 10;
  context.font = "900 104px Arial Black, Impact, sans-serif";
  context.fillText("beyond", 542, 365);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 8;
  texture.needsUpdate = true;

  return texture;
}

function EarthShell() {
  const [earthTexture, lightsTexture, cloudsTexture] = useLoader(THREE.TextureLoader, [
    EARTH_MAP_TEXTURE,
    EARTH_LIGHTS_TEXTURE,
    EARTH_CLOUDS_TEXTURE,
  ]);
  const earthMaterial = useMemo(
    () => {
      configureEarthTexture(earthTexture, THREE.SRGBColorSpace);

      return withLocalHemisphereClip(
        new THREE.MeshPhongMaterial({
          map: earthTexture,
          shininess: 14,
          specular: new THREE.Color("#24364f"),
        }),
      );
    },
    [earthTexture],
  );
  const lightsMaterial = useMemo(
    () => {
      configureEarthTexture(lightsTexture, THREE.SRGBColorSpace);

      return withLocalHemisphereClip(
        new THREE.MeshBasicMaterial({
          blending: THREE.AdditiveBlending,
          depthWrite: false,
          map: lightsTexture,
          opacity: 0.62,
          transparent: true,
        }),
      );
    },
    [lightsTexture],
  );
  const cloudsMaterial = useMemo(
    () => {
      configureEarthTexture(cloudsTexture, THREE.SRGBColorSpace);

      return withLocalHemisphereClip(
        new THREE.MeshStandardMaterial({
          blending: THREE.AdditiveBlending,
          depthWrite: false,
          map: cloudsTexture,
          opacity: 0.58,
          roughness: 0.9,
          transparent: true,
        }),
      );
    },
    [cloudsTexture],
  );
  const fresnelMaterial = useMemo(createFresnelEarthMaterial, []);

  return (
    <group rotation={[0, -2.42, 0]}>
      <mesh position={[0, -0.02, 0]}>
        <icosahedronGeometry args={[DOME_RADIUS, 14]} />
        <primitive object={earthMaterial} attach="material" />
      </mesh>

      <mesh position={[0, -0.02, 0]} scale={1.001}>
        <icosahedronGeometry args={[DOME_RADIUS, 14]} />
        <primitive object={lightsMaterial} attach="material" />
      </mesh>

      <mesh position={[0, -0.02, 0]} scale={1.003}>
        <icosahedronGeometry args={[DOME_RADIUS, 14]} />
        <primitive object={cloudsMaterial} attach="material" />
      </mesh>

      <mesh position={[0, -0.02, 0]} scale={1.012}>
        <icosahedronGeometry args={[DOME_RADIUS, 14]} />
        <primitive object={fresnelMaterial} attach="material" />
      </mesh>

      <mesh position={[0, 0.02, 0]}>
        <cylinderGeometry args={[DOME_RADIUS * 0.99, DOME_RADIUS * 0.99, 0.08, 128]} />
        <meshStandardMaterial
          color="#1c314b"
          emissive="#0f2239"
          emissiveIntensity={0.12}
          metalness={0.05}
          opacity={0.018}
          roughness={0.38}
          transparent
        />
      </mesh>
    </group>
  );
}

function GlassDome() {
  const facetLines = useMemo(
    () => [
      createCurveLine(
        [new THREE.Vector3(-1.05, 0.02, 1.18), new THREE.Vector3(-0.96, 1.0, 0.76), new THREE.Vector3(-0.4, 1.62, 0.16)],
        GLASS_BLUE,
        0.035,
      ),
      createCurveLine(
        [new THREE.Vector3(1.08, 0.02, 1.1), new THREE.Vector3(0.92, 1.16, 0.48), new THREE.Vector3(0.24, 1.68, -0.08)],
        SOFT_ORANGE,
        0.055,
      ),
      createCurveLine(
        [new THREE.Vector3(-1.4, 0.02, -0.3), new THREE.Vector3(-1.1, 1.0, -0.75), new THREE.Vector3(-0.38, 1.58, -0.42)],
        GLASS_BLUE,
        0.025,
      ),
      createCurveLine(
        [new THREE.Vector3(1.4, 0.02, -0.28), new THREE.Vector3(1.08, 0.9, -0.78), new THREE.Vector3(0.44, 1.54, -0.48)],
        SOFT_ORANGE,
        0.032,
      ),
    ],
    [],
  );

  return (
    <group>
      <mesh renderOrder={4}>
        <sphereGeometry args={[DOME_RADIUS * 1.02, 96, 48, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial
          color={GLASS_BLUE}
          depthWrite={false}
          metalness={0.02}
          opacity={0.032}
          roughness={0.2}
          side={THREE.DoubleSide}
          transparent
        />
      </mesh>

      <mesh renderOrder={5}>
        <sphereGeometry args={[DOME_RADIUS * 1.025, 48, 24, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshBasicMaterial color={GLASS_BLUE} depthWrite={false} opacity={0.008} transparent wireframe />
      </mesh>

      <mesh rotation={[Math.PI / 2, 0, 0]} renderOrder={8}>
        <torusGeometry args={[DOME_RADIUS * 1.015, 0.012, 8, 192]} />
        <meshStandardMaterial
          color={GLASS_BLUE}
          emissive="#31506f"
          emissiveIntensity={0.14}
          opacity={0.18}
          transparent
        />
      </mesh>

      {facetLines.map((line, index) => (
        <primitive key={index} object={line} />
      ))}
    </group>
  );
}

function DioramaPlatform() {
  return (
    <group>
      <mesh position={[0, 0.065, 0]} rotation={[0, Math.PI / 10, 0]}>
        <cylinderGeometry args={[1.66, 1.66, 0.055, 10]} />
        <meshStandardMaterial color={WATER_BLUE} emissive="#3f7ca0" emissiveIntensity={0.16} roughness={0.28} />
      </mesh>

      <mesh position={[0, 0.1, 0]} rotation={[0, Math.PI / 10, 0]}>
        <cylinderGeometry args={[1.36, 1.5, 0.09, 10]} />
        <meshStandardMaterial color="#4c2927" emissive="#32150d" emissiveIntensity={0.28} roughness={0.56} />
      </mesh>

      <mesh position={[0, 0.158, 0]} rotation={[0, Math.PI / 10, 0]}>
        <cylinderGeometry args={[1.36, 1.36, 0.014, 10]} />
        <meshStandardMaterial color={ISLAND_SAND} emissive="#6a2f18" emissiveIntensity={0.08} roughness={0.62} />
      </mesh>

      <mesh position={[0, 0.172, 0]} rotation={[-Math.PI / 2, 0, Math.PI / 10]}>
        <ringGeometry args={[1.34, 1.38, 10, 1]} />
        <meshBasicMaterial color={HOT_ORANGE} opacity={0.58} transparent />
      </mesh>
    </group>
  );
}

function RoadLoop() {
  const roadGeometry = useMemo(createRoadGeometry, []);

  return (
    <group>
      <mesh geometry={roadGeometry}>
        <meshStandardMaterial color="#1b2430" emissive="#0b1018" emissiveIntensity={0.42} roughness={0.5} />
      </mesh>
      <mesh position={[0.06, 0.205, -0.08]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.095, 0.148, 48]} />
        <meshBasicMaterial color="#dfe7ea" opacity={0.88} transparent />
      </mesh>
      <mesh position={[0.06, 0.206, -0.08]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.055, 0.073, 48]} />
        <meshBasicMaterial color={HOT_ORANGE} opacity={0.72} transparent />
      </mesh>
      {[
        [-0.54, 0.226, 0.24, -0.6],
        [-0.28, 0.226, -0.38, 0.12],
        [0.38, 0.226, -0.32, 0.7],
        [0.52, 0.226, 0.28, -0.28],
        [-0.1, 0.226, 0.52, 1.35],
        [0.18, 0.226, 0.38, 1.04],
      ].map(([x, y, z, rotation]) => (
        <mesh key={`${x}-${z}`} position={[x, y, z]} rotation={[0, rotation, 0]}>
          <boxGeometry args={[0.13, 0.006, 0.012]} />
          <meshBasicMaterial color="#f5f2e8" opacity={0.84} transparent />
        </mesh>
      ))}
    </group>
  );
}

function PlaneModel({
  position,
  rotation,
  scale = 1,
}: {
  position: [number, number, number];
  rotation: [number, number, number];
  scale?: number;
}) {
  return (
    <group position={position} rotation={rotation} scale={scale}>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.035, 0.04, 0.62, 18]} />
        <meshStandardMaterial color="#e6edf3" emissive="#2b3440" emissiveIntensity={0.08} roughness={0.36} />
      </mesh>
      <mesh position={[0, 0, -0.34]} rotation={[-Math.PI / 2, 0, 0]}>
        <coneGeometry args={[0.04, 0.1, 18]} />
        <meshStandardMaterial color="#f7fbff" roughness={0.32} />
      </mesh>
      <mesh position={[0, 0.038, -0.24]} rotation={[-0.22, 0, 0]}>
        <boxGeometry args={[0.072, 0.026, 0.09]} />
        <meshStandardMaterial color="#8fb3c9" emissive="#284b60" emissiveIntensity={0.16} roughness={0.18} />
      </mesh>
      <mesh position={[0, 0, 0.35]} rotation={[Math.PI / 2, 0, 0]}>
        <coneGeometry args={[0.038, 0.12, 18]} />
        <meshStandardMaterial color={LOGO_ORANGE} emissive={LOGO_ORANGE} emissiveIntensity={0.08} roughness={0.42} />
      </mesh>
      <mesh position={[0, 0, -0.02]}>
        <boxGeometry args={[0.72, 0.018, 0.12]} />
        <meshStandardMaterial color="#dfe8ef" roughness={0.35} />
      </mesh>
      <mesh position={[0, 0.055, 0.3]}>
        <boxGeometry args={[0.24, 0.012, 0.08]} />
        <meshStandardMaterial color="#dfe8ef" roughness={0.35} />
      </mesh>
      <mesh position={[0, 0.085, 0.35]}>
        <boxGeometry args={[0.045, 0.12, 0.08]} />
        <meshStandardMaterial color={LOGO_ORANGE} emissive={LOGO_ORANGE} emissiveIntensity={0.12} roughness={0.4} />
      </mesh>
      <mesh position={[-0.048, 0.028, -0.25]} rotation={[0.18, 0, -0.4]}>
        <boxGeometry args={[0.16, 0.01, 0.038]} />
        <meshStandardMaterial color="#cfdce5" roughness={0.34} />
      </mesh>
      <mesh position={[0.048, 0.028, -0.25]} rotation={[0.18, 0, 0.4]}>
        <boxGeometry args={[0.16, 0.01, 0.038]} />
        <meshStandardMaterial color="#cfdce5" roughness={0.34} />
      </mesh>
      {[-0.2, 0.2].map((x) => (
        <mesh key={x} position={[x, -0.026, -0.02]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.022, 0.022, 0.05, 12]} />
          <meshStandardMaterial color="#d9e2e7" roughness={0.32} />
        </mesh>
      ))}
      {[-0.24, -0.16, -0.08, 0, 0.08, 0.16, 0.24].map((z) => (
        <mesh key={`right-${z}`} position={[0.038, 0.018, z]}>
          <boxGeometry args={[0.008, 0.01, 0.026]} />
          <meshBasicMaterial color="#7896a8" opacity={0.78} transparent />
        </mesh>
      ))}
      {[-0.2, -0.1, 0, 0.1, 0.2].map((z) => (
        <mesh key={`left-${z}`} position={[-0.038, 0.018, z]}>
          <boxGeometry args={[0.008, 0.01, 0.026]} />
          <meshBasicMaterial color="#7896a8" opacity={0.58} transparent />
        </mesh>
      ))}
      <mesh position={[-0.14, -0.012, -0.02]}>
        <boxGeometry args={[0.12, 0.01, 0.018]} />
        <meshBasicMaterial color={LOGO_ORANGE} />
      </mesh>
      <mesh position={[0.14, -0.012, -0.02]}>
        <boxGeometry args={[0.12, 0.01, 0.018]} />
        <meshBasicMaterial color={LOGO_ORANGE} />
      </mesh>
      {[-0.16, 0.16].map((x) => (
        <mesh key={`gear-${x}`} position={[x, -0.055, 0.08]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.012, 0.012, 0.012, 10]} />
          <meshBasicMaterial color="#121821" />
        </mesh>
      ))}
    </group>
  );
}

function CargoShip({
  position,
  rotation = 0,
  scale = 1,
}: {
  position: [number, number, number];
  rotation?: number;
  scale?: number;
}) {
  return (
    <group position={position} rotation={[0, rotation, 0]} scale={scale}>
      <mesh position={[0, 0.025, 0]}>
        <boxGeometry args={[0.46, 0.06, 0.13]} />
        <meshStandardMaterial color="#a92f28" emissive="#3a0e0b" emissiveIntensity={0.16} roughness={0.45} />
      </mesh>
      <mesh position={[-0.26, 0.032, 0]} rotation={[0, 0, -Math.PI / 2]}>
        <coneGeometry args={[0.068, 0.13, 4]} />
        <meshStandardMaterial color="#c84232" emissive="#3a0e0b" emissiveIntensity={0.16} roughness={0.42} />
      </mesh>
      <mesh position={[0.02, 0.065, 0]}>
        <boxGeometry args={[0.34, 0.018, 0.105]} />
        <meshStandardMaterial color="#171e2a" roughness={0.5} />
      </mesh>
      {[-0.13, -0.065, 0, 0.065, 0.13].map((x, index) => (
        <mesh key={`container-row-a-${x}`} position={[x, 0.095, -0.034]}>
          <boxGeometry args={[0.052, 0.038, 0.046]} />
          <meshStandardMaterial color={index % 3 === 0 ? LOGO_ORANGE : index % 3 === 1 ? "#d7dee4" : "#566779"} roughness={0.44} />
        </mesh>
      ))}
      {[-0.096, -0.032, 0.032, 0.096].map((x, index) => (
        <mesh key={`container-row-b-${x}`} position={[x, 0.095, 0.032]}>
          <boxGeometry args={[0.052, 0.038, 0.046]} />
          <meshStandardMaterial color={index % 3 === 0 ? LOGO_ORANGE : index % 3 === 1 ? "#d7dee4" : "#566779"} roughness={0.44} />
        </mesh>
      ))}
      <mesh position={[0.2, 0.108, 0.025]}>
        <boxGeometry args={[0.07, 0.082, 0.075]} />
        <meshStandardMaterial color="#d6e1e7" roughness={0.4} />
      </mesh>
      <mesh position={[0.2, 0.158, 0.025]}>
        <boxGeometry args={[0.052, 0.018, 0.055]} />
        <meshStandardMaterial color="#8fa3b1" roughness={0.35} />
      </mesh>
      <mesh position={[0.23, 0.18, 0.025]}>
        <cylinderGeometry args={[0.004, 0.004, 0.11, 8]} />
        <meshBasicMaterial color="#f5f2e8" />
      </mesh>
      <mesh position={[0.2, 0.11, 0.065]}>
        <boxGeometry args={[0.044, 0.026, 0.006]} />
        <meshBasicMaterial color="#6f91a6" opacity={0.78} transparent />
      </mesh>
      <mesh position={[0.2, 0.11, -0.015]}>
        <boxGeometry args={[0.044, 0.026, 0.006]} />
        <meshBasicMaterial color="#6f91a6" opacity={0.7} transparent />
      </mesh>
      <mesh position={[-0.05, 0.128, -0.074]} rotation={[Math.PI / 2, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.006, 0.006, 0.36, 8]} />
        <meshBasicMaterial color="#f5f2e8" />
      </mesh>
      <mesh position={[-0.05, 0.128, 0.074]} rotation={[Math.PI / 2, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.006, 0.006, 0.36, 8]} />
        <meshBasicMaterial color="#f5f2e8" />
      </mesh>
      <mesh position={[0.28, 0.13, -0.02]} rotation={[0, 0, -0.25]}>
        <boxGeometry args={[0.006, 0.11, 0.006]} />
        <meshBasicMaterial color="#f0ede6" />
      </mesh>
    </group>
  );
}

function SmallVehicle({
  position,
  rotation = 0,
  color = LOGO_ORANGE,
}: {
  position: [number, number, number];
  rotation?: number;
  color?: string;
}) {
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      <mesh position={[0, 0.018, 0]}>
        <boxGeometry args={[0.105, 0.034, 0.052]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.05} roughness={0.42} />
      </mesh>
      <mesh position={[0.024, 0.048, 0]}>
        <boxGeometry args={[0.048, 0.028, 0.044]} />
        <meshStandardMaterial color="#d8e2e7" roughness={0.32} />
      </mesh>
      {[-0.038, 0.038].flatMap((x) =>
        [-0.031, 0.031].map((z) => (
          <mesh key={`${x}-${z}`} position={[x, -0.004, z]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.011, 0.011, 0.01, 10]} />
            <meshBasicMaterial color="#111722" />
          </mesh>
        )),
      )}
    </group>
  );
}

function ContainerTruck({
  position,
  rotation = 0,
}: {
  position: [number, number, number];
  rotation?: number;
}) {
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      <mesh position={[0.03, 0.045, 0]}>
        <boxGeometry args={[0.34, 0.075, 0.105]} />
        <meshStandardMaterial color={LOGO_ORANGE} emissive={LOGO_ORANGE} emissiveIntensity={0.06} roughness={0.48} />
      </mesh>
      <mesh position={[-0.17, 0.05, 0]}>
        <boxGeometry args={[0.095, 0.09, 0.11]} />
        <meshStandardMaterial color="#dce6eb" roughness={0.36} />
      </mesh>
      <mesh position={[-0.19, 0.074, 0.058]}>
        <boxGeometry args={[0.045, 0.032, 0.006]} />
        <meshBasicMaterial color="#6f91a6" opacity={0.74} transparent />
      </mesh>
      {[-0.16, -0.04, 0.12].flatMap((x) =>
        [-0.058, 0.058].map((z) => (
          <mesh key={`${x}-${z}`} position={[x, 0.004, z]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.018, 0.018, 0.014, 12]} />
            <meshBasicMaterial color="#101722" />
          </mesh>
        )),
      )}
    </group>
  );
}

function PortCrane({
  position,
  rotation = 0,
  scale = 1,
}: {
  position: [number, number, number];
  rotation?: number;
  scale?: number;
}) {
  return (
    <group position={position} rotation={[0, rotation, 0]} scale={scale}>
      <mesh position={[0, 0.12, 0]}>
        <boxGeometry args={[0.08, 0.24, 0.055]} />
        <meshStandardMaterial color="#344350" emissive="#111820" emissiveIntensity={0.16} roughness={0.48} />
      </mesh>
      <mesh position={[0.18, 0.24, 0]} rotation={[0, 0, -0.1]}>
        <boxGeometry args={[0.38, 0.022, 0.038]} />
        <meshStandardMaterial color={LOGO_ORANGE} emissive={LOGO_ORANGE} emissiveIntensity={0.08} roughness={0.42} />
      </mesh>
      <mesh position={[-0.12, 0.215, 0]} rotation={[0, 0, 0.45]}>
        <boxGeometry args={[0.24, 0.018, 0.032]} />
        <meshStandardMaterial color="#d6dee5" roughness={0.38} />
      </mesh>
      <mesh position={[0.31, 0.115, 0]} rotation={[0, 0, 0]}>
        <boxGeometry args={[0.012, 0.18, 0.012]} />
        <meshBasicMaterial color="#f0ede6" />
      </mesh>
      <mesh position={[0.31, 0.018, 0]}>
        <boxGeometry args={[0.07, 0.036, 0.05]} />
        <meshStandardMaterial color="#566779" roughness={0.42} />
      </mesh>
    </group>
  );
}

function ContainerStack({
  position,
  rotation = 0,
}: {
  position: [number, number, number];
  rotation?: number;
}) {
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      {[
        [-0.08, 0.02, -0.035, LOGO_ORANGE],
        [0, 0.02, -0.035, "#5d6e7d"],
        [0.08, 0.02, -0.035, "#e6edf3"],
        [-0.04, 0.066, 0.032, "#e6edf3"],
        [0.04, 0.066, 0.032, LOGO_ORANGE],
      ].map(([x, y, z, color]) => (
        <mesh key={`${x}-${y}-${z}`} position={[x as number, y as number, z as number]}>
          <boxGeometry args={[0.068, 0.04, 0.05]} />
          <meshStandardMaterial color={color as string} roughness={0.44} />
        </mesh>
      ))}
    </group>
  );
}

function BuildingCluster() {
  return (
    <group>
      <mesh position={[-0.5, 0.31, -0.12]}>
        <boxGeometry args={[0.18, 0.34, 0.16]} />
        <meshStandardMaterial color="#596778" emissive="#1b2330" emissiveIntensity={0.2} roughness={0.58} />
      </mesh>
      {[-0.555, -0.5, -0.445].flatMap((x) =>
        [0.25, 0.32, 0.39].map((y) => (
          <mesh key={`${x}-${y}`} position={[x, y, -0.036]}>
            <boxGeometry args={[0.022, 0.028, 0.006]} />
            <meshBasicMaterial color="#cbd8df" opacity={0.58} transparent />
          </mesh>
        )),
      )}
      <mesh position={[-0.66, 0.255, 0.18]}>
        <boxGeometry args={[0.3, 0.2, 0.2]} />
        <meshStandardMaterial color="#d46139" emissive="#45140c" emissiveIntensity={0.22} roughness={0.5} />
      </mesh>
      <mesh position={[-0.66, 0.37, 0.18]} rotation={[0, 0, 0]}>
        <boxGeometry args={[0.32, 0.035, 0.22]} />
        <meshStandardMaterial color="#2f3b47" roughness={0.4} />
      </mesh>
      <mesh position={[-0.66, 0.265, 0.076]}>
        <boxGeometry args={[0.22, 0.065, 0.007]} />
        <meshBasicMaterial color="#f4eee6" opacity={0.72} transparent />
      </mesh>
      <mesh position={[0.56, 0.24, -0.05]}>
        <boxGeometry args={[0.34, 0.16, 0.22]} />
        <meshStandardMaterial color="#536575" emissive="#111820" emissiveIntensity={0.22} roughness={0.5} />
      </mesh>
      <mesh position={[0.56, 0.34, -0.05]} rotation={[0, 0, 0]}>
        <boxGeometry args={[0.38, 0.035, 0.26]} />
        <meshStandardMaterial color="#9eb1bd" roughness={0.34} />
      </mesh>
      <mesh position={[0.56, 0.25, 0.065]}>
        <boxGeometry args={[0.24, 0.07, 0.008]} />
        <meshBasicMaterial color="#d7e7ef" opacity={0.66} transparent />
      </mesh>
      {[-0.74, -0.68, -0.6].map((x, index) => (
        <mesh key={x} position={[x, 0.34 + index * 0.02, -0.08]}>
          <cylinderGeometry args={[0.018, 0.02, 0.24 + index * 0.04, 12]} />
          <meshStandardMaterial color={index === 1 ? LOGO_ORANGE : "#d2d9df"} roughness={0.42} />
        </mesh>
      ))}
      <mesh position={[0.1, 0.26, 0.56]} rotation={[0, -0.22, 0]}>
        <boxGeometry args={[0.32, 0.09, 0.12]} />
        <meshStandardMaterial color={LOGO_ORANGE} emissive={LOGO_ORANGE} emissiveIntensity={0.08} roughness={0.46} />
      </mesh>
      <mesh position={[0.1, 0.33, 0.56]} rotation={[0, -0.22, 0]}>
        <boxGeometry args={[0.22, 0.045, 0.1]} />
        <meshStandardMaterial color="#55626f" roughness={0.44} />
      </mesh>
      <mesh position={[0.35, 0.235, 0.48]} rotation={[0, 0.18, 0]}>
        <boxGeometry args={[0.18, 0.06, 0.1]} />
        <meshStandardMaterial color="#1d2632" roughness={0.46} />
      </mesh>
      <mesh position={[0.35, 0.29, 0.48]} rotation={[0, 0.18, 0]}>
        <boxGeometry args={[0.12, 0.05, 0.09]} />
        <meshStandardMaterial color="#d7dee4" roughness={0.38} />
      </mesh>
    </group>
  );
}

function EiffelTower() {
  return (
    <group position={[0.04, 0.18, -0.12]} scale={0.78}>
      {[
        [-0.07, 0, -0.07, -0.18],
        [0.07, 0, -0.07, 0.18],
        [-0.07, 0, 0.07, 0.18],
        [0.07, 0, 0.07, -0.18],
      ].map(([x, y, z, rotate]) => (
        <mesh key={`${x}-${z}`} position={[x, y + 0.17, z]} rotation={[0, 0, rotate]}>
          <cylinderGeometry args={[0.008, 0.018, 0.34, 8]} />
          <meshStandardMaterial color="#b47052" emissive="#3a170c" emissiveIntensity={0.28} roughness={0.54} />
        </mesh>
      ))}
      <mesh position={[0, 0.36, 0]}>
        <cylinderGeometry args={[0.035, 0.075, 0.32, 4]} />
        <meshStandardMaterial color="#b47052" emissive="#3a170c" emissiveIntensity={0.24} roughness={0.54} wireframe />
      </mesh>
      <mesh position={[0, 0.58, 0]}>
        <cylinderGeometry args={[0.006, 0.018, 0.22, 8]} />
        <meshStandardMaterial color={SOFT_ORANGE} emissive={SOFT_ORANGE} emissiveIntensity={0.18} roughness={0.48} />
      </mesh>
    </group>
  );
}

function BrandLogoSign() {
  const logoTexture = useMemo(createBrandLogoTexture, []);

  return (
    <group>
      <mesh position={[0.018, -0.012, -0.008]} renderOrder={28}>
        <planeGeometry args={[0.94, 0.48]} />
        <meshBasicMaterial color="#190c08" depthTest={false} depthWrite={false} opacity={0.22} transparent />
      </mesh>
      <mesh renderOrder={32}>
        <planeGeometry args={[0.94, 0.48]} />
        <meshBasicMaterial
          depthTest={false}
          depthWrite={false}
          map={logoTexture}
          side={THREE.DoubleSide}
          toneMapped={false}
          transparent
        />
      </mesh>
    </group>
  );
}

function StationaryBrandLogo() {
  const group = useRef<THREE.Group>(null);

  useFrame(({ camera }) => {
    if (!group.current) return;

    group.current.lookAt(camera.position);
  });

  return (
    <group ref={group} position={[0.028, 0.585, 0.332]} scale={1.1}>
      <BrandLogoSign />
    </group>
  );
}

function DioramaDetails() {
  return (
    <group>
      <DioramaPlatform />
      <group scale={1.24}>
        <RoadLoop />
        <BuildingCluster />
        <EiffelTower />
        <PortCrane position={[-0.96, 0.2, 0.22]} rotation={-0.75} scale={0.68} />
        <PortCrane position={[0.82, 0.2, 0.38]} rotation={2.62} scale={0.62} />
        <ContainerStack position={[-0.86, 0.205, -0.2]} rotation={-0.42} />
        <ContainerStack position={[0.68, 0.205, -0.42]} rotation={0.38} />
        <ContainerStack position={[0.34, 0.205, 0.82]} rotation={-0.2} />

        <PlaneModel position={[0.02, 0.44, 0.02]} rotation={[0.04, -1.18, 0.04]} scale={1.08} />
        <PlaneModel position={[-0.55, 0.46, 0.5]} rotation={[0.03, -1.8, -0.02]} scale={0.62} />
        <PlaneModel position={[0.5, 0.42, -0.36]} rotation={[0.03, 2.2, 0]} scale={0.58} />

        <ContainerTruck position={[0.12, 0.205, 0.58]} rotation={-0.18} />
        <SmallVehicle position={[-0.56, 0.205, 0.36]} rotation={-0.65} color="#f0ede6" />
        <SmallVehicle position={[-0.36, 0.205, -0.44]} rotation={0.12} />
        <SmallVehicle position={[0.5, 0.205, 0.2]} rotation={-0.36} color="#f0ede6" />
        <SmallVehicle position={[0.43, 0.205, -0.32]} rotation={0.74} />

        <CargoShip position={[-0.9, 0.105, 0.48]} rotation={0.18} scale={0.66} />
        <CargoShip position={[0.92, 0.105, 0.44]} rotation={-0.28} scale={0.62} />
        <CargoShip position={[0.55, 0.095, 0.86]} rotation={-1.45} scale={0.58} />
        <CargoShip position={[-0.58, 0.095, 0.84]} rotation={-1.28} scale={0.58} />
      </group>
    </group>
  );
}

function NativeGobeModel({ autoRotate }: { autoRotate: boolean }) {
  const rotatingRoot = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (!autoRotate || !rotatingRoot.current) return;

    rotatingRoot.current.rotation.y += delta * AUTO_ROTATE_SPEED;
  });

  return (
    <group position={[0.12, 0.02, 0]} rotation={[0.26, -0.38, 0]} scale={0.82}>
      <group ref={rotatingRoot}>
        <EarthShell />
        <DioramaDetails />
        <GlassDome />
      </group>
    </group>
  );
}

function GobeModelComponent({ scale = 1, autoRotate = false, className }: GobeModelProps) {
  return (
    <div className={className} style={{ width: "100%", height: "100%" }}>
      <Canvas
        camera={{ position: CAMERA_POSITION.toArray(), fov: CAMERA_FOV, near: 0.05, far: 80 }}
        dpr={[0.8, 1.15]}
        gl={{ alpha: true, antialias: false, powerPreference: "high-performance" }}
        onCreated={({ camera }) => {
          camera.lookAt(CAMERA_TARGET);
        }}
        style={{ background: "transparent" }}
      >
        <ambientLight intensity={0.92} />
        <hemisphereLight args={["#ffffff", "#29385a", 0.95]} />
        <directionalLight position={[4.8, 6.5, 8]} intensity={2.25} />
        <directionalLight position={[-5.4, 2.2, 4.8]} intensity={1.15} color={LOGO_ORANGE} />
        <pointLight position={[0, 3.2, 4.5]} intensity={1.12} color="#ffffff" />
        <group scale={scale}>
          <NativeGobeModel autoRotate={autoRotate} />
          <StationaryBrandLogo />
        </group>
      </Canvas>
    </div>
  );
}

export const GobeModel = memo(GobeModelComponent);
