"use client";

import { useEffect, useState, type CSSProperties } from "react";
import { createPortal } from "react-dom";

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
    title: "Creative",
    body: "Creativity is our DNA. We use AI to optimize every concept and turn ideas into market-winning content.",
    fullBody:
      "Creativity is the core DNA driving GoBeyond's growth. By harnessing AI and relentlessly optimizing every concept, we turn ideas into market-winning content — defining our role and standing out in a crowded global market.",
  },
  {
    index: "02",
    title: "Ads Performance",
    body: "Performance is our edge. New strategies, constantly tested — powering $50K–$150K in daily ad spend.",
    fullBody:
      "Performance marketing is our built-in strength. We constantly test, learn, and deploy cutting-edge strategies that let us scale confidently at $50K–$150K in daily ad spend, turning demand signals into real results.",
  },
  {
    index: "03",
    title: "Fulfillment",
    body: "The backbone of stable scaling. Optimized, automated processes from sourcing to delivery.",
    fullBody:
      "The backbone of stable scaling. Our fulfillment engine continuously optimizes sourcing, packaging, and delivery through streamlined, automated processes — so we grow fast without breaking under pressure.",
  },
  {
    index: "04",
    title: "AI",
    body: "The force behind everything. Constant AI innovation fuels our non-stop growth.",
    fullBody:
      "AI is the force multiplier behind everything we do. By constantly exploring and innovating with AI, we unlock new capabilities and keep pushing forward — growth that never stops.",
  },
  {
    index: "05",
    title: "Operation",
    body: "The back-end that holds it together — smooth operations, strong culture, clear communication.",
    fullBody:
      "The back-end that holds it all together. Our operations team ensures the company runs smoothly day to day, while building a strong internal culture and clear communication across the team.",
  },
];

type OperationItem = (typeof operations)[number];

const scaleIntro = {
  title: "Why this is where you belong.",
  body: "We don't scale with numbers — we scale with people who dare to go beyond.",
};

const scaleNodes = [
  {
    title: "A Strong Core Team.",
    body: "Here, you don't work for leaders — you become one. We build our team with creative, knowledgeable people who are ready for any challenge. You're empowered to decide and lead from day one.",
    // chips: ["Creative Leadership", "Knowledge-Driven", "Ready for Challenges"],
    chips: [],
  },
  {
    title: "A Global Supplier Network.",
    body: "Join GoBeyond and step onto a global stage — connecting product sources, fulfillment partners, and storefronts across markets. Your vision won't be limited by borders.",
    // chips: ["Global Suppliers", "Optimized Storefronts", "International Fulfillment"],
    chips: [],
  },
  {
    title: "AI & Automation First.",
    body: "Machines handle the repetitive; people create. AI frees you from busywork so you can focus on what matters — strategy, ideas, and impact. Work smart, not just hard.",
    // chips: ["AI-First Mindset", "Workflow Automation", "Peak Performance"],
    chips: [],
  },
];

export function CoreValuesSection() {
  const [activeValue, setActiveValue] = useState<CoreValue | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

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
      data-home-story-section
      data-scroll-section
      className="values-showcase relative z-10 min-h-screen overflow-hidden bg-[#000314] opacity-90"
    >
      <div data-home-story-content className="relative min-h-screen overflow-hidden">
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
                  key={item.index}
                  type="button"
                  data-scroll-card
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
                    <span className="mt-7 inline-flex px-4 py-2 font-black tracking-[0.12em] transition">
                      {/* {"Xem chi ti\u1ebft"} */}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="values-intro pointer-events-none relative z-[5] flex min-h-screen w-full max-w-[45rem] flex-col justify-center px-5 py-24 text-left sm:px-8 lg:px-[clamp(2.5rem,4.6vw,5rem)]">
            <p data-scroll-reveal className="text-xs font-black uppercase tracking-[0.28em] text-[#F26522]">CORE VALUES</p>

            <h3
              id="values-title"
              data-scroll-reveal
              className="mt-5 text-[clamp(3.9rem,7.1vw,8.35rem)] font-black uppercase leading-[0.84] tracking-normal text-white drop-shadow-[0_20px_48px_rgba(0,0,0,0.62)]"
            >
              {"CORE VALUE \n "}
              <span className="text-[#ff7648]">GOBE-ER</span>
            </h3>
          </div>
        </div>
      </div>

      {activeValue && mounted
        ? createPortal(
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
            {/* <span className="value-focus-note">Nhan ESC hoac click ra ngoai de dong</span> */}
          </article>
        </div>,
            document.body,
          )
        : null}
    </section>
  );
}

