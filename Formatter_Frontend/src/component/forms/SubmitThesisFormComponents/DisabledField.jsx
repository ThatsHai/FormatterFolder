import PropTypes from "prop-types";

const DisabledField = ({
  title = "Tựa đề",
  value = "",
  onChange = () => {},
  error = "",
}) => {
  return (
    <div className="w-full grid grid-cols-3 items-center mb-3">
      <p className="text-black">{title}</p>
      <select
        className="col-span-2 bg-gray rounded-md px-4 py-1 appearance-none"
        disabled
      >
        <option className="text-black">{value}</option>
      </select>
    </div>
  );
};

export default DisabledField;

DisabledField.propTypes = {
  VNTitle: PropTypes.string,
  ENTitle: PropTypes.string,
  formData: PropTypes.object,
}