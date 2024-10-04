"use client";

import React, { useState } from "react";
import * as z from "zod";
import { Button } from "~/components/ui/button";
import { TextEditablePropsType } from "~/types/timeline.types";

interface SequenceItemEditorTextProps {
  initialData: TextEditablePropsType;
  onSave: (data: TextEditablePropsType) => void;
  onCancel: () => void;
}

const SequenceItemEditorText = () => {
  return (
    <>
      <div className="sticky inset-x-0 top-0 flex h-12 items-center justify-end gap-2 p-2">
        <Button variant="outline" size="sm">
          Cancel
        </Button>
        <Button size="sm" variant="secondary">
          Save
        </Button>
      </div>
      <div className="h-screen"></div>
      <div className="h-screen border"></div>

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
    </>
  );
};

export default SequenceItemEditorText;