export function OperationsSection() {
  const [activeOperation, setActiveOperation] = useState<OperationItem | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("operation-card-open", Boolean(activeOperation));

    if (!activeOperation) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setActiveOperation(null);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.documentElement.classList.remove("operation-card-open");
    };
  }, [activeOperation]);

  return (
    <section id="operations" data-home-story-section data-scroll-section className="operation-showcase relative z-10 min-h-screen overflow-hidden bg-[#000314] opacity-90">
      <div data-home-story-content className="relative min-h-screen overflow-hidden">
        <div
          className="absolute inset-0 bg-[radial-gradient(circle_at_54%_46%,rgba(242,101,34,0.16),transparent_24%),radial-gradient(circle_at_80%_22%,rgba(255,255,255,0.06),transparent_22%),linear-gradient(135deg,#030711_0%,#060b18_55%,#01030a_100%)]"
          aria-hidden="true"
        />
        <div className="grid-mask pointer-events-none absolute inset-0 opacity-24" aria-hidden="true" />

        <div className="operation-content relative mx-auto grid min-h-screen max-w-[92rem] items-center gap-10 px-5 py-20 sm:px-8 lg:px-12">
          <div data-scroll-reveal className="operation-copy relative z-[3]">
            <p className="text-xs font-black uppercase tracking-[0.28em] text-[#F26522]">COMPANY OPERATION</p>
            <h2 data-pretext-fit data-pretext-max-lines="3" data-pretext-min-scale="0.82" className="mt-7 text-[clamp(4.2rem,7vw,8rem)] font-black leading-[0.9] tracking-normal text-white">
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
              <button
                key={item.title}
                type="button"
                data-scroll-card
                className="operation-card relative grid gap-4 border border-white/12 bg-[#101520]/72 p-5 text-left text-white shadow-[0_28px_80px_rgba(0,0,0,0.38)] backdrop-blur-md sm:grid-cols-[72px_1fr_120px] sm:items-center"
                aria-label={`View details for ${item.title}`}
                onClick={() => setActiveOperation(item)}
              >
                <span className="operation-index">{item.index}</span>
                <span>
                  <h3 data-pretext-fit data-pretext-max-lines="2" data-pretext-min-scale="0.82" className="text-[clamp(2rem,3vw,3rem)] font-black leading-none text-white">{item.title}</h3>
                  <p className="operation-summary mt-2 text-base font-medium leading-6 text-white/68">{item.body}</p>
                  <p className="operation-expanded-copy">{item.fullBody}</p>
                </span>
                <span className="hidden h-[3px] w-full bg-[linear-gradient(90deg,#F26522,transparent)] opacity-75 sm:block" aria-hidden="true" />
              </button>
            ))}
          </div>
        </div>
      </div>

      {activeOperation && mounted
        ? createPortal(
            <div
              className="operation-focus-overlay"
              role="dialog"
              aria-modal="true"
              aria-labelledby="operation-focus-title"
              onMouseDown={(event) => {
                if (event.target === event.currentTarget) {
                  setActiveOperation(null);
                }
              }}
            >
              <article className="operation-focus-card">
                <button
                  className="operation-focus-close"
                  type="button"
                  aria-label="Close operation detail"
                  onClick={() => setActiveOperation(null)}
                >
                  x
                </button>
                <p className="operation-focus-kicker">{activeOperation.index} — GoBeyond scale engine</p>
                <h3 id="operation-focus-title" className="operation-focus-title">
                  {activeOperation.title}
                </h3>
                <p className="operation-focus-copy">{activeOperation.fullBody}</p>
              </article>
            </div>,
            document.body,
          )
        : null}
    </section>
  );
}

