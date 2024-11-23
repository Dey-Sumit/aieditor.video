// store/useEditorStore.ts
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import type { EditorState } from "~/types/code-transition-editor.store.types";

const defaultMdx = `# Promise.all Polyfill Implementation

## !!steps example-1
!duration 180
!transition magic
!fontUtils 

\`\`\`javascript ! Example 1: All promises resolve
const promise1 = Promise.resolve(3);
const promise2 = 42;
const promise3 = new Promise((resolve) => setTimeout(resolve, 100, 'foo'));

Promise.all([promise1, promise2, promise3])
    .then((values) => {
        // !mark[29:200] 75 30
        console.log(values); // Output: [3, 42, 'foo']
    })
    .catch((error) => {
        console.error(error);
    });
\`\`\``;

export const useEditorStore = create<EditorState>()(
  immer((set) => ({
    content: defaultMdx,
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
      }),
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
