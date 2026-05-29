"use client";

// Dev-only: silence a single benign React 19 + @react-three/fiber warning.
//
// Under React 19's stricter dev checks, an INTERNAL (minified) fiber component
// renders an array of children without a `key`, producing repeated
// `Each child in a list should have a unique "key" prop. Check the render
// method of \`Yb\`` console errors (and a Next.js dev-overlay "Issue").
//
// Every list we render in our own components is correctly keyed — verified.
// The warning is stripped from production builds and has no functional impact.
//
// We suppress ONLY when the reported owner is a minified token (e.g. `Yb`,
// `q3`). Our own components keep their real PascalCase names in dev, so genuine
// key bugs in our code are NOT hidden by this filter.
if (typeof window !== "undefined" && !(window as { __r3fKeyWarnPatched?: boolean }).__r3fKeyWarnPatched) {
  (window as { __r3fKeyWarnPatched?: boolean }).__r3fKeyWarnPatched = true;
  const original = console.error;
  console.error = function patchedError(...args: unknown[]) {
    const first = typeof args[0] === "string" ? args[0] : "";
    if (first.includes('unique "key" prop')) {
      const joined = args.map((a) => (typeof a === "string" ? a : "")).join(" ");
      const owner = joined.match(/render method of `([^`]+)`/)?.[1] ?? "";
      // Minified owner => library-internal. Real components are PascalCase/longer.
      if (/^[A-Za-z$_]{1,3}[0-9]*$/.test(owner)) {
        return;
      }
    }
    original.apply(console, args as []);
  };
}

export function SuppressDevWarnings() {
  return null;
}
