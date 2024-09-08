import React from "react";
import { Card, CardContent } from "~/components/ui/card";
import SequenceItemEditorImage from "./sequence-item-editor.image";
import SequenceItemEditorText from "./sequence-item-editor.text";
import { useEditingStore } from "~/store/editing.store";

const SequenceItemEditor: React.FC = () => {
  const activeSeqItem = useEditingStore((state) => state.activeSeqItem);

  if (!activeSeqItem) {
    return null;
  }

  return (
    <Card className="w-full max-w-3xl">
      <CardContent className="p-4">
        {activeSeqItem?.itemType === "text" && <SequenceItemEditorText />}
        {activeSeqItem?.itemType === "image" && <SequenceItemEditorImage />}
      </CardContent>
    </Card>
  );
};

export default SequenceItemEditor;
//
