"use client";

import { Suspense, useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import * as THREE from "three";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader.js";

type ValueCardStyle = CSSProperties &
  Partial<
    Record<
      | "--panel-accent"
      | "--x"
      | "--y"
      | "--z"
      | "--r"
      | "--s"
      | "--letter-y"
      | "--letter-x"
      | "--content-x",
      string
    >
  >;

const coreValues = [
  {
    index: "01",
    code: "G",
    title: "GOAL-ORIENTED",
    body: "Lu\u00f4n x\u00e1c \u0111\u1ecbnh r\u00f5 r\u00e0ng m\u1ee5c ti\u00eau v\u00e0 n\u1ed7 l\u1ef1c kh\u00f4ng ng\u1eebng \u0111\u1ec3 \u0111\u1ea1t \u0111\u01b0\u1ee3c ch\u00fang.",
    accent: "#F26522",
    style: {
      "--panel-accent": "#F26522",
      "--x": "clamp(120px, 8vw, 150px)",
      "--y": "clamp(220px, 34vh, 310px)",
      "--z": "150px",
      "--r": "-11deg",
      "--s": "1.04",
      "--letter-y": "0px",
      "--content-x": "clamp(104px, 6.8vw, 126px)",
    } as ValueCardStyle,
  },
  {
    index: "02",
    code: "O",
    title: "OPEN-MINDEDNESS",
    body: "S\u1eb5n s\u00e0ng ti\u1ebfp thu \u00fd ki\u1ebfn m\u1edbi, h\u1ecdc h\u1ecfi v\u00e0 th\u00edch \u1ee9ng v\u1edbi s\u1ef1 thay \u0111\u1ed5i.",
    accent: "#2ED4A4",
    style: {
      "--panel-accent": "#2ED4A4",
      "--x": "clamp(110px, 17vw, 310px)",
      "--y": "clamp(175px, 27vh, 250px)",
      "--z": "112px",
      "--r": "-9deg",
      "--s": "1.01",
      "--letter-y": "-10px",
      "--content-x": "clamp(112px, 7.4vw, 134px)",
    } as ValueCardStyle,
  },
  {
    index: "03",
    code: "B",
    title: "BALANCED",
    body: "Bi\u1ebft c\u00e2n b\u1eb1ng gi\u1eefa c\u00e1c \u01b0u ti\u00ean nh\u01b0 hi\u1ec7u qu\u1ea3 c\u00f4ng vi\u1ec7c, ph\u00e1t tri\u1ec3n c\u00e1 nh\u00e2n v\u00e0 cu\u1ed9c s\u1ed1ng gia \u0111\u00ecnh.",
    accent: "#D95B9F",
    style: {
      "--panel-accent": "#D95B9F",
      "--x": "clamp(300px, 31vw, 590px)",
      "--y": "clamp(120px, 20vh, 190px)",
      "--z": "76px",
      "--r": "-7deg",
      "--s": "0.99",
      "--letter-y": "-20px",
      "--content-x": "clamp(118px, 7.8vw, 140px)",
    } as ValueCardStyle,
  },
  {
    index: "04",
    code: "E",
    title: "EMPOWERMENT",
    body: "Trao quy\u1ec1n v\u00e0 tin t\u01b0\u1edfng \u0111\u1ec3 nh\u00e2n vi\u00ean ch\u1ee7 \u0111\u1ed9ng v\u00e0 s\u00e1ng t\u1ea1o trong c\u00f4ng vi\u1ec7c.",
    accent: "#5AA2E8",
    style: {
      "--panel-accent": "#5AA2E8",
      "--x": "clamp(500px, 45vw, 850px)",
      "--y": "clamp(72px, 13vh, 136px)",
      "--z": "40px",
      "--r": "-5deg",
      "--s": "0.96",
      "--letter-y": "-30px",
      "--content-x": "clamp(124px, 8.2vw, 146px)",
    } as ValueCardStyle,
  },
  {
    index: "05",
    code: "E",
    title: "ENTREPRENEURSHIP (HUSTLE)",
    body: "B\u1ea3n l\u0129nh, s\u00e1ng t\u1ea1o v\u00e0 s\u1eb5n s\u00e0ng \u0111\u01b0\u01a1ng \u0111\u1ea7u v\u1edbi r\u1ee7i ro \u0111\u1ec3 t\u1ea1o ra nh\u1eefng gi\u00e1 tr\u1ecb m\u1edbi.",
    accent: "#E9C15F",
    style: {
      "--panel-accent": "#E9C15F",
      "--x": "clamp(700px, 58vw, 1100px)",
      "--y": "clamp(36px, 7vh, 96px)",
      "--z": "10px",
      "--r": "-3deg",
      "--s": "0.93",
      "--letter-y": "-40px",
      "--content-x": "clamp(130px, 8.6vw, 152px)",
    } as ValueCardStyle,
  },
  {
    index: "06",
    code: "R",
    title: "RESULTS-DRIVEN",
    body: "Lu\u00f4n t\u1eadp trung v\u00e0o vi\u1ec7c ho\u00e0n th\u00e0nh m\u1ee5c ti\u00eau v\u00e0 mang l\u1ea1i k\u1ebft qu\u1ea3 c\u1ee5 th\u1ec3.",
    accent: "#70D17B",
    style: {
      "--panel-accent": "#70D17B",
      "--x": "clamp(880px, 70vw, 1320px)",
      "--y": "clamp(4px, 2vh, 56px)",
      "--z": "-20px",
      "--r": "-1deg",
      "--s": "0.9",
      "--letter-y": "-50px",
      "--content-x": "clamp(136px, 9vw, 158px)",
    } as ValueCardStyle,
  },
];

type CoreValue = (typeof coreValues)[number];

const operations = [
  {
    index: "01",
    title: "Ads",
    body: "Demand signals, channels, testing rhythm, and market feedback.",
  },
  {
    index: "02",
    title: "Creative",
    body: "Product stories, visuals, angles, short-form content, and campaign assets.",
  },
  {
    index: "03",
    title: "Fulfillment",
    body: "Supply coordination, packing flow, shipping partners, and customer delivery.",
  },
  {
    index: "04",
    title: "Designer",
    body: "Storefront experience, product presentation, brand systems, and conversion details.",
  },
  {
    index: "05",
    title: "Operation",
    body: "Daily operations, automation, internal tools, finance.",
  },
];

const scaleNodes = [
  {
    title: "Strong core team.",
    body: "Core team is strong with team leaders is creative and knowledgeable, open to take any challenge.",
    chips: ["Creative leaders", "Knowledgeable", "Challenge ready"],
  },
  {
    title: "Global supplier network.",
    body: "Works with different suppliers across the world, connecting product sources, fulfillment partners, and store operations across markets.",
    chips: ["Worldwide suppliers", "Storefronts", "Fulfillment"],
  },
  {
    title: "AI and automation first initiative",
    body: "AI and Automation is the 1st initiative, making it easier to scale a large number amount of orders, data workflows, creative production, and daily operations.",
    chips: ["AI-first", "Automation", "Large order scale"],
  },
];

const packageDrops = Array.from({ length: 18 }, (_, index) => ({
  color: index % 3 === 0 ? "#fff7ed" : "#F26522",
  initialY: 3.25 + (index % 6) * 0.52,
  position: [((index * 1.73) % 9.6) - 4.8, 0, -1.5 - (index % 5) * 0.42] as [number, number, number],
  rotation: [index * 0.47, index * 0.72, index * 0.31] as [number, number, number],
  scale: 0.16 + (index % 4) * 0.035,
  speed: 0.34 + (index % 5) * 0.065,
  spin: 0.18 + (index % 4) * 0.08,
}));

type PackageDrop = (typeof packageDrops)[number];

function FallingPackage({ drop }: { drop: PackageDrop }) {
  const ref = useRef<THREE.Group>(null);
  const source = useLoader(OBJLoader, "/package-asset/base.obj");

  const model = useMemo(() => {
    const clone = source.clone(true);
    const box = new THREE.Box3().setFromObject(clone);
    const size = new THREE.Vector3();
    const center = new THREE.Vector3();

    box.getSize(size);
    box.getCenter(center);
    clone.position.sub(center);

    const maxDimension = Math.max(size.x, size.y, size.z) || 1;
    clone.scale.multiplyScalar(1.55 / maxDimension);

    clone.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        mesh.material = new THREE.MeshStandardMaterial({
          color: drop.color,
          emissive: drop.color === "#F26522" ? "#4a1606" : "#3b2b20",
          emissiveIntensity: drop.color === "#F26522" ? 0.18 : 0.05,
          metalness: 0.08,
          roughness: 0.48,
        });
      }
    });

    return clone;
  }, [drop.color, source]);

  useFrame(({ clock }) => {
    const group = ref.current;
    if (!group) {
      return;
    }

    const cycle = 6.9;
    const elapsed = clock.elapsedTime * drop.speed;
    group.position.y = THREE.MathUtils.euclideanModulo(drop.initialY - elapsed + 3.4, cycle) - 3.4;
    group.rotation.x = drop.rotation[0] + clock.elapsedTime * drop.spin;
    group.rotation.y = drop.rotation[1] + clock.elapsedTime * drop.spin * 1.25;
    group.rotation.z = drop.rotation[2] + clock.elapsedTime * drop.spin * 0.72;
  });

  return (
    <group ref={ref} position={drop.position} scale={drop.scale} rotation={drop.rotation}>
      <primitive object={model} />
    </group>
  );
}

