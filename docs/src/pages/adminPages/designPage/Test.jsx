import React, { useEffect, useRef } from "react";
import ReactQuill from "react-quill";
import Quill from "quill";
import "react-quill/dist/quill.snow.css";

// --- Register custom Embed blot ---
const Embed = Quill.import("blots/embed");

class PlaceholderBlot extends Embed {
  static create(value) {
    const node = super.create();
    node.setAttribute("data-placeholder", value);
    node.innerText = `{{ ${value} }}`;
    node.classList.add("placeholder-blot");
    return node;
  }

  static value(node) {
    return node.getAttribute("data-placeholder");
  }
}

PlaceholderBlot.blotName = "placeholder";
PlaceholderBlot.tagName = "span";
Quill.register(PlaceholderBlot);

// Add CSS globally via JavaScript for demo; you can move this to CSS
const style = document.createElement("style");
style.innerHTML = `
  .placeholder-blot {
    background-color: #e0f2fe;
    color: #0284c7;
    padding: 2px 6px;
    border-radius: 6px;
    display: inline-block;
    font-weight: bold;
  }
`;
document.head.appendChild(style);

// --- Component that renders Quill with placeholder parsing ---
export default function PlaceholderQuill({ text }) {
  const editorRef = useRef(null);
  const hasInitialized = useRef(false);

  useEffect(() => {
    if (!editorRef.current || hasInitialized.current) return;
    const quill = editorRef.current.getEditor();
    quill.setContents([]);

    const regex = /\${{\s*([^}]+?)\s*}}/g;
    let lastIndex = 0;
    let match;

    while ((match = regex.exec(text)) !== null) {
      const before = text.slice(lastIndex, match.index);
      if (before) quill.insertText(quill.getLength(), before);

      const placeholderValue = match[1].trim();
      quill.insertEmbed(quill.getLength(), "placeholder", placeholderValue);

      lastIndex = regex.lastIndex;
    }

    const after = text.slice(lastIndex);
    if (after) quill.insertText(quill.getLength(), after);

    quill.setSelection(0); 
    hasInitialized.current = true;
  }, [text]);

  return (
    <ReactQuill
      ref={editorRef}
      theme="snow"
      modules={{ toolbar: false }}
      readOnly={true}
    />
  );
}
