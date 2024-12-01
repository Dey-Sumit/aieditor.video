import { HighlightedCodeBlock } from "codehike/blocks";
import type { CodeAnnotation, Token } from "codehike/code";
import type { CSSProperties } from "react";
import { z } from "zod";

export const TransitionType = z.enum([
  "magic",
  "fade",
  "slide",
  "wipe",
  "none",
]);
export type TransitionType = z.infer<typeof TransitionType>;

export interface Step {
  code: {
    code: string;
    meta: string;
    style: CSSProperties;
    value: string;
    lang: string;
    tokens: (string | Token)[];
    annotations: CodeAnnotation[];
    themeName: string;
  };
  duration: number;
  fontUtils?: string;
  transition: TransitionType;
}

export interface EditorState {
  content: string;
  steps: Step[];
  loading: boolean;
  error: string | null;
  setContent: (content: string) => void;
  setSteps: (steps: Step[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  duration: number;

  bgStyles: CSSProperties;
  slideStyles: CSSProperties;
  setBgStyles: (styles: CSSProperties) => void;
  setSlideStyles: (styles: CSSProperties) => void;
  // setDuration: (duration: number) => void;
}

export interface CodeTransitionCompositionProps {
  steps: EditorState["steps"];
}

export const CodeTransitionCompositionPropsSchema = z.object({
  steps: z.array(
    z.object({
      code: HighlightedCodeBlock,
      duration: z.number(),
      fontUtils: z.string().optional(),
      transition: TransitionType,
    }),
  ),
});
