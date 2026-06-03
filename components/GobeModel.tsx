"use client";

import { useEffect, useRef, useState, type RefObject } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { MeshoptDecoder } from "three/addons/libs/meshopt_decoder.module.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import * as THREE from "three";

const MODEL_PATH = "/models/gobe-globe-hq.web.glb";
const CAMERA_POSITION = new THREE.Vector3(0, 0.18, 5.15);
const CAMERA_TARGET = new THREE.Vector3(0, 0.08, 0);
const CAMERA_FOV = 34;
const MODEL_FIT_SIZE = 3.52;
const AUTO_ROTATE_SPEED = 0.07;
const GLASS_OPACITY = 0.16;
const LOGO_ORANGE = "#F26522";

interface GobeModelProps {
  scale?: number;
  autoRotate?: boolean;
  className?: string;
}

function makeUpperGlobeTransparent(scene: THREE.Object3D) {
  scene.traverse((child) => {
    if (!(child instanceof THREE.Mesh)) {
      return;
    }

    const materialName = Array.isArray(child.material)
      ? child.material.map((material) => material.name).join(" ")
      : child.material?.name;
    const isUpperGlass = child.name.toLowerCase().includes("sphere") || materialName?.toLowerCase().includes("glass");

    if (!isUpperGlass) {
      return;
    }

    const applyGlass = (material: THREE.Material) => {
      const glass = material.clone();
      glass.name = `${material.name || "Glass"} Transparent`;
      glass.transparent = true;
      glass.opacity = GLASS_OPACITY;
      glass.depthWrite = false;
      glass.side = THREE.DoubleSide;
      glass.needsUpdate = true;

      if (glass instanceof THREE.MeshStandardMaterial) {
        glass.color = new THREE.Color("#edf5fb");
        glass.metalness = 0.02;
        glass.roughness = 0.3;
        glass.envMapIntensity = 0.58;
      }

      return glass;
    };

    child.material = Array.isArray(child.material) ? child.material.map(applyGlass) : applyGlass(child.material);
    child.renderOrder = 4;
    child.castShadow = false;
  });
}

function makeLogoOrange(scene: THREE.Object3D) {
  scene.traverse((child) => {
    if (!(child instanceof THREE.Mesh)) {
      return;
    }

    const materials = Array.isArray(child.material) ? child.material : [child.material];
    const materialNames = materials.map((material) => material.name).join(" ").toLowerCase();
    const targetText = `${child.name} ${materialNames}`.toLowerCase();
    const isLogo = targetText.includes("logo") || materialNames.includes("material_0.015");

    if (!isLogo) {
      return;
    }

    const applyLogoColor = (material: THREE.Material) => {
      const logo = material.clone();
      logo.name = `${material.name || "Logo"} Orange`;

      if (logo instanceof THREE.MeshStandardMaterial) {
        logo.color = new THREE.Color(LOGO_ORANGE);
        logo.emissive = new THREE.Color(LOGO_ORANGE);
        logo.emissiveIntensity = 0.16;
        logo.metalness = 0.08;
        logo.roughness = 0.34;
        logo.map = null;
        logo.emissiveMap = null;
      } else if (
        logo instanceof THREE.MeshBasicMaterial ||
        logo instanceof THREE.MeshPhongMaterial ||
        logo instanceof THREE.MeshLambertMaterial
      ) {
        logo.color = new THREE.Color(LOGO_ORANGE);
      }

      logo.needsUpdate = true;
      return logo;
    };

    child.material = Array.isArray(child.material)
      ? child.material.map(applyLogoColor)
      : applyLogoColor(child.material);
    child.renderOrder = 5;
  });
}

