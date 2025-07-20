import { useState, useRef } from "react";

const RichTextEditor = () => {
  const [focused, setFocused] = useState(false);
  const editorRef = useRef(null);

  const applyFormat = (command) => {
    document.execCommand(command, false, null);
  };

  const logContent = () => {
    console.log("Formatted HTML:", editorRef.current.innerHTML);
  };

  return (
    <div className="space-y-2 w-full max-w-md relative">
      {focused && (
        <div className="space-x-2 mb-1 absolute -top-7">
          <button
            onMouseDown={(e) => {
              e.preventDefault();
              applyFormat("bold");
            }}
            className="px-2 py-1 bg-lightBlue text-white rounded font-bold"
          >
            Bold
          </button>
          <button
            onMouseDown={(e) => {
              e.preventDefault();
              applyFormat("italic");
            }}
            className="px-2 py-1 bg-lightBlue text-white rounded italic"
          >
            Italic
          </button>
          <button
            onMouseDown={(e) => {
              e.preventDefault();
              applyFormat("underline");
            }}
            className="px-2 py-1 bg-lightBlue text-white rounded underline"
          >
            Underline
          </button>
          <button
            onMouseDown={(e) => {
              e.preventDefault();
              logContent();
            }}
            className="px-2 py-1 bg-darkBlue text-white rounded"
          >
            Log
          </button>
        </div>
      )}

      <div
        ref={editorRef}
        contentEditable
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        className="border p-2 w-full rounded focus:outline-none border-lightGray"
        suppressContentEditableWarning
      />
    </div>
  );
};

export default RichTextEditor;
