// "use client";
// import { CardFooter } from "~/components/ui/card";
// import { Label } from "~/components/ui/label";
// import {
//   Select,
//   SelectTrigger,
//   SelectValue,
//   SelectContent,
//   SelectItem,
// } from "~/components/ui/select";
// import { Slider } from "~/components/ui/slider";
// import { Textarea } from "~/components/ui/textarea";
// import { Button } from "~/components/ui/button";
// import { useEffect, useState } from "react";

// import { Separator } from "~/components/ui/separator";
// import { useVideoStore } from "~/zustand/video-store";
// import { TextSequenceType } from "~/types/store.types";
// import { useEditingStore } from "~/zustand/editing-store";
// export const SequenceItemEditorText = () => {
//   const updateTextEditableProps = useVideoStore(
//     (state) => state.updateTextEditableProps,
//   );
//   const activeSeqItemLite = useEditingStore((state) => state.activeSeqItem!);

//   const activeSeqItem = useVideoStore(
//     (state) =>
//       state.props.sequenceItems["content-layer-1"]?.[activeSeqItemLite.itemId]!,
//   ) as TextSequenceType;

//   const [text, setText] = useState(activeSeqItem?.editableProps.content || "");
//   const [classNames, setClassnames] = useState(
//     activeSeqItem?.editableProps?.classNames || "",
//   );

//   useEffect(() => {
//     setText(activeSeqItem?.editableProps?.content || "");
//     setClassnames(activeSeqItem?.editableProps?.classNames || "");
//   }, [activeSeqItem?.editableProps]);

//   const handleApply = () => {
//     updateTextEditableProps("content-layer-1", activeSeqItem.id, {
//       content: text,
//       classNames: classNames,
//     });
//   };

//   return (
//     <div className="flex flex-col gap-4">
//       <div className="grid gap-2">
//         <Label htmlFor="font">Font</Label>
//         <Select name="font">
//           <SelectTrigger>
//             <SelectValue placeholder="Select font" />
//           </SelectTrigger>
//           <SelectContent>
//             <SelectItem value="Arial">Arial</SelectItem>
//             <SelectItem value="Times New Roman">Times New Roman</SelectItem>
//             <SelectItem value="Verdana">Verdana</SelectItem>
//             <SelectItem value="Georgia">Georgia</SelectItem>
//             <SelectItem value="Roboto">Roboto</SelectItem>
//             <SelectItem value="Open Sans">Open Sans</SelectItem>
//           </SelectContent>
//         </Select>
//       </div>
//       <div className="grid gap-2">
//         <Label htmlFor="size">Font Size</Label>
//         <Slider
//           id="size"
//           defaultValue={[16]}
//           min={8}
//           max={72}
//           step={1}
//           className="[&>span:first-child]:h-2 [&>span:first-child]:bg-primary [&>span:first-child_span]:bg-primary [&_[role=slider]:focus-visible]:scale-105 [&_[role=slider]:focus-visible]:ring-0 [&_[role=slider]:focus-visible]:ring-offset-0 [&_[role=slider]:focus-visible]:transition-transform [&_[role=slider]]:h-4 [&_[role=slider]]:w-4 [&_[role=slider]]:border-0 [&_[role=slider]]:bg-primary"
//         />
//       </div>
//       <div className="grid gap-2">
//         <Label htmlFor="color">Color</Label>
//         <div />
//       </div>
//       <div className="grid gap-2">
//         <Label htmlFor="text">Text</Label>
//         <Textarea
//           id="text"
//           rows={3}
//           placeholder="Enter your text"
//           value={text}
//           onChange={(e) => setText(e.target.value)}
//         />
//       </div>
//       <div className="grid gap-2">
//         <Label htmlFor="x">X Position</Label>
//         <Slider
//           id="x"
//           defaultValue={[0]}
//           min={0}
//           max={100}
//           step={1}
//           className="[&>span:first-child]:h-2 [&>span:first-child]:bg-primary [&>span:first-child_span]:bg-primary [&_[role=slider]:focus-visible]:scale-105 [&_[role=slider]:focus-visible]:ring-0 [&_[role=slider]:focus-visible]:ring-offset-0 [&_[role=slider]:focus-visible]:transition-transform [&_[role=slider]]:h-4 [&_[role=slider]]:w-4 [&_[role=slider]]:border-0 [&_[role=slider]]:bg-primary"
//         />
//       </div>
//       <div className="grid gap-2">
//         <Label htmlFor="y">Y Position</Label>
//         <Slider
//           id="y"
//           defaultValue={[0]}
//           min={0}
//           max={100}
//           step={1}
//           className="[&>span:first-child]:h-2 [&>span:first-child]:bg-primary [&>span:first-child_span]:bg-primary [&_[role=slider]:focus-visible]:scale-105 [&_[role=slider]:focus-visible]:ring-0 [&_[role=slider]:focus-visible]:ring-offset-0 [&_[role=slider]:focus-visible]:transition-transform [&_[role=slider]]:h-4 [&_[role=slider]]:w-4 [&_[role=slider]]:border-0 [&_[role=slider]]:bg-primary"
//         />
//       </div>
//       <Separator orientation="horizontal" />
//       <div className="grid gap-2">
//         <Label htmlFor="text">Yo Coder : add tailwind classNames</Label>
//         <Textarea
//           id="text"
//           rows={3}
//           placeholder="Tailwind classes"
//           value={classNames}
//           onChange={(e) => setClassnames(e.target.value)}
//         />
//       </div>
//       <CardFooter>
//         <Button className="ml-auto" onClick={handleApply}>
//           Apply
//         </Button>
//       </CardFooter>
//     </div>
//   );
// };

const SequenceItemEditorText = () => {
  return (
    <div>
      <h1>SequenceItemEditorText</h1>
    </div>
  );
};
export default SequenceItemEditorText;
