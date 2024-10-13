"use client";

import { Editor, type OnMount } from "@monaco-editor/react";
import * as monaco from "monaco-editor";
import { useEffect, useRef, useState } from "react";
import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { extractCSS } from "~/lib/utils";
import { useEditingStore } from "~/store/editing.store";
import useVideoStore from "~/store/video.store";
import type { ImageEditablePropsType } from "~/types/timeline.types";

const SequenceItemEditorImage = () => {
  const updateImageEditableProps = useVideoStore(
    (store) => store.updateImageEditableProps,
  );
  const activeSeqItemLite = useEditingStore((state) => state.activeSeqItem!);
  const sequenceItems = useVideoStore((store) => store.props.sequenceItems);
  const activeSequenceItem = sequenceItems[activeSeqItemLite.itemId]
    .editableProps as ImageEditablePropsType;

  const [imageCssEditorContent, setImageCssEditorContent] = useState("");

  useEffect(() => {
    console.log("useEffect runs");

    if (activeSequenceItem?.styles?.element) {
      const cssString = Object.entries(activeSequenceItem.styles.element)
        .map(([key, value]) => `  ${key}: ${value};`)
        .join("\n");
      console.log({ cssString });

      setImageCssEditorContent(`image {\n${cssString}\n}`);
    } else {
      setImageCssEditorContent(
        "image {\n  /* Write your image styles here */\n}",
      );
    }
  }, [activeSequenceItem]);
  console.log({ imageCssEditorContent });

  const handleSave = () => {
    if (editorRef.current) {
      const css = editorRef.current.getValue();
      console.log("Submitted CSS:", css);
      const styles = extractCSS(css);
      console.log("Extracted styles:", styles);

      updateImageEditableProps(
        activeSeqItemLite.layerId,
        activeSeqItemLite.itemId,
        {
          styles: {
            ...activeSequenceItem.styles,
            element: styles,
          },
          imageUrl: activeSequenceItem.imageUrl,
        },
      );
      // Here you would typically send this data to your application state or backend
    }
  };

  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);
  const fixedCSSStructure = `image {


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

        compatibleVendorPrefixes: "warning",
        vendorPrefix: "warning",
        duplicateProperties: "warning",
        emptyRules: "ignore",
        importStatement: "warning",
        boxModel: "warning",
        universalSelector: "warning",
        zeroUnits: "warning",
        fontFaceProperties: "warning",
        hexColorLength: "error",
        argumentsInColorFunction: "error",
        unknownProperties: "error",
        ieHack: "ignore",
        unknownVendorSpecificProperties: "ignore",
        propertyIgnoredDueToDisplay: "warning",
        important: "ignore",
        float: "ignore",
        idSelector: "ignore",
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

        if (lines[0] !== "image {" || lines[lines.length - 1] !== "}") {
          const middleContent = lines.slice(1, -1).join("\n");
          editor.setValue(`image {\n${middleContent}\n}`);
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
    }
  };

  return (
    <div>
      <div className="sticky inset-x-0 top-0 flex h-12 items-center justify-end gap-2 p-2">
        <Button variant="outline" size="sm">
          Cancel
        </Button>
        <Button size="sm" variant="secondary" onClick={handleSave}>
          Save
        </Button>
      </div>

      <div className="h-96 p-2">
        <Tabs defaultValue="image" className="mx-auto w-full max-w-3xl">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="image">Image CSS</TabsTrigger>
            <TabsTrigger value="container">Container CSS</TabsTrigger>
            <TabsTrigger value="overlay">Overlay CSS</TabsTrigger>
          </TabsList>
          <TabsContent value="image">
            <Card className="h-96 overflow-hidden">
              <CardContent className="h-full p-0">
                <Editor
                  className="relative h-full w-full rounded-md border-2"
                  height="100%"
                  defaultLanguage="css"
                  value={imageCssEditorContent}
                  defaultValue={fixedCSSStructure}
                  onMount={handleEditorDidMount}
                  options={{
                    minimap: { enabled: false },
                    fontSize: 16,
                    lineNumbers: "off",
                    lineHeight: 22,
                    padding: {
                      top: 16,
                      bottom: 16,
                    },
                    fontFamily:
                      "'Fira Code', 'Consolas', 'Courier New', monospace",
                    fontLigatures: true, // Enable this if you're using a font with ligatures like Fira Code
                    renderLineHighlight: "none",
                    scrollbar: {
                      vertical: "hidden",
                      horizontal: "hidden",
                    },
                    overviewRulerLanes: 0,
                    hideCursorInOverviewRuler: true,
                    scrollBeyondLastLine: false,
                  }}
                />
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="container">
            <Card className="h-96">
              <CardContent></CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="overlay">
            <Card className="h-96">
              <CardContent></CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default SequenceItemEditorImage;
