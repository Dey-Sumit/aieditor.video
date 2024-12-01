import { compile, run } from "@mdx-js/mdx";
import { Block, HighlightedCodeBlock, parseRoot } from "codehike/blocks";
import {
  recmaCodeHike,
  remarkCodeHike,
  type CodeHikeConfig,
} from "codehike/mdx";
import { useEffect } from "react";
import { z } from "zod";
import { useCTEditorStore } from "~/store/code-transition-editor.store";
import { TransitionType } from "~/types/code-transition-editor.store.types";

const chConfig: CodeHikeConfig = {
  syntaxHighlighting: {
    theme: "github-dark",
  },
};

export const useMdxProcessor = () => {
  const { content, setSteps, setLoading, setError } = useCTEditorStore();

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
        // First try to compile the MDX
        const { content: compiledContent, error: compileError } =
          await compileAndRun(content);

        if (compileError) throw new Error(compileError);

        // Then try to parse the compiled content
        let parsedSteps;
        try {
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
          parsedSteps = steps;
          console.log("successfully parsed steps", steps);
        } catch (parseError) {
          // If there's a parsing error, throw it to be caught by the outer try-catch
          throw new Error(`Parsing error: ${parseError.message}`);
        }

        // Only update states if we have valid parsed steps and the effect hasn't been cancelled
        if (!cancelled && currentEffectId === effectId && parsedSteps) {
          setSteps(parsedSteps);
          setError(null);
        }
      } catch (err) {
        if (!cancelled && currentEffectId === effectId) {
          // Only set the error message, don't clear the steps
          setError(err.message);
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
