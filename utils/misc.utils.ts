import { v4 as uuid } from "uuid";
import { ContentType } from "~/types/timeline.types";

type SequencePrefix = ["s", ContentType];
type PresetPrefix = ["p", "preset"];
type TransitionPrefix = ["t", "slide" | "fade" | "wipe" | "dissolve" | string];
type Prefix = SequencePrefix | TransitionPrefix | PresetPrefix;

export const genId = (...prefixes: Prefix): string => {
  return `${prefixes.join("-")}-${uuid()}`;
};
