"use client";

import { useEffect, type CSSProperties, type ReactNode } from "react";
import { CustomCursor } from "./CustomCursor";
import { FooterSection } from "./LegacySections";
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
    date: "08 Th12",
    excerpt: "Tìm kiếm nhân viên Marketing Google Ads tài năng, biết thử nghiệm, tối ưu và đọc tín hiệu thị trường.",
    href: "/tuyen-dung/marketing-google-ads",
    title: "Marketing Google Ads",
    tone: "#F26522",
  },
  {
    date: "08 Th12",
    excerpt: "Đồng hành cùng team performance để scale các chiến dịch Facebook Ads cho thị trường quốc tế.",
    href: "/tuyen-dung/marketing-facebook-ads",
    title: "Marketing Facebook Ads",
    tone: "#5AA2E8",
  },
  {
    date: "08 Th12",
    excerpt: "Sản xuất video ngắn, visual angle và nội dung sáng tạo phục vụ các chiến dịch e-commerce.",
    href: "/tuyen-dung/creative-video",
    title: "Creative Video",
    tone: "#D95B9F",
  },
  {
    date: "05 Th1",
    excerpt: "Chăm sóc khách hàng, xử lý phản hồi và phối hợp vận hành để trải nghiệm mua hàng mượt mà.",
    href: "/tuyen-dung/customer-service",
    title: "Customer Service",
    tone: "#2ED4A4",
  },
  {
    date: "29 Th8",
    excerpt: "Tuyển dụng, phát triển con người và xây dựng văn hóa vận hành chủ động trong đội ngũ.",
    href: "/tuyen-dung/human-resource",
    title: "Human Resource",
    tone: "#E9C15F",
  },
  {
    date: "21 Th4",
    excerpt: "Quản lý đơn hàng, điều phối supplier, logistics và theo dõi vận hành từ lúc nhận đơn đến khi giao thành công.",
    href: "/tuyen-dung/fulfillment-full-time",
    title: "Fulfillment Full-time",
    tone: "#F26522",
  },
  {
    date: "21 Th4",
    excerpt: "Thực tập vận hành sàn Etsy, hỗ trợ listing, tracking và quy trình xử lý dữ liệu sản phẩm.",
    href: "/tuyen-dung/van-hanh-san-etsy-intern",
    title: "Vận hành sàn Etsy Intern",
    tone: "#5AA2E8",
  },
];

const jobInfo = [
  ["Vị trí", "Fulfillment Full-time"],
  ["Lĩnh vực", "Thương mại điện tử Âu Mỹ, Dropshipping, FBA, FBM"],
  ["Số lượng", "02"],
  ["Địa điểm", "Tòa St Moritz, 1014 Đường Phạm Văn Đồng, TP. Hồ Chí Minh"],
];

const workScope = [
  "Quản lý toàn bộ quy trình xử lý và theo dõi đơn hàng từ lúc nhận đơn đến khi giao thành công, đảm bảo tiến độ và chất lượng vận hành.",
  "Điều phối công việc giữa Customer Support, Supplier và Logistics để đảm bảo hàng hóa được sản xuất và giao đúng kế hoạch.",
  "Giám sát và tối ưu quy trình Fulfill nhằm giảm thiểu sai sót, rút ngắn thời gian xử lý và tăng trải nghiệm khách hàng.",
  "Xử lý và hỗ trợ team giải quyết hoàn trả, mất hàng, khiếu nại theo hướng nhanh chóng, linh hoạt và hiệu quả.",
  "Theo dõi chỉ số vận hành như tỷ lệ giao đúng hạn, tỷ lệ lỗi, thời gian xử lý đơn và đề xuất cải tiến liên tục.",
  "Báo cáo định kỳ cho Leader về hiệu quả vận hành và tình hình đơn hàng.",
];

