"use client";

import { useEffect, useState, type CSSProperties } from "react";
import { createPortal } from "react-dom";
import type { IconType } from "react-icons";
import { FaBox, FaBullhorn, FaCog, FaFacebookF, FaGlobe, FaLinkedinIn, FaPalette, FaRobot, FaUsers } from "react-icons/fa";
import { MdEmail, MdLocalPhone } from "react-icons/md";

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
    body: "We set clear goals and keep pushing until they are achieved.",
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
    body: "We stay receptive to new ideas, keep learning, and adapt quickly to change.",
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
    body: "We balance performance, personal growth, and life outside work.",
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
    body: "We give people ownership and trust them to act proactively and creatively.",
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
    body: "We are bold, creative, and willing to take smart risks to create new value.",
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
    body: "We stay focused on finishing goals and delivering concrete outcomes.",
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

const valueIcons: Record<string, string> = {
  "01": "/values/goal.webp",
  "02": "/values/open-mindedness.webp",
  "03": "/values/balanced.webp",
  "04": "/values/empowerment.webp",
  "05": "/values/entrepreneurship.webp",
  "06": "/values/results.webp",
};

function ValueGlassIcon({ iconKey }: { iconKey: string }) {
  return (
    <span className="value-glass-icon" aria-hidden="true">
      <img
        src={valueIcons[iconKey] ?? valueIcons["01"]}
        alt=""
        className="value-glass-icon-img"
        width={320}
        height={320}
        loading="lazy"
        decoding="async"
      />
    </span>
  );
}

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

const scaleIntro = {
  title: "Why this is where you belong.",
};

const scaleNodes = [
  {
    index: "01",
    title: "A Strong Core Team.",
    body: "Here, you don't work for leaders — you become one. We build our team with creative, knowledgeable people who are ready for any challenge. You're empowered to decide and lead from day one.",
    // chips: ["Creative Leadership", "Knowledge-Driven", "Ready for Challenges"],
    chips: [],
  },
  {
    index: "02",
    title: "A Global Supplier Network.",
    body: "Join GoBeyond and step onto a global stage — connecting product sources, fulfillment partners, and storefronts across markets. Your vision won't be limited by borders.",
    // chips: ["Global Suppliers", "Optimized Storefronts", "International Fulfillment"],
    chips: [],
  },
  {
    index: "03",
    title: "AI & Automation First.",
    body: "Machines handle the repetitive; people create. AI frees you from busywork so you can focus on what matters — strategy, ideas, and impact. Work smart, not just hard.",
    // chips: ["AI-First Mindset", "Workflow Automation", "Peak Performance"],
    chips: [],
  },
];

const VALUE_AUTO_STEP_MS = 3000;

