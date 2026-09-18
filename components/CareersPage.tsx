"use client";

import { useEffect, type CSSProperties, type ReactNode } from "react";
import { CustomCursor } from "./CustomCursor";
import { FooterBridge, FooterSection } from "./LegacySections";
import { Navbar } from "./Navbar";
import { initScrollController } from "./ScrollController";

type Job = {
  date: string;
  excerpt: string;
  href: string;
  title: string;
  tone: string;
};

const jobs: Job[] = [
  {
    date: "Dec 08",
    excerpt: "Looking for a talented Google Ads marketer who can test, optimize, and read market signals.",
    href: "/tuyen-dung/marketing-google-ads",
    title: "Marketing Google Ads",
    tone: "#F26522",
  },
  {
    date: "Dec 08",
    excerpt: "Partner with the performance team to scale Facebook Ads campaigns for international markets.",
    href: "/tuyen-dung/marketing-facebook-ads",
    title: "Marketing Facebook Ads",
    tone: "#5AA2E8",
  },
  {
    date: "Dec 08",
    excerpt: "Produce short videos, visual angles, and creative content for e-commerce campaigns.",
    href: "/tuyen-dung/creative-video",
    title: "Creative Video",
    tone: "#D95B9F",
  },
  {
    date: "Jan 05",
    excerpt: "Support customers, handle feedback, and coordinate with operations for a smooth buying experience.",
    href: "/tuyen-dung/customer-service",
    title: "Customer Service",
    tone: "#2ED4A4",
  },
  {
    date: "Aug 29",
    excerpt: "Recruit, develop people, and build a proactive operating culture within the team.",
    href: "/tuyen-dung/human-resource",
    title: "Human Resource",
    tone: "#E9C15F",
  },
  {
    date: "Apr 21",
    excerpt: "Manage orders, coordinate suppliers and logistics, and monitor operations from order receipt to delivery.",
    href: "/tuyen-dung/fulfillment-full-time",
    title: "Fulfillment Full-time",
    tone: "#F26522",
  },
  {
    date: "Apr 21",
    excerpt: "Marketplace operations internship supporting Etsy listings, tracking, and product data workflows.",
    href: "/tuyen-dung/van-hanh-san-etsy-intern",
    title: "Etsy Marketplace Operations Intern",
    tone: "#5AA2E8",
  },
];

const jobInfo = [
  ["Role", "Fulfillment Full-time"],
  ["Field", "US/EU e-commerce, dropshipping, FBA, FBM"],
  ["Headcount", "02"],
  ["Location", "St Moritz, 1014 Pham Van Dong Street, Hiep Binh Ward, Ho Chi Minh City"],
];

const workScope = [
  "Manage the full order processing and tracking flow from order receipt to successful delivery while maintaining speed and quality.",
  "Coordinate work between Customer Support, Suppliers, and Logistics to keep production and delivery on schedule.",
  "Monitor and optimize fulfillment processes to reduce errors, shorten handling time, and improve the customer experience.",
  "Support the team in resolving returns, lost shipments, and complaints quickly and effectively.",
  "Track operating metrics such as on-time delivery, error rate, and processing time, then propose continuous improvements.",
  "Report regularly to the Leader on order status and operational performance.",
];

const requirements = [
  "University graduate in Supply Chain Management, Business Administration, or a related field.",
  "Good English skills and ability to work with international partners and customers.",
  "At least 1-2 years of fulfillment experience in POD, dropshipping, or e-commerce.",
  "Proficient with order management, shipment tracking, and data handling tools.",
  "Management mindset with the ability to coordinate, delegate, and monitor work.",
  "Proactive, responsible, agile, flexible, and strong at problem solving.",
];

