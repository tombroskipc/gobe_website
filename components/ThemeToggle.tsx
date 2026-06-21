"use client";

import { useEffect, useState } from "react";

type SiteTheme = "dark" | "light";

const THEME_STORAGE_KEY = "gobe:theme";

function getStoredTheme(): SiteTheme {
  if (typeof document !== "undefined") {
    const activeTheme = document.documentElement.dataset.theme;
    if (activeTheme === "light" || activeTheme === "dark") {
      return activeTheme;
    }
  }

  if (typeof window === "undefined") {
    return "dark";
  }

  try {
    const storedTheme = window.localStorage.getItem(THEME_STORAGE_KEY);
    if (storedTheme === "light" || storedTheme === "dark") {
      return storedTheme;
    }
  } catch {
    return "dark";
  }

  return "dark";
}

function applyTheme(theme: SiteTheme) {
  const root = document.documentElement;
  root.dataset.theme = theme;
  root.classList.toggle("dark", theme === "dark");
  root.classList.toggle("light", theme === "light");
  root.style.colorScheme = theme;
}

function SunIcon() {
  return (
    <svg aria-hidden="true" className="h-[18px] w-[18px]" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2.2M12 19.8V22M4.22 4.22l1.56 1.56M18.22 18.22l1.56 1.56M2 12h2.2M19.8 12H22M4.22 19.78l1.56-1.56M18.22 5.78l1.56-1.56" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg aria-hidden="true" className="h-[18px] w-[18px]" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" viewBox="0 0 24 24">
      <path d="M20.2 14.4A7.7 7.7 0 0 1 9.6 3.8 8.2 8.2 0 1 0 20.2 14.4Z" />
    </svg>
  );
}

export function ThemeToggle({ className = "" }: { className?: string }) {
  const [theme, setTheme] = useState<SiteTheme>("dark");

  useEffect(() => {
    setTheme(getStoredTheme());

    const handleThemeChange = (event: Event) => {
      const nextTheme = (event as CustomEvent<SiteTheme>).detail;

      if (nextTheme === "light" || nextTheme === "dark") {
        setTheme(nextTheme);
      }
    };

    const handleStorage = (event: StorageEvent) => {
      if (event.key !== THEME_STORAGE_KEY) {
        return;
      }

      const nextTheme = event.newValue === "light" ? "light" : "dark";
      applyTheme(nextTheme);
      setTheme(nextTheme);
    };

    window.addEventListener("gobe-theme-change", handleThemeChange as EventListener);
    window.addEventListener("storage", handleStorage);
    return () => {
      window.removeEventListener("gobe-theme-change", handleThemeChange as EventListener);
      window.removeEventListener("storage", handleStorage);
    };
  }, []);

  const nextTheme: SiteTheme = theme === "dark" ? "light" : "dark";

  const toggleTheme = () => {
    applyTheme(nextTheme);
    setTheme(nextTheme);
    window.dispatchEvent(new CustomEvent("gobe-theme-change", { detail: nextTheme }));

    try {
      window.localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
    } catch {
      // The applied document theme still works for this page view.
    }
  };

  return (
    <button
      type="button"
      aria-label={theme === "dark" ? "Chuyển sang giao diện sáng" : "Chuyển sang giao diện tối"}
      aria-pressed={theme === "light"}
      title={theme === "dark" ? "Light theme" : "Dark theme"}
      onClick={toggleTheme}
      className={`theme-toggle grid h-11 w-11 shrink-0 place-items-center rounded-full border border-white/14 bg-white/10 text-white/82 shadow-[0_12px_28px_rgba(0,0,0,0.18)] backdrop-blur-xl transition hover:-translate-y-0.5 hover:border-[#F26522]/60 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F26522]/70 ${className}`}
    >
      {theme === "dark" ? <SunIcon /> : <MoonIcon />}
    </button>
  );
}
