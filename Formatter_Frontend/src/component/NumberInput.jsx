import PropTypes from "prop-types";

const NumberInput = ({
  min = 0,
  max = 9999999999,
  name = "",
  placeholder = "",
  className = "",
  disabled = false,
  value,
  onChange,
  onKeyDown,
}) => {
  const handleChange = (e) => {
    const newValue = e.target.value;

    // Allow empty or only digits
    if (newValue === "" || /^\d+$/.test(newValue)) {
      onChange(e);
    }
  };

  const clampValue = (rawValue) => {
    if (rawValue === "") return "";

    let numericValue = parseInt(rawValue, 10);
    if (isNaN(numericValue)) return "";

    if (numericValue < min) return min;
    if (numericValue > max) return max;

    return numericValue;
  };

  const handleBlur = (e) => {
    const clampedValue = clampValue(e.target.value);

    // If clamping changes the value, update parent
    if (clampedValue !== e.target.value) {
      const syntheticEvent = {
        ...e,
        target: {
          ...e.target,
          value: clampedValue,
        },
      };
      onChange(syntheticEvent);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();

      const clampedValue = clampValue(e.target.value);
      if (clampedValue !== e.target.value) {
        const syntheticEvent = {
          ...e,
          target: {
            ...e.target,
            value: clampedValue,
          },
        };
        onChange(syntheticEvent);
      }

      // Your original search handler
      if (onKeyDown) onKeyDown(e);
    }
  };

  return (
    <input
      type="text"
      className={className}
      placeholder={placeholder}
      name={name}
      value={value}
      disabled={disabled}
      onChange={handleChange}
      onBlur={handleBlur}
      onKeyDown={handleKeyDown}
    />
  );
};

export default NumberInput;

NumberInput.propTypes = {
  min: PropTypes.number,
  max: PropTypes.number,
  name: PropTypes.string,
  placeholder: PropTypes.string,
  disabled: PropTypes.bool,
  className: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  onChange: PropTypes.func.isRequired,
  onKeyDown: PropTypes.func,
  disable: PropTypes.bool,
};
