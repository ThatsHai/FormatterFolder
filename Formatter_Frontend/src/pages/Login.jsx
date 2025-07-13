import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import FieldInfo from "../component/FieldInfo.jsx";
import PasswordField from "../component/PasswordField.jsx";
import { useDispatch } from "react-redux";
import api, { refreshTokenApi } from "../services/api.js";
import { loginSuccess } from "../redux/authSlice";

const Login = () => {
  const navigate = useNavigate();
  const [error, setError] = useState("");

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(""), 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const fields = [
    { label: "Mã số người dùng", minLength: 5 },
    { label: "Mật khẩu", minLength: 8, type: "password" },
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

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const saveToken = async (jwtToken) => {
    sessionStorage.removeItem("accessToken");
    sessionStorage.setItem("accessToken", jwtToken);
  };

  const dispatch = useDispatch();

  const fetchInfo = async () => {
    const response = await api.get("/myInfo");
    return response.data.result;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    const mapFormInfoToPayload = () => ({
      userId: formInfo["Mã số người dùng"],
      password: formInfo["Mật khẩu"],
    });

    const dataToSend = mapFormInfoToPayload();

    try {
      console.log("Form submitted:", dataToSend);
      const loginResponse = await refreshTokenApi.post(
        `/auth/token`,
        dataToSend
      );
      const accessToken = loginResponse.data.result.accesstoken;

      await saveToken(accessToken);
      const user = await fetchInfo();

      dispatch(loginSuccess({ user, accessToken }));

      setFormInfo(Object.fromEntries(fields.map((f) => [f.label, ""])));
      setResetSignal((prev) => prev + 1);
      alert(JSON.stringify(user));
      const roleName = user.role?.name?.toUpperCase();

      if (roleName === "STUDENT") {
        navigate("/student");
      } else if (roleName === "TEACHER") {
        navigate("/teacher");
      } else {
        // If role is missing or not recognized, assume admin
        navigate("/admin");
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Đăng nhập thất bại";

      if (errorMessage === "Incorrect password") {
        setError("Mã số hoặc mật khẩu không chính xác");
      } else {
        setError(errorMessage);
      }
    }
  };

  return (
    <>
      <div className="px-16 py-5">
        <p className="text-5xl text-darkBlue font-headerFont text-center font-bold">
          Đăng nhập
        </p>
        <p className="text-[1.8rem] text-gray mt-2 opacity-80">
          Hệ thống Đề cương luận văn luận án
        </p>
        {error && (
          <p className="text-lg text-redError text-center mb-4">{error}</p>
        )}
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
          <p className="text-headerFont text-xl text-center">ĐĂNG NHẬP</p>
        </button>
        <p className="text-gray text-center">
          Chưa có tài khoản?{" "}
          <span
            className="text-darkBlue cursor-pointer"
            onClick={() => navigate("/signup")}
          >
            Đăng ký ngay
          </span>
        </p>
      </form>
    </>
  );
};

export default Login;
