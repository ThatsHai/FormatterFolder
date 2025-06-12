import { useState, useEffect } from "react";
import api from "../../services/api";
import ShortAnswer from "../teacherPages/ShortAnswer";
import ReactQuill from "react-quill";
import AddingTeacher from "./AddingTeacher";
import TeachersTable from "./TeachersTable";
import SelectField from "../../component/SelectField";
const TopicSuggestionPage = ({
  handleFormToggle = () => {},
  onSuccess = () => {},
}) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    objective: "",
    fundingSource: "",
    implementationTime: "",
    teacherIds: [],
    contactInfo: "",
    majorId: "",
  });
  const [teachersList, setTeachersList] = useState([]); // currentUserTeacher là giáo viên đăng nhập
  const [openAddTeacherModal, setOpenAddTeacherModal] = useState(false);
  const [majorsOptions, setMajorsOptions] = useState([]);

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

  useEffect(() => {
    const getMajors = async () => {
      const majors = await fetchMajors();
      setMajorsOptions(majors);
    };
    getMajors();
  }, []);

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

  // const handleRemoveTeacher = (userId) => {
  //   setTeachersList((prev) => prev.filter(t => t.userId !== userId || t.isDefault));
  // };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form data:", formData);
    if (
      !formData.title ||
      !formData.description ||
      !formData.objective ||
      !formData.fundingSource ||
      !formData.implementationTime ||
      !formData.contactInfo ||
      !formData.majorId ||
      teachersList.length === 0
    ) {
      alert("Vui lòng điền đầy đủ thông tin trước khi gửi.");
      return;
    }
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
  const fetchMajors = async () => {
    try {
      const response = await api.get("/majors");
      return response.data.result.map((major) => ({
        key: major.majorId,
        value: major.majorName,
      }));
    } catch (error) {
      console.error("Error fetching majors:", error);
      return [];
    }
  };

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
          <ShortAnswer
            order="1"
            VNTitle="TÊN ĐỀ TÀI"
            ENTitle="title"
            formData={formData}
            handleChange={handleChange}
          ></ShortAnswer>
          <ShortAnswer
            order="2"
            VNTitle="MÔ TẢ"
            ENTitle="description"
            formData={formData}
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
            />
          </div>

          <ShortAnswer
            order="4"
            VNTitle="KINH PHÍ"
            ENTitle="funding"
            formData={formData}
            handleChange={handleChange}
          ></ShortAnswer>
          <ShortAnswer
            order="5"
            VNTitle="NGUỒN KINH PHÍ"
            ENTitle="fundingSource"
            formData={formData}
            handleChange={handleChange}
          ></ShortAnswer>

          <ShortAnswer
            order="6"
            VNTitle="THỜI GIAN THỰC HIỆN"
            ENTitle="implementationTime"
            formData={formData}
            handleChange={handleChange}
          ></ShortAnswer>
          <div className="flex items-center relative text-start font-textFont text-lg m-8 px-10">
            <h3 className="text-black font-semibold">7. CÁN BỘ HƯỚNG DẪN</h3>
            <button
              type="button"
              className="border text-xs rounded-md p-1 px-2 mx-3"
              onClick={() => setOpenAddTeacherModal(true)}
            >
              + Thêm CBHD
            </button>
          </div>
          <div className="max-w-xl mx-auto">
            <TeachersTable teachers={teachersList} />
          </div>
          {/* Modal thêm giáo viên */}
          {openAddTeacherModal && (
            <AddingTeacher
              onSelectTeachers={(selected) => setTeachersList(selected)}
              onClose={() => setOpenAddTeacherModal(false)}
            />
          )}

          <ShortAnswer
            order="8"
            VNTitle="THÔNG TIN LIÊN HỆ"
            ENTitle="contactInfo"
            formData={formData}
            handleChange={handleChange}
          ></ShortAnswer>

          <div className="relative text-start font-textFont text-lg m-8 px-10">
            <h3 className="text-black font-semibold">
              9. DÀNH CHO SINH VIÊN NGÀNH
            </h3>
            <div className="mt-2 mb-4">
              <SelectField
                className="!m-0"
                key={"majorId"}
                label={"majorId"}
                value={formData.majorId}
                onChange={handleSelectChange}
                error={""}
                options={majorsOptions}
                showLabel={false}
              ></SelectField>
            </div>
          </div>

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
    // Lấy danh sách form từ 1 cái id form có sẵn, lấy danh sách fields từ form đó
  );
};

export default TopicSuggestionPage;
