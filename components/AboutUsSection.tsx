"use client";

import type { ReactNode } from "react";

type Trait = {
  title: string;
  subtext: string;
  icon: JSX.Element;
};

const ORANGE = "#F26522";

function IconFrame({ children }: { children: ReactNode }) {
  return (
    <svg
      aria-hidden="true"
      className="mx-auto h-16 w-16 text-[#F26522]"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.8"
      viewBox="0 0 64 64"
    >
      {children}
    </svg>
  );
}

const traits: Trait[] = [
  {
    title: "Hoàn thành",
    subtext: "Mọi mục tiêu",
    icon: (
      <IconFrame>
        <circle cx="32" cy="32" r="22" />
        <circle cx="32" cy="32" r="14" />
        <circle cx="32" cy="32" r="6" />
        <path d="m39 25 10-10M48 15h8v8" />
      </IconFrame>
    ),
  },
  {
    title: "Năng động",
    subtext: "Và sáng tạo",
    icon: (
      <IconFrame>
        <ellipse cx="32" cy="32" rx="25" ry="9" />
        <ellipse cx="32" cy="32" rx="25" ry="9" transform="rotate(60 32 32)" />
        <ellipse cx="32" cy="32" rx="25" ry="9" transform="rotate(120 32 32)" />
        <circle cx="32" cy="32" r="4" fill={ORANGE} stroke="none" />
      </IconFrame>
    ),
  },
  {
    title: "Chuyên nghiệp",
    subtext: "Đáng tin cậy",
    icon: (
      <IconFrame>
        <path d="M32 8 50 15v13c0 13-7.4 22.6-18 28-10.6-5.4-18-15-18-28V15l18-7Z" />
        <path d="m23 32 6 6 13-14" />
        <path d="M13 52h38" />
      </IconFrame>
    ),
  },
  {
    title: "Cầu toàn",
    subtext: "Và học hỏi",
    icon: (
      <IconFrame>
        <path d="M17 9h24l8 8v34H17V9Z" />
        <path d="M41 9v10h9" />
        <path d="M24 24h16M24 32h11" />
        <circle cx="30" cy="43" r="8" />
        <path d="m36 49 8 8" />
      </IconFrame>
    ),
  },
  {
    title: "Trách nhiệm",
    subtext: "Trong công việc",
    icon: (
      <IconFrame>
        <path d="M32 8 52 27 32 56 12 27 32 8Z" fill={ORANGE} stroke="none" />
        <path d="M12 27h40M22 27l10 29 10-29M24 8l-2 19M40 8l2 19" stroke="white" strokeWidth="1.5" />
      </IconFrame>
    ),
  },
  {
    title: "Đoàn kết",
    subtext: "Tinh thần đồng đội",
    icon: (
      <IconFrame>
        <path d="M21 34 11 24a7 7 0 0 1 10-10l5 5" />
        <path d="m43 34 10-10a7 7 0 0 0-10-10l-5 5" />
        <path d="M24 35h16M23 44h18" />
        <path d="m27 25 5-5 5 5-5 5-5-5Z" />
        <path d="M20 34v13M44 34v13" />
      </IconFrame>
    ),
  },
];

export function AboutUsSection() {
  return (
    <section id="about" className="relative z-10 overflow-hidden py-16 md:py-24">
      <div
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(255,255,255,0.88)_0%,rgba(255,255,255,0.76)_48%,rgba(255,255,255,0.48)_100%)]"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-y-0 right-0 w-1/2 bg-[radial-gradient(circle_at_70%_45%,rgba(242,101,34,0.10),transparent_42%)]"
        aria-hidden="true"
      />

      <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-6 lg:grid-cols-[0.95fr_1.05fr] lg:gap-16">
        <div className="flex justify-center lg:justify-start">
          <div className="relative aspect-square w-full max-w-[520px]">
            <img
              src="/about-pinwheel.png"
              alt="GoBeyond team photo collage"
              className="h-full w-full object-contain"
            />
          </div>
        </div>

        <div className="text-center lg:text-left">
          <p className="text-sm font-black uppercase tracking-[0.08em] text-[#182452]">
            VỀ CHÚNG TÔI
          </p>
          <h2 className="mt-3 text-4xl font-black uppercase leading-tight tracking-tight text-[#182452] md:text-5xl">
            GO BEYOND
          </h2>

          <div className="mt-8 max-w-2xl space-y-1 text-lg leading-relaxed text-[#182452]">
            <p>
              GoBeyond là công ty start-up tại TP HCM với tuổi đời 4 năm trong lĩnh vực
              POD/Dropshipping tại thị trường Bắc Mỹ và Châu Âu.
            </p>
            <p>
              Chúng tôi tin rằng một tập thể nhỏ nhưng với tài năng và nhiệt huyết luôn
              có thể làm nên việc lớn trên thị trường toàn cầu.
            </p>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-x-8 gap-y-9 sm:grid-cols-2 md:grid-cols-3">
            {traits.map((trait) => (
              <article key={trait.title} className="text-center">
                {trait.icon}
                <h3 className="mt-3 text-base font-semibold text-[#182452]">{trait.title}</h3>
                <p className="mt-1 text-base leading-snug text-[#182452]">{trait.subtext}</p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
