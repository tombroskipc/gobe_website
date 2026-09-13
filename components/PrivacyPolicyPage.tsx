"use client";

import { useEffect, type ReactNode } from "react";
import { FooterBridge, FooterSection } from "./LegacySections";
import { Navbar } from "./Navbar";

const EFFECTIVE_DATE = "July 23, 2026";

const policySections = [
  { id: "scope", label: "Scope" },
  { id: "information-we-collect", label: "Information we collect" },
  { id: "meta-platform-data", label: "Meta Platform Data" },
  { id: "how-we-use-data", label: "How we use data" },
  { id: "sharing", label: "How we share data" },
  { id: "retention", label: "Retention and deletion" },
  { id: "your-rights", label: "Your rights and choices" },
  { id: "data-deletion", label: "Data deletion instructions" },
  { id: "security", label: "Security and transfers" },
  { id: "privacy-contact", label: "Contact" },
];

const summaryItems = [
  {
    label: "Meta access",
    value: "Read-only",
    detail: "Advertising accounts and performance data used for internal reporting.",
  },
  {
    label: "Sale of data",
    value: "Never",
    detail: "We do not sell Meta Platform Data or personal information.",
  },
  {
    label: "Service providers",
    value: "Disclosed",
    detail: "Limited providers support data integration, collaboration, infrastructure, and security.",
  },
  {
    label: "Deletion requests",
    value: "Available",
    detail: "Email info@gobe.asia. Verified requests are ordinarily completed within 30 days.",
  },
];

function PolicySection({
  children,
  id,
  index,
  title,
}: {
  children: ReactNode;
  id: string;
  index: string;
  title: string;
}) {
  return (
    <section id={id} className="scroll-mt-28 border-t border-white/12 py-10 first:border-t-0 first:pt-0 md:py-14">
      <div className="mb-5 flex items-baseline gap-4">
        <span className="font-mono text-xs font-bold tracking-[0.16em] text-[#F26522]" aria-hidden="true">
          {index}
        </span>
        <h2 className="text-2xl font-black tracking-[-0.02em] text-white md:text-3xl">{title}</h2>
      </div>
      <div className="space-y-5 text-[0.98rem] font-medium leading-7 text-white/70 md:text-[1.04rem] md:leading-8">
        {children}
      </div>
    </section>
  );
}

function PolicyLink({
  children,
  href,
}: {
  children: ReactNode;
  href: string;
}) {
  return (
    <a
      href={href}
      className="font-bold text-white underline decoration-[#F26522] decoration-2 underline-offset-4 transition hover:text-[#ff8a56] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F26522] focus-visible:ring-offset-4 focus-visible:ring-offset-[#07101d]"
      target={href.startsWith("http") ? "_blank" : undefined}
      rel={href.startsWith("http") ? "noreferrer" : undefined}
    >
      {children}
    </a>
  );
}

