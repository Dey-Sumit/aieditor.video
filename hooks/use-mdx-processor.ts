// hooks/useMdxProcessor.ts
import { compile, run } from "@mdx-js/mdx";
import { Block, HighlightedCodeBlock, parseRoot } from "codehike/blocks";
import {
  recmaCodeHike,
  remarkCodeHike,
  type CodeHikeConfig,
} from "codehike/mdx";
import { useEffect } from "react";
import { z } from "zod";
import { useEditorStore } from "~/store/code-transition-editor.store";
import { TransitionType } from "~/types/code-transition-editor.store.types";

const chConfig: CodeHikeConfig = {
  syntaxHighlighting: {
    theme: "github-dark",
  },
};

export const useMdxProcessor = () => {
  const { content, setSteps, setLoading, setError } = useEditorStore();

  useEffect(() => {
    let cancelled = false;
    let effectId = 0;
    const currentEffectId = effectId;

    const compileAndRun = async (mdxContent: string) => {
      try {
        const runtime = await import("react/jsx-runtime");
        const compiled = await compile(mdxContent, {
          outputFormat: "function-body",
          remarkPlugins: [[remarkCodeHike, chConfig]],
          recmaPlugins: [[recmaCodeHike, chConfig]],
        });
        console.log("compiled", compiled);

        const result = await run(String(compiled), runtime);

        return { content: result.default, error: undefined };
      } catch (e) {
        return { content: undefined, error: e.message };
      }
    };

    const processContent = async () => {
      if (!content) return;

      setLoading(true);
      try {
        const { content: compiledContent, error } =
          await compileAndRun(content);

        if (error) throw new Error(error);
        console.log("compiledContent", compiledContent);

        const { steps } = parseRoot(
          compiledContent!,
          Block.extend({
            steps: z.array(
              Block.extend({
                code: HighlightedCodeBlock,
                duration: z.string().transform((v) => parseInt(v, 10)),
                fontUtils: z.string().optional(),
                transition: TransitionType,
              }),
            ),
          }),
        );

        if (!cancelled && currentEffectId === effectId) {
          setSteps(steps);
          setError(null);
        }
      } catch (err) {
        if (!cancelled && currentEffectId === effectId) {
          setError(err.message);
          setSteps([]);
        }
      } finally {
        if (!cancelled && currentEffectId === effectId) {
          setLoading(false);
        }
      }
    };

    const debounceTimer = setTimeout(processContent, 500);

    return () => {
      cancelled = true;
      effectId++;
      clearTimeout(debounceTimer);
    };
  }, [content, setSteps, setLoading, setError]);
};
