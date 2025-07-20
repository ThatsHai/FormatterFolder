import PropTypes from "prop-types";
import CheckIcon from "@mui/icons-material/Check";

const FieldInfo = ({
  label = "Tên trường",
  value = "",
  onChange = () => {},
  error = "",
  minLength = 1,
  type = "text",
}) => {
  return (
    <div className="my-12">
      <p className="text-darkGray text-lg opacity-80 py-2">{label}</p>
      <div className="relative w-full flex items-center">
        <input
          type={type}
          className={`text-xl w-full ${
            type === "date" ? "bg-white" : "bg-transparent"
          } outline-none`}
          value={value}
          onChange={(e) => onChange(label, e.target.value)}
          name={label}
        />

        {value.length >= minLength && (
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

export default FieldInfo;

FieldInfo.propTypes = {
  label: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func,
  error: PropTypes.string,
  minLength: PropTypes.number,
  type: PropTypes.string,
};
