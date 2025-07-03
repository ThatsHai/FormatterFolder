import PropTypes from "prop-types";

const SuccessPopup = ({
  isOpen = false,
  onClose = () => {},
  successPopupText = "Thành công",
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-xl shadow-lg text-center max-w-sm w-full">
        <h2 className="text-lg font-semibold mb-4">{successPopupText}</h2>
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded-full"
          onClick={onClose}
        >
          OK
        </button>
      </div>
    </div>
  );
};

SuccessPopup.propTypes = {
  isOpen: PropTypes.bool,
  onClose: PropTypes.func,
  successPopupText: PropTypes.string,
};

export default SuccessPopup;
