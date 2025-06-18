import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import FieldInfo from "../component/FieldInfo.jsx";
import PasswordField from "../component/PasswordField.jsx";
import SelectField from "../component/SelectField.jsx";
import api, { noTokenApi } from "../services/api.js";
import dayjs from "dayjs";
import { loginSuccess } from "../redux/authSlice";
import { useDispatch } from "react-redux";
import FormField from "../component/forms/SubmitThesisFormComponents/FormField.jsx";

const SignUp = () => {
  const navigate = useNavigate();

  const fields = [
    { label: "Họ và tên sinh viên", minLength: 5 },
    { label: "Mã số sinh viên", minLength: 8 },
    { label: "Ngày sinh", minLength: 10, type: "date" },
    { label: "Số điện thoại", minLength: 10, type: "number" },
    { label: "Giới tính", options: ["Nam", "Nữ"], type: "select" },
    { label: "Khoa/Trường/Viện", type: "select" },
    { label: "Đơn vị (Khoa/Bộ môn)", type: "select" },
    { label: "Ngành", type: "select" },
    { label: "Lớp", type: "select" },
    { label: "Mật khẩu", minLength: 8, type: "password" },
    { label: "Nhập lại mật khẩu", minLength: 8, type: "password" },
  ];

  const [facultiesList, setFacultiesList] = useState([]);
  const [departmentsList, setDepartmentsList] = useState([]);
  const [majorsList, setMajorsList] = useState([]);
  const [studentClassesList, setStudentClassesList] = useState([]);
  const [selectedFacultyId, setSelectedFacultyId] = useState("");
  const [selectedDepartmentId, setSelectedDepartmentId] = useState("");
  const [selectedMajorId, setSelectedMajorId] = useState("");
  const [selectedClassId, setSelectedClassId] = useState("");

  const [error, setError] = useState("");
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(""), 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const fetchOptions = async (endpoint, setList) => {
    try {
      const response = await noTokenApi.get(endpoint);
      setList(response.data.result);
    } catch (error) {
      setList([]);
      console.error(`Error fetching ${endpoint}:`, error);
    }
  };
  useEffect(() => {
    fetchOptions(`/faculties`, setFacultiesList);
  }, []);

  useEffect(() => {
    if (!selectedFacultyId) {
      setDepartmentsList([]);
      return;
    }
    fetchOptions(
      `/departments?facultyId=${selectedFacultyId}`,
      setDepartmentsList
    );
  }, [selectedFacultyId]);

  useEffect(() => {
    if (!selectedDepartmentId) {
      setMajorsList([]);
      return;
    }
    fetchOptions(`majors?departmentId=${selectedDepartmentId}`, setMajorsList);
  }, [selectedDepartmentId]);

  useEffect(() => {
    if (!selectedMajorId) {
      setStudentClassesList([]);
      return;
    }
    fetchOptions(`classes?majorId=${selectedMajorId}`, setStudentClassesList);
  }, [selectedMajorId]);

  const handleSelectChange = (selectedId) => (field, value) => {
    selectedId(value);
    setFormInfo((prev) => ({ ...prev, [field]: value }));
  };

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

    fields.forEach(({ label, minLength, type }) => {
      const value = formInfo[label] || "";
      if (type === "select" || type === "date") {
        if (value === "") {
          errors[label] = `Vui lòng chọn ${label.toLowerCase()}`;
        }
      } else {
        if (value.trim().length < minLength) {
          errors[label] = `${label} phải có ít nhất ${minLength} ký tự`;
        }
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
    if (validateForm()) {
      const mapFormInfoToPayload = () => {
        return {
          name: formInfo["Họ và tên sinh viên"],
          userId: formInfo["Mã số sinh viên"],
          dateOfBirth: dayjs(formInfo["Ngày sinh"]).format("DD-MM-YYYY"), // định dạng theo backend
          gender: formInfo["Giới tính"],
          phoneNumber: formInfo["Số điện thoại"],
          classId: selectedClassId,
          password: formInfo["Mật khẩu"],
        };
      };
      const dataToSend = mapFormInfoToPayload();

      try {
        await noTokenApi.post("/students", dataToSend);
        console.log("Form submitted:", dataToSend);

        const loginResponse = await noTokenApi.post(`/auth/token`, dataToSend);
        const accessToken = loginResponse.data.result.accesstoken;

        await saveToken(accessToken);
        const user = await fetchInfo();

        dispatch(loginSuccess({ user, accessToken }));
        alert(JSON.stringify(user));

        setFormInfo(Object.fromEntries(fields.map((f) => [f.label, ""])));
        setResetSignal((prev) => prev + 1);
        navigate("/");
      } catch (error) {
        setError(
          error.response.data.message || "Đăng ký thất bại. Vui lòng thử lại!"
        );
      }
      setFormErrors({});
    }
  };

  const specialSelectFields = {
  "Khoa/Trường/Viện": {
    options: facultiesList.map((f) => ({
      key: f.facultyId,
      value: f.facultyName,
    })),
    onChange: handleSelectChange(setSelectedFacultyId),
  },
  "Đơn vị (Khoa/Bộ môn)": {
    options: departmentsList.map((d) => ({
      key: d.departmentId,
      value: d.departmentName,
    })),
    onChange: handleSelectChange(setSelectedDepartmentId),
  },
  "Ngành": {
    options: majorsList.map((m) => ({
      key: m.majorId,
      value: m.majorName,
    })),
    onChange: handleSelectChange(setSelectedMajorId),
  },
  "Lớp": {
    options: studentClassesList.map((c) => ({
      key: c.studentClassId,
      value: c.studentClassName,
    })),
    onChange: handleSelectChange(setSelectedClassId),
  },
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
      {error && (
        <p className="text-lg text-redError text-center mb-4">{error}</p>
      )}
    </div>
    <form onSubmit={handleSubmit}>
      {fields.map((field) => {
        const { label, type, minLength } = field;

        const isSpecialSelect = specialSelectFields[label];

        return (
          <FormField
            key={label}
            type={type === "password" ? "password" : field.type === "select" || isSpecialSelect ? "select" : "fieldInfo"}
            label={label}
            value={formInfo[label]}
            onChange={isSpecialSelect ? isSpecialSelect.onChange : handleChange}
            error={formErrors[label]}
            options={isSpecialSelect ? isSpecialSelect.options : field.options}
            minLength={minLength}
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
      <p className="text-gray text-center">
        Đã có tài khoản?{" "}
        <span
          className="text-darkBlue cursor-pointer"
          onClick={() => navigate("/login")}
        >
          Đăng nhập ngay
        </span>
      </p>
    </form>
  </>
);

};

export default SignUp;
