"use client";

import { useEffect } from "react";

type PretextModule = typeof import("@chenglou/pretext");

const FIT_SELECTOR = "[data-pretext-fit]";
const DEFAULT_MAX_LINES = 2;
const DEFAULT_MIN_SCALE = 0.82;

function parsePositiveNumber(value: string | undefined, fallback: number) {
  if (!value) {
    return fallback;
  }

  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

function parseLetterSpacing(value: string) {
  if (!value || value === "normal") {
    return 0;
  }

  const parsed = Number.parseFloat(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function getCanvasFont(style: CSSStyleDeclaration, fontSize: number) {
  const fontStyle = style.fontStyle && style.fontStyle !== "normal" ? `${style.fontStyle} ` : "";
  const fontVariant = style.fontVariant && style.fontVariant !== "normal" ? `${style.fontVariant} ` : "";
  const fontWeight = style.fontWeight || "400";
  const fontFamily = style.fontFamily || "Inter";

  return `${fontStyle}${fontVariant}${fontWeight} ${fontSize}px ${fontFamily}`;
}

function getLineHeight(style: CSSStyleDeclaration, fontSize: number) {
  if (style.lineHeight === "normal") {
    return fontSize * 1.2;
  }

  const parsed = Number.parseFloat(style.lineHeight);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fontSize * 1.2;
}

function fitTextElement(element: HTMLElement, pretext: PretextModule) {
  const text = element.textContent?.trim();

  if (!text) {
    return;
  }

  const width = element.clientWidth;

  if (width <= 0) {
    return;
  }

  element.style.removeProperty("font-size");
  element.style.removeProperty("-webkit-line-clamp");
  element.style.removeProperty("display");
  element.style.removeProperty("overflow");
  element.style.removeProperty("-webkit-box-orient");
  element.dataset.pretextOverflow = "false";

  const style = window.getComputedStyle(element);
  const baseFontSize = parsePositiveNumber(element.dataset.pretextBaseFontSize, Number.parseFloat(style.fontSize) || 16);
  element.dataset.pretextBaseFontSize = String(baseFontSize);

  const maxLines = Math.max(1, Math.round(parsePositiveNumber(element.dataset.pretextMaxLines, DEFAULT_MAX_LINES)));
  const minScale = Math.min(1, Math.max(0.55, parsePositiveNumber(element.dataset.pretextMinScale, DEFAULT_MIN_SCALE)));
  const letterSpacing = parseLetterSpacing(style.letterSpacing);
  const baseLineHeight = getLineHeight(style, baseFontSize);

  let bestScale = 1;
  let bestLineCount = 0;

  for (let step = 0; step < 7; step += 1) {
    const scale = step === 0 ? 1 : 1 - ((1 - minScale) * step) / 6;
    const fontSize = baseFontSize * scale;
    const prepared = pretext.prepare(text, getCanvasFont(style, fontSize), letterSpacing === 0 ? undefined : { letterSpacing });
    const result = pretext.layout(prepared, width, baseLineHeight * scale);

    bestScale = scale;
    bestLineCount = result.lineCount;

    if (result.lineCount <= maxLines) {
      break;
    }
  }

  element.style.fontSize = `${baseFontSize * bestScale}px`;
  element.dataset.pretextLines = String(bestLineCount);

  if (bestLineCount > maxLines) {
    element.dataset.pretextOverflow = "true";
    element.style.display = "-webkit-box";
    element.style.overflow = "hidden";
    element.style.webkitBoxOrient = "vertical";
    element.style.webkitLineClamp = String(maxLines);
  }
}

export function usePretextHomeTextFit(enabled = true) {
  useEffect(() => {
    if (!enabled) {
      return;
    }

    let cancelled = false;
    let resizeObserver: ResizeObserver | null = null;
    let raf = 0;

    const run = async () => {
      if (!("Segmenter" in Intl)) {
        return;
      }

      const pretext = await import("@chenglou/pretext");

      if (cancelled) {
        return;
      }

      const fitAll = () => {
        window.cancelAnimationFrame(raf);
        raf = window.requestAnimationFrame(() => {
          document.querySelectorAll<HTMLElement>(FIT_SELECTOR).forEach((element) => {
            fitTextElement(element, pretext);
          });
        });
      };

      await document.fonts.ready;

      if (cancelled) {
        return;
      }

      resizeObserver = new ResizeObserver(fitAll);
      document.querySelectorAll<HTMLElement>(FIT_SELECTOR).forEach((element) => resizeObserver?.observe(element));
      fitAll();
      window.addEventListener("resize", fitAll);

      return () => {
        window.removeEventListener("resize", fitAll);
      };
    };

    let removeResizeListener: (() => void) | undefined;
    run().then((cleanup) => {
      removeResizeListener = cleanup;
    });

    return () => {
      cancelled = true;
      window.cancelAnimationFrame(raf);
      resizeObserver?.disconnect();
      removeResizeListener?.();
    };
  }, [enabled]);
}
