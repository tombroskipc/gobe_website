"use client";

import Link from "next/link";
import { useEffect, type CSSProperties, type ReactNode } from "react";
import type { CareerItem } from "@/lib/careers";
import { CustomCursor } from "./CustomCursor";
import { FooterSection } from "./LegacySections";
import { Navbar } from "./Navbar";
import { initScrollController } from "./ScrollController";

const tagLabels: Record<string, string> = {
  hiring: "Đang tuyển",
  marketing: "Marketing",
  creative: "Sáng tạo",
  operations: "Vận hành",
  customerService: "Chăm sóc khách hàng",
  humanResource: "Nhân sự",
  internship: "Thực tập",
};

const tagColors: Record<string, string> = {
  hiring: "#F26522",
  marketing: "#F26522",
  creative: "#D95B9F",
  operations: "#2ED4A4",
  customerService: "#5AA2E8",
  humanResource: "#E9C15F",
  internship: "#8A7CFF",
};

function PageShell({ children }: { children: ReactNode }) {
  useEffect(() => initScrollController(), []);

  return (
    <main className="relative min-h-screen overflow-x-hidden bg-[#000314] text-white">
      <CustomCursor />
      <Navbar />
      {children}
      <FooterSection />
    </main>
  );
}

function SectionMark({ current, label }: { current: string; label: string }) {
  return (
    <div className="flex items-center gap-4 text-xs font-black uppercase tracking-[0.24em] text-white/56">
      <span className="text-[#F26522]">{current}</span>
      <span className="h-px w-14 bg-[#F26522]/70" aria-hidden="true" />
      <span>{label}</span>
    </div>
  );
}

function listItems(items?: { text?: string }[]) {
  return Array.isArray(items) ? items.map((item) => item.text).filter((item): item is string => Boolean(item)) : [];
}

function JobCard({ job, index }: { job: CareerItem; index: number }) {
  const tag = job.tag || "hiring";
  const accent = tagColors[tag] || "#F26522";

  return (
    <Link
      href={`/tuyen-dung/${job.slug}`}
      data-scroll-card
      className="group relative min-h-[390px] overflow-hidden border border-white/12 bg-[#101520]/82 p-5 text-white shadow-[0_28px_82px_rgba(0,0,0,0.30)] backdrop-blur-md transition hover:-translate-y-2 hover:border-[#F26522]/70 hover:shadow-[0_34px_100px_rgba(242,101,34,0.16)]"
      style={{ "--accent": accent } as CSSProperties}
    >
      <span className="absolute left-5 top-5 z-[2] border border-[color:var(--accent)] px-2 py-1 text-center text-[10px] font-black uppercase leading-3 text-[color:var(--accent)]">
        {job.dateLabel || "2026"}
      </span>
      <div className="absolute right-5 top-5 z-[2] text-right text-sm font-black uppercase leading-none text-[#F26522]">
        GO
        <span className="block text-[10px] text-white/72">beyond</span>
      </div>

      <div className="mt-14 overflow-hidden rounded-[1.75rem] bg-white p-4 text-[#182452]">
        <div className="mx-auto w-fit rounded-full bg-black px-5 py-2 text-xs font-black uppercase tracking-[0.08em] text-white">
          Chúng tôi đang tuyển!
        </div>
        <div className="mt-4 rounded-2xl bg-[#F26522] px-4 py-4 text-center text-xl font-black text-white">
          {job.title}
        </div>
        <div className="mt-5 grid grid-cols-[96px_1fr] items-center gap-4">
          <div className="grid aspect-square place-items-center border-2 border-[#F26522] bg-white p-2">
            <span className="text-center text-[10px] font-black uppercase leading-tight text-[#182452]">
              Lark
              <br />
              JD
            </span>
          </div>
          <div className="relative h-24">
            <div className="absolute bottom-0 right-2 h-20 w-20 rounded-full bg-[#F26522]/16" />
            <div className="absolute bottom-2 right-8 text-5xl">GO</div>
            <div className="absolute bottom-2 right-0 h-12 w-12 rounded-full bg-[#F26522]" />
          </div>
        </div>
      </div>

      <div className="mt-5">
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[color:var(--accent)]">
          {tagLabels[tag] || tagLabels.hiring} / {String(index + 1).padStart(2, "0")}
        </p>
        <h3 className="mt-3 text-2xl font-black uppercase leading-tight text-white">{job.title}</h3>
        <p className="mt-3 text-sm font-medium leading-6 text-white/64">{job.excerpt}</p>
      </div>

      <span className="absolute bottom-5 right-5 rounded-full bg-[#F26522] px-4 py-2 text-xs font-black uppercase tracking-[0.1em] text-white opacity-0 transition group-hover:opacity-100">
        Xem JD
      </span>
    </Link>
  );
}

