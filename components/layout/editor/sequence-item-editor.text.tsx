"use client";

import { EditorContent, EditorInstance, JSONContent } from "novel";
import React, { ComponentProps, useEffect, useRef, useState } from "react";
import * as z from "zod";
import Editor from "~/components/novel/editor/advanced-editor";
import { htmlStringWithBg } from "~/components/novel/page";
import { Button } from "~/components/ui/button";
import { useEditingStore } from "~/store/editing.store";
import useVideoStore from "~/store/video.store";
import { TextEditablePropsType } from "~/types/timeline.types";

interface SequenceItemEditorTextProps {
  initialData: TextEditablePropsType;
  onSave: (data: TextEditablePropsType) => void;
  onCancel: () => void;
}

const SequenceItemEditorText = () => {
  const updateTextEditableProps = useVideoStore(
    (store) => store.updateTextEditableProps,
  );
  const [editorContent, setEditorContent] = useState(htmlStringWithBg);
  const activeSeqItemLite = useEditingStore((state) => state.activeSeqItem!);

  const editorRef = useRef<EditorInstance>(null);
  const handleSave = () => {
    // const content = editorRef?.current?.getJSON();
    // console.log(content);
    console.log(editorContent);
    updateTextEditableProps(
      activeSeqItemLite.layerId,
      activeSeqItemLite.itemId,
      { text: editorContent },
    );
  };

  const handleEditorUpdate: ComponentProps<
    typeof EditorContent
  >["onUpdate"] = ({ editor, transaction }) => {
    setEditorContent(editor.getHTML());
  };

  /*   useEffect(() => {
    if (activeSeqItemLite) {
      setEditorContent(activeSeqItemLite.editableProps?.text || "");
    }
  }, [activeSeqItemLite]); */

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
      <div className="p-2">
        <Editor
          // initialValue={htmlStringWithBg as unknown as JSONContent}
          ref={editorRef}
          onUpdate={handleEditorUpdate}
        />
      </div>
    </>
  );
};

export default SequenceItemEditorText;
