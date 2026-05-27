"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

const menuItems = [
  { label: "TRANG CH\u1ee6", href: "/", match: "/" },
  { label: "V\u1ec0 CH\u00daNG T\u00d4I", href: "/ve-chung-toi", match: "/ve-chung-toi" },
  { label: "TUY\u1ec2N D\u1ee4NG", href: "/tuyen-dung", match: "/tuyen-dung" },
  { label: "HO\u1ea0T \u0110\u1ed8NG", href: "/#operations", match: "/#operations" },
  { label: "TIN T\u1ee8C", href: "/#proof", match: "/#proof" },
];

function Icon({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.8"
      viewBox="0 0 24 24"
    >
      {children}
    </svg>
  );
}

export function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header className="fixed left-0 right-0 top-0 z-50 border-b border-white/10 bg-[#0c1018]/60 shadow-[0_12px_42px_rgba(0,0,0,0.24)] backdrop-blur-2xl">
      <div className="mx-auto flex min-h-[78px] max-w-7xl items-center gap-4 px-5 sm:px-6 lg:px-8">
        <a href="/" className="flex items-center gap-3" aria-label="GoBe home">
          <img src="/Logo_2.png" alt="GOBeyond go global or go home" className="h-auto w-[164px] object-contain md:w-[202px]" />
        </a>

        <nav aria-label="Landing navigation" className="ml-auto hidden items-center gap-2 lg:flex">
          {menuItems.map((item, index) => (
            <a
              key={item.href}
              href={item.href}
              aria-current={
                item.match === "/"
                  ? pathname === "/"
                    ? "page"
                    : undefined
                  : pathname.startsWith(item.match)
                    ? "page"
                    : undefined
              }
              className="rounded-full border border-transparent px-5 py-3 text-xs font-black uppercase tracking-[0.12em] text-white/70 transition hover:border-white/15 hover:bg-white/10 hover:text-white aria-[current=page]:border-[#F26522]/35 aria-[current=page]:bg-[#F26522]/10 aria-[current=page]:text-white"
            >
              {item.label}
            </a>
          ))}
          <a
            href="/tuyen-dung"
            className="magnetic ml-2 inline-flex min-h-11 items-center rounded-full border border-[#F26522]/45 bg-[#F26522] px-5 text-xs font-black uppercase tracking-[0.12em] text-white shadow-[0_14px_34px_rgba(242,101,34,0.26)] transition hover:-translate-y-0.5 hover:bg-[#d94d12]"
          >
            {"\u1ee8ng tuy\u1ec3n"}
          </a>
        </nav>

        <button
          type="button"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((value) => !value)}
          className="ml-auto grid h-11 w-11 place-items-center rounded-full border border-[#F26522]/35 bg-white/10 text-[#F26522] transition hover:bg-[#F26522]/10 lg:hidden"
        >
          <span className="relative h-5 w-6">
            <span className={`absolute left-0 top-0 h-0.5 w-6 rounded-full bg-current transition duration-300 ${open ? "translate-y-2 rotate-45" : ""}`} />
            <span className={`absolute left-0 top-2 h-0.5 w-6 rounded-full bg-current transition duration-300 ${open ? "opacity-0" : ""}`} />
            <span className={`absolute left-0 top-4 h-0.5 w-6 rounded-full bg-current transition duration-300 ${open ? "-translate-y-2 -rotate-45" : ""}`} />
          </span>
        </button>
      </div>

      <div
        className={`fixed inset-0 z-40 bg-black/45 backdrop-blur-sm transition-opacity duration-300 lg:hidden ${
          open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={() => setOpen(false)}
      />

      <aside
        className={`fixed right-0 top-0 z-50 h-dvh w-[min(86vw,390px)] border-l border-white/10 bg-[#0c1018] shadow-[-24px_0_60px_rgba(0,0,0,0.40)] transition-transform duration-300 ease-out lg:hidden ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
        aria-hidden={!open}
      >
        <div className="flex h-full flex-col px-6 py-5">
          <div className="flex items-center justify-between">
            <img src="/Logo_2.png" alt="GOBeyond" className="w-40 object-contain" />
            <button
              type="button"
              aria-label="Close menu"
              onClick={() => setOpen(false)}
              className="grid h-10 w-10 place-items-center rounded-full bg-[#F26522]/10 text-[#F26522]"
            >
              <Icon className="h-5 w-5">
                <path d="m6 6 12 12M18 6 6 18" />
              </Icon>
            </button>
          </div>

          <nav className="mt-10 grid gap-2" aria-label="Mobile navigation">
            {menuItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="rounded-2xl px-4 py-4 text-lg font-black uppercase tracking-[0.08em] text-white/80 transition hover:bg-[#F26522]/10 hover:text-white"
              >
                {item.label}
              </a>
            ))}
          </nav>

          <div className="mt-auto rounded-3xl bg-[#F26522] p-5 text-white">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-white/80">Contact</p>
            <a href="mailto:info@gobe.asia" className="mt-3 block text-sm font-bold">
              info@gobe.asia
            </a>
            <a href="tel:0786541658" className="mt-4 inline-flex rounded-full bg-[#22C55E] px-4 py-2 text-sm font-black text-white">
              Hotline 078.654.1658
            </a>
          </div>
        </div>
      </aside>
    </header>
  );
}
