import PropTypes from "prop-types";
import { useState, useEffect } from "react";

import DisabledField from "./SubmitThesisFormComponents/DisabledField";
import api from "../../services/api";
import { useSelector } from "react-redux";
import SelectField from "../SelectField";
import TopicDetail from "./SubmitThesisFormComponents/TopicDetail";
import AddingTeacherField from "../../pages/teacherPages/AddingTeacherField";

const SubmitThesisForm = ({
  handleFormToggle = () => {},
  onSuccess = () => {},
}) => {
  const student = useSelector((state) => state.auth.user);
  const currentYear = new Date().getFullYear();
  const [formData, setFormData] = useState({
    formId: "",
    topicId: "",
    student: {
      name: student?.name,
      studentId: student?.userId,
      majorName: student?.studentClass.major.majorName,
      departmentName: student?.studentClass.major.department.departmentName,
      facultyName: student?.studentClass.major.department.faculty.facultyName,
    },
  });
  const [openAddTeacherTable, setOpenAddTeacherTable] = useState(false);
  const [forms, setForms] = useState([]);
  const [topics, setTopics] = useState([]);
  const [selectedTopic, setSelectedTopic] = useState("");
  const [teachersList, setTeachersList] = useState([]);
  const [openAddTeacherModal, setOpenAddTeacherModal] = useState(false);
  const [formErrors, setFormErrors] = useState({});

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
    const result = async () => {
      try {
        await api.post("/form/submit", formData);
        onSuccess();
      } catch (error) {
        console.log("Error submitting " + error);
      }
    };
    result();
  };

  useEffect(() => {
    document.body.classList.add("overflow-hidden");
    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, []);

  const fetchForms = async () => {
    try {
      const response = await api.get("/forms");
      return response.data.result;
    } catch (error) {
      console.error("Error fetching majors:", error);
      return [];
    }
  };

  const fetchTopics = async (formId) => {
    try {
      const response = await api.get(`/topics?formId=${formId}`);
      return response.data.result;
    } catch (error) {
      console.error("Error fetching topics:", error);
      return [];
    }
  };

  useEffect(() => {
    const getForms = async () => {
      const forms = await fetchForms();
      setForms(forms);
    };
    getForms();
  }, []);

  useEffect(() => {
    const getTopics = async () => {
      const topics = await fetchTopics(formData.formId);
      setTopics(topics);
    };
    getTopics();
  }, [formData.formId]);

  const handleSelectChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (field === "formId") {
    setSelectedTopic(null); 
    setFormData((prev) => ({ ...prev, topicId: "" })); // reset topicId
  }
    if (field === "topicId") {
      const topic = topics.find((t) => t.topicId === value);
      setSelectedTopic(topic || null);
    }
  };

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
            THÔNG TIN CHUNG
          </h1>

          {/* Form */}
          <div className="relative text-start w-full font-textFont text-lg mb-8 px-10">
            <h3 className="text-black font-semibold">1. CHỌN LOẠI BIỂU MẪU</h3>
            <SelectField
              className="!m-0"
              key={"formId"}
              label={"formId"}
              value={formData.formId}
              onChange={handleSelectChange}
              error={""}
              options={forms.map((form) => ({
                key: form.formId,
                value: form.title,
              }))}
              showLabel={false}
            ></SelectField>
          </div>
          <div className="relative text-start w-full font-textFont text-lg mb-8 px-10">
            <h3 className="text-black font-semibold">2. CHỌN ĐỀ TÀI</h3>
            <SelectField
              className="!m-0"
              key={"topicId"}
              label={"topicId"}
              value={formData.topicId}
              onChange={handleSelectChange}
              error={""}
              options={topics.map((topic) => ({
                key: topic.topicId,
                value: topic.title,
              }))}
              showLabel={false}
            ></SelectField>
          </div>
          {/* Student Information */}
          <div className="relative text-start w-full font-textFont text-lg mb-8 px-10">
            <h3 className="text-black font-semibold mb-3">
              3. NGƯỜI THỰC HIỆN
            </h3>
            {/* Student info */}
            <DisabledField
              title="Tên sinh viên"
              value={formData.student.name}
            ></DisabledField>
            <DisabledField
              title="Khóa (MSSV)"
              value={formData.student.studentId}
            ></DisabledField>
            <DisabledField
              title="Ngành"
              value={formData.student.majorName}
            ></DisabledField>
            <DisabledField
              title="Đơn vị (Khoa/Bộ môn)"
              value={formData.student.departmentName}
            ></DisabledField>
            <DisabledField
              title="Khoa/Trường"
              value={formData.student.facultyName}
            ></DisabledField>
          </div>

            {/* Year */}
            {/* <div className="w-full grid grid-cols-3 items-center mb-3">
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
            </div> */}
          

          {/* Teacher */}
          {/* <AddingTeacherField
          className="relative flex items-start text-start w-full font-textFont text-lg mb-8 px-10"
            title="3. CÁN BỘ HƯỚNG DẪN"
            teachersList={teachersList}
            setTeachersList={setTeachersList}
            formErrors={formErrors}
            openAddTeacherModal={openAddTeacherModal}
            setOpenAddTeacherModal={setOpenAddTeacherModal}
          ></AddingTeacherField> */}

          {/* Introduction */}
          {/* <div className="relative text-start w-full font-textFont text-lg mb-8 px-10">
            <h3 className="text-black font-semibold mb-2">4. GIỚI THIỆU</h3>
            <textarea
              name="introduction"
              id=""
              placeholder="Nội dung giới thiệu"
              className="border w-full p-3 rounded-md resize-none"
              onChange={handleChange}
            ></textarea>
          </div> */}

          <div className="relative text-start w-full font-textFont text-lg mb-8 px-10">
            <h3 className="text-black font-semibold mb-3">
              4. THÔNG TIN ĐỀ TÀI
            </h3>
             <TopicDetail
              topic={selectedTopic || {}}
              onChange={handleSelectChange}
              formErrors={formErrors}
            ></TopicDetail>
          </div>
          
          {/* Submit Button */}
          <div className="mt-6 text-center">
            <button
              type="submit"
              className="bg-darkBlue text-white px-6 py-2 rounded-full"
              onClick={(e) => handleSubmit(e)}
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
  onSuccess: PropTypes.func,
};

export default SubmitThesisForm;
