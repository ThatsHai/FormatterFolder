import { useState, useEffect } from "react";
import api from "../../services/api";
import ShortAnswer from "../../component/forms/SubmitThesisFormComponents/ShortAnswer";
import ReactQuill from "react-quill";
import SelectField from "../../component/SelectField";
import { useSelector } from "react-redux";
import AddingTeacherField from "./AddingTeacherField";
import AddingMajorField from "./major/AddingMajorField"
import { major } from "@mui/material";
const TopicSuggestionPage = ({
  handleFormToggle = () => {},
  onSuccess = () => {},
}) => {
  const [formData, setFormData] = useState({
    formId: "",
    title: "",
    description: "",
    objective: "",
    funding: "",
    fundingSource: "",
    implementationTime: "",
    teacherIds: [],
    contactInfo: "",
    majorIds: [],
  });
  const [teachersList, setTeachersList] = useState([]); // currentUserTeacher là giáo viên đăng nhập
  const [openAddTeacherModal, setOpenAddTeacherModal] = useState(false);
  const [majorsList, setMajorsList] = useState([]);
  const [formErrors, setFormErrors] = useState({});
  const user = useSelector((state) => state.auth.user);
  const [currentUserTeacher, setCurrentUserTeacher] = useState(user);
  const [forms, setForms] = useState([]);
  const [openAddMajorModal, setOpenAddMajorModal] = useState(false);


  const onUpdateFormData = (fieldName, value) => {
    setFormData((prev) => ({ ...prev, [fieldName]: value }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const fetchForms = async () => {
    try {
      const response = await api.get("/forms");
      return response.data.result;
    } catch (error) {
      console.error("Error fetching majors:", error);
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

  // useEffect(() => {
  //   const getMajors = async () => {
  //     const majors = await fetchMajors();
  //     setMajorsOptions(majors);
  //   };
  //   getMajors();
  //   console.log("currentUserTeacher", currentUserTeacher);
  // }, []);

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      teacherIds: teachersList.map((t) => t.userId),
    }));
  }, [teachersList]);

  useEffect(() => {
    if (teachersList[0]?.email) {
      setFormData((prev) => ({
        ...prev,
        contactInfo: teachersList[0].email,
      }));
    }
  }, [teachersList]);

  useEffect(() => {
  setFormData((prev) => ({
    ...prev,
    majorIds: majorsList.map((major) => major.majorId), 
  }));
}, [majorsList]);

  // const handleRemoveTeacher = (userId) => {
  //   setTeachersList((prev) => prev.filter(t => t.userId !== userId || t.isDefault));
  // };

  const validateForm = () => {
    const errors = {};

    if (!formData.title.trim())
      errors.title = "Tên đề tài không được để trống.";
    if (!formData.description.trim())
      errors.description = "Mô tả không được để trống.";
    if (!formData.objective.trim())
      errors.objective = "Mục tiêu không được để trống.";
    if (!formData.funding.trim())
      errors.funding = "Kinh phí không được để trống.";
    if (!formData.fundingSource.trim())
      errors.fundingSource = "Nguồn kinh phí không được để trống.";
    if (!formData.implementationTime.trim())
      errors.implementationTime = "Thời gian thực hiện không được để trống.";
    if (!formData.contactInfo.trim())
      errors.contactInfo = "Thông tin liên hệ không được để trống.";
    if (majorsList.length === 0)
      errors.majorIds = "Vui lòng chọn ngành cho sinh viên thực hiện đề tài.";
    if (teachersList.length === 0)
      errors.teacherIds = "Phải có ít nhất một cán bộ hướng dẫn.";
    else console.log("teachersList", teachersList);

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form data:", formData);
    if (!validateForm()) return;

    const result = async () => {
      try {
        await api.post("/topics/create", formData);

        onSuccess();
      } catch (error) {
        console.error("Error submitting topic form:", error);
      }
    };
    result();
  };
  // const fetchMajors = async () => {
  //   try {
  //     const response = await api.get("/majors");
  //     return response.data.result.map((major) => ({
  //       key: major.majorId,
  //       value: major.majorName,
  //     }));
  //   } catch (error) {
  //     console.error("Error fetching majors:", error);
  //     return [];
  //   }
  // };

  return (
    <div className="fixed inset-0 z-40 flex items-start justify-center overflow-y-auto bg-black bg-opacity-50 p-6">
      <div className="relative z-10 mt-10 w-full max-w-3xl bg-white rounded shadow-lg">
        <button
          className="absolute -top-4 -right-4 bg-white border border-gray-300 px-2 py-1 rounded-full z-20 shadow-md"
          onClick={handleFormToggle}
        >
          X
        </button>
        <form className="w-full" onSubmit={handleSubmit}>
          <h1 className="text-4xl font-headerFont text-darkBlue font-bold text-center m-6">
            Đề xuất đề tài
          </h1>
          {/* Form */}
         <div className="relative text-start font-textFont text-lg m-8 px-10">
            <h2 className="text-black font-semibold">
              LOẠI BIỂU MẪU TƯƠNG ỨNG
            </h2>
            <SelectField
              className="mt-2 mb-4"
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
          <div className="relative text-start font-textFont text-lg m-8 px-10">
           <h2 className="text-lightBlue font-semibold">
              THÔNG TIN ĐỀ TÀI
            </h2>
          </div>
          <ShortAnswer
            order="1"
            VNTitle="TÊN ĐỀ TÀI"
            ENTitle="title"
            formData={formData}
            error={formErrors.title}
            handleChange={handleChange}
          ></ShortAnswer>
          <ShortAnswer
            order="2"
            VNTitle="MÔ TẢ"
            ENTitle="description"
            formData={formData}
            error={formErrors.description}
            handleChange={handleChange}
          ></ShortAnswer>
          <div className="relative text-start font-textFont text-lg m-8 px-10">
            <h3 className="text-black font-semibold mb-2">3. MỤC TIÊU</h3>
            <ReactQuill
              className="w-full border border-darkBlue"
              theme="snow"
              value={formData.objective || ""}
              onChange={(value) => onUpdateFormData("objective", value)}
              placeholder="Nhập mô tả chi tiết về mục tiêu đề tài..."
              error={formErrors.objective}
            />
            {formErrors.objective && (
              <p className="text-redError pt-2">{formErrors.objective}</p>
            )}
          </div>

          <ShortAnswer
            order="4"
            VNTitle="KINH PHÍ"
            ENTitle="funding"
            formData={formData}
            error={formErrors.funding}
            handleChange={handleChange}
          ></ShortAnswer>
          <ShortAnswer
            order="5"
            VNTitle="NGUỒN KINH PHÍ"
            ENTitle="fundingSource"
            formData={formData}
            error={formErrors.fundingSource}
            handleChange={handleChange}
          ></ShortAnswer>

          <ShortAnswer
            order="6"
            VNTitle="THỜI GIAN THỰC HIỆN"
            ENTitle="implementationTime"
            formData={formData}
            error={formErrors.implementationTime}
            handleChange={handleChange}
          ></ShortAnswer>

          <AddingTeacherField
            className="flex items-center relative text-start font-textFont text-lg m-8 px-10"
            title="7. CÁN BỘ HƯỚNG DẪN"
            teachersList={teachersList}
            setTeachersList={setTeachersList}
            formErrors={formErrors}
            openAddTeacherModal={openAddTeacherModal}
            setOpenAddTeacherModal={setOpenAddTeacherModal}
          ></AddingTeacherField>
          <ShortAnswer
            order="8"
            VNTitle="THÔNG TIN LIÊN HỆ"
            ENTitle="contactInfo"
            formData={formData}
            error={formErrors.contactInfo}
            handleChange={handleChange}
          ></ShortAnswer>

          {/* <div className="relative text-start font-textFont text-lg m-8 px-10">
            <h3 className="text-black font-semibold">
              9. DÀNH CHO SINH VIÊN NGÀNH
            </h3>

            <SelectField
              className="!m-0"
              key={"majorId"}
              label={"majorId"}
              value={formData.majorId}
              onChange={handleSelectChange}
              error={formErrors.majorId}
              options={majorsOptions}
              showLabel={false}
            ></SelectField>
          </div> */}

          <AddingMajorField
            className="flex items-center relative text-start font-textFont text-lg m-8 px-10"
            title="8. DÀNH CHO SINH VIÊN NGÀNH"
            majorsList={majorsList}
            setMajorsList={setMajorsList}
            formErrors={formErrors}
            openAddMajorModal={openAddMajorModal}
            setOpenAddMajorModal={setOpenAddMajorModal}
          ></AddingMajorField>

          <div className="m-6 text-center">
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

export default TopicSuggestionPage;