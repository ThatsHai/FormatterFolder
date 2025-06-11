import React from "react";
import ReactQuill from "react-quill";
import { IconButton } from "@mui/material";
import FormatBoldIcon from "@mui/icons-material/FormatBold";
import FormatItalicIcon from "@mui/icons-material/FormatItalic";
import FormatUnderlinedIcon from "@mui/icons-material/FormatUnderlined";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import FormatListNumberedIcon from "@mui/icons-material/FormatListNumbered";
import FormatAlignLeftIcon from "@mui/icons-material/FormatAlignLeft";
import FormatAlignCenterIcon from "@mui/icons-material/FormatAlignCenter";
import FormatAlignRightIcon from "@mui/icons-material/FormatAlignRight";
import FormatAlignJustifyIcon from "@mui/icons-material/FormatAlignJustify";
import DeleteIcon from "@mui/icons-material/Delete";
import "react-quill/dist/quill.snow.css";
import PropTypes from "prop-types";

export const CustomToolbar = ({ onFormat, onDelete }) => (
  <div id="toolbar" onMouseDown={(e) => e.preventDefault()}>
    <div className="flex gap-4 text-lg px-3 items-center">
      <IconButton onMouseDown={() => onFormat("bold")} aria-label="bold">
        <FormatBoldIcon />
      </IconButton>
      <IconButton onMouseDown={() => onFormat("italic")} aria-label="italic">
        <FormatItalicIcon />
      </IconButton>
      <IconButton
        onMouseDown={() => onFormat("underline")}
        aria-label="underline"
      >
        <FormatUnderlinedIcon />
      </IconButton>
      {/* Lists */}
      <IconButton
        onMouseDown={() => onFormat("list", "bullet")}
        aria-label="unordered list"
      >
        <FormatListBulletedIcon />
      </IconButton>
      <IconButton
        onMouseDown={() => onFormat("list", "ordered")}
        aria-label="ordered list"
      >
        <FormatListNumberedIcon />
      </IconButton>
    </div>
    <div className="flex gap-4 text-lg px-3 items-center">
      {/* Text Alignment */}
      <IconButton
        onMouseDown={() => onFormat("align", "")}
        aria-label="align left"
      >
        <FormatAlignLeftIcon />
      </IconButton>
      <IconButton
        onMouseDown={() => onFormat("align", "center")}
        aria-label="align center"
      >
        <FormatAlignCenterIcon />
      </IconButton>
      <IconButton
        onMouseDown={() => onFormat("align", "right")}
        aria-label="align right"
      >
        <FormatAlignRightIcon />
      </IconButton>
      <IconButton
        onMouseDown={() => onFormat("align", "justify")}
        aria-label="justify"
      >
        <FormatAlignJustifyIcon />
      </IconButton>

      <div className="flex gap-3">
        <IconButton
          onMouseDown={() => onDelete && onDelete()}
          aria-label="delete"
          color="error"
        >
          <DeleteIcon />
        </IconButton>
      </div>
    </div>
  </div>
);

CustomToolbar.propTypes = {
  onFormat: PropTypes.func,
  onDelete: PropTypes.func,
};

const CustomizableInput = React.forwardRef(
  ({ text, onChange, onDrop, onFocus, onBlur, style, readOnly = false }, ref) => {
    return (
      <div
        tabIndex={0}
        onDragOver={(e) => e.preventDefault()}
        onDrop={onDrop}
        onFocus={onFocus}
        onBlur={onBlur}
        style={{
          outline: "none",
          pointerEvents: "auto",
          height: "100%",
          backgroundColor: readOnly ? "#e0f7fa" : "transparent",
          display: readOnly ? "flex" : "block",
          alignItems: readOnly ? "center" : "initial",
          justifyContent: readOnly ? "center" : "initial",
          textAlign: readOnly ? "center" : "initial",
          ...style,
        }}
      >
        <ReactQuill
          ref={ref}
          theme="snow"
          value={text}
          onChange={(content, delta, source, editor) => {
            const html = editor.getHTML();
            onChange(html);
          }}
          className={readOnly ? "ql-no-border" : ""}
          readOnly={readOnly}
          modules={{ toolbar: false }}
          style={{
            height: readOnly ? "auto" : "100%",
            backgroundColor: readOnly ? "#e0f7fa" : "transparent",
            fontSize: "3rem",
            fontWeight: readOnly ? "bold" : "normal",
            color: readOnly ? "#00796b" : "inherit",
            pointerEvents: "auto",
            userSelect: "text",
            display: readOnly ? "inline-block" : "block",
            textAlign: "inherit",
          }}
        />
      </div>
    );
  }
);


CustomizableInput.propTypes = {
  text: PropTypes.string,
  onChange: PropTypes.func,
  onDrop: PropTypes.func,
  onFocus: PropTypes.func,
  onBlur: PropTypes.func,
  style: PropTypes.object,
  readOnly: PropTypes.bool,
};

CustomizableInput.displayName = "CustomizableInput";

export default CustomizableInput;
