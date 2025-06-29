import PropTypes from "prop-types";

const Title = ({
  order = "0",
  title = "",
  value = "",
  name ="",
  // VNTitle = "Tựa Việt",
  // ENTitle = "English Title",
  // formData = {},
  handleChange = () => {},
  error = "",
}) => {
  return (
    <div className="relative text-start font-textFont text-lg m-8 px-10">
      <h3 className="text-black font-semibold mb-2">{order}. {title}</h3>
      <input
        type="text"
        className="w-full border-b border-darkBlue focus:outline-none"
        name={name}
        // value={formData[ENTitle]}
        value={value}
        onChange={handleChange}
      />
       {error && <p className="text-redError pt-2">{error}</p>}
    </div>
  );
};

export default Title;

Title.propTypes = {
  order: PropTypes.string,
  // VNTitle: PropTypes.string,
  // ENTitle: PropTypes.string,
  // formData: PropTypes.object,
  name: PropTypes.string,
  value: PropTypes.string,
  error: PropTypes.string,
  title: PropTypes.string,
  handleChange: PropTypes.func,
};
