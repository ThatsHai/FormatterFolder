import { useState, useEffect } from "react";
import api from "../../services/api";
import ShortAnswer from "../../component/forms/SubmitThesisFormComponents/ShortAnswer";
import ReactQuill from "react-quill";
import SelectField from "../../component/SelectField";
import { useSelector } from "react-redux";
import AddingTeacherField from "./AddingTeacherField";
import AddingMajorField from "./major/AddingMajorField";
import DesignsListWindow from "../../component/DesignListWindow";

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
    year: new Date().getFullYear(),
    semester:
      new Date().getMonth() < 5
        ? "HK2"
        : new Date().getMonth() < 9
        ? "HK3"
        : "HK1",
  });
  const user = useSelector((state) => state.auth.user);
  const [currentTeacher, setCurrentTeacher] = useState(user);
  const [teachersList, setTeachersList] = useState([currentTeacher]); // currentUserTeacher là giáo viên đăng nhập
  const [openAddTeacherModal, setOpenAddTeacherModal] = useState(false);
  const [majorsList, setMajorsList] = useState([]);
  const [formErrors, setFormErrors] = useState({});
  const [currencyUnit, setCurrencyUnit] = useState("VND");
  const [timeUnit, setTimeUnit] = useState("tháng");

  const [forms, setForms] = useState([]);
  const [openAddMajorModal, setOpenAddMajorModal] = useState(false);
  const [showDesignWindow, setShowDesignWindow] = useState(false);

  const onUpdateFormData = (fieldName, value) => {
    setFormData((prev) => ({ ...prev, [fieldName]: value }));
    setFormErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[fieldName];
      return newErrors;
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    setFormErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[name];
      return newErrors;
    });
  };

  const handleSelectChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setFormErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[field];
      return newErrors;
    });
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

  const swapTeachers = (index1, index2) => {
    setTeachersList((prev) => {
      const newList = [...prev];
      [newList[index1], newList[index2]] = [newList[index2], newList[index1]];
      return newList;
    });
  };

  useEffect(() => {
    const getForms = async () => {
      const forms = await fetchForms();
      setForms(forms);
    };
    getForms();
  }, []);

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      teacherIds: teachersList.map((t) => t.userId),
    }));
    if (teachersList.length > 0) {
      setFormErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.teacherIds;
        return newErrors;
      });
    }
  }, [teachersList]);

  useEffect(() => {
    if (teachersList.length === 0) {
      setFormData((prev) => ({
        ...prev,
        contactInfo: "",
      }));
    } else if (teachersList[0]?.email) {
      setFormData((prev) => ({
        ...prev,
        contactInfo: teachersList[0].email,
      }));
    }
    setFormErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors.teacherIds;
      return newErrors;
    });
  }, [teachersList]);

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      majorIds: majorsList.map((major) => major.majorId),
    }));
    if (majorsList.length > 0) {
      setFormErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.majorIds;
        return newErrors;
      });
    }
  }, [majorsList]);

  const validateForm = () => {
    const errors = {};
    if (!formData.formId) errors.formId = "Vui lòng chọn loại biểu mẫu.";
    if (!formData.title.trim())
      errors.title = "Tên đề tài không được để trống.";
    if (!formData.description.trim())
      errors.description = "Mô tả không được để trống.";
    if (!formData.objective.trim())
      errors.objective = "Mục tiêu không được để trống.";
    if (!formData.funding.trim())
      errors.funding = "Kinh phí không được để trống.";
    if (!currencyUnit) errors.funding = "Vui lòng chọn đơn vị tiền tệ";

    if (!formData.fundingSource.trim())
      errors.fundingSource = "Nguồn kinh phí không được để trống.";
    if (!formData.implementationTime.trim())
      errors.implementationTime = "Thời gian thực hiện không được để trống.";
    if (!timeUnit)
      errors.implementationTime = "Vui lòng chọn đơn vị thời gian.";
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

  const formatNumberWithCommas = (numStr) => {
    if (!numStr) return "";
    return numStr.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form data:", formData);
    if (!validateForm()) return;

    // normalize funding & implementationTime
    const formatNumberWithCommas = (numStr) => {
      return numStr.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    };

    const rawFunding = formData.funding.replace(/,/g, "").replace(/[^\d]/g, "");
    const cleanedFunding = /^0+$/.test(rawFunding)
      ? "0"
      : rawFunding.replace(/^0+/, "");
    const formattedFunding = cleanedFunding
      ? `${formatNumberWithCommas(cleanedFunding)} ${currencyUnit}`
      : "";

    const rawTime = formData.implementationTime.replace(/[^\d]/g, "");
    const cleanedTime = /^0+$/.test(rawTime) ? "0" : rawTime.replace(/^0+/, "");
    const formattedTime = cleanedTime ? `${cleanedTime} ${timeUnit}` : "";

    const payload = {
      ...formData,
      funding: formattedFunding,
      implementationTime: formattedTime,
    };

    console.log("payload:", payload);
    const result = async () => {
      try {
        await api.post("/topics/create", payload);

        onSuccess();
      } catch (error) {
        console.error("Error submitting topic form:", error);
      }
    };
    result();
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
          {/* Form */}
          <div className="relative text-start font-textFont text-lg m-8 px-10">
            <h2 className="text-black font-semibold">
              LOẠI BIỂU MẪU TƯƠNG ỨNG
            </h2>
            <div className="flex items-center gap-2 mt-2 mb-4">
              <SelectField
                className="mt-2 mb-4 w-full"
                key={"formId"}
                label={"formId"}
                value={formData.formId}
                onChange={handleSelectChange}
                error={formErrors.formId || ""}
                options={forms.map((form) => ({
                  key: form.formId,
                  value: form.title,
                }))}
                showLabel={false}
              ></SelectField>
              <button
                type="button"
                tooltip="Xem pdf tương ứng"
                className="ml-2 bg-lightBlue text-white rounded-full w-8 h-8 flex items-center justify-center text-xl shadow hover:bg-blue-600"
                title="Xem danh sách thiết kế"
                onClick={() => {setShowDesignWindow(true);
                  console.log("formData.formId", formData.formId);
                }}
              >
                +
              </button>
            </div>
          </div>
          <div className="relative text-start font-textFont text-lg m-8 px-10">
            <h2 className="text-lightBlue font-semibold">THÔNG TIN ĐỀ TÀI</h2>
          </div>
          <ShortAnswer
            order="1"
            title="TÊN ĐỀ TÀI"
            name="title"
            value={formData.title}
            error={formErrors.title}
            handleChange={handleChange}
          ></ShortAnswer>
          <ShortAnswer
            order="2"
            title="MÔ TẢ"
            name="description"
            value={formData.description}
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
          <div className="relative text-start font-textFont text-lg m-8 mb-0 px-10">
            <h3 className="text-black font-semibold m-0">
              4. KINH PHÍ (chỉ nhập số)
            </h3>
            <div className="flex gap-12 items-start">
              <div className="flex-1">
                <ShortAnswer
                  className="!m-0 !px-0"
                  name="fundingNumeric"
                  value={formatNumberWithCommas(
                    formData.funding.replace(/[^\d]/g, "")
                  )}
                  error={
                    !currencyUnit
                      ? "Vui lòng chọn đơn vị tiền tệ trước khi nhập số."
                      : formErrors.funding
                  }
                  handleChange={(e) => {
                    const input = e.target.value.replace(/[^\d]/g, "");
                    const formatted = formatNumberWithCommas(input);
                    const fundingString = input
                      ? `${formatted} ${currencyUnit}`
                      : "";
                    onUpdateFormData("funding", fundingString);
                  }}
                />
              </div>
              <SelectField
                className="w-32 !my-1"
                key="currency"
                value={currencyUnit}
                onChange={(field, value) => {
                  setCurrencyUnit(value);
                  const numeric = formData.funding.replace(/[^\d]/g, "");
                  onUpdateFormData(
                    "funding",
                    numeric && value ? `${numeric} ${value}` : ""
                  );
                }}
                options={[
                  { key: "VND", value: "VND" },
                  { key: "USD", value: "USD" },
                ]}
                showLabel={false}
              />
            </div>
          </div>

          <ShortAnswer
            order="5"
            title="NGUỒN KINH PHÍ"
            name="fundingSource"
            value={formData.fundingSource}
            error={formErrors.fundingSource}
            handleChange={handleChange}
          ></ShortAnswer>
          <div className="relative text-start font-textFont text-lg m-8 mb-0 px-10">
            <h3 className="text-black font-semibold m-0">
              6. THỜI GIAN THỰC HIỆN (chỉ nhập số)
            </h3>
            <div className="flex gap-12 items-start">
              <div className="flex-1">
                <ShortAnswer
                  className="!m-0 !px-0"
                  name="implementationTimeNumeric"
                  value={formData.implementationTime.replace(/[^\d]/g, "")}
                  error={
                    !timeUnit
                      ? "Vui lòng chọn đơn vị thời gian trước khi nhập số."
                      : formErrors.implementationTime
                  }
                  handleChange={(e) => {
                    const numeric = e.target.value.replace(/[^\d]/g, "");
                    const timeString = `${numeric} ${timeUnit}`;
                    onUpdateFormData(
                      "implementationTime",
                      numeric && timeUnit ? timeString : ""
                    );
                  }}
                />
              </div>
              <SelectField
                className="w-32 !my-1"
                key="timeUnit"
                label="Đơn vị thời gian"
                value={timeUnit}
                onChange={(field, value) => {
                  setTimeUnit(value);
                  const numeric = formData.implementationTime.replace(
                    /[^\d]/g,
                    ""
                  );
                  onUpdateFormData(
                    "implementationTime",
                    numeric && value ? `${numeric} ${value}` : ""
                  );
                }}
                options={[
                  { key: "ngày", value: "ngày" },
                  { key: "tháng", value: "tháng" },
                  { key: "năm", value: "năm" },
                ]}
                showLabel={false}
              />
            </div>
          </div>
          <AddingTeacherField
            className="flex items-center relative text-start font-textFont text-lg m-8 px-10"
            title="7. CÁN BỘ HƯỚNG DẪN"
            teachersList={teachersList}
            setTeachersList={setTeachersList}
            swapTeachers={swapTeachers}
            formErrors={formErrors}
            openAddTeacherModal={openAddTeacherModal}
            setOpenAddTeacherModal={setOpenAddTeacherModal}
          ></AddingTeacherField>
          <ShortAnswer
            order="8"
            title="THÔNG TIN LIÊN HỆ (có thể chỉnh sửa)"
            name="contactInfo"
            value={formData.contactInfo}
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
            title="9. DÀNH CHO SINH VIÊN NGÀNH"
            majorsList={majorsList}
            setMajorsList={setMajorsList}
            formErrors={formErrors}
            openAddMajorModal={openAddMajorModal}
            setOpenAddMajorModal={setOpenAddMajorModal}
          ></AddingMajorField>
          <div className="relative text-start font-textFont text-lg m-8 px-10">
            <h3 className="text-black font-semibold">
              10. THỜI ĐIỂM TẠO ĐỀ TÀI
            </h3>
            <div className="flex justify-between gap-3 items-start mt-2">
              <p className="w-1/2">Năm: {formData.year}</p>
              <p className="w-1/2">Học kỳ: {formData.semester}</p>
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
        {showDesignWindow && (
        <DesignsListWindow
          formId={formData.formId}
          onDecline={() => setShowDesignWindow(false)}
        ></DesignsListWindow>
      )}
      </div>
      
    </div>
  );
};

export default TopicSuggestionPage;
