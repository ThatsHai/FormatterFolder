import PropTypes from "prop-types";
import { useState, useEffect } from "react";

import ShortAnswer from "./SubmitThesisFormComponents/ShortAnswer";
import DisabledField from "./SubmitThesisFormComponents/DisabledField";
import AddTeacherTable from "./SubmitThesisFormComponents/AddTeacherTable";

const SubmitThesisForm = ({ handleFormToggle = () => {} }) => {
  const currentYear = new Date().getFullYear();

  // Initialize form data state
  const [formData, setFormData] = useState({
    title: "Tên đề tài",
    studentName: "Nguyễn Văn A",
    studentId: "B2111111",
    department: "Tên ngành",
    unit: "Tên đơn vị",
    school: "Tên Khoa/Trường",
    year: currentYear,
    teachersList: [
      {
        Khoa: "Trường CNTT",
        MaBM: "Khoa CNTT",
        TenCB: "Nguyen V",
        MaCB: "0111",
      },
      {
        Khoa: "Trường CNTT",
        MaBM: "Khoa CNTT",
        TenCB: "Nguyen Y",
        MaCB: "0122",
      },
    ],
    introduction: "Giới thiệu",
  });
  const [openAddTeacherTable, setOpenAddTeacherTable] = useState(false);

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
  };

  const handleRemoveTeacher = (MaCB) => {
    setFormData((prev) => ({
      ...prev,
      teachersList: prev.teachersList.filter(
        (teacher) => teacher.MaCB !== MaCB
      ),
    }));
  };

  useEffect(() => {
    document.body.classList.add("overflow-hidden");
    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, []);

  // Generate years
  const yearOptions = [
    currentYear - 4,
    currentYear - 3,
    currentYear - 2,
    currentYear - 1,
    currentYear,
    currentYear + 1,
  ];

  return (
    <div className="fixed inset-0 z-40 flex items-start justify-center overflow-y-auto bg-black bg-opacity-50 p-6">
      {/* Modal content wrapper */}
      <div className="relative z-10 mt-10 w-full max-w-3xl bg-white rounded shadow-lg p-6">
        {/* Close button just outside modal corner */}
        <button
          className="absolute -top-4 -right-4 bg-white border border-gray-300 px-2 py-1 rounded-full z-20 shadow-md"
          onClick={handleFormToggle}
        >
          X
        </button>

        <form className="w-full" onSubmit={handleSubmit}>
          <h1 className="text-4xl font-headerFont text-darkBlue font-bold text-center mb-6">
            Đề cương
          </h1>

          {/* Title */}
          <ShortAnswer
            order="1"
            VNTitle="TÊN ĐỀ TÀI"
            ENTitle="title"
            formData={formData}
            handleChange={handleChange}
          ></ShortAnswer>

          {/* Student Information */}
          <div className="relative text-start w-full font-textFont text-lg mb-8 px-10">
            <h3 className="text-black font-semibold mb-3">
              2. NGƯỜI THỰC HIỆN
            </h3>
            {/* Student info */}
            <DisabledField
              VNTitle="Tên sinh viên"
              ENTitle="studentName"
              formData={formData}
            ></DisabledField>
            <DisabledField
              VNTitle="Khóa (MSSV)"
              ENTitle="studentId"
              formData={formData}
            ></DisabledField>
            <DisabledField
              VNTitle="Ngành"
              ENTitle="department"
              formData={formData}
            ></DisabledField>
            <DisabledField
              VNTitle="Đơn vị (Khoa/Bộ môn)"
              ENTitle="unit"
              formData={formData}
            ></DisabledField>
            <DisabledField
              VNTitle="Khoa/Trường"
              ENTitle="school"
              formData={formData}
            ></DisabledField>
            {/* Year */}
            <div className="w-full grid grid-cols-3 items-center mb-3">
              <p>Năm</p>
              <select
                className="col-span-2 border rounded-md px-4 py-1 w-1/4"
                name="year"
                value={formData.year}
                onChange={handleChange}
              >
                {yearOptions.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Teacher */}
          <div className="relative text-start w-full font-textFont text-lg mb-6 px-10">
            <div className="flex items-center mb-2">
              <h3 className="text-black font-semibold">3. CÁN BỘ HƯỚNG DẪN</h3>
              <button
                className="border text-xs rounded-md p-1 px-2 mx-3"
                onClick={() => setOpenAddTeacherTable(!openAddTeacherTable)}
              >
                {openAddTeacherTable ? "- Ẩn bảng chọn" : "+ Thêm CBHD"}
              </button>
            </div>
            {openAddTeacherTable && (
              <AddTeacherTable
                name="teacher"
                formData={formData}
                setFormData={setFormData}
              ></AddTeacherTable>
            )}
            <ul className="list-disc ml-5 space-y-1">
              {formData.teachersList?.map((teacher, index) => (
                <li key={index}>
                  <div className="flex justify-between items-center">
                    <span>
                      {teacher.TenCB} ({teacher.MaCB}) - {teacher.Khoa},{" "}
                      {teacher.MaBM}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleRemoveTeacher(teacher.MaCB)}
                      className="text-redError font-bold ml-4"
                    >
                      X
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Introduction */}
          <div className="relative text-start w-full font-textFont text-lg mb-8 px-10">
            <h3 className="text-black font-semibold mb-2">4. GIỚI THIỆU</h3>
            <textarea
              name="introduction"
              id=""
              placeholder="Nội dung giới thiệu"
              className="border w-full p-3 rounded-md resize-none"
              onChange={handleChange}
            ></textarea>
          </div>

          {/* Submit Button */}
          <div className="mt-6 text-center">
            <button
              type="submit"
              className="bg-darkBlue text-white px-6 py-2 rounded-full"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

SubmitThesisForm.propTypes = {
  handleFormToggle: PropTypes.func,
};

export default SubmitThesisForm;