const benefits = [
  "Compensation of VND 8-12M/month plus performance bonus, negotiable during interviews.",
  "Two-month probation at 85% of official salary.",
  "Annual salary review.",
  "Social, health, and unemployment insurance according to regulations for official employees.",
  "13th-month salary, holiday bonuses, and internal activities such as happy hours, birthdays, kick-offs, and team building.",
  "A young, dynamic, creative startup environment focused on people development.",
];

function PageShell({ children }: { children: ReactNode }) {
  useEffect(() => initScrollController(), []);

  return (
    <main className="relative min-h-screen overflow-x-hidden bg-[#000314] text-white">
      <CustomCursor />
      <Navbar />
      {children}
      <FooterBridge />
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

function JobCard({ job, index }: { job: Job; index: number }) {
  const isPrimary = job.href === "/tuyen-dung/fulfillment-full-time";

  return (
    <a
      href={job.href}
      data-scroll-card
      className="group relative min-h-[390px] overflow-hidden border border-white/12 bg-[#101520]/82 p-5 text-white shadow-[0_28px_82px_rgba(0,0,0,0.30)] backdrop-blur-md transition hover:-translate-y-2 hover:border-[#F26522]/70 hover:shadow-[0_34px_100px_rgba(242,101,34,0.16)]"
      style={{ "--accent": job.tone } as CSSProperties}
    >
      <span className="absolute left-5 top-5 z-[2] border border-[color:var(--accent)] px-2 py-1 text-center text-[10px] font-black uppercase leading-3 text-[color:var(--accent)]">
        {job.date}
      </span>
      <div className="absolute right-5 top-5 z-[2] text-right text-sm font-black uppercase leading-none text-[#F26522]">
        GO
        <span className="block text-[10px] text-white/72">beyond</span>
      </div>

      <div className="mt-14 overflow-hidden rounded-[1.75rem] bg-white p-4 text-[#182452]">
        <div className="mx-auto w-fit rounded-full bg-black px-5 py-2 text-xs font-black uppercase tracking-[0.08em] text-white">
          We are hiring!
        </div>
        <div className="mt-4 rounded-2xl bg-[#F26522] px-4 py-4 text-center text-xl font-black text-white">
          {job.title}
        </div>
        <div className="mt-5 grid grid-cols-[96px_1fr] items-center gap-4">
          <div className="grid aspect-square place-items-center border-2 border-[#F26522] bg-white p-2">
            <span className="text-center text-[10px] font-black uppercase leading-tight text-[#182452]">
              Scan
              <br />
              QR
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
          Careers / 0{index + 1}
        </p>
        <h3 className="mt-3 text-2xl font-black uppercase leading-tight text-white">{job.title}</h3>
        <p className="mt-3 text-sm font-medium leading-6 text-white/64">{job.excerpt}</p>
      </div>

      {isPrimary ? (
        <span className="absolute bottom-5 right-5 rounded-full bg-[#F26522] px-4 py-2 text-xs font-black uppercase tracking-[0.1em] text-white">
          View JD
        </span>
      ) : null}
    </a>
  );
}

export function CareersPage() {
  return (
    <PageShell>
      <section id="careers" data-scroll-section className="relative z-10 min-h-screen overflow-hidden bg-[#000314] px-5 pt-24 text-white sm:px-8 lg:px-12">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_76%_16%,rgba(242,101,34,0.20),transparent_28%),radial-gradient(circle_at_20%_34%,rgba(90,162,232,0.18),transparent_30%),linear-gradient(135deg,#000314_0%,#071026_52%,#02030b_100%)]" />
        <div className="grid-mask pointer-events-none absolute inset-0 opacity-24" aria-hidden="true" />

        <div className="relative mx-auto grid min-h-[calc(100vh-6rem)] max-w-7xl items-center gap-10 py-10 lg:grid-cols-[minmax(0,0.48fr)_minmax(0,0.52fr)]">
          <div>
            <div data-scroll-reveal>
              <SectionMark current="01" label="Careers" />
            </div>
            <h1 data-scroll-reveal className="mobile-page-title mt-6 text-4xl font-black uppercase leading-[0.9] tracking-normal sm:text-5xl lg:text-6xl xl:text-7xl">
              Join
              <span className="block text-[#ff7648]">GoBeyond</span>
            </h1>
            <p data-scroll-reveal className="mt-7 max-w-2xl text-base font-medium leading-8 text-white/70 md:text-lg">
              Open roles for our global e-commerce team across marketing, creative, fulfillment, customer service, and operations.
            </p>
            <a
              href="#open-roles"
              data-scroll-reveal
              className="magnetic mt-8 inline-flex min-h-12 items-center rounded-full bg-[#F26522] px-7 text-sm font-black uppercase tracking-[0.1em] text-white shadow-[0_18px_45px_rgba(242,101,34,0.28)] transition hover:-translate-y-0.5 hover:bg-[#d94d12]"
            >
              View roles
            </a>
          </div>

          <figure data-scroll-media className="relative">
            <div className="absolute -inset-5 border border-[#F26522]/28 bg-[#F26522]/8 shadow-[0_34px_120px_rgba(242,101,34,0.14)]" />
            <img
              src="/careers/legacy-careers-list.png"
              alt="GoBeyond careers listing preview"
              className="relative aspect-[4/3] w-full object-cover object-top"
            />
          </figure>
        </div>
      </section>

      <section id="open-roles" data-scroll-section className="relative z-10 overflow-hidden bg-[#030711] px-5 py-24 text-white sm:px-8 lg:px-12">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(242,101,34,0.16),transparent_28%),linear-gradient(135deg,#030711,#071026_48%,#02030b)]" />
        <div className="grid-mask pointer-events-none absolute inset-0 opacity-20" aria-hidden="true" />

        <div className="relative mx-auto max-w-7xl">
          <div className="grid items-end gap-6">
            <div>
              <div data-scroll-reveal>
                <SectionMark current="02" label="Open roles" />
              </div>
              <h2 data-scroll-reveal className="mobile-page-title mt-6 text-3xl font-black uppercase leading-[0.95] sm:text-4xl lg:text-5xl">
                All open
                <span className="block text-[#ff7648]">roles</span>
              </h2>
            </div>
            <p data-scroll-reveal className="max-w-2xl text-base font-medium leading-8 text-white/68 md:text-lg">
              Each role is one part of GoBeyond's global operating system. Choose the role that fits and send your CV to our recruitment team.
            </p>
          </div>

          <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {jobs.map((job, index) => (
              <JobCard key={job.title} job={job} index={index} />
            ))}
          </div>
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

export function FulfillmentJobPage() {
  return (
    <PageShell>
      <section id="career-detail" data-scroll-section className="relative z-10 min-h-screen overflow-hidden bg-[#000314] px-5 pt-24 text-white sm:px-8 lg:px-12">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_74%_18%,rgba(242,101,34,0.20),transparent_28%),linear-gradient(135deg,#000314,#071026_48%,#02030b)]" />
        <div className="grid-mask pointer-events-none absolute inset-0 opacity-22" aria-hidden="true" />

        <div className="relative mx-auto grid min-h-[calc(100vh-6rem)] max-w-7xl items-center gap-10 py-10 lg:grid-cols-[minmax(0,0.55fr)_minmax(0,0.45fr)]">
          <div>
            <div data-scroll-reveal>
              <SectionMark current="JD" label="Fulfillment" />
            </div>
            <h1 data-scroll-reveal className="mobile-page-title mt-6 text-3xl font-black uppercase leading-[0.95] sm:text-4xl lg:text-5xl xl:text-6xl">
              Careers
              <span className="block text-[#ff7648]">Fulfillment</span>
              <span className="block">Full-time</span>
            </h1>
            <p data-scroll-reveal className="mt-6 text-sm font-black uppercase tracking-[0.18em] text-white/46">
              April 21, 2026
            </p>
            <p data-scroll-reveal className="mt-7 max-w-2xl text-base font-medium leading-8 text-white/70 md:text-lg">
              GoBeyond is looking for a talented and passionate Fulfillment teammate. If you want a professional, dynamic environment with room to grow, this role is for you.
            </p>
            <div data-scroll-reveal className="mt-8 flex flex-wrap gap-3">
              <a className="rounded-full bg-[#F26522] px-6 py-3 text-sm font-black uppercase tracking-[0.1em] text-white transition hover:bg-[#d94d12]" href="mailto:tuyendung@gobe.asia?subject=%5BGoBeyond%20-%20FULFILLMENT%20FULL-TIME%5D%20Full%20name">
                Send CV
              </a>
              <a className="rounded-full border border-white/20 px-6 py-3 text-sm font-black uppercase tracking-[0.1em] text-white/78 transition hover:border-white hover:text-white" href="/tuyen-dung">
                View other roles
              </a>
            </div>
          </div>

          <figure data-scroll-media className="relative">
            <div className="absolute -inset-5 border border-[#F26522]/28 bg-[#F26522]/8 shadow-[0_34px_120px_rgba(242,101,34,0.14)]" />
            <img src="/careers/legacy-fulfillment-jd.png" alt="Fulfillment JD preview" className="relative aspect-[4/3] w-full object-cover object-top" />
          </figure>
        </div>
      </section>

      <section data-scroll-section className="relative z-10 bg-[#030711] px-5 py-24 text-white sm:px-8 lg:px-12">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_22%_10%,rgba(242,101,34,0.14),transparent_28%),linear-gradient(135deg,#030711,#071026_48%,#02030b)]" />
        <div className="grid-mask pointer-events-none absolute inset-0 opacity-20" aria-hidden="true" />

        <div className="relative mx-auto grid max-w-7xl gap-5 lg:grid-cols-[minmax(0,0.36fr)_minmax(0,0.64fr)]">
          <aside data-scroll-reveal className="top-24 h-fit border border-white/12 bg-white/[0.04] p-6 text-white/72 backdrop-blur-md lg:sticky">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-[#F26522]">Recruitment information</p>
            <dl className="mt-5 grid gap-4">
              {jobInfo.map(([label, value]) => (
                <div key={label}>
                  <dt className="text-xs font-black uppercase tracking-[0.14em] text-white/40">{label}</dt>
                  <dd className="mt-1 text-sm font-semibold leading-6 text-white">{value}</dd>
                </div>
              ))}
            </dl>
          </aside>

          <div className="grid gap-5">
            <DetailSection eyebrow="01" title="Scope of work">
              <ul className="grid gap-3">
                {workScope.map((item) => (
                  <li key={item} className="pl-4 before:mr-3 before:text-[#F26522] before:content-['•']">
                    {item}
                  </li>
                ))}
              </ul>
            </DetailSection>

            <DetailSection eyebrow="02" title="Requirements">
              <ul className="grid gap-3">
                {requirements.map((item) => (
                  <li key={item} className="pl-4 before:mr-3 before:text-[#F26522] before:content-['•']">
                    {item}
                  </li>
                ))}
              </ul>
            </DetailSection>

            <DetailSection eyebrow="03" title="Benefits">
              <ul className="grid gap-3">
                {benefits.map((item) => (
                  <li key={item} className="pl-4 before:mr-3 before:text-[#F26522] before:content-['•']">
                    {item}
                  </li>
                ))}
              </ul>
            </DetailSection>

            <DetailSection eyebrow="04" title="Working time">
              <p>Working hours: 8:00 - 17:30, Monday to Friday and Saturday morning remote. Lunch break: 12:00 - 13:30</p>
              <p className="mt-5 font-bold text-white">
                Send your CV and portfolio to: tuyendung@gobe.asia
                <br />
                Subject: [GoBeyond - FULFILLMENT FULL-TIME] Full name
              </p>
            </DetailSection>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
