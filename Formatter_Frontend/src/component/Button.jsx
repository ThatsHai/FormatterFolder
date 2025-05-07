import PropTypes from "prop-types";

const Button = ({ label = "Tiêu đề", handleClick = () => {} }) => {
  return (
    <button
      className="m-1 mx-2 bg-lightBlue border-none text-white text-base w-full rounded-md text-center"
      onClick={handleClick}
    >
      <p className="p-1 py-2">{label}</p>
    </button>
  );
};

export default Button;

Button.propTypes = {
  label: PropTypes.string,
  handleClick: PropTypes.func,
};
