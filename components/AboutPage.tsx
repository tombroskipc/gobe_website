"use client";

import { useEffect, type CSSProperties, type ReactNode } from "react";
import type { IconType } from "react-icons";
import { FaBox, FaBullhorn, FaCode, FaCog, FaPalette } from "react-icons/fa";
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

type JourneyMilestone = {
  year: string;
  phase: string;
  description: string;
  accent: string;
  photo: string;
  icon: string;
};

const journey: JourneyMilestone[] = [
  {
    year: "2022",
    phase: "Positioning",
    description: "Establishing our business foundation and focusing on e-commerce as our core direction",
    accent: "#f2a24c",
    photo: "/team/team-03.webp",
    icon: "/journey/positioning.webp",
  },
  {
    year: "2023",
    phase: "Establishment",
    description: "Founded the company and launched key products across Shopify, Amazon, and Etsy",
    accent: "#ef5744",
    photo: "/team/team-06.webp",
    icon: "/journey/establishment.webp",
  },
  {
    year: "2024",
    phase: "Consolidation",
    description: "Focused on developing POD and dropshipping products, optimizing operations, and enhancing quality",
    accent: "#3b93db",
    photo: "/team/team-02.webp",
    icon: "/journey/consolidation.webp",
  },
  {
    year: "2025",
    phase: "Development",
    description:
      "Expanded our global market presence, enhanced our business infrastructure, and drove sustainable revenue growth",
    accent: "#f2b134",
    photo: "/team/team-04.webp",
    icon: "/journey/development.webp",
  },
  {
    year: "2026",
    phase: "Expansion",
    description:
      "Optimized our operations end-to-end, diversified our product categories, and enhanced the overall customer experience",
    accent: "#ef7c22",
    photo: "/team/team-01.webp",
    icon: "/journey/expansion.webp",
  },
];

function JourneyTimeline() {
  return (
    <ol className="journey-timeline">
      {journey.map((milestone, index) => (
        <li
          key={milestone.year}
          className={`journey-stop ${index % 2 === 0 ? "is-left" : "is-right"}`}
          style={{ "--journey-accent": milestone.accent } as CSSProperties}
        >
          <figure className="journey-stop-media">
            <img
              className="journey-stop-photo"
              src={milestone.photo}
              alt=""
              loading="lazy"
              decoding="async"
            />
            <span className="journey-stop-year">{milestone.year}</span>
          </figure>
          <span className="journey-stop-floater" aria-hidden="true">
            <img src={milestone.icon} alt="" loading="lazy" decoding="async" />
          </span>
          <article className="journey-stop-card">
            <h3 className="journey-stop-phase">{milestone.phase}</h3>
            <p className="journey-stop-copy">{milestone.description}</p>
          </article>
        </li>
      ))}
    </ol>
  );
}

type TeamMember = {
  name: string;
  role: string;
  note?: string;
  initials: string;
  photo?: string;
};

type TeamGroup = {
  id: string;
  label: string;
  icon: IconType;
  accent: string;
  description: string;
  department: string;
  region: string;
  focus: string[];
  members: TeamMember[];
};

