import { useState } from "react";
import { useNavigate } from "react-router-dom";
import FieldInfo from "../component/FieldInfo.jsx";
import PasswordField from "../component/PasswordField.jsx";

const Login = () => {
  const navigate = useNavigate();

  const fields = [
    { label: "Họ và tên sinh viên", minLength: 5 },
    { label: "Mã số sinh viên", minLength: 8 },
    { label: "Ngành", minLength: 2 },
    { label: "Đơn vị (Khoa/Bộ môn)", minLength: 2 },
    { label: "Khoa/Trường", minLength: 2 },
    { label: "Mật khẩu", minLength: 8, type: "password" },
    { label: "Nhập lại mật khẩu", minLength: 8, type: "password" },
  ];

  const [formInfo, setFormInfo] = useState(
    Object.fromEntries(fields.map((f) => [f.label, ""]))
  );
  const [formErrors, setFormErrors] = useState({});
  const [resetSignal, setResetSignal] = useState(0);

  const handleChange = (field, value) => {
    setFormInfo((prev) => ({ ...prev, [field]: value }));
    if (formErrors[field]) {
      setFormErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const validateForm = () => {
    const errors = {};

    fields.forEach(({ label, minLength }) => {
      const value = formInfo[label] || "";
      if (value.trim().length < minLength) {
        errors[label] = `${label} phải có ít nhất ${minLength} ký tự`;
      }
    });

    if (
      formInfo["Mật khẩu"] &&
      formInfo["Nhập lại mật khẩu"] &&
      formInfo["Mật khẩu"] !== formInfo["Nhập lại mật khẩu"]
    ) {
      errors["Nhập lại mật khẩu"] = "Mật khẩu không khớp";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      console.log("Form submitted:", formInfo);
      setFormInfo(Object.fromEntries(fields.map((f) => [f.label, ""])));
      setResetSignal((prev) => prev + 1);
      navigate("/login");
    }
  };

  return (
    <>
      <div className="px-16 py-5">
        <p className="text-5xl text-darkBlue font-headerFont text-center font-bold">
          Đăng ký
        </p>
        <p className="text-[1.8rem] text-gray mt-2 opacity-80">
          Hệ thống Đề cương luận văn luận án
        </p>
      </div>
      <form onSubmit={handleSubmit}>
        {fields.map((field) => {
          const FieldComponent =
            field.type === "password" ? PasswordField : FieldInfo;
          return (
            <FieldComponent
              key={field.label}
              label={field.label}
              value={formInfo[field.label]}
              onChange={handleChange}
              error={formErrors[field.label]}
              minLength={field.minLength}
              resetSignal={resetSignal}
            />
          );
        })}
        <button
          type="submit"
          className="text-white text-xl py-2 px-4 rounded-md bg-gradient-to-r from-[#23A9E1] to-[#0249AE] w-full mb-10"
        >
          <p className="text-headerFont text-xl text-center">ĐĂNG KÝ</p>
        </button>
      </form>
    </>
  );
};

export default Login;
