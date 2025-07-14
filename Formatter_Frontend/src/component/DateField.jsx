import PropTypes from "prop-types";
import CheckIcon from "@mui/icons-material/Check";
import dayjs from "dayjs";

const isValidDate = (value) => {
  const [day, month, year] = value.split("/");
  return dayjs(`${year}-${month}-${day}`, "YYYY-MM-DD", true).isValid();
};

const formatAsDate = (value) => {
  const digits = value.replace(/\D/g, "").slice(0, 8);
  const parts = [];
  if (digits.length > 0) parts.push(digits.slice(0, 2));
  if (digits.length > 2) parts.push(digits.slice(2, 4));
  if (digits.length > 4) parts.push(digits.slice(4, 8));
  return parts.join("/");
};

const DateField = ({
  label = "Tên trường",
  value = "",
  onChange = () => {},
  error = "",
  minLength = 1,
  type = "text",
}) => {
  const isDateType = type === "date";

  const displayValue = isDateType ? formatAsDate(value) : value;

  const handleInputChange = (e) => {
    let newValue = e.target.value;
    if (isDateType) newValue = formatAsDate(newValue);
    onChange(label, newValue);
  };

  const isValid = () => {
    if (isDateType) return isValidDate(value);
    return value.length >= minLength;
  };

  return (
    <div className="my-12">
      <p className="text-darkGray text-lg opacity-80 py-2">{label}</p>
      <div className="relative w-full flex items-center">
        <input
          type="text"
          placeholder={isDateType ? "dd/mm/yyyy" : ""}
          className="text-xl w-full outline-none bg-transparent"
          value={displayValue}
          onChange={handleInputChange}
          name={label}
          inputMode={isDateType ? "numeric" : undefined}
        />

        {isValid() && (
          <CheckIcon
            sx={{ marginLeft: "8px", color: "green", paddingBottom: "2px" }}
          />
        )}

        <div className="absolute bottom-0 left-0 w-full after:content-[''] after:block after:w-full after:h-[1px] after:bg-darkBlue"></div>
      </div>
      {error && <p className="text-redError pt-2">{error}</p>}
    </div>
  );
};

DateField.propTypes = {
  label: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func,
  error: PropTypes.string,
  minLength: PropTypes.number,
  type: PropTypes.string,
};

export default DateField;