const teams: TeamGroup[] = [
  {
    id: "operation",
    label: "Operation",
    icon: FaCog,
    accent: "#f26522",
    description: "Leading our operations and people, ensuring the company runs smoothly and efficiently.",
    department: "Operation Department",
    region: "Vietnam",
    focus: ["People & culture", "Process & SOP", "Cross-team coordination"],
    members: [
      {
        name: "Pham Thi Thu Trang",
        role: "Acting Operation Leader",
        note: "Optimizing processes, empowering people, driving results.",
        initials: "TT",
      },
      {
        name: "Le Minh Hoang",
        role: "Human Resources",
        note: "Building a great place to work, for a greater tomorrow.",
        initials: "MH",
      },
    ],
  },
  {
    id: "developer",
    label: "Developer",
    icon: FaCode,
    accent: "#2f80ed",
    description: "Building the platforms, automations, and internal tools that keep our stores fast and reliable.",
    department: "Engineering Department",
    region: "Vietnam",
    focus: ["Platform & infra", "Automation", "Internal tools"],
    members: [],
  },
  {
    id: "marketing",
    label: "Marketing",
    icon: FaBullhorn,
    accent: "#27ae60",
    description: "Driving demand through paid media, creative testing, and market research across channels.",
    department: "Marketing Department",
    region: "Vietnam",
    focus: ["Paid media", "Creative testing", "Market research"],
    members: [],
  },
  {
    id: "designer",
    label: "Designer",
    icon: FaPalette,
    accent: "#9b51e0",
    description: "Crafting products, storefronts, and brand visuals that stand out in global markets.",
    department: "Design Department",
    region: "Vietnam",
    focus: ["Product design", "Storefront & brand", "Visual systems"],
    members: [],
  },
  {
    id: "fulfillment",
    label: "Fulfillment",
    icon: FaBox,
    accent: "#14b8a6",
    description: "Coordinating suppliers, production, and delivery so every order reaches customers on time.",
    department: "Fulfillment Department",
    region: "Vietnam",
    focus: ["Supplier network", "Production & QC", "Delivery & CS"],
    members: [],
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
        {["about-gobeyond", "our-journey", "about-vision", "our-team", "about-brands"].map((id) => (
          <a
            key={id}
            href={`#${id}`}
            className="h-2.5 w-2.5 rounded-full border border-white/50 bg-white/10 transition hover:border-[#F26522] hover:bg-[#F26522]"
            aria-label={`Go to ${id}`}
          />
        ))}
      </nav>

      <SectionFrame id="about-gobeyond">
        <div className="relative mx-auto flex min-h-[calc(100vh-5rem)] max-w-7xl flex-col justify-center py-8 lg:py-10">
          <figure data-scroll-media className="about-hero relative w-full">
            <img
              src="/team/team-11.webp"
              alt="GoBeyond team building at the beach"
              className="about-hero-img w-full object-cover"
              loading="eager"
              decoding="async"
            />
            <span className="about-hero-pill">About GoBeyond</span>
          </figure>
        </div>
      </SectionFrame>

      <SectionFrame id="our-journey" className="our-journey-section bg-[#06101d]">
        <div className="relative mx-auto flex min-h-[calc(100vh-5rem)] max-w-7xl flex-col justify-center py-8 lg:py-10">
          <header className="text-center">
            <h2
              data-scroll-reveal
              className="our-journey-title mobile-page-title text-5xl font-black uppercase leading-[0.9] tracking-normal text-white sm:text-6xl lg:text-7xl xl:text-8xl"
            >
              Our <span className="text-[#ff7648]">Journey</span>
            </h2>
            <p
              data-scroll-reveal
              className="our-journey-subtitle mt-4 text-[11px] font-black uppercase tracking-[0.42em] text-white/50 sm:text-sm"
            >
              Go Beyond Together
            </p>
          </header>

          <div className="journey-stats" data-scroll-reveal>
            {stats.map((stat) => (
              <div key={stat.label} className="journey-stat" style={{ "--accent": stat.accent } as AccentStyle}>
                <span className="journey-stat-value">{stat.value}</span>
                <span className="journey-stat-label">{stat.label}</span>
              </div>
            ))}
          </div>

          <div className="journey-panel" data-scroll-reveal>
            <JourneyTimeline />
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

      <SectionFrame id="our-team" className="our-team-section">
        <div className="relative mx-auto flex min-h-[calc(100vh-5rem)] max-w-7xl flex-col justify-center py-8 lg:py-10">
          <div className="our-team-shell">
            <header className="our-team-header" data-scroll-reveal>
              <div className="our-team-head-main">
                <p className="our-team-eyebrow">Our Team</p>
                <h2 className="our-team-heading mobile-page-title text-4xl font-black uppercase leading-[0.92] tracking-normal text-white sm:text-5xl lg:text-6xl xl:text-7xl">
                  People Build
                  <span className="our-team-heading-line">
                    What&apos;s <span className="our-team-heading-accent">Beyond</span>
                  </span>
                </h2>
              </div>
              <p className="our-team-lede">
                We are a diverse team of strategists, creators, marketers, and operators, working together to build and
                scale global e-commerce brands.
              </p>
            </header>

            <ul className="our-team-grid" data-scroll-reveal>
              {teams.map((team, index) => {
                const TeamIcon = team.icon;

                return (
                  <li
                    key={team.id}
                    className="our-team-tile"
                    style={{ "--team-accent": team.accent } as CSSProperties}
                  >
                    <div className="our-team-tile-top">
                      <span className="our-team-tile-icon" aria-hidden="true">
                        <TeamIcon />
                      </span>
                      <span className="our-team-tile-index">{String(index + 1).padStart(2, "0")}</span>
                    </div>
                    <h3 className="our-team-tile-label">{team.label}</h3>
                    <p className="our-team-tile-focus">{team.focus[0]}</p>
                    <div className="our-team-tile-foot">
                      {team.members.length > 0 ? (
                        <span className="our-team-tile-avatars" aria-hidden="true">
                          {team.members.slice(0, 3).map((member) => (
                            <span key={member.name} className="our-team-tile-avatar">
                              {member.initials}
                            </span>
                          ))}
                        </span>
                      ) : null}
                      <span className="our-team-tile-badge">
                        {team.members.length > 0 ? `${team.members.length} members` : "Growing"}
                      </span>
                    </div>
                  </li>
                );
              })}
            </ul>
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
