import { Editor, type OnMount } from "@monaco-editor/react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { useCTEditorStore } from "~/store/code-transition-editor.store";
const StylesEditor = () => {
  const { bgStyles, slideStyles, setBgStyles, setSlideStyles } =
    useCTEditorStore();

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
  };
  return (
    <Tabs defaultValue="background" className="w-full">
      <TabsList>
        <TabsTrigger value="background">Background</TabsTrigger>
        <TabsTrigger value="slide">Slide</TabsTrigger>
      </TabsList>

      <TabsContent value="background">
        <Editor
          theme="vs-dark"
          height="200px"
          //defaultLanguage="typescript"

          value={JSON.stringify(bgStyles, null, 2)}
          onMount={handleEditorMount}
          // onChange={(value) => {
          //   try {
          //     setBgStyles(JSON.parse(value || "{}"));
          //   } catch (e) {}
          // }}
          beforeMount={(monaco) => {
            // Add React CSS Properties suggestions
            monaco.languages.typescript.javascriptDefaults.setCompilerOptions({
              jsx: monaco.languages.typescript.JsxEmit.React,
              target: monaco.languages.typescript.ScriptTarget.ESNext,
            });

            // Add type definitions
            monaco.languages.typescript.javascriptDefaults.addExtraLib(
              `
              interface CSSProperties {
                background?: string;
                border?: string;
                borderRadius?: string;
                boxShadow?: string;
                color?: string;
                // Add more CSS properties
                [key: string]: string | undefined;
              }
            `,
              "css-types.d.ts",
            );
          }}
          options={{
            minimap: { enabled: false },
            lineNumbers: "off",
            fontSize: 14,
            suggest: {
              showProperties: true,
            },
          }}
        />
      </TabsContent>

      {/* <TabsContent value="slide">
        <Editor
          height="200px"
          defaultLanguage="typescript"
          path="slide-styles.ts" // Unique path
          value={JSON.stringify(slideStyles, null, 2)}
          onChange={(value) => {
            try {
              setSlideStyles(JSON.parse(value || "{}"));
            } catch (e) {}
          }}
          beforeMount={(monaco) => {
            // Same setup for slide editor
            // ... typescript setup code
          }}
          options={{
            minimap: { enabled: false },
            lineNumbers: "off",
            fontSize: 14,
            suggest: {
              showProperties: true,
            },
          }}
        />
      </TabsContent> */}
    </Tabs>
  );
};

export default StylesEditor;
