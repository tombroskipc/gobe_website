"use client";

import { useEffect, type CSSProperties, type ReactNode } from "react";
import { CustomCursor } from "./CustomCursor";
import { FooterBridge, FooterSection } from "./LegacySections";
import { Navbar } from "./Navbar";
import { initScrollController } from "./ScrollController";

type AccentStyle = CSSProperties & {
  "--accent": string;
};

const stats = [
  {
    value: "4+",
    label: "Years building and growing",
    body: "A focused journey in POD, dropshipping, and e-commerce from Ho Chi Minh City to global markets.",
    accent: "#F26522",
  },
  {
    value: "3+",
    label: "Brands in operation",
    body: "Multiple brands built, tested, and scaled through GoBeyond's in-house capabilities.",
    accent: "#5AA2E8",
  },
  {
    value: "10+",
    label: "Partner network",
    body: "A network of suppliers, fulfillment partners, platforms, and operating tools across markets.",
    accent: "#2ED4A4",
  },
  {
    value: "US/EU",
    label: "Core markets",
    body: "The team builds products and campaigns for customers in North America and Europe.",
    accent: "#E9C15F",
  },
];

const principles = [
  "Continuous innovation",
  "Entrepreneurial spirit",
  "Products beyond expectations",
  "Systematic operations",
];

const journey = [
  {
    year: "2022",
    phase: "Positioning",
    description: "Establishing our business foundation and focusing on e-commerce as our core direction",
    accent: "#ffb15f",
    symbol: "01",
  },
  {
    year: "2023",
    phase: "Establishment",
    description: "Founded the company and launched key products across Shopify, Amazon, and Etsy",
    accent: "#ff6b4d",
    symbol: "02",
  },
  {
    year: "2024",
    phase: "Consolidation",
    description: "Focused on developing POD and dropshipping products, optimizing operations, and enhancing quality",
    accent: "#58a8ef",
    symbol: "03",
  },
  {
    year: "2025",
    phase: "Development",
    description:
      "Expanded our global market presence, enhanced our business infrastructure, and drove sustainable revenue growth",
    accent: "#f4bc34",
    symbol: "04",
  },
  {
    year: "2026",
    phase: "Expansion",
    description:
      "Optimized our operations end-to-end, diversified our product categories, and enhanced the overall customer experience",
    accent: "#ff6a10",
    symbol: "05",
  },
];

const brandLogos = [
  { name: "Shopify", src: "/about/partner-shopify.png" },
  { name: "Facebook", src: "/about/partner-facebook.png" },
  { name: "Pinterest", src: "/about/partner-pinterest.png" },
  { name: "Dreamship", src: "/about/partner-dreamship.png" },
  { name: "Google", src: "/about/partner-google.png" },
  { name: "Gelato", src: "/about/partner-gelato.png" },
  { name: "PayPal", src: "/about/partner-paypal.webp" },
  { name: "TikTok", src: "/about/partner-tiktok.png" },
  { name: "X", src: "/about/partner-twitter.png" },
  { name: "YouTube", src: "/about/partner-youtube.png" },
  { name: "Instagram", src: "/about/partner-instagram.png" },
  { name: "Amazon", src: "/about/partner-amazon.png" },
];

function SectionMark({ current, label }: { current: string; label: string }) {
  return (
    <div className="flex items-center gap-4 text-xs font-black uppercase tracking-[0.24em] text-white/56">
      <span className="text-[#F26522]">{current}</span>
      <span className="h-px w-14 bg-[#F26522]/70" aria-hidden="true" />
      <span>{label}</span>
    </div>
  );
}

