"use client";

import { useEffect, useState } from "react";
import Editor from "~/components/editor/advanced-editor";
// import Editor from "~/components/novel/editor/advanced-editor";
// import { htmlStringWithBg } from "~/components/novel/page";
import { Button } from "~/components/ui/button";
import { useEditingStore } from "~/store/editing.store";
import useVideoStore from "~/store/video.store";
import type { TextEditablePropsType } from "~/types/timeline.types";

const SequenceItemEditorText = () => {
  const updateTextEditableProps = useVideoStore(
    (store) => store.updateTextEditableProps,
  );
  const activeSeqItemLite = useEditingStore((state) => state.activeSeqItem!);
  const sequenceItems = useVideoStore((store) => store.props.sequenceItems);
  const activeSequenceItem = sequenceItems[activeSeqItemLite.itemId]
    .editableProps as TextEditablePropsType;

  const [editorContent, setEditorContent] = useState(
    activeSequenceItem?.text || "",
  );
  const handleSave = () => {
    updateTextEditableProps(
      activeSeqItemLite.layerId,
      activeSeqItemLite.itemId,
      { text: editorContent },
    );
  };

  // const handleEditorUpdate = () => {
  //   setEditorContent(editor.getJSON());
  // };
  // const handleEditorUpdate: ComponentProps<
  //   typeof EditorContent
  // >["onUpdate"] = ({ editor, transaction }) => {
  //   setEditorContent(editor.getJSON());
  // };

  useEffect(() => {
    if (activeSeqItemLite) {
      // TODO : FIX THIS
      // @ts-ignore : fix this
      setEditorContent(activeSequenceItem.editableProps?.text || "");
    }
  }, [
    activeSeqItemLite,

    // TODO : FIX THIS
    // @ts-ignore : fix this
    activeSequenceItem.editableProps?.text,
  ]);

  return (
    <>
      <div className="sticky inset-x-0 top-0 flex h-12 items-center justify-end gap-2 p-2">
        <Button variant="outline" size="sm">
          Cancel
        </Button>
        <Button size="sm" variant="secondary" onClick={handleSave}>
          Save
        </Button>
      </div>

      {/* <div className="h-screen bg-yellow-800"></div> */}
      <form
        className="space-y-6 px-2 pb-20"
        onSubmit={(e) => e.preventDefault()}
      >
        {/* <Editor
          initialValue={htmlStringWithBg as unknown as JSONContent}
          ref={editorRef}
          onUpdate={handleEditorUpdate}
        /> */}

        <Editor initialValue={editorContent} onChange={setEditorContent} />

        {/* Custom CSS Inputs */}
        {/* {["container", "element", "overlay"].map((styleType) => (
          <div key={styleType} className="space-y-2">
            <Label
              htmlFor={`customCss${styleType.charAt(0).toUpperCase() + styleType.slice(1)}`}
            >
              Custom CSS for {styleType}
            </Label>
            <Controller
              name={
                `customCss${styleType.charAt(0).toUpperCase() + styleType.slice(1)}` as keyof FormData
              }
              control={control}
              render={({ field }) => (
                <Textarea
                  {...field}
                  id={`customCss${styleType.charAt(0).toUpperCase() + styleType.slice(1)}`}
                  placeholder={`Enter custom CSS for ${styleType}`}
                  className="font-mono text-sm"
                  rows={5}
                />
              )}
            />
          </div>
        ))} */}

        {/* Sticky Save and Cancel Buttons */}
      </form>

      {/* <div
        className={`sticky bottom-0 left-0 right-0 flex justify-end space-x-2 border-t p-4 transition-all`}
      >
        <Button type="button" variant="outline" size="sm" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" size="sm">
          Save Changes
        </Button>
      </div> */}
    </>
  );
};

export default SequenceItemEditorText;
