import { cn } from "~/lib/utils";
import SequenceItemEditorText from "./sequence-item-editor.text";

const TIMELINE_HEIGHT = "14rem";
const PROJECT_HEADER_HEIGHT = "56px";
const SequenceItemEditorContainerNew = () => {
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
      <SequenceItemEditorText />
    </section>
  );
};

export default SequenceItemEditorContainerNew;
