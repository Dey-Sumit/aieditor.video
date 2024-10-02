import React from "react";
import SequenceItemEditorImage from "./sequence-item-editor.image";
import SequenceItemEditorText from "./sequence-item-editor.text";
import { useEditingStore } from "~/store/editing.store";
import useVideoStore from "~/store/video.store";
import { AnimatePresence, motion } from "framer-motion";
const SequenceItemEditor: React.FC = () => {
  const activeSeqItem = useEditingStore((state) => state.activeSeqItem);
  const clearActiveSeqItem = useEditingStore(
    (state) => state.clearActiveSeqItem,
  );
  const props = useVideoStore((state) => state.props);
  console.log({ activeSeqItem });

  if (!activeSeqItem) {
    return null;
  }

  const handleSave = (data: any) => {
    console.log(data);
  };

  const handleCancel = () => {
    console.log("cancel");
    clearActiveSeqItem();
  };
  // TODO : use drawer component
  return (
    activeSeqItem &&
    activeSeqItem.itemType === "text" && (
      <AnimatePresence>
        <motion.div className="h-full border-4 border-amber-600">
          {activeSeqItem?.itemType === "text" && (
            <SequenceItemEditorText
              initialData={
                props.sequenceItems.layerForeground[activeSeqItem.itemId]
                  ?.editableProps
                // props.layers[activeSeqItem.layerId].liteItems[0] // 0 is hardcoded for now
              }
              onSave={handleSave}
              onCancel={handleCancel}
            />
          )}
          {/* {activeSeqItem?.itemType === "image" && <SequenceItemEditorImage />} */}
        </motion.div>
      </AnimatePresence>
    )
  );
};

export default SequenceItemEditor;
