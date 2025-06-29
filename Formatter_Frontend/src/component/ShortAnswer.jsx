import PropTypes from "prop-types";

const Title = ({
  order = "0",
  VNTitle = "Tựa Việt",
  ENTitle = "English Title",
  formData = {},
  handleChange = () => {},
}) => {
  return (
    <div className="relative text-start w-full font-textFont text-lg mb-8 px-10">
      <h3 className="text-black font-semibold mb-2">{order}. {VNTitle}</h3>
      <input
        type="text"
        className="w-full border-b border-darkBlue focus:outline-none"
        name={ENTitle}
        value={formData.title}
        onChange={handleChange}
      />
    </div>
  );
};

export default Title;

Title.propTypes = {
  order: PropTypes.string,
  VNTitle: PropTypes.string,
  ENTitle: PropTypes.string,
  formData: PropTypes.object,
  handleChange: PropTypes.func,
};
