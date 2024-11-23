import { HighlightedCodeBlock } from "codehike/blocks";
import { z } from "zod";

export const TransitionType = z.enum(["magic", "fade", "slide"]);
export type TransitionType = z.infer<typeof TransitionType>;

export interface Step {
  code: typeof HighlightedCodeBlock;
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
}
