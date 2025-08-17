import PropTypes from "prop-types";
import { useEffect, useRef } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const QuillData = ({
  title,
  order,
  name,
  value,
  handleChange,
  maxWords = 500,
  placeholder = "Nhập nội dung...",
  className = "",
  error = "",
}) => {
  const quillRef = useRef(null);

  const countWords = (text) => {
    const plainText = text.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
    return plainText.length > 0 ? plainText.split(" ").length : 0;
  };

  const onQuillChange = (content) => {
    const wordCount = countWords(content);
    if (maxWords === 0 || wordCount <= maxWords) {
      // Tạo synthetic event giống như input
      const syntheticEvent = {
        target: {
          name,
          value: content,
        },
      };
      handleChange(syntheticEvent);
    }
  };

  const currentWordCount = countWords(value);

  return (
    <div className={`flex flex-col text-lg font-textFont my-4 m-8 px-10 ${className}`}>
      {title && (
        <label className="mb-1 font-semibold">
          {order}. {title}
        </label>
      )}

      <ReactQuill
        ref={quillRef}
        value={value}
        onChange={onQuillChange}
        placeholder={placeholder}
        theme="snow"
        className="mt-2 border border-darkBlue rounded"
        modules={{
          toolbar: [
            [{ header: [1, 2, false] }],
            ["bold", "italic", "underline", "strike"],
            [{ list: "ordered" }, { list: "bullet" }],
            ["blockquote", "code-block"],
            ["link"],
            ["clean"],
          ],
        }}
      />

      <div className="text-sm text-right text-gray-500 mt-1">
        {maxWords > 0 ? `${currentWordCount}/${maxWords} từ` : "Không giới hạn từ"}
      </div>

      {error && <p className="text-redError pt-2">{error}</p>}
    </div>
  );
};

QuillData.propTypes = {
  title: PropTypes.string,
  order: PropTypes.number,
  name: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  handleChange: PropTypes.func.isRequired,
  maxWords: PropTypes.number,
  placeholder: PropTypes.string,
  className: PropTypes.string,
  error: PropTypes.string,
};

export default QuillData;