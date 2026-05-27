"use client";

import { useEffect, type CSSProperties, type ReactNode } from "react";
import { CustomCursor } from "./CustomCursor";
import { FooterSection } from "./LegacySections";
import { Navbar } from "./Navbar";
import { initScrollController } from "./ScrollController";

type AccentStyle = CSSProperties & {
  "--accent": string;
};

const stats = [
  {
    value: "4+",
    label: "Năm hình thành và phát triển",
    body: "Một hành trình tập trung vào POD, dropshipping và e-commerce từ TP HCM ra thị trường quốc tế.",
    accent: "#F26522",
  },
  {
    value: "3+",
    label: "Thương hiệu vận hành",
    body: "Nhiều brand được xây dựng, thử nghiệm và phát triển bằng năng lực nội bộ của GoBeyond.",
    accent: "#5AA2E8",
  },
  {
    value: "10+",
    label: "Đối tác đồng hành",
    body: "Mạng lưới supplier, fulfillment, platform và công cụ hỗ trợ vận hành trên nhiều thị trường.",
    accent: "#2ED4A4",
  },
  {
    value: "US/EU",
    label: "Thị trường trọng tâm",
    body: "Đội ngũ hướng đến những sản phẩm và chiến dịch phù hợp với khách hàng Bắc Mỹ và Châu Âu.",
    accent: "#E9C15F",
  },
];

const principles = [
  "Đổi mới liên tục",
  "Tinh thần khởi nghiệp",
  "Sản phẩm vượt mong đợi",
  "Vận hành có hệ thống",
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
}: {
  children: ReactNode;
  id: string;
  className?: string;
}) {
  return (
    <section
      id={id}
      data-scroll-section
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
      {children}
    </section>
  );
}

