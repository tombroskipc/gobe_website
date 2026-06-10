"use client";

import { useEffect, useRef, useState, type RefObject } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { MeshoptDecoder } from "three/addons/libs/meshopt_decoder.module.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import * as THREE from "three";

const EXTERNAL_MODEL_URL = process.env.NEXT_PUBLIC_GOBE_MODEL_URL;
const LOCAL_MODEL_PATH = "/models/gobe-3d-globe.web.glb?v=original-22mb-20260607";
const LOCAL_MODEL_CHUNKS: string[] = [];
const CAMERA_POSITION = new THREE.Vector3(0, 1.2, 7.7);
const CAMERA_TARGET = new THREE.Vector3(0, 0.08, 0);
const CAMERA_FOV = 36;
const MODEL_FIT_SIZE = 3.72;
const MODEL_VERTICAL_OFFSET = -0.06;
const AUTO_ROTATE_SPEED = 0.035;
const MAIN_RING_ROTATE_SPEED = 0.05;
const ORBIT_ROTATE_SPEED = 0.042;
const GLASS_OPACITY = 0.16;
const MODEL_BASE_ROTATION = new THREE.Euler(-0.04, -0.82, 0);

interface GobeModelProps {
  scale?: number;
  autoRotate?: boolean;
  className?: string;
  modelOffsetX?: number;
  modelOffsetY?: number;
  onLoaded?: () => void;
}

async function resolveModelSource(signal: AbortSignal) {
  if (EXTERNAL_MODEL_URL) {
    return { url: EXTERNAL_MODEL_URL };
  }

  if (LOCAL_MODEL_CHUNKS.length > 0) {
    try {
      const responses = await Promise.all(
        LOCAL_MODEL_CHUNKS.map((path) =>
          fetch(path, {
            cache: "force-cache",
            signal,
          })
        )
      );

      if (responses.every((response) => response.ok)) {
        const chunks = await Promise.all(responses.map((response) => response.arrayBuffer()));
        const url = URL.createObjectURL(new Blob(chunks, { type: "model/gltf-binary" }));

        return {
          url,
          revoke: () => URL.revokeObjectURL(url),
        };
      }
    } catch (error) {
      if (!signal.aborted) {
        console.warn("Chunked 3D model load failed, falling back to local model path.", error);
      }
    }
  }

  return { url: LOCAL_MODEL_PATH };
}

