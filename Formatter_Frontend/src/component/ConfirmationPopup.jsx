import PropTypes from "prop-types";
import SuccessPopup from "./SuccessPopup";

const ConfirmationPopup = ({
  isOpen = false,
  displaySuccessPopup = false,
  successPopupText="",
  text = "",
  onDecline = () => {},
  onConfirm = () => {},
  onSuccessPopupClosed = () => {},
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 ">
      {/* <button className="">X</button> */}
      <div className="bg-white p-6 rounded-xl shadow-lg text-center max-w-sm w-full">
        <h2 className="text-lg font-semibold mb-4">{text}</h2>
        <div className="w-full flex justify-center items-center gap-5">
          <button
            className="bg-darkBlue text-white px-4 py-2 rounded-full"
            onClick={onConfirm}
          >
            Xác nhận
          </button>
          <button
            className="bg-darkBlue text-white px-4 py-2 rounded-full"
            onClick={onDecline}
          >
            Hủy
          </button>
        </div>
      </div>
      <SuccessPopup
        isOpen={displaySuccessPopup}
        successPopupText={successPopupText}
        onClose={onSuccessPopupClosed}
      ></SuccessPopup>
    </div>
  );
};

ConfirmationPopup.propTypes = {
  isOpen: PropTypes.bool,
  text: PropTypes.string,
  onConfirm: PropTypes.func,
  onDecline: PropTypes.func,
  displaySuccessPopup: PropTypes.bool,
  onSuccessPopupClosed: PropTypes.func,
  successPopupText: PropTypes.string,
};

export default ConfirmationPopup;
