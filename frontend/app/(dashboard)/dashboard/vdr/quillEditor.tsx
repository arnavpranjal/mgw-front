"use client";

import React, { useEffect, useRef } from "react";
import Quill from "quill";
import "quill/dist/quill.snow.css";

interface QuillEditorProps {
  onContentChange: (content: string) => void;
  content: string;
  fileBox: any;
  // onFileBoxChange: (fileBox: File[] | []) => void;
  onFileBoxChange: (callback: (prevFileBox: File[]) => File[]) => void;
}

const QuillEditor: React.FC<QuillEditorProps> = ({
  onContentChange,
  content,
  onFileBoxChange,
  fileBox,
}) => {
  const quillRef = useRef<Quill | null>(null);

  useEffect(() => {
    const quill = new Quill("#editor", {
      modules: {
        toolbar: [
          [{ header: [1, 2, false] }],
          ["bold", "italic", "underline"],
          [{ list: "ordered" }, { list: "bullet" }],
          ["link"],
        ],
      },

      theme: "snow",
    });

    quillRef.current = quill;

    const toolbar: any = quill.getModule("toolbar");
    const linkButton = toolbar.container.querySelector(".ql-link");

    linkButton.addEventListener("click", (e: Event) => {
      e.preventDefault();

      const fileInput = document.createElement("input");
      fileInput.setAttribute("type", "file");

      fileInput.addEventListener("change", (e: Event) => {
        e.preventDefault();
        const file = (e.target as HTMLInputElement).files?.[0];
        console.log(file);

        if (file) {
          onFileBoxChange((prevFileBox) => [...prevFileBox, file]);
        }
        console.log("ans");
        console.log(fileBox);
      });

      fileInput.click();
    });
    quill.on("text-change", () => {
      const content = quill.root.innerHTML;
      onContentChange(content);
    });
  }, [onContentChange]);
  useEffect(() => {
    const quill = quillRef.current;
    console.log(content);
    if (quill && content === "") {
      quill.setContents([]);
    }
  }, [content]);

  return <div id="editor" />;
};

export default QuillEditor;
