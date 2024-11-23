"use client";

import { compile, run } from "@mdx-js/mdx";
import { Block, HighlightedCodeBlock, parseRoot } from "codehike/blocks";
import {
  type CodeHikeConfig,
  recmaCodeHike,
  remarkCodeHike,
} from "codehike/mdx";
import { useEffect, useState } from "react";
import * as runtime from "react/jsx-runtime";
import { z } from "zod";
import { Card } from "~/components/ui/card";
const TransitionType = z.enum(["magic", "fade", "wipe", "slide", "none"]);

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

// CodeHike configuration
const chConfig: CodeHikeConfig = {
  syntaxHighlighting: { theme: "github-dark" },
};

const compileAndRun = async (mdxContent: string) => {
  try {
    const compiled = await compile(mdxContent, {
      outputFormat: "function-body",
      remarkPlugins: [[remarkCodeHike, chConfig]],
      recmaPlugins: [[recmaCodeHike, chConfig]],
    });
    console.log({ compiled });

    const result = await run(String(compiled), runtime);
    return { content: result.default, error: undefined };
  } catch (e) {
    console.log("caught error", e);

    return { content: undefined, error: e.message };
  }
};

const LiveEditor = () => {
  const [mdxContent, setMdxContent] = useState(defaultMdx);
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;
    let effectId = 0;
    const currentEffectId = effectId;

    const processContent = async () => {
      setLoading(true);
      try {
        const { content, error } = await compileAndRun(mdxContent);
        console.log("content", content);

        const { steps } = parseRoot(
          content!,
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
        console.log({ steps });

        // if (!cancelled && currentEffectId === effectId) {
        //   if (error) {
        //     setError(error);
        //     setPreview(null);
        //   } else {
        //     setPreview(content);
        //     setError(null);
        //   }
        // }
      } catch (err) {
        if (!cancelled && currentEffectId === effectId) {
          setError(err.message);
          setPreview(null);
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
  }, [mdxContent]);

  return (
    <div className="flex h-screen gap-4 p-4">
      {/* Editor Panel */}
      <Card className="h-full w-1/2 overflow-hidden">
        <textarea
          className="h-full w-full resize-none p-4 font-mono text-sm focus:outline-none"
          value={mdxContent}
          onChange={(e) => setMdxContent(e.target.value)}
          placeholder="Write your MDX here..."
        />
      </Card>

      {/* Preview Panel */}
      <Card className="h-full w-1/2 overflow-auto">
        <div className="p-4">
          {loading && <div className="text-gray-500">Compiling MDX...</div>}
          {error && (
            <div className="whitespace-pre-wrap font-mono text-red-500">
              {error}
            </div>
          )}
          {preview && (
            <div className="prose max-w-none dark:prose-invert">{preview}</div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default LiveEditor;
