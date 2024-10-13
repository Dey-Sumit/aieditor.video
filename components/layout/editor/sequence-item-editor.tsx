"use client";
import { LAYOUT } from "~/lib/constants/layout.constants";
import { cn } from "~/lib/utils";
import { useEditingStore } from "~/store/editing.store";
import SequenceItemEditorImage from "./sequence-item-editor.image";
import SequenceItemEditorText from "./sequence-item-editor.text";

const {
  TIMELINE: { TIMELINE_CONTAINER_HEIGHT },
  PROJECT_HEADER_HEIGHT,
} = LAYOUT;

const SequenceItemEditorRenderer = () => {
  const activeSeqItem = useEditingStore((store) => store.activeSeqItem);

  // TODO : w-96? is it needed?
  return (
    <section
      className={cn(
        "w-96 overflow-y-scroll overscroll-contain border-t",
        "gradient-bg",
      )}
      style={{
        height: `calc(100vh - ${TIMELINE_CONTAINER_HEIGHT} - ${PROJECT_HEADER_HEIGHT})`,
      }}
    >
      {/* <div className="sticky inset-x-0 top-0 h-12 border-b"></div>
      <div className="h-screen"></div>
      <div className="h-screen border"></div> */}
      {activeSeqItem?.itemType === "text" && <SequenceItemEditorText />}
      {activeSeqItem?.itemType === "image" && <SequenceItemEditorImage />}
    </section>
  );
};

export default SequenceItemEditorRenderer;
