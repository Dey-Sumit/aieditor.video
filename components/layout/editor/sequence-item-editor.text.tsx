import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Textarea } from "~/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { ScrollArea } from "~/components/ui/scroll-area";
import { TextEditablePropsType } from "~/types/timeline.types";
import { htmlStringWithBg } from "~/components/novel/page";
import Editor from "~/components/novel/editor/advanced-editor";

// Define the schema for form validation
const formSchema = z.object({
  text: z.string().min(1, "Text is required"),
  fontSize: z.number().min(1, "Font size must be at least 1"),
  fontWeight: z.enum([
    "normal",
    "bold",
    "100",
    "200",
    "300",
    "400",
    "500",
    "600",
    "700",
    "800",
    "900",
  ]),
  color: z
    .string()
    .regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, "Invalid color format"),
  customCssContainer: z.string(),
  customCssElement: z.string(),
  customCssOverlay: z.string(),
});

type FormData = z.infer<typeof formSchema>;

interface SequenceItemEditorTextProps {
  initialData: TextEditablePropsType;
  onSave: (data: TextEditablePropsType) => void;
  onCancel: () => void;
}

const SequenceItemEditorText: React.FC<SequenceItemEditorTextProps> = ({
  initialData,
  onSave,
  onCancel,
}) => {
  console.log({ initialData });

  const [isSticky, setIsSticky] = useState(false);

  // const {
  //   control,
  //   handleSubmit,
  //   formState: { errors },
  // } = useForm<FormData>({
  //   resolver: zodResolver(formSchema),
  //   defaultValues: {
  //     text: initialData.text,
  //     fontSize: initialData.styles.element.fontSize as number,
  //     fontWeight: initialData.styles.element
  //       .fontWeight as FormData["fontWeight"],
  //     color: initialData.styles.element.color as string,
  //     customCssContainer: JSON.stringify(initialData.styles.container, null, 2),
  //     customCssElement: JSON.stringify(initialData.styles.element, null, 2),
  //     customCssOverlay: JSON.stringify(
  //       initialData.styles.overlay || {},
  //       null,
  //       2,
  //     ),
  //   },
  // });

  const onSubmit = (data: FormData) => {
    // Transform form data back to TextEditablePropsType
    const updatedData: TextEditablePropsType = {
      text: data.text,
      styles: {
        container: JSON.parse(data.customCssContainer),
        element: {
          ...JSON.parse(data.customCssElement),
          fontSize: data.fontSize,
          fontWeight: data.fontWeight,
          color: data.color,
        },
        overlay: JSON.parse(data.customCssOverlay),
      },
    };
    onSave(updatedData);
  };

  // Handle scroll event to determine if buttons should be sticky
  const handleScroll = (event: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop } = event.currentTarget;
    setIsSticky(scrollTop > 0);
  };

  return (
    <div className="relative h-[calc(100vh-20vh-70px)] border-2 border-l border-red-500 bg-gray-100 p-2">
      <div
        className="h-full"
        style={{
          overscrollBehavior: "contain",
        }}
      >
        {/* <div className="h-screen bg-yellow-800"></div> */}
        <form className="space-y-6 pb-20">
          {/* <Editor initialValue={htmlStringWithBg} /> */}

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
      </div>
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
    </div>
  );
};

export default SequenceItemEditorText;