function makeUpperGlobeTransparent(scene: THREE.Object3D) {
  scene.traverse((child) => {
    if (!(child instanceof THREE.Mesh)) {
      return;
    }

    const materialName = Array.isArray(child.material)
      ? child.material.map((material) => material.name).join(" ")
      : child.material?.name;
    const materials = Array.isArray(child.material) ? child.material : [child.material];
    const hasGlassMaterial = materials.some(
      (material) =>
        material instanceof THREE.MeshPhysicalMaterial &&
        ((material.transmission ?? 0) > 0 || (material.ior ?? 1) > 1)
    );
    const isUpperGlass =
      child.name.toLowerCase().includes("sphere") ||
      materialName?.toLowerCase().includes("glass") ||
      hasGlassMaterial;

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

function isMainOrangeRing(child: THREE.Object3D) {
  const name = child.name.toLowerCase();

  return name.includes("orange_globe_ring") && !name.includes("tilted_orbit");
}

function isOrbitA(child: THREE.Object3D) {
  return child.name.toLowerCase().includes("orange_globe_ring_tilted_orbit_a");
}

function isOrbitB(child: THREE.Object3D) {
  return child.name.toLowerCase().includes("orange_globe_ring_tilted_orbit_b");
}

function isCenterLogo(child: THREE.Object3D) {
  return child.name.toLowerCase().includes("logomesh");
}

function moveRootToObjectCenter(root: THREE.Group, objects: THREE.Object3D[], stage: THREE.Group) {
  if (objects.length === 0) return;

  const box = new THREE.Box3();
  objects.forEach((object) => box.expandByObject(object));
  if (box.isEmpty()) return;

  const center = box.getCenter(new THREE.Vector3());
  root.position.copy(stage.worldToLocal(center));
  root.updateMatrixWorld(true);
}

function faceLogoRootToCamera(root: THREE.Group, logo: THREE.Object3D, camera: THREE.Camera) {
  root.updateMatrixWorld(true);
  logo.updateMatrixWorld(true);

  const logoCenter = root.getWorldPosition(new THREE.Vector3());
  const cameraPosition = camera.getWorldPosition(new THREE.Vector3());
  const cameraQuaternion = camera.getWorldQuaternion(new THREE.Quaternion());
  const front = cameraPosition.sub(logoCenter).normalize();
  const up = new THREE.Vector3(0, 1, 0).applyQuaternion(cameraQuaternion).projectOnPlane(front);

  if (up.lengthSq() < 0.0001) {
    up.set(0, 1, 0).projectOnPlane(front);
  }

  up.normalize();

  const right = new THREE.Vector3().crossVectors(up, front).normalize();
  const correctedUp = new THREE.Vector3().crossVectors(front, right).normalize();
  const logoFront = front.clone().negate();
  const logoUp = correctedUp.clone().negate();
  const desiredLogoWorldQuaternion = new THREE.Quaternion().setFromRotationMatrix(
    new THREE.Matrix4().makeBasis(right, logoUp, logoFront),
  );
  const currentLogoWorldQuaternion = logo.getWorldQuaternion(new THREE.Quaternion());
  const worldDelta = desiredLogoWorldQuaternion.multiply(currentLogoWorldQuaternion.invert());
  const parentWorldQuaternion = root.parent?.getWorldQuaternion(new THREE.Quaternion()) ?? new THREE.Quaternion();
  const localDelta = parentWorldQuaternion.clone().invert().multiply(worldDelta).multiply(parentWorldQuaternion);

  root.quaternion.copy(localDelta);
  root.updateMatrixWorld(true);
}

function ModelContent({
  scale,
  autoRotate,
  groupRef,
  modelOffsetX,
  modelOffsetY,
  onLoaded,
}: {
  scale: number;
  autoRotate: boolean;
  groupRef: RefObject<THREE.Group | null>;
  modelOffsetX: number;
  modelOffsetY: number;
  onLoaded?: () => void;
}) {
  const { camera } = useThree();
  const [loaded, setLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const loadedRoot = useRef<THREE.Group | null>(null);
  const rotatingRoot = useRef<THREE.Group | null>(null);
  const mainRingRoot = useRef<THREE.Group | null>(null);
  const orbitARoot = useRef<THREE.Group | null>(null);
  const orbitBRoot = useRef<THREE.Group | null>(null);

  useEffect(() => {
    const loader = new GLTFLoader();
    loader.setMeshoptDecoder(MeshoptDecoder);

    let mounted = true;
    let retryTimer: number | undefined;
    let currentModelUrlCleanup: (() => void) | undefined;
    let abortController = new AbortController();

    const loadModel = () => {
      setIsLoading(true);
      abortController.abort();
      abortController = new AbortController();

      resolveModelSource(abortController.signal)
        .then(({ url, revoke }) => {
          if (!mounted) {
            revoke?.();
            return;
          }

          currentModelUrlCleanup?.();
          currentModelUrlCleanup = revoke;

          loader.load(
            url,
            (gltf) => {
              revoke?.();
              if (currentModelUrlCleanup === revoke) {
                currentModelUrlCleanup = undefined;
              }

              if (!mounted || !groupRef.current) return;

              if (loadedRoot.current) {
                groupRef.current.remove(loadedRoot.current);
              }

              const scene = gltf.scene;
              makeUpperGlobeTransparent(scene);

              gltf.scene.traverse((child) => {
                if (child instanceof THREE.Mesh) {
                  child.castShadow = true;
                  child.receiveShadow = true;
                  child.frustumCulled = true;
                }
              });

              const box = new THREE.Box3().setFromObject(scene);
              const center = box.getCenter(new THREE.Vector3());
              const size = box.getSize(new THREE.Vector3());
              const maxDimension = Math.max(size.x, size.y, size.z) || 1;

              scene.position.sub(center);

              const stage = new THREE.Group();
              const globeRoot = new THREE.Group();
              const stationaryLogoRoot = new THREE.Group();
              const orangeRingRoot = new THREE.Group();
              const orangeOrbitARoot = new THREE.Group();
              const orangeOrbitBRoot = new THREE.Group();
              const centerLogoObjects: THREE.Object3D[] = [];
              const mainRingObjects: THREE.Object3D[] = [];
              const orbitAObjects: THREE.Object3D[] = [];
              const orbitBObjects: THREE.Object3D[] = [];

              globeRoot.rotation.copy(MODEL_BASE_ROTATION);
              globeRoot.add(scene);
              stage.add(globeRoot);
              stage.add(stationaryLogoRoot);
              stage.add(orangeRingRoot);
              stage.add(orangeOrbitARoot);
              stage.add(orangeOrbitBRoot);
              stage.scale.setScalar(MODEL_FIT_SIZE / maxDimension);
              stage.position.x = modelOffsetX;
              stage.position.y = MODEL_VERTICAL_OFFSET;
              stage.position.y += modelOffsetY;
              scene.traverse((child) => {
                if (isCenterLogo(child)) {
                  centerLogoObjects.push(child);
                }
                if (isMainOrangeRing(child)) {
                  mainRingObjects.push(child);
                }
                if (isOrbitA(child)) {
                  orbitAObjects.push(child);
                }
                if (isOrbitB(child)) {
                  orbitBObjects.push(child);
                }
              });
              stage.updateMatrixWorld(true);
              moveRootToObjectCenter(stationaryLogoRoot, centerLogoObjects, stage);
              centerLogoObjects.forEach((object) => stationaryLogoRoot.attach(object));
              mainRingObjects.forEach((object) => orangeRingRoot.attach(object));
              orbitAObjects.forEach((object) => orangeOrbitARoot.attach(object));
              orbitBObjects.forEach((object) => orangeOrbitBRoot.attach(object));

              const perspective = camera as THREE.PerspectiveCamera;
              perspective.position.copy(CAMERA_POSITION);
              perspective.fov = CAMERA_FOV;
              perspective.near = 0.05;
              perspective.far = 80;
              perspective.lookAt(CAMERA_TARGET);
              perspective.updateProjectionMatrix();
              if (centerLogoObjects[0]) {
                faceLogoRootToCamera(stationaryLogoRoot, centerLogoObjects[0], perspective);
              }

              loadedRoot.current = stage;
              rotatingRoot.current = globeRoot;
              mainRingRoot.current = orangeRingRoot;
              orbitARoot.current = orangeOrbitARoot;
              orbitBRoot.current = orangeOrbitBRoot;
              groupRef.current.add(stage);
              setLoaded(true);
              setIsLoading(false);
              onLoaded?.();
            },
            undefined,
            (error) => {
              revoke?.();
              if (currentModelUrlCleanup === revoke) {
                currentModelUrlCleanup = undefined;
              }
              console.error("Error loading GLTF. Retrying:", error);
              if (mounted) {
                retryTimer = window.setTimeout(loadModel, 1600);
              }
            }
          );
        })
        .catch((error) => {
          if (abortController.signal.aborted) {
            return;
          }

          console.error("Error resolving GLTF source. Retrying:", error);
          if (mounted) {
            retryTimer = window.setTimeout(loadModel, 1600);
          }
        });
    };

    loadModel();

    return () => {
      mounted = false;
      if (retryTimer) {
        window.clearTimeout(retryTimer);
      }
      abortController.abort();
      currentModelUrlCleanup?.();
      if (loadedRoot.current && groupRef.current) {
        groupRef.current.remove(loadedRoot.current);
      }
      rotatingRoot.current = null;
      mainRingRoot.current = null;
      orbitARoot.current = null;
      orbitBRoot.current = null;
    };
  }, [camera, groupRef, onLoaded]);

  useEffect(() => {
    if (!loadedRoot.current) {
      return;
    }

    loadedRoot.current.position.x = modelOffsetX;
    loadedRoot.current.position.y = MODEL_VERTICAL_OFFSET + modelOffsetY;
  }, [modelOffsetX, modelOffsetY]);

  useFrame((_, delta) => {
    if (!loaded) return;

    if (autoRotate) {
      if (rotatingRoot.current) {
        rotatingRoot.current.rotation.y += delta * AUTO_ROTATE_SPEED;
      }
      if (mainRingRoot.current) {
        mainRingRoot.current.rotation.y -= delta * MAIN_RING_ROTATE_SPEED;
      }
      if (orbitARoot.current) {
        orbitARoot.current.rotation.y += delta * ORBIT_ROTATE_SPEED;
      }
      if (orbitBRoot.current) {
        orbitBRoot.current.rotation.y -= delta * ORBIT_ROTATE_SPEED;
      }
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
  modelOffsetX = 0,
  modelOffsetY = 0,
  onLoaded,
}: GobeModelProps) {
  const groupRef = useRef<THREE.Group>(null);

  return (
    <div className={["gobe-model-canvas", className].filter(Boolean).join(" ")} style={{ width: "100%", height: "100%" }}>
      <Canvas
        camera={{ position: CAMERA_POSITION.toArray(), fov: CAMERA_FOV, near: 0.05, far: 80 }}
        dpr={[0.8, 1.15]}
        gl={{ alpha: true, antialias: false, powerPreference: "high-performance" }}
        style={{ background: "transparent", display: "block", height: "100%", width: "100%" }}
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
            modelOffsetX={modelOffsetX}
            modelOffsetY={modelOffsetY}
            onLoaded={onLoaded}
          />
        </group>
      </Canvas>
    </div>
  );
}
