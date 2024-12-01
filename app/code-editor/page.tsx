"use client";

import { Editor as MonacoEditor, type OnMount } from "@monaco-editor/react";
import { TooltipProvider } from "@radix-ui/react-tooltip";
import { Player, type PlayerRef } from "@remotion/player";
import { useRef } from "react";
import { errorFallbackVideoPlayer } from "~/components/layout/editor-new/video-and-timeline";
import { Card } from "~/components/ui/card";
import { PlayerFullscreen } from "~/components/video-timeline/player-controls/full-screen";
import { MuteButton } from "~/components/video-timeline/player-controls/mute";
import { PlayPauseButton } from "~/components/video-timeline/player-controls/play-pause-button";
import { SeekBar } from "~/components/video-timeline/player-controls/seek-bar";
import TimeDisplay from "~/components/video-timeline/player-controls/time-display";
import { useMdxProcessor } from "~/hooks/use-mdx-processor";
import { useCTEditorStore } from "~/store/code-transition-editor.store";
import CodeTransitionComposition from "~/video/compositions/code-transition.composition";
import ProjectHeader from "./project-header";
import { generateCodeHikeMark } from "./utils";

const compositionMetaData = {
  fps: 60,
  height: 1080,
  width: 1920,
};
const EditorPage = () => {
  const { content, setContent, loading, error, steps, duration } =
    useCTEditorStore();
  console.log("steps", steps, "duration", duration);

  useMdxProcessor();
  const playerRef = useRef<PlayerRef>(null);

  const handleEditorMount: OnMount = (editor, monaco) => {
    monaco.editor.defineTheme("customDarkTheme", {
      base: "vs-dark",
      inherit: true,
      rules: [],
      colors: {
        "editor.background": "#000000",
        "editorCursor.foreground": "#ffffff",
        "editor.lineHighlightBackground": "#1a1a1a",
        "editorLineNumber.foreground": "#666666",
        "editorLineNumber.activeForeground": "#ffffff",
        "editor.selectionBackground": "#264f78",
        "editor.inactiveSelectionBackground": "#3a3d41",
        "editorIndentGuide.background": "#404040",
        "editorIndentGuide.activeBackground": "#707070",
      },
    });
    editor.updateOptions({
      // Font settings
      fontFamily: "'Fira Code', 'JetBrains Mono', monospace",
      fontLigatures: true,
      fontSize: 14,
      lineHeight: 24,

      // Editor behavior
      cursorBlinking: "smooth",
      cursorSmoothCaretAnimation: "on",
      smoothScrolling: true,
      cursorStyle: "line",

      // Layout
      padding: { top: 16 },
      minimap: { enabled: false },
      scrollBeyondLastLine: false,
      folding: true,

      // Editing helpers
      snippetSuggestions: "top",
      suggestSelection: "first",
      tabCompletion: "on",
      wordWrap: "on",

      // Visual guides
      renderWhitespace: "selection",
      guides: {
        bracketPairs: true,
        indentation: true,
        highlightActiveIndentation: true,
      },
      bracketPairColorization: {
        enabled: true,
      },
    });

    monaco.languages.registerHoverProvider("markdown", {
      provideHover: (model, position) => {
        const line = model.getLineContent(position.lineNumber);
        const stepsMatch = line.match(/## !!steps (.+)/);

        if (stepsMatch) {
          return {
            contents: [
              { value: `🎬 Step Name: ${stepsMatch[1]}` },
              { value: "This defines a new CodeHike step section" },
            ],
          };
        }
      },
    });

    // const updateStepDecorations = () => {
    //   const model = editor.getModel();
    //   if (!model) return;

    //   const decorations = [];
    //   let isInStepSection = false;
    //   let sectionStart = 0;

    //   for (let i = 1; i <= model.getLineCount(); i++) {
    //     const line = model.getLineContent(i);

    //     if (line.match(/## !!steps/)) {
    //       isInStepSection = true;
    //       sectionStart = i;
    //     } else if (isInStepSection && line.startsWith("##")) {
    //       // End of section
    //       decorations.push({
    //         range: new monaco.Range(sectionStart, 1, i - 1, 1),
    //         options: {
    //           isWholeLine: true,
    //           className: "step-section",
    //           linesDecorationsClassName: "step-section-border",
    //         },
    //       });
    //       isInStepSection = false;
    //     }
    //   }

    //   // Handle case when section extends to end of file
    //   if (isInStepSection) {
    //     decorations.push({
    //       range: new monaco.Range(sectionStart, 1, model.getLineCount(), 1),
    //       options: {
    //         isWholeLine: true,
    //         className: "step-section",
    //         linesDecorationsClassName: "step-section-border",
    //       },
    //     });
    //   }

    //   editor.createDecorationsCollection(decorations);
    // };

    // // Update decorations on content change
    // editor.onDidChangeModelContent(() => {
    //   updateStepDecorations();
    // });
    // updateStepDecorations();

    // monaco.languages.registerDocumentSymbolProvider("markdown", {
    //   provideDocumentSymbols: (model) => {
    //     const symbols = [];

    //     for (let i = 1; i <= model.getLineCount(); i++) {
    //       const line = model.getLineContent(i);
    //       const match = line.match(/## !!steps (.+)/);
    //       if (match) {
    //         symbols.push({
    //           name: match[1],
    //           detail: "Step",
    //           kind: monaco.languages.SymbolKind.Class,
    //           range: {
    //             startLineNumber: i,
    //             startColumn: 1,
    //             endLineNumber: i,
    //             endColumn: line.length,
    //           },
    //           selectionRange: {
    //             startLineNumber: i,
    //             startColumn: 1,
    //             endLineNumber: i,
    //             endColumn: line.length,
    //           },
    //         });
    //       }
    //     }

    //     return symbols;
    //   },
    // });

    // const decorations = editor.deltaDecorations(
    //   [],
    //   steps.map((step) => ({
    //     range: new monaco.Range(step.line, 1, step.line, 1),
    //     options: {
    //       isWholeLine: true,
    //       minimap: {
    //         color: "#ffcc00",
    //         position: monaco.editor.MinimapPosition.Inline,
    //       },
    //     },
    //   })),
    // );
    // Register folding provider
    monaco.languages.registerFoldingRangeProvider("markdown", {
      provideFoldingRanges: (model) => {
        const ranges = [];
        let stepStart = -1;

        for (let i = 1; i <= model.getLineCount(); i++) {
          const line = model.getLineContent(i);

          if (line.match(/## !!steps .+/)) {
            if (stepStart !== -1) {
              // End previous step
              ranges.push({
                start: stepStart,
                end: i - 1,
                kind: monaco.languages.FoldingRangeKind.Region,
              });
            }
            stepStart = i;
          }

          // If we're at last line and have an open step
          if (i === model.getLineCount() && stepStart !== -1) {
            ranges.push({
              start: stepStart,
              end: i,
              kind: monaco.languages.FoldingRangeKind.Region,
            });
          }
        }

        return ranges;
      },
    });
    monaco.editor.setTheme("customDarkTheme");

    editor.addAction({
      id: "add-mark",
      label: "Add Mark",
      contextMenuGroupId: "modification",
      run: () => {
        const selections = editor.getSelections();
        if (!selections || selections.length === 0) return;

        const model = editor.getModel();
        if (!model) return;

        // Handle single selection
        const selection = selections[0];
        const markText = generateCodeHikeMark({
          startLine: selection.startLineNumber,
          endLine: selection.endLineNumber,
          startColumn: selection.startColumn,
          endColumn: selection.endColumn,
        });

        model.pushEditOperations(
          [],
          [
            {
              range: new monaco.Range(
                selection.startLineNumber,
                1,
                selection.startLineNumber,
                1,
              ),
              text: markText,
            },
          ],
          () => null,
        );
      },
    });

    editor.addAction({
      id: "add-callout",
      label: "Add Callout",
      contextMenuGroupId: "modification",
      contextMenuOrder: 2,
      run: () => {
        const selection = editor.getSelection();
        const model = editor.getModel();
        if (!selection || !model) return;

        const selectedText = model.getValueInRange(selection);

        // Only proceed if it's a single word (no spaces or newlines)
        if (selectedText.includes(" ") || selectedText.includes("\n")) {
          return;
        }

        // Add callout comment above the line
        const calloutText = `// !callout[/${selectedText}/] This is a callout`;
        model.pushEditOperations(
          [],
          [
            {
              range: new monaco.Range(
                selection.startLineNumber,
                1,
                selection.startLineNumber,
                1,
              ),
              text: calloutText + "\n",
            },
          ],
          () => null,
        );
      },

      // Use keybinding context syntax
      precondition: "editorHasSelection && !editorHasMultipleSelections",
    });

    // editor.addAction({
    //   id: "codehike-mark-menu",
    //   label: "Add CodeHike Mark",
    //   contextMenuGroupId: "navigation",
    //   contextMenuOrder: 1.5,
    //   run: () => {}, // Parent doesn't need run action
    // });

    // Register submenu items
    // monaco.editor.MenuRegistry.appendMenuItem("codehike-mark-menu", {
    //   submenu: [
    //     {
    //       id: "basic",
    //       label: "Basic Mark",
    //       run: handleBasicMark,
    //     },
    //     {
    //       id: "duration",
    //       label: "With Duration",
    //       run: handleDurationMark,
    //     },
    //     {
    //       id: "color",
    //       label: "With Color",
    //       run: handleColorMark,
    //     },
    //     {
    //       id: "custom",
    //       label: "Custom...",
    //       run: handleCustomMark,
    //     },
    //   ],
    // });

    // editor.addAction({
    //   id: "codehike-mark-basic",
    //   label: "Basic Mark",
    //   contextMenuGroupId: "codehike",
    //   contextMenuOrder: 1,
    //   run: () => {}, // Your existing mark logic
    // });

    // editor.addAction({
    //   id: "codehike-mark-duration",
    //   label: "With Duration",
    //   contextMenuGroupId: "codehike",
    //   contextMenuOrder: 2,
    //   run: () => {
    //     // Add mark with default duration
    //     // Example: // !mark[29:200] 30
    //   },
    // });

    // editor.addAction({
    //   id: "codehike-mark-color",
    //   label: "With Color",
    //   contextMenuGroupId: "codehike",
    //   contextMenuOrder: 3,
    //   run: () => {
    //     // Add mark with default color
    //     // Example: // !mark[29:200] red
    //   },
    // });

    // editor.addAction({
    //   id: "codehike-mark-custom",
    //   label: "Custom...",
    //   contextMenuGroupId: "codehike",
    //   contextMenuOrder: 4,
    //   run: () => {
    //     // TODO: Show modal/dialog for custom options
    //   },
    // });

    // Remove existing context menu items
    editor.createContextKey("removeDefaultItems", true);
    editor.addCommand(monaco.KeyCode.ContextMenu, () => {
      // Custom context menu behavior
    });
  };

  return (
    <div className="flex h-screen gap-4 p-4">
      <Card className="h-full w-[45%] overflow-hidden">
        <MonacoEditor
          height="100%"
          defaultLanguage="markdown"
          theme="vs-dark"
          value={content}
          onChange={(value) => setContent(value || "")}
          onMount={handleEditorMount}
          options={{
            automaticLayout: true,
            padding: { top: 16 },
            minimap: { enabled: false },
            fontSize: 14,
            lineNumbers: "off",
            wordWrap: "on",
          }}
        />
      </Card>

      <Card className="h-full w-[55%] overflow-auto">
        <ProjectHeader />
        {/* <div className="h-96 border"></div> */}
        <div
          className="editorBg"
          style={{
            aspectRatio: `${compositionMetaData.width} / ${compositionMetaData.height}`,
          }}
        >
          {/* {loading && <div className="text-gray-500">Processing...</div>}
          {error && (
            <div className="whitespace-pre-wrap font-mono text-red-500">
              {error}
            </div>
          )} */}

          <Player
            component={CodeTransitionComposition}
            durationInFrames={duration}
            fps={compositionMetaData.fps}
            compositionHeight={compositionMetaData.height}
            compositionWidth={compositionMetaData.width}
            style={{
              width: "100%",
              height: "100%",
            }}
            className=""
            loop
            initiallyMuted
            overflowVisible
            inputProps={{
              steps,
            }}
            errorFallback={errorFallbackVideoPlayer}
            ref={playerRef}
          />

          {/* {steps.length > 0 && (
            <pre className="whitespace-pre-wrap">
              {JSON.stringify(steps, null, 2)}
            </pre>
          )} */}
        </div>
        <TooltipProvider>
          <section className="flex w-full flex-col gap-1 border-b p-1">
            <div className="flex w-full items-center justify-between">
              <div className="flex items-center space-x-3">
                <PlayPauseButton playerRef={playerRef} />
                <TimeDisplay
                  playerRef={playerRef}
                  fps={compositionMetaData.fps}
                  durationInFrames={duration}
                />
                <MuteButton playerRef={playerRef} />
              </div>
              {/* <VolumeSlider playerRef={playerRef} /> */}
              <div>
                <PlayerFullscreen playerRef={playerRef} />
              </div>
            </div>
            <div className="px-2">
              <SeekBar durationInFrames={duration} playerRef={playerRef} />
            </div>
          </section>
        </TooltipProvider>

        {/* <StylesEditor /> */}
      </Card>
    </div>
  );
};

export default EditorPage;