export function CoreValuesSection() {
  const [activeValue, setActiveValue] = useState<CoreValue | null>(null);
  const [mounted, setMounted] = useState(false);
  const [autoIndex, setAutoIndex] = useState(0);
  const [autoEnabled, setAutoEnabled] = useState(false);
  const [autoPaused, setAutoPaused] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    setAutoEnabled(true);
  }, []);

  useEffect(() => {
    if (!autoEnabled || autoPaused) {
      return;
    }

    const timer = window.setInterval(() => {
      setAutoIndex((current) => (current + 1) % coreValues.length);
    }, VALUE_AUTO_STEP_MS);

    return () => window.clearInterval(timer);
  }, [autoEnabled, autoPaused]);

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

        <div
          className="values-glass-inner relative z-[2] mx-auto flex min-h-screen w-full max-w-7xl flex-col justify-center gap-8 px-5 py-20 sm:px-8 lg:px-12"
          aria-labelledby="values-title"
        >
          <div className="values-glass-intro max-w-2xl">
            <p data-scroll-reveal className="text-xs font-black uppercase tracking-[0.28em] text-[#F26522]">
              Core Values
            </p>
            <h3
              id="values-title"
              data-scroll-reveal
              className="mobile-page-title mt-5 text-[clamp(2.4rem,5vw,4.4rem)] font-black uppercase leading-[0.9] tracking-normal text-white"
            >
              Core Value
              <span className="block text-[#ff7648]">GOBE-ER</span>
            </h3>
            <p data-scroll-reveal className="mt-4 max-w-xl text-sm font-medium leading-6 text-white/62 md:text-base md:leading-7">
              The six principles that shape how we build, operate, and grow together.
            </p>
          </div>

          <div className="values-honeycomb-bleed">
          <div
            className={`values-glass-honeycomb${autoEnabled && !autoPaused ? " is-auto-cycling" : ""}`}
            aria-label="GOBE-ER core values"
            onMouseEnter={() => setAutoPaused(true)}
            onMouseLeave={() => setAutoPaused(false)}
            onFocusCapture={() => setAutoPaused(true)}
            onBlurCapture={() => setAutoPaused(false)}
          >
            {[coreValues.slice(0, 3), coreValues.slice(3)].map((row, rowIndex) => (
              <div
                key={rowIndex}
                className={`values-glass-row${rowIndex === 1 ? " is-offset" : ""}`}
              >
                {row.map((item, index) => {
                  const cycling = autoEnabled && !autoPaused;
                  const globalIndex = rowIndex === 0 ? index : 3 + index;
                  const isFeatured = rowIndex === 0 && index === 0 && !cycling;
                  const isAutoActive = cycling && autoIndex === globalIndex;
                  return (
                  <button
                    key={item.index}
                    type="button"
                    data-scroll-reveal
                    className={`value-glass-card group relative flex flex-col items-center justify-center text-center outline-none${isFeatured ? " is-featured" : ""}${isAutoActive ? " is-auto-active" : ""}`}
                    style={{ "--panel-accent": item.accent } as ValueCardStyle}
                    onClick={() => setActiveValue(item)}
                  >
                    <ValueGlassIcon iconKey={item.index} />
                    <div className="value-glass-body relative z-[2] flex flex-col items-center">
                      <h3 className="value-glass-title font-black uppercase leading-[1.05] text-white">
                        [<span className="acronym-hit">{item.code}</span>]{item.title.slice(1)}
                      </h3>
                    </div>
                    <span className="value-glass-index" aria-hidden="true">{item.index}</span>
                  </button>
                  );
                })}
              </div>
            ))}
          </div>
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
            {/* <span className="value-focus-note">Press ESC or click outside to close</span> */}
          </article>
        </div>,
            document.body,
          )
        : null}
    </section>
  );
}

const operationIcons: Record<string, IconType> = {
  "01": FaPalette,
  "02": FaBullhorn,
  "03": FaBox,
  "04": FaRobot,
  "05": FaCog,
};

