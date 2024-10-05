"use client";

import Editor from "~/components/novel/editor/advanced-editor";

const htmlStringWithBg = `
<div aria-expanded="false"><div contenteditable="true" translate="no" class="tiptap ProseMirror prose prose-lg dark:prose-invert prose-headings:font-title font-default focus:outline-none max-w-full" tabindex="0"><p><mark data-color="purple" style="background-color: purple; color: inherit">This is great...</mark></p><p><strong><s><u><mark data-color="purple" style="background-color: purple; color: inherit">hello</mark></u></s></strong></p><p><mark data-color="purple" style="background-color: purple; color: inherit">hi</mark></p><p><mark data-color="purple" style="background-color: purple; color: inherit">this is great, </mark><strong><mark data-color="purple" style="background-color: purple; color: inherit">seriously</mark></strong></p></div><div draggable="true" data-drag-handle="" class="drag-handle" style="left: 13px; top: 105px;"></div></div><div></div>  `;

const Page = () => {
  return (
    <div className="flex h-screen flex-col gap-4 border-2 border-red-800 p-4">
      {/* @ts-ignore */}
      <Editor initialValue={htmlStringWithBg} />
    </div>
  );
};

export default Page;
