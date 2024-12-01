// store/useEditorStore.ts
import type { z } from "zod";
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import type {
  EditorState,
  TransitionType,
} from "~/types/code-transition-editor.store.types";

const defaultMdx = `# Promise.all Polyfill Implementation

## !!steps example-1
!duration 180
!transition magic
!fontUtils 

\`\`\`js ! Example 1: All promises resolve

const promise1 = Promise.resolve(3);
const promise2 = 42;
const promise3 = new Promise((resolve) => setTimeout(resolve, 100, 'foo'));

Promise.all([promise1, promise2, promise3])
    .then((values) => {
        console.log(values); // Output: [3, 42, 'foo']
    })
    .catch((error) => {
        console.error(error);
    });
    

\`\`\``;

export const transitionDurations: Record<
  z.infer<typeof TransitionType>,
  number
> = {
  magic: 0, // example duration, adjust as needed
  wipe: 45, // example duration, adjust as needed
  slide: 45, // example duration, adjust as needed
  none: 0, // assuming 'none' means no transition
  fade: 45,
  // add other transitions if needed
};
export const useCTEditorStore = create<EditorState>()(
  immer((set) => ({
    bgStyles: {
      background: "linear-gradient(to right, #10B981, #059669, #0D9488)",
      border: "1px solid #000",
    },
    slideStyles: {
      inset: "2.5rem",
      height: "auto",
      width: "auto",
      overflow: "hidden",
      borderRadius: "0.75rem",
      border: "2px solid #4B5563",
      background: "#030712",
      boxShadow: "0 25px 50px -12px rgb(0 0 0 / 0.25)",
    },
    setBgStyles: (styles) =>
      set((state) => {
        state.bgStyles = styles;
      }),
    setSlideStyles: (styles) =>
      set((state) => {
        state.slideStyles = styles;
      }),
    content: defaultMdx,
    duration: 300,
    steps: [],
    loading: false,
    error: null,
    setContent: (content) =>
      set((state) => {
        state.content = content;
      }),
    setSteps: (steps) =>
      set((state) => {
        state.steps = steps;
        state.duration = steps.reduce(
          (acc, step) =>
            acc + step.duration - transitionDurations[step.transition],
          0,
        );
      }),
    /*    setDuration: (duration) =>
      set((state) => {
       
        state.duration = state.steps.reduce(
          (acc, step) =>
            acc + step.duration - transitionDurations[step.transition],
          0,
        );
      }), */
    setLoading: (loading) =>
      set((state) => {
        state.loading = loading;
      }),
    setError: (error) =>
      set((state) => {
        state.error = error;
      }),
  })),
);