export function OperationsSection() {
  return (
    <section
      id="operations"
      data-home-story-section
      data-scroll-section
      className="bento-scope relative z-10 min-h-screen overflow-hidden bg-[#000314]"
    >
      <div data-home-story-content className="relative min-h-screen overflow-hidden">
        <div
          className="absolute inset-0 bg-[radial-gradient(circle_at_72%_22%,rgba(242,101,34,0.14),transparent_30%),linear-gradient(135deg,#030711_0%,#060b18_55%,#01030a_100%)]"
          aria-hidden="true"
        />
        <div className="grid-mask pointer-events-none absolute inset-0 opacity-24" aria-hidden="true" />

        <div className="bento-inner relative z-[2] mx-auto grid min-h-screen max-w-[92rem] items-center gap-12 px-5 py-24 sm:px-8 lg:grid-cols-[minmax(0,0.4fr)_minmax(0,0.6fr)] lg:gap-16 lg:px-12">
          <div data-scroll-reveal className="bento-copy">
            <p className="bento-eyebrow">Company Operation</p>
            <h2 className="bento-title">
              How GoBeyond
              <span className="bento-title-accent"> Operates</span>
            </h2>
            <p className="bento-intro">
              Five in-house engines move every product from idea to a customer&apos;s door — creative, performance,
              fulfillment, AI, and operations.
            </p>
          </div>

          <div className="bento-grid bento-grid--5">
            {operations.map((item, index) => {
              const Icon = operationIcons[item.index] ?? FaCog;

              return (
                <article
                  key={item.title}
                  data-scroll-card
                  className={`bento-card${index === 0 ? " is-featured" : ""}`}
                >
                  <div className="bento-card-head">
                    <span className="bento-card-icon" aria-hidden="true">
                      <Icon />
                    </span>
                    <span className="bento-card-index">{item.index}</span>
                  </div>
                  <h3 className="bento-card-title">{item.title}</h3>
                  <p className="bento-card-body">{item.body}</p>
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

const scaleIcons: Record<string, IconType> = {
  "01": FaUsers,
  "02": FaGlobe,
  "03": FaRobot,
};

export function ScaleSection() {
  return (
    <section
      id="proof"
      data-home-story-section
      data-scroll-section
      className="scale-showcase bento-scope relative z-10 min-h-screen overflow-hidden bg-[#000314]"
    >
      <div data-home-story-content className="relative min-h-screen overflow-hidden">
        <div
          className="absolute inset-0 bg-[radial-gradient(circle_at_78%_18%,rgba(242,101,34,0.12),transparent_26%),linear-gradient(135deg,#050911_0%,#070a13_48%,#120806_100%)]"
          aria-hidden="true"
        />
        <div className="grid-mask pointer-events-none absolute inset-0 opacity-24" aria-hidden="true" />

        <div className="scale-content relative z-[2] mx-auto grid min-h-screen max-w-[94rem] items-center gap-12 px-5 py-24 sm:px-8 lg:grid-cols-[minmax(0,0.4fr)_minmax(0,0.6fr)] lg:gap-16 lg:px-12">
          <div data-scroll-reveal className="scale-copy">
            <p className="bento-eyebrow">Company Scale</p>
            <h2 className="bento-title">
              How GoBeyond
              <span className="bento-title-accent"> Scales</span>
            </h2>
            <p className="bento-lead">{scaleIntro.title}</p>
          </div>

          <div className="bento-grid bento-grid--3">
            {scaleNodes.map((node, index) => {
              const Icon = scaleIcons[node.index] ?? FaRobot;

              return (
                <article
                  key={node.title}
                  data-scroll-card
                  className={`bento-card${index === 0 ? " is-featured" : ""}`}
                >
                  <div className="bento-card-head">
                    <span className="bento-card-icon" aria-hidden="true">
                      <Icon />
                    </span>
                    <span className="bento-card-index">{node.index}</span>
                  </div>
                  <h3 className="bento-card-title">{node.title}</h3>
                  <p className="bento-card-body">{node.body}</p>
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

const teamPhotos = [
  { src: "/team/team-01.webp", grow: 1.35 },
  { src: "/team/team-02.webp", grow: 1 },
  { src: "/team/team-03.webp", grow: 1.25 },
  { src: "/team/team-04.webp", grow: 1.5 },
  { src: "/team/team-05.webp", grow: 1.5 },
  { src: "/team/team-06.webp", grow: 1.2 },
  { src: "/team/team-07.webp", grow: 1 },
  { src: "/team/team-08.webp", grow: 1.3 },
  { src: "/team/team-09.webp", grow: 1.1 },
  { src: "/team/team-10.webp", grow: 1.4 },
  { src: "/team/team-11.webp", grow: 1.2 },
  { src: "/team/team-12.webp", grow: 1 },
];

export function OurTeamSection() {
  return (
    <section id="team" data-scroll-section className="our-team-showcase relative z-10 overflow-hidden pt-20 pb-6 md:pt-28 md:pb-8">
      <div className="our-team-head">
        <h2 data-scroll-reveal className="our-team-title">Our Team</h2>
        <p data-scroll-reveal className="our-team-quote">
          “People are at the heart of GoBeyond. We cultivate a workplace where creativity, collaboration, and continuous growth thrive.”
        </p>
      </div>

      <div className="our-team-collage" aria-hidden="true">
        {[0, 1, 2].map((row) => (
          <div
            key={row}
            data-team-row
            data-team-dir={row === 1 ? "right" : "left"}
            className={`our-team-row our-team-row--${row + 1}`}
          >
            {teamPhotos.slice(row * 4, row * 4 + 4).map((photo) => (
              <figure key={photo.src} className="our-team-photo" style={{ flexGrow: photo.grow }}>
                <img src={photo.src} alt="" loading="lazy" decoding="async" />
              </figure>
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}

export function ContactCtaSection() {
  return (
    <section id="contact" data-home-story-section data-scroll-section className="relative z-10 overflow-hidden px-0 pt-12 md:pt-16">
      <div data-home-story-content className="relative z-[2] overflow-hidden px-5 sm:px-6 lg:px-8">
        <div className="absolute inset-0 bg-[#101726]/36 backdrop-blur-[1px]" aria-hidden="true" />
        <div className="grid-mask pointer-events-none absolute inset-0 opacity-28" aria-hidden="true" />
        <div data-scroll-reveal className="relative mx-auto max-w-5xl rounded-[2rem] border border-white/10 bg-white/[0.04] p-8 text-center shadow-[0_28px_90px_rgba(0,0,0,0.22)] backdrop-blur-md md:p-12">
          <h2 data-pretext-fit data-pretext-max-lines="2" data-pretext-min-scale="0.82" className="text-[clamp(2.4rem,6vw,5.8rem)] font-black leading-[0.9] tracking-normal text-white">
            Join GoBeyond today!
          </h2>
          <p data-pretext-fit data-pretext-max-lines="3" data-pretext-min-scale="0.82" className="mx-auto mt-6 max-w-2xl text-base leading-8 text-white/65">
            Contact GoBeyond for products, partnerships, careers, press, or opportunities connected to global e-commerce operations.
          </p>
          <a
            href="mailto:info@gobe.asia"
            className="magnetic mt-9 inline-flex min-h-12 items-center rounded-full bg-[#F26522] px-8 text-sm font-black uppercase tracking-[0.08em] text-white shadow-[0_18px_45px_rgba(242,101,34,0.28)] transition hover:-translate-y-0.5 hover:bg-[#d94d12]"
          >
            Send email
          </a>
        </div>
      </div>
      <div className="contact-footer-bridge pointer-events-none relative w-full" aria-hidden="true" />
    </section>
  );
}

export function FooterBridge() {
  return <div className="footer-page-bridge pointer-events-none relative z-[9] -mb-px h-28" aria-hidden="true" />;
}

export function FooterSection() {
  const pageLinks = [
    { href: "/", label: "Home" },
    { href: "/about-us", label: "About Us" },
    { href: "/careers", label: "Careers" },
    { href: "/activities", label: "Activities" },
    { href: "/news", label: "News" },
    { href: "/privacy-policy", label: "Privacy Policy" },
  ];

  const socialLinks = [
    { href: "https://web.facebook.com/lifeatgobeyond", label: "Facebook", Icon: FaFacebookF },
    { href: "mailto:info@gobe.asia", label: "Email", Icon: MdEmail },
    { href: "tel:0786541658", label: "Phone", Icon: MdLocalPhone },
    { href: "https://www.linkedin.com/company/gobeyond-llc/", label: "LinkedIn", Icon: FaLinkedinIn },
  ];

  return (
    <footer data-home-story-footer className="relative z-10 overflow-hidden bg-[radial-gradient(circle_at_54%_26%,rgba(255,176,65,0.9),transparent_19%),linear-gradient(112deg,#ef2b0b_0%,#ff5b13_36%,#f03b0c_72%,#e7260a_100%)] px-5 pb-8 pt-20 text-white sm:px-6 lg:px-8">
      <svg
        className="footer-top-wave pointer-events-none absolute inset-x-0 top-0 h-14 w-full"
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
          <img src="/Logo_2.png" alt="GoBeyond" className="w-64 max-w-full brightness-0 invert" />
          <p className="mt-8 max-w-[34rem] text-base font-semibold leading-8 text-white">
            GoBeyond grows with cross-border e-commerce, focusing on Print on Demand and dropshipping.
          </p>

          <div className="mt-7 flex flex-wrap gap-3" aria-label="GoBeyond social links">
            {socialLinks.map((link) => {
              const Icon = link.Icon;

              return (
                <a
                  key={link.label}
                  href={link.href}
                  target={link.href.startsWith("http") ? "_blank" : undefined}
                  rel={link.href.startsWith("http") ? "noreferrer" : undefined}
                  aria-label={link.label}
                  className="inline-flex size-11 items-center justify-center rounded-full border-2 border-white text-xl font-black text-white transition hover:-translate-y-1 hover:bg-white hover:text-[#f04413]"
                >
                  <Icon aria-hidden="true" focusable="false" />
                </a>
              );
            })}
          </div>
        </div>

        <div>
          <h2 className="text-3xl font-black tracking-normal text-white">Contact</h2>
          <div className="mt-7 space-y-4 text-base font-semibold leading-7 text-white">
            <p className="flex gap-3">
              <span className="mt-1 min-w-8 text-xs font-black uppercase tracking-[0.08em]" aria-hidden="true">pin</span>
              <span>St Moritz, 1014 Pham Van Dong Street, Hiep Binh Ward, Ho Chi Minh City</span>
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

        <nav aria-label="Footer pages">
          <h2 className="text-3xl font-black tracking-normal text-white">Pages</h2>
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
        Copyright © 2024 - GoBeyond. All rights reserved.
      </div>

      <button
        type="button"
        aria-label="Back to top"
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
