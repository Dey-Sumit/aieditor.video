// const SequenceItemEditorImage = () => {
//   const updateImageEditableProps = useVideoStore(
//     (state) => state.updateImageEditableProps,
//   );

//   const activeSeqItemLite = useEditingStore((state) => state.activeSeqItem!);

//   const activeSeqItem = useVideoStore(
//     (state) =>
//       state.props.sequenceItems[activeSeqItemLite.layerId]?.[
//         activeSeqItemLite.itemId
//       ]!,
//   )! as ImageEditablePropsType;

//   const [src, setSrc] = useState("");

//   useEffect(() => {
//     if (activeSeqItem && activeSeqItem.editableProps) {
//       setSrc(activeSeqItem.editableProps.mediaUrl || "");
//     }
//   }, [activeSeqItem]);

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     if (activeSeqItem) {
//       updateImageEditableProps(activeSeqItem.layerId, activeSeqItem.id, {
//         mediaUrl: src,
//       });
//     }
//   };

//   if (!activeSeqItem) return null;

//   return (
//     <Card>
//       <form onSubmit={handleSubmit}>
//         <CardContent className="space-y-4">
//           <div className="space-y-2">
//             <Label htmlFor="src">Image Source</Label>
//             <Input
//               id="src"
//               value={src}
//               onChange={(e) => setSrc(e.target.value)}
//               placeholder="Enter image URL"
//             />
//           </div>
//         </CardContent>
//         <CardFooter>
//           <Button type="submit">Update Image</Button>
//         </CardFooter>
//       </form>
//     </Card>
//   );
// };

// export default SequenceItemEditorImage;
const SequenceItemEditorImage = () => {
  return (
    <div>
      <h1>SequenceItemEditorImage</h1>
    </div>
  );
};
export default SequenceItemEditorImage;