function PackageRain3D() {
  return (
    <Canvas
      className="absolute inset-0"
      camera={{ position: [0, 0.8, 6.5], fov: 45 }}
      dpr={[1, 1.5]}
      gl={{ alpha: true, antialias: true }}
    >
      <ambientLight intensity={1.05} />
      <directionalLight position={[4, 6, 5]} intensity={1.8} />
      <directionalLight position={[-4, -2, 3]} color="#F26522" intensity={0.9} />
      <Suspense fallback={null}>
        {packageDrops.map((drop, index) => (
          <FallingPackage key={`${drop.position.join("-")}-${index}`} drop={drop} />
        ))}
      </Suspense>
    </Canvas>
  );
}

export function CoreValuesSection() {
  const [activeValue, setActiveValue] = useState<CoreValue | null>(null);
  const sectionRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    document.documentElement.classList.toggle("value-card-open", Boolean(activeValue));

    if (!activeValue) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setActiveValue(null);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.documentElement.classList.remove("value-card-open");
    };
  }, [activeValue]);

  return (
    <section
      id="stack"
      ref={sectionRef}
      className="values-showcase relative z-10 min-h-screen overflow-hidden bg-[#000314] opacity-90"
      onPointerMove={(event) => {
        const element = sectionRef.current;
        if (!element) {
          return;
        }

        const rect = element.getBoundingClientRect();
        const x = (event.clientX - rect.left) / rect.width - 0.5;
        const y = (event.clientY - rect.top) / rect.height - 0.5;
        element.style.setProperty("--mx", x.toFixed(3));
        element.style.setProperty("--my", y.toFixed(3));
        element.style.setProperty("--panel-shift-x", `${(-x * 38).toFixed(1)}px`);
        element.style.setProperty("--panel-shift-y", `${(-y * 28).toFixed(1)}px`);
        element.style.setProperty("--panel-rotate-x", `${(-y * 5).toFixed(2)}deg`);
        element.style.setProperty("--panel-rotate-y", `${(x * 7).toFixed(2)}deg`);
      }}
    >
      <div
        className="absolute inset-0 bg-[radial-gradient(circle_at_78%_18%,rgba(242,101,34,0.20),transparent_28%),radial-gradient(circle_at_24%_16%,rgba(54,160,255,0.16),transparent_30%),linear-gradient(135deg,#000314_0%,#060b26_54%,#02030b_100%)]"
        aria-hidden="true"
      />
      <div className="grid-mask pointer-events-none absolute inset-0 z-0 opacity-25" aria-hidden="true" />

      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[1] h-[42%] bg-[linear-gradient(180deg,transparent,rgba(0,3,20,0.88))]" aria-hidden="true" />

      <div className="core-values relative min-h-screen" aria-labelledby="values-title">
        <div className="values-panel-stage pointer-events-none absolute inset-0 z-[2]">
          <div className="values-panel-track pointer-events-auto" aria-label="GOBE-ER core values">
            {coreValues.map((item) => (
              <button
                key={item.title}
                type="button"
                data-index={item.index}
                data-letter={item.code}
                className="value-card group absolute left-1/2 top-1/2 overflow-hidden border border-white/20 bg-[#111827]/82 p-5 text-left shadow-[0_36px_110px_rgba(0,0,0,0.52)] outline-none backdrop-blur-md"
                style={{ "--panel-accent": item.accent } as ValueCardStyle}
                onClick={() => setActiveValue(item)}
              >
                <span className="value-card-corners" aria-hidden="true" />
                <span className="value-card-corners alt" aria-hidden="true" />
                <span className="absolute left-5 top-5 z-[2] text-[10px] font-black uppercase tracking-[0.16em] text-white/36">
                  GOBE-ER / {item.index}
                </span>

                <div className="value-body relative z-[2]">
                  <h3 className="max-w-[11ch] text-[clamp(1.2rem,1.6vw,1.9rem)] font-black uppercase leading-[0.94] text-white">
                    [<span className="acronym-hit">{item.code}</span>]{item.title.slice(1)}
                  </h3>
                  <p className="mt-5 max-w-[24ch] text-sm font-semibold leading-[1.55] text-white/74">{item.body}</p>
                  <span className="mt-7 inline-flex rounded-full border border-white/36 px-4 py-2 text-[11px] font-black uppercase tracking-[0.12em] text-white/78 transition group-hover:border-white group-hover:bg-white group-hover:text-[#050815]">
                    {"Xem chi ti\u1ebft"}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="values-intro pointer-events-none relative z-[5] flex min-h-screen w-full max-w-[45rem] flex-col justify-center px-5 py-24 text-left sm:px-8 lg:px-[clamp(2.5rem,4.6vw,5rem)]">
          <p className="text-xs font-black uppercase tracking-[0.28em] text-[#F26522]">CORE VALUES</p>

          <h3
            id="values-title"
            className="mt-5 text-[clamp(3.9rem,7.1vw,8.35rem)] font-black uppercase leading-[0.84] tracking-normal text-white drop-shadow-[0_20px_48px_rgba(0,0,0,0.62)]"
          >
            {"CORE VALUE \n "}
            <span className="text-[#ff7648]">GOBE-ER</span>
          </h3>
        </div>
      </div>

      {activeValue ? (
        <div
          className="value-focus-overlay is-open"
          role="dialog"
          aria-modal="true"
          aria-labelledby="value-focus-title"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setActiveValue(null);
            }
          }}
        >
          <article
            className="value-focus-card"
            data-letter={activeValue.code}
            style={{ "--panel-accent": activeValue.accent } as ValueCardStyle}
          >
            <button
              className="value-focus-close"
              type="button"
              aria-label="Close value card"
              onClick={() => setActiveValue(null)}
            >
              x
            </button>
            <div className="value-focus-meta">
              <span>{activeValue.index}</span>
              <span>GOBE-ER</span>
            </div>
            <h3 id="value-focus-title" className="value-focus-title">
              [<span className="acronym-hit">{activeValue.code}</span>]{activeValue.title.slice(1)}
            </h3>
            <p className="value-focus-copy">{activeValue.body}</p>
            <span className="value-focus-note">Nhan ESC hoac click ra ngoai de dong</span>
          </article>
        </div>
      ) : null}
    </section>
  );
}