export function CareersListing({ jobs, listingSourceUrl }: { jobs: CareerItem[]; listingSourceUrl: string }) {
  return (
    <PageShell>
      <section id="careers" data-scroll-section className="relative z-10 min-h-screen overflow-hidden bg-[#000314] px-5 pt-24 text-white sm:px-8 lg:px-12">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_76%_16%,rgba(242,101,34,0.20),transparent_28%),radial-gradient(circle_at_20%_34%,rgba(90,162,232,0.18),transparent_30%),linear-gradient(135deg,#000314_0%,#071026_52%,#02030b_100%)]" />
        <div className="grid-mask pointer-events-none absolute inset-0 opacity-24" aria-hidden="true" />

        <div className="relative mx-auto grid min-h-[calc(100vh-6rem)] max-w-7xl items-center gap-10 py-10 lg:grid-cols-[minmax(0,0.48fr)_minmax(0,0.52fr)]">
          <div>
            <div data-scroll-reveal>
              <SectionMark current="01" label="" />
            </div>
            <h1 data-scroll-reveal className="mt-6 text-5xl font-black uppercase leading-[0.86] tracking-normal sm:text-6xl lg:text-7xl xl:text-8xl">
              Gia nhập
              <span className="block text-[#ff7648]">GoBeyond</span>
            </h1>
            <p data-scroll-reveal className="mt-7 max-w-2xl text-base font-medium leading-8 text-white/70 md:text-lg">
              Các vị trí đang mở cho đội ngũ thương mại điện tử toàn cầu: marketing, sáng tạo, fulfillment, chăm sóc khách hàng và vận hành.
            </p>
            <div data-scroll-reveal className="mt-8 flex flex-wrap gap-3">
              <a
                href="#open-roles"
                className="magnetic inline-flex min-h-12 items-center rounded-full bg-[#F26522] px-7 text-sm font-black uppercase tracking-[0.1em] text-white shadow-[0_18px_45px_rgba(242,101,34,0.28)] transition hover:-translate-y-0.5 hover:bg-[#d94d12]"
              >
                Xem vị trí
              </a>
              <a
                href={listingSourceUrl}
                target="_blank"
                rel="noreferrer"
                className="magnetic inline-flex min-h-12 items-center rounded-full border border-white/18 px-7 text-sm font-black uppercase tracking-[0.1em] text-white/78 transition hover:border-white hover:text-white"
              >
                Danh sách Lark
              </a>
            </div>
          </div>

          <figure data-scroll-media className="relative">
            <div className="absolute -inset-5 border border-[#F26522]/28 bg-[#F26522]/8 shadow-[0_34px_120px_rgba(242,101,34,0.14)]" />
            <img
              src="/careers/legacy-careers-list.png"
              alt="Bản xem trước danh sách tuyển dụng GoBeyond"
              className="relative aspect-[4/3] w-full object-cover object-top"
            />
          </figure>
        </div>
      </section>

      <section id="open-roles" data-scroll-section className="relative z-10 overflow-hidden bg-[#030711] px-5 py-24 text-white sm:px-8 lg:px-12">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(242,101,34,0.16),transparent_28%),linear-gradient(135deg,#030711,#071026_48%,#02030b)]" />
        <div className="grid-mask pointer-events-none absolute inset-0 opacity-20" aria-hidden="true" />

        <div className="relative mx-auto max-w-7xl">
          <div className="grid items-end gap-6 lg:grid-cols-[minmax(0,0.5fr)_minmax(0,0.5fr)]">
            <div>
              <div data-scroll-reveal>
                <SectionMark current="02" label="" />
              </div>
              <h2 data-scroll-reveal className="mt-6 text-4xl font-black uppercase leading-[0.9] sm:text-5xl lg:text-7xl">
                Tất cả vị trí
                <span className="block text-[#ff7648]">đang tuyển</span>
              </h2>
            </div>
            <p data-scroll-reveal className="max-w-2xl text-base font-medium leading-8 text-white/68 md:text-lg">
              Mỗi vai trò đều là một mảnh ghép trong hệ thống vận hành toàn cầu của GoBeyond. Nội dung có thể chỉnh sửa trong Payload CMS.
            </p>
          </div>

          {jobs.length > 0 ? (
            <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {jobs.map((job, index) => (
                <JobCard key={job.slug} job={job} index={index} />
              ))}
            </div>
          ) : (
            <div data-scroll-card className="mt-10 border border-white/12 bg-[#101520]/82 p-8 text-white shadow-[0_28px_82px_rgba(0,0,0,0.26)] backdrop-blur-md md:p-10">
              <p className="text-xs font-black uppercase tracking-[0.2em] text-[#F26522]">Tuyển dụng</p>
              <h3 className="mt-4 text-3xl font-black uppercase tracking-normal text-white md:text-5xl">
                Chưa có tin tuyển dụng
              </h3>
              <p className="mt-5 max-w-2xl text-base font-medium leading-8 text-white/68">
                Hiện tại GoBeyond chưa mở vị trí tuyển dụng công khai. Khi team đăng JD mới trong Payload CMS, danh sách sẽ tự động hiển thị tại đây.
              </p>
              <a
                href={listingSourceUrl}
                target="_blank"
                rel="noreferrer"
                className="mt-7 inline-flex min-h-12 items-center rounded-full border border-white/18 px-6 text-sm font-black uppercase tracking-[0.1em] text-white/78 transition hover:border-[#F26522] hover:text-white"
              >
                Xem danh sách Lark
              </a>
            </div>
          )}
        </div>
      </section>
    </PageShell>
  );
}

