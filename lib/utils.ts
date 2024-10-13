import { clsx, type ClassValue } from "clsx";
import type { CSSProperties } from "react";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Smoothly scrolls to a specified position within a container.
 * @param containerId - The ID of the container to scroll.
 * @param options - Scroll options including top, left, and behavior.
 */
export const scrollToPosition = (
  containerId: string,
  options: ScrollToOptions = { top: 0, behavior: "smooth" },
): void => {
  const container = document.getElementById(containerId);
  if (!container) {
    console.warn(`Container with id "${containerId}" not found.`);
    return;
  }

  container.scrollTo(options);
};

// Convenience functions
export const scrollToTop = (containerId: string): void =>
  scrollToPosition(containerId, { top: 0, behavior: "smooth" });

export const scrollToBottom = (containerId: string): void => {
  const container = document.getElementById(containerId);
  if (container) {
    scrollToPosition(containerId, {
      top: container.scrollHeight,
      behavior: "smooth",
    });
  }
};

export function extractCSS(cssString: string) {
  // Update regex to match kebab-case properties and their values
  const regex = /([\w-]+)\s*:\s*([^;]+);/g;
  const cssObject = {};
  let match;

  // Iterate over all matches and populate the cssObject
  while ((match = regex.exec(cssString)) !== null) {
    const property = match[1].trim();
    const value = match[2].trim();
    //@ts-ignore
    cssObject[property] = value.replace(/"/g, ""); // Remove quotes
  }

  return cssObject as CSSProperties;
}
