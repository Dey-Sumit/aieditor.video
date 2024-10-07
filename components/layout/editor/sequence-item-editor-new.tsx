import { cn } from "~/lib/utils";
import SequenceItemEditorText from "./sequence-item-editor.text";
import { useEditingStore } from "~/store/editing.store";
import { LAYOUT } from "~/lib/constants/layout.constants";
const { TIMELINE_HEIGHT, PROJECT_HEADER_HEIGHT } = LAYOUT;
const SequenceItemEditorContainerNew = () => {
  const activeSeqItem = useEditingStore((store) => store.activeSeqItem);
  return (
    <section
      className={cn(
        "w-96 overflow-y-scroll overscroll-contain border-t",
        "gradient-bg",
      )}
      style={{
        height: `calc(100vh - ${TIMELINE_HEIGHT} - ${PROJECT_HEADER_HEIGHT})`,
      }}
    >
      {/* <div className="sticky inset-x-0 top-0 h-12 border-b"></div>
      <div className="h-screen"></div>
      <div className="h-screen border"></div> */}
      {activeSeqItem?.itemType === "text" && <SequenceItemEditorText />}
    </section>
  );
};

export default SequenceItemEditorContainerNew;
