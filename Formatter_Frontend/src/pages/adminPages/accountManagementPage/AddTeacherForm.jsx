import PropTypes from "prop-types";
import { useState, useEffect } from "react";
import { refreshTokenApi } from "../../../services/api";
import api from "../../../services/api";
import FormField from "../../../component/forms/SubmitThesisFormComponents/FormField";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
dayjs.extend(customParseFormat);

const AddTeacherForm = () => {
  const fields = [
    { label: "Họ và tên cán bộ", minLength: 5 },
    { label: "Mã số cán bộ", minLength: 4 },
    { label: "Ngày sinh", type: "date" },
    { label: "Số điện thoại", minLength: 10, type: "text" },
    { label: "Email", minLength: 5 },
    { label: "Giới tính", options: ["Nam", "Nữ"], type: "select" },
    { label: "Đơn vị (Khoa/Bộ môn)", type: "select" },
    { label: "Học hàm học vị", minLength: 0 },
    { label: "Vị trí công tác", minLength: 0 },
    { label: "Mật khẩu", minLength: 8, type: "password" },
    { label: "Nhập lại mật khẩu", minLength: 8, type: "password" },
  ];

  const [departmentsList, setDepartmentsList] = useState([]);
  const [selectedDepartmentId, setSelectedDepartmentId] = useState("");
  const [error, setError] = useState("");
  const [formErrors, setFormErrors] = useState({});
  const [resetSignal, setResetSignal] = useState(0);

  const [formInfo, setFormInfo] = useState(
    Object.fromEntries(fields.map((f) => [f.label, ""]))
  );

  const handleChange = (field, value) => {
    setFormInfo((prev) => ({ ...prev, [field]: value }));
    if (formErrors[field]) {
      setFormErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleSelectChange = (setSelectedId) => (field, value) => {
    setSelectedId(value);
    setFormInfo((prev) => ({ ...prev, [field]: value }));
  };

  useEffect(() => {
    fetchOptions(`/departments`, setDepartmentsList);
  }, []);

  const fetchOptions = async (endpoint, setList) => {
    try {
      const response = await refreshTokenApi.get(endpoint);
      setList(response.data.result);
    } catch (error) {
      console.error(`Error fetching ${endpoint}:`, error);
      setList([]);
    }
  };

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(""), 10000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const isValidDate = (value) => {
    return dayjs(value, "DD/MM/YYYY", true).isValid();
  };

  const validateForm = () => {
    const errors = {};

    fields.forEach(({ label, minLength, type }) => {
      const value = formInfo[label] || "";

      if (type === "select" && !value) {
        errors[label] = `Vui lòng chọn ${label.toLowerCase()}`;
      } else if (type === "date") {
        if (!value) {
          errors[label] = `Vui lòng chọn ${label.toLowerCase()}`;
        } else if (!isValidDate(value)) {
          errors[label] = `${label} không hợp lệ (định dạng đúng: dd/mm/yyyy)`;
        }
      } else {
        if (typeof minLength === "number" && value.trim().length < minLength) {
          errors[label] = `${label} phải có ít nhất ${minLength} ký tự`;
        }

        // ✅ Validate phone number is 10 digits
        if (
          label === "Số điện thoại" &&
          value.trim() &&
          !/^\d{10}$/.test(value.trim())
        ) {
          errors[label] = `${label} phải gồm đúng 10 chữ số`;
        }

        // ✅ Validate email format
        if (
          label === "Email" &&
          value.trim() &&
          !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())
        ) {
          errors[label] = `${label} không hợp lệ`;
        }
      }
    });

    // ✅ Password confirmation check
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

  const mapFormInfoToPayload = () => {
    return {
      password: formInfo["Mật khẩu"],
      name: formInfo["Họ và tên cán bộ"],
      dateOfBirth: dayjs(formInfo["Ngày sinh"], "DD/MM/YYYY").format(
        "YYYY-MM-DD"
      ),
      gender: formInfo["Giới tính"],
      phoneNumber: formInfo["Số điện thoại"],
      email: formInfo["Email"],
      status: "active",
      userId: formInfo["Mã số cán bộ"],
      degree: formInfo["Học hàm học vị"],
      position: formInfo["Vị trí công tác"],
      department: {
        departmentId: selectedDepartmentId,
      },
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      const dataToSend = mapFormInfoToPayload();
      try {
        await api.post("/teachers", dataToSend);

        alert("Đăng ký thành công!");

        setFormInfo(Object.fromEntries(fields.map((f) => [f.label, ""])));
        setResetSignal((prev) => prev + 1);
      } catch (error) {
        const errorData = error.response?.data;

        if (
          errorData?.code === "1009" &&
          errorData.message === "Duplicate key"
        ) {
          setError("Mã CB đã tồn tại");
        } else {
          setError(errorData?.message || "Đăng ký thất bại. Vui lòng thử lại!");
        }
      }

      setFormErrors({});
    }
  };

  const specialSelectFields = {
    "Đơn vị (Khoa/Bộ môn)": {
      options: departmentsList.map((d) => ({
        key: d.departmentId,
        value: d.departmentName,
      })),
      onChange: handleSelectChange(setSelectedDepartmentId),
    },
  };

  return (
    <div className="p-6  flex justify-center">
      <div className="px-16 py-5 w-full">
        {error && (
          <p className="text-lg text-redError text-center mb-4">{error}</p>
        )}

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
            {fields.map((field, index) => {
              const { label, type, minLength } = field;
              const isSpecialSelect = specialSelectFields[label];

              return (
                <FormField
                  type={
                    type === "password"
                      ? "password"
                      : field.type === "select" || isSpecialSelect
                      ? "select"
                      : field.type === "date"
                      ? "date"
                      : "fieldInfo"
                  }
                  key={index}
                  label={label}
                  value={formInfo[label]}
                  onChange={
                    isSpecialSelect ? isSpecialSelect.onChange : handleChange
                  }
                  error={formErrors[label]}
                  options={
                    isSpecialSelect ? isSpecialSelect.options : field.options
                  }
                  minLength={minLength}
                  resetSignal={resetSignal}
                />
              );
            })}
          </div>

          <button
            type="submit"
            className="text-white text-xl py-2 px-4 rounded-md bg-gradient-to-r from-[#23A9E1] to-[#0249AE] w-full mt-6 mb-10"
          >
            <p className="text-headerFont text-xl text-center">ĐĂNG KÝ</p>
          </button>
        </form>
      </div>
    </div>
  );
};

AddTeacherForm.propTypes = {};
export default AddTeacherForm;
