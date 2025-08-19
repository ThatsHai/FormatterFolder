import PropTypes from "prop-types";
import { useEffect, useRef } from "react";

const LongAnswer = ({
  title,
  order,
  name,
  value,
  handleChange,
  maxWords = 500,
  maxHeight = "300px",
  placeholder = "Nhập nội dung...",
  className = "",
  error = "",
  spellErrorWords = [],
}) => {
  const textareaRef = useRef(null);

  useEffect(() => {
    autoResize();
  }, [value]);

  const countWords = (text) =>
    text
      .trim()
      .split(/\s+/)
      .filter((word) => word.length > 0).length;

  const onInputChange = (e) => {
    const newValue = e.target.value;
    const wordCount = countWords(newValue);

    if (maxWords === 0 || wordCount <= maxWords) {
      handleChange(e); // chỉ cập nhật nếu chưa vượt max
    } else {
      // Nếu đã vượt maxWords thì không cho nhập thêm
      e.target.value = e.target.value.split(/\s+/).slice(0, maxWords).join(" ");
    }
  };

  const autoResize = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      const newHeight =
        Math.min(textarea.scrollHeight, parseInt(maxHeight)) + "px";
      textarea.style.height = newHeight;
    }
  };

  return (
    <div
      className={`flex flex-col text-lg font-textFont my-4 m-8 px-10 ${className}`}
    >
      {title && (
        <label className="mb-1 font-semibold">
          {order}. {title}
        </label>
      )}
      <textarea
        ref={textareaRef}
        className="p-3 mt-2 text-lg border border-darkBlue rounded overflow-auto focus:outline-none focus:ring-2 focus:ring-blue-500"
        value={value}
        name={name}
        onChange={onInputChange}
        placeholder={placeholder}
        style={{
          minHeight: "120px",
          maxHeight: maxHeight,
          lineHeight: "1.5",
          fontSize: "1rem",
        }}
      />
      <div className="text-sm text-right text-gray-500 mt-1">
        {maxWords > 0
          ? `${countWords(value)}/${maxWords} từ`
          : "Không giới hạn từ"}
      </div>
      
      {error && <p className="text-redError pt-2">{error}</p>}
    </div>
  );
};

LongAnswer.propTypes = {
  title: PropTypes.string,
  order: PropTypes.number,
  name: PropTypes.string.isRequired,
  value: PropTypes.string,
  handleChange: PropTypes.func.isRequired,
  maxWords: PropTypes.number,
  maxHeight: PropTypes.string,
  placeholder: PropTypes.string,
  className: PropTypes.string,
  error: PropTypes.string,
  spellErrorWords: PropTypes.object, // { word: ["suggestion1", "suggestion2"] }
};

export default LongAnswer;