function DetailSection({
  children,
  eyebrow,
  title,
}: {
  children: ReactNode;
  eyebrow: string;
  title: string;
}) {
  return (
    <section data-scroll-card className="border border-white/12 bg-[#101520]/78 p-6 shadow-[0_28px_82px_rgba(0,0,0,0.28)] backdrop-blur-md md:p-8">
      <p className="text-xs font-black uppercase tracking-[0.2em] text-[#F26522]">{eyebrow}</p>
      <h2 className="mt-3 text-2xl font-black uppercase text-white md:text-3xl">{title}</h2>
      <div className="mt-5 text-base font-medium leading-8 text-white/70">{children}</div>
    </section>
  );
}

function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="grid gap-3">
      {items.map((item) => (
        <li key={item} className="flex gap-3">
          <span className="mt-3 h-1.5 w-1.5 shrink-0 rounded-full bg-[#F26522]" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

export function CareerDetail({ job }: { job: CareerItem }) {
  const responsibilities = listItems(job.responsibilities);
  const requirements = listItems(job.requirements);
  const benefits = listItems(job.benefits);
  const tag = job.tag || "hiring";

  return (
    <PageShell>
      <section id="career-detail" data-scroll-section className="relative z-10 min-h-screen overflow-hidden bg-[#000314] px-5 pt-24 text-white sm:px-8 lg:px-12">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_74%_18%,rgba(242,101,34,0.20),transparent_28%),linear-gradient(135deg,#000314,#071026_48%,#02030b)]" />
        <div className="grid-mask pointer-events-none absolute inset-0 opacity-22" aria-hidden="true" />

        <div className="relative mx-auto grid min-h-[calc(100vh-6rem)] max-w-7xl items-center gap-10 py-10 lg:grid-cols-[minmax(0,0.55fr)_minmax(0,0.45fr)]">
          <div>
            <div data-scroll-reveal>
              <SectionMark current="JD" label={tagLabels[tag] || tagLabels.hiring} />
            </div>
            <h1 data-scroll-reveal className="mt-6 text-4xl font-black uppercase leading-[0.9] sm:text-5xl lg:text-7xl xl:text-8xl">
              {job.title}
            </h1>
            <p data-scroll-reveal className="mt-6 text-sm font-black uppercase tracking-[0.18em] text-white/46">
              {job.dateLabel || job.publishedAt || "2026"} / {job.employmentType || "Toàn thời gian"}
            </p>
            <p data-scroll-reveal className="mt-7 max-w-2xl text-base font-medium leading-8 text-white/70 md:text-lg">
              {job.description || job.excerpt}
            </p>
            <div data-scroll-reveal className="mt-8 flex flex-wrap gap-3">
              <a className="rounded-full bg-[#F26522] px-6 py-3 text-sm font-black uppercase tracking-[0.1em] text-white transition hover:bg-[#d94d12]" href={job.applyUrl || "mailto:tuyendung@gobe.asia"}>
                Ứng tuyển
              </a>
              {job.larkUrl ? (
                <a className="rounded-full border border-white/20 px-6 py-3 text-sm font-black uppercase tracking-[0.1em] text-white/78 transition hover:border-white hover:text-white" href={job.larkUrl} target="_blank" rel="noreferrer">
                  Mở Lark JD
                </a>
              ) : null}
              <Link className="rounded-full border border-white/20 px-6 py-3 text-sm font-black uppercase tracking-[0.1em] text-white/78 transition hover:border-white hover:text-white" href="/tuyen-dung">
                Vị trí khác
              </Link>
            </div>
          </div>

          <figure data-scroll-media className="relative">
            <div className="absolute -inset-5 border border-[#F26522]/28 bg-[#F26522]/8 shadow-[0_34px_120px_rgba(242,101,34,0.14)]" />
            <img src="/careers/legacy-fulfillment-jd.png" alt={`${job.title} JD preview`} className="relative aspect-[4/3] w-full object-cover object-top" />
          </figure>
        </div>
      </section>

      <section data-scroll-section className="relative z-10 bg-[#030711] px-5 py-24 text-white sm:px-8 lg:px-12">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_22%_10%,rgba(242,101,34,0.14),transparent_28%),linear-gradient(135deg,#030711,#071026_48%,#02030b)]" />
        <div className="grid-mask pointer-events-none absolute inset-0 opacity-20" aria-hidden="true" />

        <div className="relative mx-auto grid max-w-7xl gap-5 lg:grid-cols-[minmax(0,0.36fr)_minmax(0,0.64fr)]">
          <aside data-scroll-reveal className="top-24 h-fit border border-white/12 bg-white/[0.04] p-6 text-white/72 backdrop-blur-md lg:sticky">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-[#F26522]">Thông tin tuyển dụng</p>
            <dl className="mt-5 grid gap-4">
              {[
                ["Vị trí", job.title],
                ["Lĩnh vực", job.department || "Thương mại điện tử"],
                ["Hình thức", job.employmentType || "Toàn thời gian"],
                ["Số lượng", job.quantity || "01"],
                ["Địa điểm", job.location || "TP. Hồ Chí Minh"],
              ].map(([label, value]) => (
                <div key={label}>
                  <dt className="text-xs font-black uppercase tracking-[0.14em] text-white/40">{label}</dt>
                  <dd className="mt-1 text-sm font-semibold leading-6 text-white">{value}</dd>
                </div>
              ))}
            </dl>
          </aside>

          <div className="grid gap-5">
            {responsibilities.length > 0 ? (
              <DetailSection eyebrow="01" title="Phạm vi công việc">
                <BulletList items={responsibilities} />
              </DetailSection>
            ) : null}
            {requirements.length > 0 ? (
              <DetailSection eyebrow="02" title="Yêu cầu">
                <BulletList items={requirements} />
              </DetailSection>
            ) : null}
            {benefits.length > 0 ? (
              <DetailSection eyebrow="03" title="Quyền lợi">
                <BulletList items={benefits} />
              </DetailSection>
            ) : null}
            <DetailSection eyebrow="04" title="Thời gian làm việc">
              <p>{job.workingTime || "Thông tin sẽ được trao đổi cụ thể trong quá trình phỏng vấn."}</p>
              <p className="mt-5 font-bold text-white">
                Gửi CV tới Email: tuyendung@gobe.asia
                <br />
                Tiêu đề: [GOBEYOND - {job.title.toUpperCase()}] Họ và tên
              </p>
            </DetailSection>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