const requirements = [
  "Tốt nghiệp Đại học các ngành Quản trị Chuỗi Cung Ứng, Quản trị Kinh doanh hoặc lĩnh vực liên quan.",
  "Tiếng Anh khá, có khả năng làm việc với đối tác và khách hàng nước ngoài.",
  "Tối thiểu 1-2 năm kinh nghiệm Fulfillment trong lĩnh vực POD, Dropshipping hoặc E-commerce.",
  "Thành thạo các công cụ quản lý đơn hàng, theo dõi vận chuyển và xử lý dữ liệu.",
  "Tư duy quản lý, biết điều phối, phân công và giám sát công việc.",
  "Chủ động, trách nhiệm, nhanh nhẹn, linh hoạt và có khả năng xử lý vấn đề tốt.",
];

const benefits = [
  "Thu nhập 8-12 triệu/tháng + bonus theo hiệu suất, có thể thỏa thuận trong quá trình phỏng vấn.",
  "Thời gian thử việc 2 tháng, nhận 85% lương chính thức.",
  "Review lương 1 lần/năm.",
  "Đóng BHXH, BHYT, BHTN theo quy định khi là nhân viên chính thức.",
  "Lương tháng 13, thưởng Lễ, Tết và các hoạt động nội bộ như happy hours, sinh nhật, kick-off, team building.",
  "Môi trường startup trẻ trung, năng động, sáng tạo và tập trung phát triển con người.",
];

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
          Tuyển dụng / 0{index + 1}
        </p>
        <h3 className="mt-3 text-2xl font-black uppercase leading-tight text-white">{job.title}</h3>
        <p className="mt-3 text-sm font-medium leading-6 text-white/64">{job.excerpt}</p>
      </div>

      {isPrimary ? (
        <span className="absolute bottom-5 right-5 rounded-full bg-[#F26522] px-4 py-2 text-xs font-black uppercase tracking-[0.1em] text-white">
          Xem JD
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
              <SectionMark current="01" label="Tuyển dụng" />
            </div>
            <h1 data-scroll-reveal className="mt-6 text-5xl font-black uppercase leading-[0.86] tracking-normal sm:text-6xl lg:text-8xl xl:text-9xl">
              Gia nhập
              <span className="block text-[#ff7648]">GoBeyond</span>
            </h1>
            <p data-scroll-reveal className="mt-7 max-w-2xl text-base font-medium leading-8 text-white/70 md:text-lg">
              Những vị trí đang mở cho đội ngũ e-commerce toàn cầu: marketing, creative, fulfillment, customer service và vận hành.
            </p>
            <a
              href="#open-roles"
              data-scroll-reveal
              className="magnetic mt-8 inline-flex min-h-12 items-center rounded-full bg-[#F26522] px-7 text-sm font-black uppercase tracking-[0.1em] text-white shadow-[0_18px_45px_rgba(242,101,34,0.28)] transition hover:-translate-y-0.5 hover:bg-[#d94d12]"
            >
              Xem vị trí
            </a>
          </div>

          <figure data-scroll-media className="relative">
            <div className="absolute -inset-5 border border-[#F26522]/28 bg-[#F26522]/8 shadow-[0_34px_120px_rgba(242,101,34,0.14)]" />
            <img
              src="/careers/legacy-careers-list.png"
              alt="Danh sách tuyển dụng GoBeyond cũ"
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
                <SectionMark current="02" label="Open roles" />
              </div>
              <h2 data-scroll-reveal className="mt-6 text-4xl font-black uppercase leading-[0.9] sm:text-5xl lg:text-7xl">
                Tất cả vị trí
                <span className="block text-[#ff7648]">đang tuyển</span>
              </h2>
            </div>
            <p data-scroll-reveal className="max-w-2xl text-base font-medium leading-8 text-white/68 md:text-lg">
              Mỗi vai trò đều là một mảnh ghép trong hệ thống vận hành toàn cầu của GoBeyond. Chọn vị trí phù hợp và gửi CV về team tuyển dụng.
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
            <h1 data-scroll-reveal className="mt-6 text-4xl font-black uppercase leading-[0.9] sm:text-5xl lg:text-7xl xl:text-8xl">
              Tuyển dụng
              <span className="block text-[#ff7648]">Fulfillment</span>
              <span className="block">Full-time</span>
            </h1>
            <p data-scroll-reveal className="mt-6 text-sm font-black uppercase tracking-[0.18em] text-white/46">
              Tháng 4 21, 2026
            </p>
            <p data-scroll-reveal className="mt-7 max-w-2xl text-base font-medium leading-8 text-white/70 md:text-lg">
              GoBeyond đang tìm kiếm nhân viên Fulfillment tài năng và nhiệt huyết để gia nhập đội ngũ. Nếu bạn thích môi trường chuyên nghiệp, năng động và có cơ hội thăng tiến, đây là nơi dành cho bạn.
            </p>
            <div data-scroll-reveal className="mt-8 flex flex-wrap gap-3">
              <a className="rounded-full bg-[#F26522] px-6 py-3 text-sm font-black uppercase tracking-[0.1em] text-white transition hover:bg-[#d94d12]" href="mailto:tuyendung@gobe.asia?subject=%5BGOBEYOND%20-%20FULFILLMENT%20FULL-TIME%5D%20Ho%20va%20ten">
                Gửi CV
              </a>
              <a className="rounded-full border border-white/20 px-6 py-3 text-sm font-black uppercase tracking-[0.1em] text-white/78 transition hover:border-white hover:text-white" href="/tuyen-dung">
                Xem vị trí khác
              </a>
            </div>
          </div>

          <figure data-scroll-media className="relative">
            <div className="absolute -inset-5 border border-[#F26522]/28 bg-[#F26522]/8 shadow-[0_34px_120px_rgba(242,101,34,0.14)]" />
            <img src="/careers/legacy-fulfillment-jd.png" alt="JD Fulfillment old page preview" className="relative aspect-[4/3] w-full object-cover object-top" />
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
              {jobInfo.map(([label, value]) => (
                <div key={label}>
                  <dt className="text-xs font-black uppercase tracking-[0.14em] text-white/40">{label}</dt>
                  <dd className="mt-1 text-sm font-semibold leading-6 text-white">{value}</dd>
                </div>
              ))}
            </dl>
          </aside>

          <div className="grid gap-5">
            <DetailSection eyebrow="01" title="Phạm vi công việc">
              <ul className="grid gap-3">
                {workScope.map((item) => (
                  <li key={item} className="pl-4 before:mr-3 before:text-[#F26522] before:content-['•']">
                    {item}
                  </li>
                ))}
              </ul>
            </DetailSection>

            <DetailSection eyebrow="02" title="Yêu cầu">
              <ul className="grid gap-3">
                {requirements.map((item) => (
                  <li key={item} className="pl-4 before:mr-3 before:text-[#F26522] before:content-['•']">
                    {item}
                  </li>
                ))}
              </ul>
            </DetailSection>

            <DetailSection eyebrow="03" title="Quyền lợi">
              <ul className="grid gap-3">
                {benefits.map((item) => (
                  <li key={item} className="pl-4 before:mr-3 before:text-[#F26522] before:content-['•']">
                    {item}
                  </li>
                ))}
              </ul>
            </DetailSection>

            <DetailSection eyebrow="04" title="Thời gian làm việc">
              <p>Giờ làm việc: 8:00-17:30, từ thứ 2 đến thứ 6, thứ 7 remote. Nghỉ trưa: 12:00-13:30.</p>
              <p className="mt-5 font-bold text-white">
                Gửi CV và Portfolio tới Email: tuyendung@gobe.asia
                <br />
                Tiêu đề: [GOBEYOND - FULFILLMENT FULL-TIME] Họ và tên
              </p>
            </DetailSection>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
