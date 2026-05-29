"use client";

import { useEffect, useRef, useState, type RefObject } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import * as THREE from "three";

const MODEL_PATH = "/models/gobeyond3d2.web.glb";
const BLENDER_CAMERA_FOV = THREE.MathUtils.radToDeg(0.7427104693450297);
const FALLBACK_CAMERA_POSITION = new THREE.Vector3(3.067650079727173, 2.698859453201294, 3.5093698501586914);
const FALLBACK_CAMERA_QUATERNION = new THREE.Quaternion(
  -0.11975622177124023,
  0.20744825899600983,
  0.023914916440844536,
  0.9705935120582581
);

interface GobeModelProps {
  scale?: number;
  autoRotate?: boolean;
  className?: string;
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
  const baseCameraPosition = useRef(FALLBACK_CAMERA_POSITION.clone());
  const baseCameraQuaternion = useRef(FALLBACK_CAMERA_QUATERNION.clone());
  const baseLookTarget = useRef(
    FALLBACK_CAMERA_POSITION.clone().add(new THREE.Vector3(0, 0, -1).applyQuaternion(FALLBACK_CAMERA_QUATERNION).multiplyScalar(6))
  );
  const desiredCameraPosition = useRef(new THREE.Vector3());
  const desiredLookTarget = useRef(new THREE.Vector3());

  useEffect(() => {
    const loader = new GLTFLoader();
    let mounted = true;
    let retryTimer: number | undefined;

    const loadModel = () => {
      setIsLoading(true);

      loader.load(
        MODEL_PATH,
        (gltf) => {
          if (!mounted || !groupRef.current) return;

          const scene = gltf.scene;
          gltf.scene.traverse((child) => {
            if (child instanceof THREE.Mesh) {
              child.castShadow = true;
              child.receiveShadow = true;
            }
          });

          const sourceCamera = gltf.cameras[0] as THREE.PerspectiveCamera | undefined;
          if (sourceCamera) {
            sourceCamera.updateMatrixWorld(true);
            sourceCamera.getWorldPosition(baseCameraPosition.current);
            sourceCamera.getWorldQuaternion(baseCameraQuaternion.current);

            const forward = new THREE.Vector3(0, 0, -1).applyQuaternion(baseCameraQuaternion.current);
            baseLookTarget.current.copy(baseCameraPosition.current).add(forward.multiplyScalar(6));

            const perspective = camera as THREE.PerspectiveCamera;
            perspective.position.copy(baseCameraPosition.current);
            perspective.quaternion.copy(baseCameraQuaternion.current);
            perspective.fov = sourceCamera.fov;
            perspective.near = 0.01;
            perspective.far = 220;
            perspective.updateProjectionMatrix();
          } else {
            const perspective = camera as THREE.PerspectiveCamera;
            perspective.position.copy(baseCameraPosition.current);
            perspective.quaternion.copy(baseCameraQuaternion.current);
            perspective.fov = BLENDER_CAMERA_FOV;
            perspective.near = 0.01;
            perspective.far = 220;
            perspective.updateProjectionMatrix();
          }

          groupRef.current.add(scene);
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
    };
  }, [camera, groupRef]);

  useFrame(({ clock, pointer }, delta) => {
    if (!groupRef.current || !loaded) return;

    const perspective = camera as THREE.PerspectiveCamera;
    const parallaxX = pointer.x * 0.08;
    const parallaxY = pointer.y * 0.045;

    desiredCameraPosition.current.set(
      baseCameraPosition.current.x + parallaxX,
      baseCameraPosition.current.y + parallaxY,
      baseCameraPosition.current.z + pointer.x * 0.03
    );
    desiredLookTarget.current.set(
      baseLookTarget.current.x + pointer.x * 0.06,
      baseLookTarget.current.y + pointer.y * 0.035,
      baseLookTarget.current.z
    );

    if (autoRotate) {
      desiredCameraPosition.current.x += Math.sin(clock.elapsedTime * 0.3) * 0.08;
    }

    const blend = 1 - Math.exp(-delta * 8);
    perspective.position.lerp(desiredCameraPosition.current, blend);
    perspective.lookAt(desiredLookTarget.current);
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
        camera={{ position: [3.067650079727173, 2.698859453201294, 3.5093698501586914], fov: BLENDER_CAMERA_FOV, near: 0.01, far: 220 }}
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
