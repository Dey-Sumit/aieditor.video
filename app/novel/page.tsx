"use client";

import { useState } from "react";
import Editor from "~/components/editor/advanced-editor";

export default function Home() {
  const [value, setValue] = useState("");
  console.log(value);
  return (
    <main className="flex min-h-screen   p-4 gap-4">
      <div className="flex flex-col p-6 border max-w-xl w-full gap-6 rounded-md bg-card">
        <div className="flex justify-between">
          <h1 className="text-4xl font-semibold"> Novel Example</h1>
        </div>
        <Editor initialValue={value} onChange={setValue} />
      </div>
      <div className="flex flex-col gap-6 w-full">
        <div className="flex flex-col gap-2">
          <h2 className="text-2xl font-semibold">Preview</h2>
          <div className="border rounded-md p-6 prose dark:prose-invert">
            {value}
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <h2 className="text-2xl font-semibold">HTML</h2>
          <div
            className="border rounded-md p-6 prose dark:prose-invert prose-lg [&>*]:my-0 space-y-0"
            dangerouslySetInnerHTML={{ __html: value }}
          />
        </div>
      </div>
    </main>
  );
}