export function AboutPage() {
  useEffect(() => initScrollController(), []);

  return (
    <main className="relative min-h-screen overflow-x-hidden bg-[#000314] text-white">
      <CustomCursor />
      <Navbar />

      <nav
        aria-label="About section navigation"
        className="fixed right-5 top-1/2 z-40 hidden -translate-y-1/2 grid-cols-1 gap-3 lg:grid"
      >
        {["about-gobeyond", "about-numbers", "about-vision", "about-brands"].map((id) => (
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
              <SectionMark current="01" label="Về GoBeyond" />
            </div>
            <h1 data-scroll-reveal className="mt-6 max-w-4xl text-5xl font-black uppercase leading-[0.86] tracking-normal text-white sm:text-6xl lg:text-8xl xl:text-9xl">
              Về
              <span className="block text-[#ff7648]">GOBEYOND</span>
            </h1>
            <div data-scroll-reveal className="mt-6 max-w-2xl space-y-4 text-base font-medium leading-7 text-white/72 md:text-lg md:leading-8">
              <p>
                GoBeyond là công ty start-up tại TP HCM với tuổi đời 4 năm trong lĩnh vực POD/Dropshipping tại thị
                trường Bắc Mỹ và Châu Âu.
              </p>
              <p>
                Đi cùng khẩu hiệu <strong className="text-white">Go Global or Go Home</strong>, chúng tôi tin rằng một
                tập thể nhỏ nhưng có tài năng và nhiệt huyết luôn có thể làm nên việc lớn trên thị trường toàn cầu.
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

      <SectionFrame id="about-numbers" className="bg-[#030711]">
        <div className="relative mx-auto grid min-h-[calc(100vh-5rem)] max-w-7xl items-center gap-8 py-5 lg:grid-cols-[minmax(0,0.38fr)_minmax(0,0.62fr)]">
          <div className="min-w-0">
            <div data-scroll-reveal>
              <SectionMark current="02" label="Những con số" />
            </div>
            <h2 data-scroll-reveal className="mt-6 text-5xl font-black uppercase leading-[0.9] tracking-normal sm:text-6xl lg:text-6xl xl:text-7xl">
              Những con số
              <span className="block text-[#ff7648]">GoBeyond</span>
            </h2>
            <p data-scroll-reveal className="mt-6 max-w-xl text-base font-medium leading-7 text-white/68 md:text-lg md:leading-8">
              Không ngừng cải tiến thương mại điện tử tập trung vào nhu cầu, chúng tôi mong muốn tạo ra những sản phẩm
              chất lượng vượt trội với mức giá hợp lý.
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
              <SectionMark current="03" label="Tầm nhìn và sứ mệnh" />
            </div>
            <h2 data-scroll-reveal className="mt-6 text-5xl font-black uppercase leading-[0.9] tracking-normal sm:text-6xl lg:text-6xl xl:text-7xl">
              Tầm nhìn
              <span className="block text-[#ff7648]">Sứ mệnh</span>
            </h2>
          </div>

          <div className="grid gap-5 lg:grid-cols-2">
            <article data-scroll-card className="border border-white/12 bg-[#101520]/78 p-6 shadow-[0_28px_82px_rgba(0,0,0,0.30)] backdrop-blur-md md:p-7">
              <p className="text-xs font-black uppercase tracking-[0.28em] text-[#2ED4A4]">Tầm nhìn</p>
              <h3 className="mt-4 text-4xl font-black uppercase leading-[0.92] text-white lg:text-5xl xl:text-6xl">
                Go global or go home
              </h3>
              <p className="mt-5 text-base font-medium leading-7 text-white/68 md:text-lg md:leading-8">
                Tầm nhìn của GoBeyond là hướng đến việc phát triển mạnh trong ngành thương mại điện tử, ươm mầm cho các
                ý tưởng khởi nghiệp và tạo ra những doanh nhân thành công trong lĩnh vực này.
              </p>
            </article>

            <article data-scroll-card className="border border-white/12 bg-[#101520]/78 p-6 shadow-[0_28px_82px_rgba(0,0,0,0.30)] backdrop-blur-md md:p-7">
              <p className="text-xs font-black uppercase tracking-[0.28em] text-[#F26522]">Sứ mệnh</p>
              <h3 className="mt-4 text-4xl font-black uppercase leading-[0.92] text-white lg:text-5xl xl:text-6xl">
                Khám phá
                <span className="block text-[#ff7648]">Kết nối</span>
                <span className="block">Thúc đẩy</span>
              </h3>
              <p className="mt-5 text-base font-medium leading-7 text-white/68 md:text-lg md:leading-8">
                Sứ mệnh của GoBeyond là cung cấp nền tảng vững chắc và những công cụ cần thiết để thúc đẩy đổi mới và
                sáng tạo trong thương mại điện tử.
              </p>
            </article>
          </div>
        </div>
      </SectionFrame>

      <SectionFrame id="about-brands" className="bg-[#050911]">
        <div className="relative mx-auto flex min-h-[calc(100vh-5rem)] max-w-7xl flex-col justify-center py-5">
          <div className="grid items-end gap-7 lg:grid-cols-[minmax(0,0.46fr)_minmax(0,0.54fr)]">
            <div className="min-w-0">
              <div data-scroll-reveal>
                <SectionMark current="04" label="Nhãn hàng và nền tảng" />
              </div>
              <h2 data-scroll-reveal className="mt-6 text-5xl font-black uppercase leading-[0.9] tracking-normal sm:text-6xl lg:text-6xl xl:text-7xl">
                Hệ sinh thái
                <span className="block text-[#ff7648]">đồng hành</span>
              </h2>
            </div>
            <p data-scroll-reveal className="max-w-2xl text-base font-medium leading-8 text-white/68 md:text-lg">
              GoBeyond kết nối sản phẩm, storefront, marketing, thanh toán và fulfillment qua các nền tảng quen thuộc
              trong thương mại điện tử toàn cầu.
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

      <FooterSection />
    </main>
  );
}