function SectionFrame({
  children,
  id,
  className = "",
  releaseWithFooter = false,
}: {
  children: ReactNode;
  id: string;
  className?: string;
  releaseWithFooter?: boolean;
}) {
  return (
    <section
      id={id}
      data-scroll-section
      data-home-story-section
      data-home-story-release-section={releaseWithFooter || undefined}
      className={`relative z-10 min-h-screen snap-start snap-always overflow-hidden bg-[#000314] px-5 pt-20 text-white sm:px-8 lg:px-12 ${className}`}
    >
      <div
        className="absolute inset-0 bg-[linear-gradient(135deg,#000314_0%,#061029_48%,#030712_100%)]"
        aria-hidden="true"
      />
      <div className="grid-mask pointer-events-none absolute inset-0 opacity-24" aria-hidden="true" />
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-[linear-gradient(180deg,transparent,rgba(0,3,20,0.86))]"
        aria-hidden="true"
      />
      <div data-home-story-content className="relative z-[2] min-h-screen">
        {children}
      </div>
    </section>
  );
}

export function AboutPage() {
  useEffect(() => initScrollController(), []);

  return (
    <main id="scroll-story" className="relative min-h-screen overflow-x-hidden bg-[#000314] text-white">
      <CustomCursor />
      <Navbar />

      <nav
        aria-label="About section navigation"
        data-home-story-nav
        className="fixed right-5 top-1/2 z-40 hidden -translate-y-1/2 grid-cols-1 gap-3 lg:grid"
      >
        {["about-gobeyond", "our-journey", "about-numbers", "about-vision", "about-brands"].map((id) => (
          <a
            key={id}
            href={`#${id}`}
            className="h-2.5 w-2.5 rounded-full border border-white/50 bg-white/10 transition hover:border-[#F26522] hover:bg-[#F26522]"
            aria-label={`Go to ${id}`}
          />
        ))}
      </nav>

      <SectionFrame id="about-gobeyond">
        <div className="relative mx-auto grid min-h-[calc(100vh-5rem)] max-w-7xl items-center gap-8 py-5 lg:grid-cols-[minmax(0,0.52fr)_minmax(0,0.48fr)]">
          <div className="min-w-0">
            <div data-scroll-reveal>
              <SectionMark current="01" label="" />
            </div>
            <h1 data-scroll-reveal className="mobile-page-title mt-6 max-w-4xl text-4xl font-black uppercase leading-[0.86] tracking-normal text-white sm:text-4xl lg:text-6xl xl:text-8xl">
              About
              <span className="block text-[#ff7648]">GoBeyond</span>
            </h1>
            <div data-scroll-reveal className="mt-6 max-w-2xl space-y-4 text-base font-medium leading-7 text-white/72 md:text-lg md:leading-8">
              <p>
                GoBeyond is a Ho Chi Minh City startup with four years of focus in POD and dropshipping across North
                American and European markets.
              </p>
              <p>
                Guided by the spirit of <strong className="text-white">go global, keep moving</strong>, we believe a
                small, talented, and passionate team can create meaningful impact in the global market.
              </p>
            </div>
            <div data-scroll-reveal className="mt-7 flex flex-wrap gap-3">
              {principles.map((item) => (
                <span
                  key={item}
                  className="border border-white/14 bg-white/[0.045] px-4 py-2 text-xs font-black uppercase tracking-[0.12em] text-white/74"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>

          <figure data-scroll-media className="relative mx-auto w-full max-w-[500px] xl:max-w-[580px]">
            <div
              className="absolute -inset-4 border border-[#F26522]/28 bg-[#F26522]/8 shadow-[0_34px_110px_rgba(242,101,34,0.12)]"
              aria-hidden="true"
            />
            <img
              src="/about/ly-anh-post-website-7.png"
              alt="GoBeyond meeting and brand message"
              className="relative aspect-[16/10] w-full object-cover"
            />
          </figure>
        </div>
      </SectionFrame>

      <SectionFrame id="our-journey" className="bg-[#06101d]">
        <div className="relative mx-auto flex min-h-[calc(100vh-5rem)] max-w-7xl flex-col justify-center py-8 lg:py-10">
          <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
            <div>
              <div data-scroll-reveal>
                <SectionMark current="02" label="Our story in motion" />
              </div>
              <h2 data-scroll-reveal className="mobile-page-title mt-5 text-5xl font-black uppercase leading-[0.88] tracking-normal sm:text-6xl lg:text-7xl xl:text-8xl">
                Our <span className="text-[#ff7648]">Journey</span>
              </h2>
            </div>
            <p data-scroll-reveal className="max-w-md text-sm font-medium leading-6 text-white/62 md:text-right md:text-base md:leading-7">
              Every stage made the next one possible. Here is how GoBeyond has grown from a focused idea into a global
              e-commerce operation.
            </p>
          </div>

          <div className="relative mt-8 lg:mt-10">
            <div
              className="absolute left-5 right-5 top-[2.35rem] hidden h-px bg-gradient-to-r from-[#ffb15f] via-[#58a8ef] to-[#ff6a10] lg:block"
              aria-hidden="true"
            />
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5 lg:gap-3">
              {journey.map((milestone) => (
                <article
                  key={milestone.year}
                  data-scroll-card
                  className="group relative min-w-0 border border-white/10 bg-[#0d1a2b]/85 p-5 shadow-[0_20px_60px_rgba(0,0,0,0.22)] transition duration-300 hover:-translate-y-1 hover:border-[color:var(--journey-accent)] hover:bg-[#102238] lg:pt-14"
                  style={{ "--journey-accent": milestone.accent } as CSSProperties}
                >
                  <div className="flex items-center justify-between lg:absolute lg:left-5 lg:right-5 lg:top-0 lg:-translate-y-1/2">
                    <span className="grid h-10 w-10 place-items-center rounded-full border-4 border-[#06101d] bg-[color:var(--journey-accent)] text-[10px] font-black tracking-wider text-[#07101c]">
                      {milestone.symbol}
                    </span>
                    <span className="text-2xl font-black tracking-tight text-white lg:text-xl">
                      {milestone.year}
                    </span>
                  </div>
                  <div className="mt-6 h-1 w-9 bg-[color:var(--journey-accent)] transition-all duration-300 group-hover:w-full lg:mt-0" />
                  <h3 className="mt-5 text-lg font-black uppercase leading-[0.95] text-white">{milestone.phase}</h3>
                  <p className="mt-4 text-sm font-medium leading-6 text-white/64">{milestone.description}</p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </SectionFrame>

      <SectionFrame id="about-numbers" className="bg-[#030711]">
        <div className="relative mx-auto grid min-h-[calc(100vh-5rem)] max-w-7xl items-center gap-8 py-5 lg:grid-cols-[minmax(0,0.38fr)_minmax(0,0.62fr)]">
          <div className="min-w-0">
            <div data-scroll-reveal>
              <SectionMark current="03" label="" />
            </div>
            <h2 data-scroll-reveal className="mobile-page-title mt-6 text-5xl font-black uppercase leading-[0.9] tracking-normal sm:text-6xl lg:text-6xl xl:text-7xl">
              GoBeyond
              <span className="block text-[#ff7648]">GoBeyond</span>
            </h2>
            <p data-scroll-reveal className="mt-6 max-w-xl text-base font-medium leading-7 text-white/68 md:text-lg md:leading-8">
              We keep improving demand-led e-commerce so we can create high-quality products at accessible prices.
            </p>
          </div>

          <div className="grid min-w-0 gap-4 sm:grid-cols-2">
            {stats.map((stat, index) => (
              <article
                key={stat.label}
                data-scroll-card
                className="min-h-[190px] border border-white/12 bg-[#101520]/78 p-5 shadow-[0_28px_80px_rgba(0,0,0,0.30)] backdrop-blur-md transition hover:-translate-y-1 hover:border-[color:var(--accent)]"
                style={{ "--accent": stat.accent } as AccentStyle}
              >
                <span className="text-sm font-black uppercase tracking-[0.18em] text-white/38">
                  0{index + 1}
                </span>
                <div className="mt-5 text-5xl font-black leading-none text-[color:var(--accent)] lg:text-6xl xl:text-7xl">
                  {stat.value}
                </div>
                <h3 className="mt-4 text-lg font-black uppercase leading-tight text-white">{stat.label}</h3>
                <p className="mt-2 text-sm font-medium leading-6 text-white/62">{stat.body}</p>
              </article>
            ))}
          </div>
        </div>
      </SectionFrame>

      <SectionFrame id="about-vision">
        <div className="relative mx-auto flex min-h-[calc(100vh-5rem)] max-w-7xl flex-col justify-center gap-6 py-5">
          <div className="max-w-4xl">
            <div data-scroll-reveal>
              <SectionMark current="04" label="" />
            </div>
            <h2 data-scroll-reveal className="mobile-page-title mt-6 text-5xl font-black uppercase leading-[0.9] tracking-normal sm:text-6xl lg:text-6xl xl:text-7xl">
              Vision
              <span className="block text-[#ff7648]">Mission</span>
            </h2>
          </div>

          <div className="grid gap-5 lg:grid-cols-2">
            <article data-scroll-card className="border border-white/12 bg-[#101520]/78 p-6 shadow-[0_28px_82px_rgba(0,0,0,0.30)] backdrop-blur-md md:p-7">
              <p className="text-xs font-black uppercase tracking-[0.28em] text-[#2ED4A4]">Vision</p>
              <h3 className="mobile-card-title mt-4 text-4xl font-black uppercase leading-[0.92] text-white lg:text-5xl xl:text-6xl">
                Go global or go home
              </h3>
              <p className="mt-5 text-base font-medium leading-7 text-white/68 md:text-lg md:leading-8">
                GoBeyond's vision is to grow strongly in e-commerce, nurture entrepreneurial ideas, and help create
                successful builders in this field.
              </p>
            </article>

            <article data-scroll-card className="border border-white/12 bg-[#101520]/78 p-6 shadow-[0_28px_82px_rgba(0,0,0,0.30)] backdrop-blur-md md:p-7">
              <p className="text-xs font-black uppercase tracking-[0.28em] text-[#F26522]">Mission</p>
              <h3 className="mobile-card-title mt-4 text-4xl font-black uppercase leading-[0.92] text-white lg:text-5xl xl:text-6xl">
                Explore
                <span className="block text-[#ff7648]">Connect</span>
                <span className="block">Accelerate</span>
              </h3>
              <p className="mt-5 text-base font-medium leading-7 text-white/68 md:text-lg md:leading-8">
                GoBeyond's mission is to provide the foundation and tools needed to accelerate innovation and creativity
                in e-commerce.
              </p>
            </article>
          </div>
        </div>
      </SectionFrame>

      <SectionFrame id="about-brands" className="bg-[#050911]" releaseWithFooter>
        <div
          data-home-story-release-content
          className="relative mx-auto flex min-h-[calc(100vh-5rem)] max-w-7xl flex-col justify-center py-5"
        >
          <div className="grid items-end gap-7 lg:grid-cols-[minmax(0,0.46fr)_minmax(0,0.54fr)]">
            <div className="min-w-0">
              <div data-scroll-reveal>
                <SectionMark current="05" label="" />
              </div>
              <h2 data-scroll-reveal className="mobile-page-title mt-6 text-5xl font-black uppercase leading-[0.9] tracking-normal sm:text-6xl lg:text-6xl xl:text-7xl">
                Partner
                <span className="block mt-4 text-[#ff7648]">ecosystem</span>
              </h2>
            </div>
            <p data-scroll-reveal className="max-w-2xl text-base font-medium leading-8 text-white/68 md:text-lg">
              GoBeyond connects products, storefronts, marketing, payments, and fulfillment through trusted global
              e-commerce platforms.
            </p>
          </div>

          <div className="mt-7 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
            {brandLogos.map((brand) => (
              <article
                key={brand.name}
                data-scroll-card
                className="grid min-h-[88px] place-items-center border border-white/10 bg-white/[0.94] px-5 text-center shadow-[0_20px_58px_rgba(0,0,0,0.20)] backdrop-blur-md transition hover:-translate-y-1 hover:border-white/28 hover:bg-white"
              >
                <img src={brand.src} alt={`${brand.name} logo`} className="max-h-11 max-w-full object-contain" />
              </article>
            ))}
          </div>
        </div>
      </SectionFrame>

      <div data-home-story-footer>
        <FooterBridge />
        <FooterSection />
      </div>
    </main>
  );
}