export function PrivacyPolicyPage() {
  useEffect(() => {
    document.documentElement.classList.add("legal-page-active");
    return () => document.documentElement.classList.remove("legal-page-active");
  }, []);

  return (
    <main className="legal-document-page relative min-h-screen overflow-x-hidden bg-[#000314] text-white" lang="en">
      <a
        href="#policy-content"
        className="fixed left-4 top-3 z-[60] -translate-y-24 rounded-full bg-white px-5 py-3 text-sm font-black text-[#000314] transition focus:translate-y-0"
      >
        Skip to policy
      </a>
      <Navbar />

      <header className="relative overflow-hidden border-b border-white/10 px-5 pb-16 pt-36 sm:px-8 md:pb-24 md:pt-44 lg:px-12">
        <div
          className="absolute inset-0 bg-[radial-gradient(circle_at_78%_24%,rgba(242,101,34,0.22),transparent_28%),radial-gradient(circle_at_18%_76%,rgba(90,162,232,0.13),transparent_28%),linear-gradient(135deg,#000314_0%,#07101d_48%,#020611_100%)]"
          aria-hidden="true"
        />
        <div className="grid-mask pointer-events-none absolute inset-0 opacity-20" aria-hidden="true" />
        <div
          className="pointer-events-none absolute -right-10 top-28 select-none font-mono text-[clamp(5rem,19vw,17rem)] font-black leading-none tracking-[-0.09em] text-white/[0.025]"
          aria-hidden="true"
        >
          DATA
        </div>

        <div className="relative mx-auto max-w-7xl">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 font-mono text-[0.68rem] font-bold uppercase tracking-[0.2em] text-white/48">
            <span className="text-[#F26522]">GoBeyond / Legal</span>
            <span className="h-px w-10 bg-white/24" aria-hidden="true" />
            <span>Effective {EFFECTIVE_DATE}</span>
          </div>
          <h1 className="mt-8 max-w-5xl text-[clamp(3.6rem,10vw,8.8rem)] font-black uppercase leading-[0.82] tracking-[-0.065em] text-white">
            Privacy,
            <span className="block text-[#ff7648]">stated plainly.</span>
          </h1>
          <p className="mt-8 max-w-2xl text-base font-medium leading-8 text-white/68 md:text-lg">
            This policy explains what GoBeyond handles, why we handle it, who helps us process it, and how you can
            access or delete it—including data received through Meta products.
          </p>

          <div className="mt-12 grid overflow-hidden border border-white/12 bg-[#0b1320]/76 shadow-[0_32px_90px_rgba(0,0,0,0.28)] backdrop-blur-xl sm:grid-cols-2 lg:grid-cols-4">
            {summaryItems.map((item) => (
              <div
                key={item.label}
                className="border-b border-white/10 p-5 last:border-b-0 sm:border-r sm:[&:nth-child(2)]:border-r-0 sm:[&:nth-child(3)]:border-b-0 lg:border-b-0 lg:[&:nth-child(2)]:border-r lg:[&:last-child]:border-r-0"
              >
                <p className="font-mono text-[0.64rem] font-bold uppercase tracking-[0.18em] text-white/38">
                  {item.label}
                </p>
                <p className="mt-3 text-xl font-black text-white">{item.value}</p>
                <p className="mt-2 text-sm font-medium leading-6 text-white/54">{item.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </header>

      <div className="relative px-5 py-16 sm:px-8 md:py-24 lg:px-12">
        <div
          className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,#000314_0%,#07101d_48%,#000314_100%)]"
          aria-hidden="true"
        />
        <div className="relative mx-auto grid max-w-7xl gap-12 lg:grid-cols-[17rem_minmax(0,1fr)] lg:gap-20">
          <aside className="lg:sticky lg:top-28 lg:h-fit">
            <p className="font-mono text-[0.66rem] font-bold uppercase tracking-[0.2em] text-[#F26522]">
              In this policy
            </p>
            <nav aria-label="Privacy policy contents" className="mt-5 hidden border-l border-white/14 lg:grid">
              {policySections.map((section) => (
                <a
                  key={section.id}
                  href={`#${section.id}`}
                  className="-ml-px border-l border-transparent px-5 py-2.5 text-sm font-bold text-white/48 transition hover:border-[#F26522] hover:text-white focus:outline-none focus-visible:border-[#F26522] focus-visible:text-white"
                >
                  {section.label}
                </a>
              ))}
            </nav>

            <div className="mt-7 border border-[#F26522]/30 bg-[#F26522]/[0.08] p-5">
              <p className="text-sm font-black text-white">Need your data deleted?</p>
              <p className="mt-2 text-sm font-medium leading-6 text-white/58">
                The exact request steps are included below.
              </p>
              <a
                href="#data-deletion"
                className="mt-4 inline-flex text-xs font-black uppercase tracking-[0.13em] text-[#ff8a56] transition hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F26522]"
              >
                Go to deletion steps →
              </a>
            </div>
          </aside>

          <article id="policy-content" className="min-w-0">
            <div className="mb-12 border-l-2 border-[#F26522] pl-5 text-base font-semibold leading-7 text-white/72 md:pl-7 md:text-lg md:leading-8">
              <p>
                GoBeyond LLC (“GoBeyond,” “we,” “us,” or “our”) operates the GoBeyond website and our internal
                marketing-management application.
              </p>
            </div>

            <PolicySection id="scope" index="01" title="Scope">
              <p>
                This Privacy Policy applies to information processed through <strong className="text-white">gobe.asia</strong>,
                our business communications, and our internal marketing-management application, including information obtained through
                Facebook, Instagram, and other products provided by Meta Platforms, Inc. (“Meta”).
              </p>
              <p>
                It does not govern Meta’s own processing. Meta explains its practices in the{" "}
                <PolicyLink href="https://www.facebook.com/privacy/policy/">Meta Privacy Policy</PolicyLink>. Links to
                third-party websites or social platforms are governed by those parties’ policies.
              </p>
            </PolicySection>

            <PolicySection id="information-we-collect" index="02" title="Information we collect">
              <div>
                <h3 className="font-black text-white">Information you provide</h3>
                <p className="mt-2">
                  If you contact us, apply for a role, or make a privacy request, we may receive your name, work contact
                  details, company or role, message, attachments, and the information needed to respond or verify your
                  request.
                </p>
              </div>
              <div>
                <h3 className="font-black text-white">Website and device information</h3>
                <p className="mt-2">
                  Our hosting systems may create standard technical logs such as IP address, browser and device type,
                  requested pages, timestamps, referral information, and security events. The site stores limited
                  preferences in your browser, such as your selected light or dark theme and whether the home loading
                  sequence has already been shown during the current session. We do not use those preferences to build
                  advertising profiles.
                </p>
              </div>
              <div>
                <h3 className="font-black text-white">Business system information</h3>
                <p className="mt-2">
                  Authorized staff may use our internal systems to process company-owned store, order, supplier,
                  financial, advertising, and operational records. Access is limited by role and business need.
                </p>
              </div>
            </PolicySection>

            <PolicySection id="meta-platform-data" index="03" title="Meta Platform Data">
              <p>
                When an authorized business user connects a Meta account or when our approved service provider syncs
                data for GoBeyond-owned advertising assets, we may process the following categories of Meta Platform
                Data:
              </p>
              <ul className="grid gap-3 pl-5 marker:text-[#F26522]">
                <li>ad account identifiers, account names, status, currency, and authorization metadata;</li>
                <li>campaign, ad set, ad, creative, and post identifiers and names;</li>
                <li>
                  advertising performance and delivery metrics, including spend, impressions, clicks, CPC, CPM, CTR,
                  frequency, actions, purchases, conversion value, ROAS, video views, and related date ranges; and
                </li>
                <li>access tokens and connection metadata needed to make authorized, read-only API requests.</li>
              </ul>
              <p>
                The application is designed for <strong className="text-white">read-only advertising access</strong>.
                It does not create, edit, or publish campaigns or ads, and it does not access the content of personal
                Facebook or Instagram messages.
              </p>
            </PolicySection>

            <PolicySection id="how-we-use-data" index="04" title="How we use information">
              <p>We process information only for specific business and operational purposes, including to:</p>
              <ul className="grid gap-3 pl-5 marker:text-[#F26522]">
                <li>authenticate authorized users and maintain secure connections;</li>
                <li>provide internal advertising reporting, accounting, reconciliation, and profitability analysis;</li>
                <li>combine advertising results with GoBeyond’s own commerce and cost data for internal measurement;</li>
                <li>diagnose data freshness, API errors, delivery issues, and reporting discrepancies;</li>
                <li>protect our systems, investigate misuse, and maintain audit records; and</li>
                <li>respond to support, privacy, legal, and regulatory requests.</li>
              </ul>
              <p>
                We do <strong className="text-white">not</strong> sell Meta Platform Data, use it for cross-platform
                targeting or retargeting, build profiles about people for unrelated purposes, make eligibility
                decisions, or optimize another platform’s advertising campaigns.
              </p>
              <p>
                Where applicable law requires a legal basis, we rely on performance of a contract, legitimate business
                interests, consent, and compliance with legal obligations, depending on the context.
              </p>
            </PolicySection>

            <PolicySection id="sharing" index="05" title="How we share information">
              <p>We disclose information only as needed for the purposes described above:</p>
              <ul className="grid gap-4 pl-5 marker:text-[#F26522]">
                <li>
                  <strong className="text-white">Service providers.</strong> Data-integration providers may ingest and
                  synchronize authorized Meta advertising data, and business-collaboration providers may receive
                  selected aggregate performance metrics for internal reporting. Infrastructure, database, security,
                  and professional-service providers may also process limited information to operate and protect our
                  services.
                </li>
                <li>
                  <strong className="text-white">Legal and safety disclosures.</strong> We may disclose information
                  where required by law or when reasonably necessary to protect rights, safety, and system integrity.
                </li>
                <li>
                  <strong className="text-white">Business changes.</strong> Information may be transferred as part of
                  a merger, financing, reorganization, or sale of business assets, subject to this policy and
                  applicable law.
                </li>
              </ul>
              <p>
                When a provider processes Meta Platform Data for us, we require purpose limitation, confidentiality,
                appropriate security, limited retention, and deletion or return of the data when its work ends. We do
                not allow providers to use that data for their own advertising or unrelated purposes.
              </p>
            </PolicySection>

            <PolicySection id="retention" index="06" title="Retention and deletion">
              <p>
                We keep personal information and Meta Platform Data only for as long as necessary for the purposes in
                this policy, while an authorized connection remains active, or as required by law and Meta’s terms. We
                periodically review whether the data is still needed.
              </p>
              <p>
                We delete or de-identify Platform Data when it is no longer necessary, when authorization is withdrawn,
                when Meta requires deletion, when our use of Meta services ends, or after a valid deletion request,
                unless the law requires us to retain specific records. Legally retained data is isolated and used only
                for the required purpose.
              </p>
              <p>
                Verified deletion requests are handled promptly and are ordinarily completed within 30 days. Residual
                copies may remain temporarily in protected backups until routine rotation, but they are not returned
                to active use. We also instruct relevant service providers to delete applicable copies.
              </p>
            </PolicySection>

            <PolicySection id="your-rights" index="07" title="Your rights and choices">
              <p>
                Depending on where you live, you may have the right to request access, correction, deletion,
                portability, restriction, or objection; withdraw consent; or complain to a data protection authority.
                We will not discriminate against you for making a privacy request.
              </p>
              <p>
                You may withdraw GoBeyond’s Meta authorization through your Facebook or Meta Business settings. This
                stops future access but may not automatically remove information already lawfully received, so send us
                a deletion request if you also want our copies removed.
              </p>
            </PolicySection>

            <section
              id="data-deletion"
              className="scroll-mt-28 border-y border-[#F26522]/32 bg-[#F26522]/[0.075] px-5 py-10 md:px-8 md:py-12"
            >
              <div className="flex items-baseline gap-4">
                <span className="font-mono text-xs font-bold tracking-[0.16em] text-[#F26522]" aria-hidden="true">
                  08
                </span>
                <h2 className="text-2xl font-black tracking-[-0.02em] text-white md:text-3xl">
                  Data deletion instructions
                </h2>
              </div>
              <p className="mt-5 text-[0.98rem] font-medium leading-7 text-white/70 md:text-[1.04rem] md:leading-8">
                To request deletion of information received from Meta or otherwise held by GoBeyond:
              </p>
              <ol className="mt-6 grid gap-5 text-[0.98rem] font-medium leading-7 text-white/70 md:text-[1.04rem] md:leading-8">
                <li className="grid grid-cols-[2rem_minmax(0,1fr)] gap-3">
                  <span className="font-mono text-sm font-black text-[#F26522]">1.</span>
                  <span>
                    Email{" "}
                    <PolicyLink href="mailto:info@gobe.asia?subject=Data%20Deletion%20Request">
                      info@gobe.asia
                    </PolicyLink>{" "}
                    with the subject “Data Deletion Request.”
                  </span>
                </li>
                <li className="grid grid-cols-[2rem_minmax(0,1fr)] gap-3">
                  <span className="font-mono text-sm font-black text-[#F26522]">2.</span>
                  <span>
                    Include your name, the email address used to authorize the connection, the relevant business or ad
                    account name or ID, and a short description of what you want deleted. Never send us a password,
                    access token, or payment credential.
                  </span>
                </li>
                <li className="grid grid-cols-[2rem_minmax(0,1fr)] gap-3">
                  <span className="font-mono text-sm font-black text-[#F26522]">3.</span>
                  <span>
                    We may ask for limited information to verify that you control the account. After verification, we
                    will confirm receipt, track the request, delete applicable data from active systems, and notify
                    relevant service providers.
                  </span>
                </li>
                <li className="grid grid-cols-[2rem_minmax(0,1fr)] gap-3">
                  <span className="font-mono text-sm font-black text-[#F26522]">4.</span>
                  <span>
                    We ordinarily complete verified requests within 30 days and will tell you if law requires a longer
                    period or prevents deletion of a specific record.
                  </span>
                </li>
              </ol>
              <a
                href="mailto:info@gobe.asia?subject=Data%20Deletion%20Request"
                className="mt-8 inline-flex min-h-12 items-center rounded-full bg-[#F26522] px-7 text-sm font-black uppercase tracking-[0.1em] text-white shadow-[0_16px_38px_rgba(242,101,34,0.24)] transition hover:-translate-y-0.5 hover:bg-[#d94d12] focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-4 focus-visible:ring-offset-[#1c1110]"
              >
                Request data deletion
              </a>
            </section>

            <PolicySection id="security" index="09" title="Security and international transfers">
              <p>
                We use administrative, technical, and organizational safeguards designed to protect information,
                including role-based access, encryption of stored credentials, encrypted transport, monitoring, and
                restricted production access. No system is perfectly secure, so we cannot guarantee absolute security.
              </p>
              <p>
                Some providers may process information outside your country. Where required, we use appropriate
                contractual or legal safeguards for international transfers.
              </p>
              <div>
                <h3 className="font-black text-white">Children</h3>
                <p className="mt-2">
                  Our website and business applications are not directed to children under 16, and we do not knowingly
                  collect children’s personal information through them.
                </p>
              </div>
              <div>
                <h3 className="font-black text-white">Policy changes</h3>
                <p className="mt-2">
                  We may update this policy when our practices, services, or legal obligations change. We will post the
                  revised policy here and update the effective date. Material changes may also be communicated through
                  an appropriate business channel.
                </p>
              </div>
            </PolicySection>

            <PolicySection id="privacy-contact" index="10" title="Contact GoBeyond">
              <p>Questions, privacy requests, and complaints can be sent to:</p>
              <address className="not-italic text-white/74">
                <strong className="text-white">GoBeyond LLC</strong>
                <br />
                St Moritz, 1014 Pham Van Dong Street
                <br />
                Thu Duc Ward, Ho Chi Minh City, Vietnam
                <br />
                Email: <PolicyLink href="mailto:info@gobe.asia">info@gobe.asia</PolicyLink>
                <br />
                Phone: <PolicyLink href="tel:0786541658">078.654.1658</PolicyLink>
              </address>
              <p className="text-sm text-white/48">
                Effective and last updated: <time dateTime="2026-07-23">{EFFECTIVE_DATE}</time>.
              </p>
            </PolicySection>
          </article>
        </div>
      </div>

      <FooterBridge />
      <FooterSection />
    </main>
  );
}
