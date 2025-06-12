import PropTypes from "prop-types";

const SelectField = ({ label, value, onChange, error, options = [], className = "", showLabel = true }) => {
  return (
    <div className={`my-12 ${className}`}>
      {showLabel && (<p className="text-gray text-lg opacity-80 py-2">{label}</p>)}
      <div className="relative w-full flex items-center">
        <select
          className="text-xl w-full outline-none bg-transparent border-b border-darkBlue"
          value={value}
          onChange={(e) => onChange(label, e.target.value)}
          name={label}
        >
          <option value="">-- Chọn --</option>
          {options.map((opt) =>
            typeof opt === "object" ? (
              <option key={opt.key} value={opt.key}>
                {opt.value}
              </option>
            ) : (
              <option key={opt} value={opt}>
                {opt}
              </option>
            )
          )}
        </select>
      </div>
      {error && <p className="text-redError pt-2">{error}</p>}
    </div>
  );
};

SelectField.propTypes = {
  label: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func,
  error: PropTypes.string,
  options: PropTypes.arrayOf(PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.shape({
        key: PropTypes.string.isRequired,
        value: PropTypes.string.isRequired,
      }),
    ])),
};

export default SelectField;