export function OperationsSection() {
  return (
    <section id="operations" className="operation-showcase relative z-10 min-h-screen overflow-hidden bg-[#000314] opacity-90">
      <div
        className="absolute inset-0 bg-[radial-gradient(circle_at_54%_46%,rgba(242,101,34,0.16),transparent_24%),radial-gradient(circle_at_80%_22%,rgba(255,255,255,0.06),transparent_22%),linear-gradient(135deg,#030711_0%,#060b18_55%,#01030a_100%)]"
        aria-hidden="true"
      />
      <div className="grid-mask pointer-events-none absolute inset-0 opacity-24" aria-hidden="true" />

      <div className="relative mx-auto grid min-h-screen max-w-[92rem] items-center gap-10 px-5 py-20 sm:px-8 lg:grid-cols-[0.34fr_0.18fr_0.48fr] lg:px-12">
        <div className="relative z-[3]">
          <p className="text-xs font-black uppercase tracking-[0.28em] text-[#F26522]">COMPANY OPERATION</p>
          <h2 className="mt-7 text-[clamp(4.2rem,7vw,8rem)] font-black leading-[0.9] tracking-normal text-white">
            How Gobe Operate
          </h2>
        </div>

        <div className="operation-core relative z-[2] hidden items-center justify-center lg:flex">
          <div className="operation-core-orb">
            <span>GOBEYOND</span>
            <small>COMPANY CORE</small>
          </div>
        </div>

        <div className="operation-list relative z-[3] grid gap-5">
          {operations.map((item) => (
            <article
              key={item.title}
              className="operation-card relative grid gap-4 border border-white/12 bg-[#101520]/72 p-5 shadow-[0_28px_80px_rgba(0,0,0,0.38)] backdrop-blur-md sm:grid-cols-[72px_1fr_120px] sm:items-center"
            >
              <span className="operation-index">{item.index}</span>
              <span>
                <h3 className="text-[clamp(2rem,3vw,3rem)] font-black leading-none text-white">{item.title}</h3>
                <p className="mt-2 text-base font-medium leading-6 text-white/68">{item.body}</p>
              </span>
              <span className="hidden h-[3px] w-full bg-[linear-gradient(90deg,#F26522,transparent)] opacity-75 sm:block" aria-hidden="true" />
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export function ScaleSection() {
  return (
    <section id="proof" className="scale-showcase relative z-10 min-h-screen overflow-hidden bg-[#000314] opacity-90">
      <div
        className="absolute inset-0 bg-[radial-gradient(circle_at_78%_18%,rgba(242,101,34,0.12),transparent_26%),linear-gradient(135deg,#050911_0%,#070a13_48%,#120806_100%)]"
        aria-hidden="true"
      />
      <div className="grid-mask pointer-events-none absolute inset-0 opacity-24" aria-hidden="true" />
      <div className="pointer-events-none absolute inset-0 z-[1] opacity-80" aria-hidden="true">
        <PackageRain3D />
      </div>

      <div className="relative z-[2] mx-auto grid min-h-screen max-w-[94rem] items-center gap-12 px-5 py-20 sm:px-8 lg:grid-cols-[0.44fr_0.56fr] lg:px-12">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.36em] text-white/62">Company scale</p>
          <h2 className="mt-7 text-[clamp(4.4rem,7.4vw,8.5rem)] font-black leading-[0.88] tracking-normal text-white">
            How GoBe Scale
          </h2>
        </div>

        <div className="scale-card-stack grid gap-6">
          {scaleNodes.map((node) => (
            <article key={node.title} className="scale-card border border-white/12 bg-[#111622]/76 p-7 shadow-[0_28px_82px_rgba(0,0,0,0.32)] backdrop-blur-md">
              <h3 className="text-[clamp(1.9rem,2.4vw,3rem)] font-black leading-tight text-white">{node.title}</h3>
              <p className="mt-4 text-lg font-medium leading-8 text-white/66">{node.body}</p>
              <div className="mt-6 flex flex-wrap gap-2">
                {node.chips.map((chip) => (
                  <span key={chip} className="rounded-full border border-white/12 bg-white/[0.035] px-4 py-2 text-xs font-black uppercase tracking-[0.1em] text-white/78">
                    {chip}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export function ContactCtaSection() {
  return (
    <section id="contact" className="relative z-10 overflow-hidden px-5 py-20 sm:px-6 md:py-28 lg:px-8">
      <div className="absolute inset-0 bg-[#101726]/36 backdrop-blur-[1px]" aria-hidden="true" />
      <div className="grid-mask pointer-events-none absolute inset-0 opacity-28" aria-hidden="true" />
      <div className="relative mx-auto max-w-5xl rounded-[2rem] border border-white/10 bg-white/[0.04] p-8 text-center shadow-[0_28px_90px_rgba(0,0,0,0.22)] backdrop-blur-md md:p-12">
        <h2 className="text-[clamp(2.4rem,6vw,5.8rem)] font-black uppercase leading-[0.9] tracking-normal text-white">
          Talk to the GoBe global team.
        </h2>
        <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-white/65">
          {"Li\u00ean h\u1ec7 GoBe v\u1ec1 s\u1ea3n ph\u1ea9m, h\u1ee3p t\u00e1c, tuy\u1ec3n d\u1ee5ng, truy\u1ec1n th\u00f4ng, ho\u1eb7c nh\u1eefng c\u01a1 h\u1ed9i li\u00ean quan \u0111\u1ebfn v\u1eadn h\u00e0nh th\u01b0\u01a1ng m\u1ea1i \u0111i\u1ec7n t\u1eed to\u00e0n c\u1ea7u."}
        </p>
        <a
          href="mailto:info@gobe.asia"
          className="magnetic mt-9 inline-flex min-h-12 items-center rounded-full bg-[#F26522] px-8 text-sm font-black uppercase tracking-[0.08em] text-white shadow-[0_18px_45px_rgba(242,101,34,0.28)] transition hover:-translate-y-0.5 hover:bg-[#d94d12]"
        >
          Open contact page
        </a>
      </div>
    </section>
  );
}

export function FooterSection() {
  return (
    <footer className="relative z-10 overflow-hidden border-t border-white/10 bg-[#090d14]/58 px-5 py-12 text-white backdrop-blur-[1px] sm:px-6 lg:px-8">
      <div className="relative mx-auto flex max-w-7xl flex-col gap-8 pt-8 md:flex-row md:items-center md:justify-between">
        <div>
          <img src="/Logo_2.png" alt="GOBeyond" className="w-44" />
          <p className="mt-4 max-w-md text-sm leading-7 text-white/60">
            GoBe is a dynamic business growing with the global e-commerce industry.
          </p>
        </div>
        <nav className="flex flex-wrap gap-4 text-xs font-black uppercase tracking-[0.12em] text-white/60">
          <a href="#home" className="transition hover:text-white">Home</a>
          <a href="#stack" className="transition hover:text-white">Values</a>
          <a href="#operations" className="transition hover:text-white">Operation</a>
          <a href="#proof" className="transition hover:text-white">Scale</a>
        </nav>
      </div>
      <div className="relative mx-auto mt-8 max-w-7xl text-xs font-semibold text-white/50">
        Copyright (c) 2024 - GoBeyond All Right Reserved.
      </div>
    </footer>
  );
}
