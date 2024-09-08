import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { v4 as uuid } from "uuid";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

type SequencePrefix = ["s", "audio" | "video" | "text" | "image"];
type TransitionPrefix = ["t", "slide" | "fade" | "wipe" | "dissolve" | string];
type ProjectPrefix = ["p"];
type Prefix = SequencePrefix | TransitionPrefix | ProjectPrefix;

export const genId = (...prefixes: Prefix): string => {
  return `${prefixes.join("-")}-${uuid()}`;
};