function ModelContent({
  scale,
  autoRotate,
  groupRef,
}: {
  scale: number;
  autoRotate: boolean;
  groupRef: RefObject<THREE.Group | null>;
}) {
  const { camera } = useThree();
  const [loaded, setLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const loadedRoot = useRef<THREE.Group | null>(null);

  useEffect(() => {
    const loader = new GLTFLoader();
    loader.setMeshoptDecoder(MeshoptDecoder);

    let mounted = true;
    let retryTimer: number | undefined;

    const loadModel = () => {
      setIsLoading(true);

      loader.load(
        MODEL_PATH,
        (gltf) => {
          if (!mounted || !groupRef.current) return;

          if (loadedRoot.current) {
            groupRef.current.remove(loadedRoot.current);
          }

          const scene = gltf.scene;
          makeUpperGlobeTransparent(scene);
          makeLogoOrange(scene);

          gltf.scene.traverse((child) => {
            if (child instanceof THREE.Mesh) {
              child.castShadow = true;
              child.receiveShadow = true;
              child.frustumCulled = true;
            }
          });

          const root = new THREE.Group();
          root.add(scene);

          const box = new THREE.Box3().setFromObject(scene);
          const center = box.getCenter(new THREE.Vector3());
          const size = box.getSize(new THREE.Vector3());
          const maxDimension = Math.max(size.x, size.y, size.z) || 1;

          scene.position.sub(center);
          root.scale.setScalar(MODEL_FIT_SIZE / maxDimension);
          root.rotation.set(-0.08, -0.34, 0);

          const perspective = camera as THREE.PerspectiveCamera;
          perspective.position.copy(CAMERA_POSITION);
          perspective.fov = CAMERA_FOV;
          perspective.near = 0.05;
          perspective.far = 80;
          perspective.lookAt(CAMERA_TARGET);
          perspective.updateProjectionMatrix();

          loadedRoot.current = root;
          groupRef.current.add(root);
          setLoaded(true);
          setIsLoading(false);
        },
        undefined,
        (error) => {
          console.error("Error loading GLTF. Retrying:", error);
          if (mounted) {
            retryTimer = window.setTimeout(loadModel, 1600);
          }
        }
      );
    };

    loadModel();

    return () => {
      mounted = false;
      if (retryTimer) {
        window.clearTimeout(retryTimer);
      }
      if (loadedRoot.current && groupRef.current) {
        groupRef.current.remove(loadedRoot.current);
      }
    };
  }, [camera, groupRef]);

  useFrame((_, delta) => {
    if (!groupRef.current || !loaded) return;

    if (autoRotate) {
      groupRef.current.rotation.y += delta * AUTO_ROTATE_SPEED;
    }
  });

  return (
    <>
      {!loaded && isLoading && (
        <mesh scale={scale}>
          <sphereGeometry args={[0.3, 16, 16]} />
          <meshBasicMaterial color="#F26522" wireframe />
        </mesh>
      )}
    </>
  );
}

export function GobeModel({
  scale = 1,
  autoRotate = false,
  className,
}: GobeModelProps) {
  const groupRef = useRef<THREE.Group>(null);

  return (
    <div className={className} style={{ width: "100%", height: "100%" }}>
      <Canvas
        camera={{ position: CAMERA_POSITION.toArray(), fov: CAMERA_FOV, near: 0.05, far: 80 }}
        dpr={[0.8, 1.15]}
        gl={{ alpha: true, antialias: false, powerPreference: "high-performance" }}
        style={{ background: "transparent" }}
      >
        <ambientLight intensity={0.86} />
        <hemisphereLight args={["#ffffff", "#29385a", 0.92]} />
        <directionalLight position={[4.8, 6.5, 8]} intensity={2.2} />
        <directionalLight position={[-5.4, 2.2, 4.8]} intensity={1.05} color="#F26522" />
        <pointLight position={[0, 4, 5]} intensity={1.08} color="#ffffff" />
        <group ref={groupRef} scale={scale}>
          <ModelContent
            scale={scale}
            autoRotate={autoRotate}
            groupRef={groupRef}
          />
        </group>
      </Canvas>
    </div>
  );
}
