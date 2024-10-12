"use client";
import Editor, { OnMount } from "@monaco-editor/react";
import * as monaco from "monaco-editor";
import React, { useRef } from "react";

const MonacoCSSEditorPOC: React.FC = () => {
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);
  const fixedCSSStructure = `#container {
  /* Write your styles here */

}`;

  const handleEditorDidMount: OnMount = (editor, monacoInstance) => {
    editorRef.current = editor;

    // Set the theme to a dark theme
    monacoInstance.editor.setTheme("vs-dark");

    // Configure the CSS language with linting
    monacoInstance.languages.css.cssDefaults.setOptions({
      validate: true,
      lint: {
        // ... (keep the same linting options as before)
      },
    });

    const model = editor.getModel();
    if (model) {
      // Function to update read-only decorations
      const updateDecorations = () => {
        const lines = model.getLinesContent();
        editor.createDecorationsCollection([
          {
            range: new monacoInstance.Range(1, 1, 1, Infinity),
            options: { inlineClassName: "readonly-line", readOnly: true },
          },
          {
            range: new monacoInstance.Range(
              lines.length,
              1,
              lines.length,
              Infinity,
            ),
            options: { inlineClassName: "readonly-line", readOnly: true },
          },
        ]);
      };

      updateDecorations();
      // Add custom undo/redo commands
      editor.addCommand(
        monacoInstance.KeyMod.CtrlCmd | monacoInstance.KeyCode.KeyZ,
        () => {
          editor.trigger("keyboard", "undo", null);
        },
      );

      editor.addCommand(
        monacoInstance.KeyMod.CtrlCmd |
          monacoInstance.KeyMod.Shift |
          monacoInstance.KeyCode.KeyZ,
        () => {
          editor.trigger("keyboard", "redo", null);
        },
      );

      // Ensure the structure is always preserved
      editor.onDidChangeModelContent(() => {
        const currentContent = editor.getValue();
        const lines = currentContent.split("\n");

        if (lines[0] !== "#container {" || lines[lines.length - 1] !== "}") {
          const middleContent = lines.slice(1, -1).join("\n");
          editor.setValue(`#container {\n${middleContent}\n}`);
          updateDecorations();
        }
      });

      // Prevent editing of the first and last lines
      editor.onKeyDown((e) => {
        const selection = editor.getSelection();
        if (selection) {
          const lines = model.getLinesContent();
          if (
            selection.startLineNumber === 1 ||
            selection.endLineNumber === lines.length
          ) {
            e.preventDefault();
          }
        }
      });

      // Configure context menu
      editor.onContextMenu((e) => {
        const contribution = editor.getContribution(
          "editor.contrib.contextmenu",
        );
        if (contribution) {
          const actions = contribution.getMenuActions();
          // Filter or modify actions here
          const filteredActions = actions.filter(
            (action) =>
              ![
                "editor.action.changeAll",
                "editor.action.blockComment",
              ].includes(action.id),
          );
          contribution.show(e.event, filteredActions);
        }
      });
    }
  };

  const handleSubmit = () => {
    if (editorRef.current) {
      const css = editorRef.current.getValue();
      console.log("Submitted CSS:", css);
      // Here you would typically send this data to your application state or backend
    }
  };

  return (
    <div className="container mx-auto bg-gray-800 p-4 text-white">
      <h1 className="mb-4 text-2xl font-bold">CSS Editor POC</h1>
      <div className="mb-4 border border-gray-600" style={{ height: "400px" }}>
        <Editor
          height="100%"
          defaultLanguage="css"
          defaultValue={fixedCSSStructure}
          onMount={handleEditorDidMount}
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            lineNumbers: "off",
            scrollBeyondLastLine: false,
            renderLineHighlight: "none",
            hideCursorInOverviewRuler: true,
            overviewRulerLanes: 0,
            contextmenu: true,
          }}
        />
      </div>
      <button
        onClick={handleSubmit}
        className="rounded bg-blue-600 px-4 py-2 font-bold text-white hover:bg-blue-700"
      >
        Submit CSS
      </button>
    </div>
  );
};

export default MonacoCSSEditorPOC;
