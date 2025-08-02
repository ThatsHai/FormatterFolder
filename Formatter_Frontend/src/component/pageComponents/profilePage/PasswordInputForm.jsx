import PropTypes from "prop-types";
import { useState } from "react";
import ConfirmationPopup from "../../ConfirmationPopup";
import SuccessPopup from "../../SuccessPopup";

const PasswordInputForm = ({
  handleFormToggle = () => {},
  onSuccess = () => {},
}) => {
  const [formData, setFormData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [formErrors, setFormErrors] = useState({});
  const [showConfirmPopup, setShowConfirmPopup] = useState(false);
  const [displaySuccessPopup, setDisplaySuccessPopup] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setFormErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[name];
      return newErrors;
    });
  };

  const validate = () => {
    const errors = {};
    if (!formData.oldPassword.trim())
      errors.oldPassword = "Vui lòng nhập mật khẩu cũ.";
    if (!formData.newPassword.trim()) {
      errors.newPassword = "Vui lòng nhập mật khẩu mới.";
    } else if (formData.newPassword.length < 8) {
      errors.newPassword = "Mật khẩu mới phải có ít nhất 8 ký tự.";
    }
    if (!formData.confirmPassword.trim())
      errors.confirmPassword = "Vui lòng nhập lại mật khẩu mới.";
    if (
      formData.newPassword &&
      formData.confirmPassword &&
      formData.newPassword !== formData.confirmPassword
    ) {
      errors.confirmPassword = "Mật khẩu mới không khớp.";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    setShowConfirmPopup(true);
  };

  const handleConfirm = () => {
    setShowConfirmPopup(false);
    console.log("Submitted passwords:", formData);
    // Make API call here if needed
    setDisplaySuccessPopup(true);
  };

  const handleClosePopup = () => {
    setDisplaySuccessPopup(false);
    onSuccess();
  };

  return (
    <div className="fixed inset-0 z-40 flex items-start justify-center overflow-y-auto bg-black bg-opacity-50 p-6">
      <div className="relative z-10 mt-10 w-full max-w-xl bg-white rounded shadow-lg">
        <button
          className="absolute -top-4 -right-4 bg-white border border-gray-300 px-2 py-1 rounded-full z-20 shadow-md"
          onClick={handleFormToggle}
        >
          X
        </button>

        <form onSubmit={handleSubmit} className="p-8 font-textFont text-lg">
          <h1 className="text-3xl font-headerFont text-darkBlue font-bold text-center mb-6">
            Đổi mật khẩu
          </h1>

          {/* Old Password */}
          <div className="mb-5">
            <label
              className="block text-black font-semibold mb-2"
              htmlFor="oldPassword"
            >
              Mật khẩu cũ
            </label>
            <input
              id="oldPassword"
              name="oldPassword"
              type="password"
              value={formData.oldPassword}
              onChange={handleChange}
              className="w-full border border-darkBlue px-4 py-2 rounded"
              placeholder="Nhập mật khẩu cũ"
            />
            {formErrors.oldPassword && (
              <p className="text-redError mt-1">{formErrors.oldPassword}</p>
            )}
          </div>

          {/* New Password */}
          <div className="mb-5">
            <label
              className="block text-black font-semibold mb-2"
              htmlFor="newPassword"
            >
              Mật khẩu mới
            </label>
            <input
              id="newPassword"
              name="newPassword"
              type="password"
              value={formData.newPassword}
              onChange={handleChange}
              className="w-full border border-darkBlue px-4 py-2 rounded"
              placeholder="Nhập mật khẩu mới"
            />
            {formErrors.newPassword && (
              <p className="text-redError mt-1">{formErrors.newPassword}</p>
            )}
          </div>

          {/* Confirm Password */}
          <div className="mb-6">
            <label
              className="block text-black font-semibold mb-2"
              htmlFor="confirmPassword"
            >
              Nhập lại mật khẩu mới
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full border border-darkBlue px-4 py-2 rounded"
              placeholder="Nhập lại mật khẩu mới"
            />
            {formErrors.confirmPassword && (
              <p className="text-redError mt-1">{formErrors.confirmPassword}</p>
            )}
          </div>

          <div className="text-center">
            <button
              type="submit"
              className="bg-darkBlue text-white px-6 py-2 rounded-full"
            >
              Gửi
            </button>
          </div>
        </form>

        {showConfirmPopup && (
          <ConfirmationPopup
            isOpen={true}
            text="Bạn chắc chắn muốn đổi mật khẩu?"
            onConfirm={handleConfirm}
            onDecline={() => setShowConfirmPopup(false)}
          />
        )}

        {displaySuccessPopup && (
          <SuccessPopup
            isOpen={true}
            successPopupText="Mật khẩu đã được đổi thành công!"
            onClose={handleClosePopup}
          />
        )}
      </div>
    </div>
  );
};
export default PasswordInputForm;

PasswordInputForm.propTypes = {
  handleFormToggle: PropTypes.func,
  onSuccess: PropTypes.func,
};
