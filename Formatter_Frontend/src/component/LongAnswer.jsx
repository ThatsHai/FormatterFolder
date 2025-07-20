import PropTypes from "prop-types";
import { useState, useEffect, useRef } from "react";

const LongAnswer = ({
  label,
  value,
  onChange,
  maxChars = 500,
  maxHeight = "300px",
  placeholder = "Nhập nội dung...",
  className = "",
  error = "",
}) => {
  const [inputValue, setInputValue] = useState(value || "");
  const textareaRef = useRef(null);

  useEffect(() => {
    setInputValue(value || "");
  }, [value]);

  useEffect(() => {
    autoResize();
  }, [inputValue]);

  const handleChange = (e) => {
    const newValue = e.target.value;
    if (newValue.length <= maxChars) {
      setInputValue(newValue);
      onChange && onChange(newValue);
    }
  };

  const autoResize = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto"; // reset to auto to shrink if needed
      const newHeight = Math.min(textarea.scrollHeight, parseInt(maxHeight)) + "px";
      textarea.style.height = newHeight;
    }
  };

  return (
    <div className={`flex flex-col text-lg font-textFont my-4 m-8 px-10 ${className}`}>
      {label && <label className="mb-1 font-semibold">{label}</label>}
      <textarea
        ref={textareaRef}
        className="p-3 mt-2 text-lg border border-darkBlue rounded overflow-auto focus:outline-none focus:ring-2 focus:ring-blue-500"
        value={inputValue}
        onChange={handleChange}
        placeholder={placeholder}
        style={{
          minHeight: "120px",
          maxHeight: maxHeight,
          lineHeight: "1.5",
          fontSize: "1rem",
        }}
      />
      <div className="text-sm text-right text-gray-500 mt-1">
        {inputValue.length}/{maxChars} ký tự
      </div>
      {error && <p className="text-redError pt-2">{error}</p>}
    </div>
  );
};

LongAnswer.propTypes = {
  label: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  maxChars: PropTypes.number,
  maxHeight: PropTypes.string,
  placeholder: PropTypes.string,
  className: PropTypes.string,
  error: PropTypes.string,
};

export default LongAnswer;