export function ScaleSection() {
  return (
    <section id="proof" data-home-story-section data-scroll-section className="scale-showcase relative z-10 min-h-screen overflow-hidden bg-[#000314] opacity-90">
      <div data-home-story-content className="relative min-h-screen overflow-hidden">
        <div
          className="absolute inset-0 bg-[radial-gradient(circle_at_78%_18%,rgba(242,101,34,0.12),transparent_26%),linear-gradient(135deg,#050911_0%,#070a13_48%,#120806_100%)]"
          aria-hidden="true"
        />
        <div className="grid-mask pointer-events-none absolute inset-0 opacity-24" aria-hidden="true" />

        <div className="scale-content relative z-[2] mx-auto grid min-h-screen max-w-[94rem] items-center gap-12 px-5 py-24 sm:px-8 lg:px-12">
          <div data-scroll-reveal className="scale-copy">
            <p className="text-xs font-black uppercase tracking-[0.36em] text-white/62">Company scale</p>
            <h2 data-pretext-fit data-pretext-max-lines="2" data-pretext-min-scale="0.82" className="mt-7 text-[clamp(3.4rem,9vw,8.5rem)] font-black leading-[0.88] tracking-normal text-white">
              How GoBe Scale
            </h2>
            <div className="scale-intro-copy">
              <h3 className="scale-intro-title">{scaleIntro.title}</h3>
              <p className="scale-intro-body">{scaleIntro.body}</p>
            </div>
          </div>

          <div className="scale-card-stack grid gap-6">
            {scaleNodes.map((node) => (
              <article key={node.title} data-scroll-card className="scale-card border border-white/12 bg-[#111622]/76 p-7 shadow-[0_28px_82px_rgba(0,0,0,0.32)] backdrop-blur-md">
                <h3 data-pretext-fit data-pretext-max-lines="2" data-pretext-min-scale="0.82" className="text-[clamp(1.9rem,2.4vw,3rem)] font-black leading-tight text-white">{node.title}</h3>
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
      </div>
    </section>
  );
}

export function ContactCtaSection() {
  return (
    <section id="contact" data-home-story-section data-scroll-section className="relative z-10 overflow-hidden px-5 py-20 sm:px-6 md:py-28 lg:px-8">
      <div data-home-story-content className="relative flex min-h-screen items-center overflow-hidden">
        <div className="absolute inset-0 bg-[#101726]/36 backdrop-blur-[1px]" aria-hidden="true" />
        <div className="grid-mask pointer-events-none absolute inset-0 opacity-28" aria-hidden="true" />
        <div data-scroll-reveal className="relative mx-auto max-w-5xl rounded-[2rem] border border-white/10 bg-white/[0.04] p-8 text-center shadow-[0_28px_90px_rgba(0,0,0,0.22)] backdrop-blur-md md:p-12">
          <h2 data-pretext-fit data-pretext-max-lines="2" data-pretext-min-scale="0.82" className="text-[clamp(2.4rem,6vw,5.8rem)] font-black uppercase leading-[0.9] tracking-normal text-white">
            Liên hệ đội ngũ GoBe toàn cầu.
          </h2>
          <p data-pretext-fit data-pretext-max-lines="3" data-pretext-min-scale="0.82" className="mx-auto mt-6 max-w-2xl text-base leading-8 text-white/65">
            {"Li\u00ean h\u1ec7 GoBe v\u1ec1 s\u1ea3n ph\u1ea9m, h\u1ee3p t\u00e1c, tuy\u1ec3n d\u1ee5ng, truy\u1ec1n th\u00f4ng, ho\u1eb7c nh\u1eefng c\u01a1 h\u1ed9i li\u00ean quan \u0111\u1ebfn v\u1eadn h\u00e0nh th\u01b0\u01a1ng m\u1ea1i \u0111i\u1ec7n t\u1eed to\u00e0n c\u1ea7u."}
          </p>
          <a
            href="mailto:info@gobe.asia"
            className="magnetic mt-9 inline-flex min-h-12 items-center rounded-full bg-[#F26522] px-8 text-sm font-black uppercase tracking-[0.08em] text-white shadow-[0_18px_45px_rgba(242,101,34,0.28)] transition hover:-translate-y-0.5 hover:bg-[#d94d12]"
          >
            Gửi email liên hệ
          </a>
        </div>
      </div>
    </section>
  );
}

export function FooterSection() {
  const pageLinks = [
    { href: "/", label: "Trang chủ" },
    { href: "/ve-chung-toi", label: "Về chúng tôi" },
    { href: "/tuyen-dung", label: "Tuyển dụng" },
    { href: "/hoat-dong", label: "Hoạt động" },
    { href: "/tin-tuc", label: "Tin tức" },
  ];

  const socialLinks = [
    { href: "https://www.facebook.com/gobeyond.asia", label: "Facebook", mark: "f" },
    { href: "https://www.tiktok.com/@gobeyond.asia", label: "TikTok", mark: "tt" },
    { href: "mailto:info@gobe.asia", label: "Email", mark: "@" },
    { href: "tel:0786541658", label: "Phone", mark: "tel" },
    { href: "https://www.linkedin.com/company/gobeyond-asia", label: "LinkedIn", mark: "in" },
  ];

  return (
    <footer data-home-story-footer className="relative z-10 overflow-hidden bg-[radial-gradient(circle_at_54%_26%,rgba(255,176,65,0.9),transparent_19%),linear-gradient(112deg,#ef2b0b_0%,#ff5b13_36%,#f03b0c_72%,#e7260a_100%)] px-5 pb-8 pt-20 text-white sm:px-6 lg:px-8">
      <svg
        className="pointer-events-none absolute inset-x-0 top-0 h-14 w-full text-white"
        viewBox="0 0 1440 90"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path
          d="M0 0h1440v36c-122 22-248 8-371 0-166-11-331 7-496 16-165 9-329 7-493-15C51 33 24 28 0 22V0z"
          fill="currentColor"
          opacity=".92"
        />
        <path
          d="M0 30c146 22 269 37 431 22 221-21 347-51 589-20 174 22 260-10 420-12v42H0V30z"
          fill="#ff9b55"
          opacity=".48"
        />
        <path
          d="M0 48c184 11 304 39 493 24 221-18 367-47 598-18 142 18 241-18 349-17v53H0V48z"
          fill="#ff6a2a"
          opacity=".48"
        />
      </svg>

      <div className="relative mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1.15fr_.9fr_.55fr]">
        <div>
          <img src="/Logo_2.png" alt="GOBeyond" className="w-64 max-w-full brightness-0 invert" />
          <p className="mt-8 max-w-[34rem] text-base font-semibold leading-8 text-white">
            GoBe là doanh nghiệp phát triển cùng ngành thương mại điện tử xuyên biên giới, tập trung vào Print on Demand và Drop-shipping.
          </p>

          <div className="mt-7 flex flex-wrap gap-3" aria-label="Liên kết mạng xã hội GoBeyond">
            {socialLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target={link.href.startsWith("http") ? "_blank" : undefined}
                rel={link.href.startsWith("http") ? "noreferrer" : undefined}
                aria-label={link.label}
                className="inline-flex size-11 items-center justify-center rounded-full border-2 border-white text-sm font-black text-white transition hover:-translate-y-1 hover:bg-white hover:text-[#f04413]"
              >
                {link.mark}
              </a>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-3xl font-black tracking-normal text-white">Liên hệ</h2>
          <div className="mt-7 space-y-4 text-base font-semibold leading-7 text-white">
            <p className="flex gap-3">
              <span className="mt-1 min-w-8 text-xs font-black uppercase tracking-[0.08em]" aria-hidden="true">pin</span>
              <span>St Moritz, 1014 Đường Phạm Văn Đồng, Phường Thủ Đức, Thành phố Hồ Chí Minh</span>
            </p>
            <p className="flex gap-3">
              <span className="mt-1 min-w-8 text-xs font-black uppercase tracking-[0.08em]" aria-hidden="true">tel</span>
              <a href="tel:0786541658" className="transition hover:text-white/72">078.654.1658</a>
            </p>
            <p className="flex gap-3">
              <span className="mt-1 min-w-8 text-xs font-black uppercase tracking-[0.08em]" aria-hidden="true">@</span>
              <span>
                <a href="mailto:info@gobe.asia" className="transition hover:text-white/72">info@gobe.asia</a>
                {" | "}
                <a href="mailto:tuyendung@gobe.asia" className="transition hover:text-white/72">tuyendung@gobe.asia</a>
              </span>
            </p>
          </div>
        </div>

        <nav aria-label="Các trang ở chân trang">
          <h2 className="text-3xl font-black tracking-normal text-white">Trang</h2>
          <div className="mt-7 flex flex-col gap-4 text-base font-semibold text-white">
            {pageLinks.map((link) => (
              <a key={link.href} href={link.href} className="transition hover:translate-x-1 hover:text-white/72">
                {link.label}
              </a>
            ))}
          </div>
        </nav>
      </div>

      <div className="relative mx-auto mt-14 max-w-7xl border-t border-white/78 pt-7 text-center text-sm font-semibold text-white">
        Bản quyền © 2024 - GoBeyond. Đã đăng ký mọi quyền.
      </div>

      <button
        type="button"
        aria-label="Lên đầu trang"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className="absolute bottom-10 right-7 inline-flex size-14 items-center justify-center rounded-full bg-[#31b73e] text-white shadow-[0_18px_40px_rgba(49,183,62,0.34)] transition hover:-translate-y-1 hover:bg-[#28a733]"
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M6 14.5 12 8l6 6.5" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
    </footer>
  );
}
