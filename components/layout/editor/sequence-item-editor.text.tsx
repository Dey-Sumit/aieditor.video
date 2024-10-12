"use client";

import { useEffect, useState } from "react";
import Editor from "~/components/editor/advanced-editor";
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

      <form
        className="space-y-6 px-2 pb-20"
        onSubmit={(e) => e.preventDefault()}
      >
        <Editor initialValue={editorContent} onChange={setEditorContent} />
      </form>
    </>
  );
};

export default SequenceItemEditorText;
