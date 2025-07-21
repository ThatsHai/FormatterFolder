import { useState, useEffect } from "react";
import api from "../../services/api";
import ShortAnswer from "../../component/forms/SubmitThesisFormComponents/ShortAnswer";
import ReactQuill from "react-quill";
import SelectField from "../../component/SelectField";
import { useSelector } from "react-redux";
import AddingTeacherField from "./AddingTeacherField";
import AddingMajorField from "./major/AddingMajorField";
import DesignsListWindow from "../../component/DesignListWindow";
import LongAnswer from "../../component/LongAnswer";
import MonthPicker from "../../component/MonthPicker";
import AddingStudentField from "./student/AddingStudentField";
import dayjs from "dayjs";
import SuccessPopup from "../../component/SuccessPopup";
import ConfirmationPopup from "../../component/ConfirmationPopup";

const TopicSuggestionPage = ({
  handleFormToggle = () => {},
  onSuccess = () => {},
  initialData = null,
}) => {
  const [formData, setFormData] = useState({
    formId: "",
    title: "",
    description: "",
    researchContent: "",
    objective: "",
    objectiveDetails: "",
    funding: "",
    fundingSource: "",
    time: "",
    implementationTime: "",
    teacherIds: [],
    contactInfo: "",
    majorIds: [],
    studentIds: [],
    // year: implementationTime?.getFullYear() || new Date().getFullYear(),
    // semester:
    //   implementationTime?.getMonth() || new Date().getMonth()
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
  const [studentsList, setStudentsList] = useState([]);
  const [openAddStudentModal, setOpenAddStudentModal] = useState(false);
  const [showConfirmPopup, setShowConfirmPopup] = useState(false);
  const [displaySuccessPopup, setDisplaySuccessPopup] = useState(false);
  const [successPopupText, setSuccessPopupText] = useState("");

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
    if (initialData) {
      setFormData({
        ...initialData,
        fundingSource:
          initialData.funding?.split("Nguồn ")[1]?.trim() || "",
        formId: initialData.form.formId,
      });
      setForms([initialData.form]);
      setTeachersList(initialData.teachers || [currentTeacher]);
      setMajorsList(initialData.majors || []);
      setStudentsList(initialData.students || []);
    } else {
      const getForms = async () => {
        const forms = await fetchForms();
        setForms(forms);
      };
      getForms();
    }
    console.log("initialTopic: ", initialData);
  }, [initialData]);

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

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      studentIds: studentsList.map((student) => student.userId),
    }));
    if (studentsList.length > 0) {
      setFormErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.studentIds;
        return newErrors;
      });
    }
  }, [studentsList]);

  const validateForm = () => {
    console.log("formData after initialData:", formData);
    const errors = {};
    if (!formData.formId) errors.formId = "Vui lòng chọn loại biểu mẫu.";
    if (!formData.title.trim())
      if (!formData.funding.trim())
        errors.title = "Tên đề tài không được để trống.";
    if (!formData.objectiveDetails.trim())
      errors.objectiveDetails = "Mục tiêu cụ thể không được để trống.";
    if (!formData.researchContent.trim())
      errors.researchContent = "Nội dung nghiên cứu không được để trống.";
    if (!formData.time.trim()) errors.time = "Thời gian không được để trống.";
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
  const submitData = async () => {
    const rawFunding = formData.funding.replace(/,/g, "").replace(/[^\d]/g, "");
    const isFundingEmpty = !rawFunding || /^0+$/.test(rawFunding);

    const fundingSource = formData.fundingSource.trim();
    let formattedFunding = "";

    if (isFundingEmpty) {
      formattedFunding = fundingSource || "";
    } else {
      const cleanedFunding = rawFunding.replace(/^0+/, "");
      const amount = `${formatNumberWithCommas(
        cleanedFunding
      )} ${currencyUnit}`;
      formattedFunding = fundingSource
        ? `${amount} - Nguồn: ${fundingSource}`
        : amount;
    }

    const rawTime = formData.time.replace(/[^\d]/g, "");
    const cleanedTime = /^0+$/.test(rawTime) ? "0" : rawTime.replace(/^0+/, "");
    const formattedTime = cleanedTime ? `${cleanedTime} ${timeUnit}` : "";

    let computedYear = new Date().getFullYear();
    let computedSemester = "HK1";

    if (
      formData.implementationTime &&
      dayjs.isDayjs(formData.implementationTime)
    ) {
      const month = formData.implementationTime.month(); // 0-11
      computedYear = formData.implementationTime.year();
      computedSemester = month < 5 ? "HK2" : month < 9 ? "HK3" : "HK1";
    } else {
      const now = dayjs();
      computedYear = now.year();
      const month = now.month();
      computedSemester = month < 5 ? "HK2" : month < 9 ? "HK3" : "HK1";
    }

    const payload = {
      ...formData,
      funding: formattedFunding,
      time: formattedTime,
      year: computedYear,
      semester: computedSemester,
    };

    console.log("payload:", payload);
    const result = async () => {
      try {
        if (!initialData) {
          await api.post("/topics/create", payload);
          setSuccessPopupText("Đề tài đã được lưu thành công!");
        } else {
          await api.put(`/topics/update`, payload);
          setSuccessPopupText("Đề tài đã được cập nhật thành công!");
        }
        setDisplaySuccessPopup(true);
      } catch (error) {
        // console.error("Error submitting topic form:", error);
        if (error.response.status === 500){
          alert("Sinh viên bạn chọn đang thực hiện 1 đề tài khác!");
        }
      }
    };
    result();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form data:", formData);
    if (!validateForm()) return;
    setShowConfirmPopup(true);
  };

  const onSuccessPopupClosed = () => {
    setShowConfirmPopup(false);
    setDisplaySuccessPopup(false);
    onSuccess();
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
                disabled={!!initialData}
              ></SelectField>
              <button
                type="button"
                tooltip="Xem pdf tương ứng"
                className="ml-2 bg-lightBlue text-white rounded-full w-8 h-8 flex items-center justify-center text-xl shadow hover:bg-blue-600"
                title="Xem danh sách thiết kế"
                onClick={() => {
                  setShowDesignWindow(true);
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
            title="GIỚI THIỆU ĐỀ TÀI (nếu có)"
            name="description"
            value={formData.description}
            error={formErrors.description}
            handleChange={handleChange}
          ></ShortAnswer>
          <LongAnswer
            label="3. NỘI DUNG NGHIÊN CỨU"
            value={formData.researchContent}
            onChange={(val) => onUpdateFormData("researchContent", val)}
            maxChars={500}
            error={formErrors.researchContent}
          />

          <div className="relative text-start font-textFont text-lg m-8 mt-3 px-10">
            <h3 className="text-black font-semibold mb-2">4. MỤC TIÊU</h3>
            <ShortAnswer
              className="!m-2 px-5 pr-0"
              order="4.1"
              title="Mục tiêu tổng quát (nếu có)"
              name="objective"
              value={formData.objective}
              error={formErrors.objective}
              handleChange={handleChange}
            ></ShortAnswer>
            <div className="w-full relative mb-2 m-8 pr-8">
              <h3 className="text-black font-semibold">4.2 Mục tiêu cụ thể</h3>
              <ReactQuill
                className="w-full border border-darkBlue mt-4"
                theme="snow"
                value={formData.objectiveDetails || ""}
                onChange={(value) =>
                  onUpdateFormData("objectiveDetails", value)
                }
                placeholder="Nhập mô tả chi tiết về mục tiêu đề tài..."
                error={formErrors.objectiveDetails}
              />
              {formErrors.objectiveDetails && (
                <p className="text-redError pt-2">
                  {formErrors.objectiveDetails}
                </p>
              )}
            </div>
          </div>
          <div className="relative text-start font-textFont text-lg m-8 mb-0 px-10">
            <h3 className="text-black font-semibold m-0">
              5. KINH PHÍ (nếu có, chỉ nhập số)
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
            order="6"
            title="NGUỒN KINH PHÍ (nếu có)"
            name="fundingSource"
            value={formData.fundingSource}
            error={formErrors.fundingSource}
            handleChange={handleChange}
          ></ShortAnswer>
          <div className="relative text-start font-textFont text-lg m-8 mb-0 px-10">
            <h3 className="text-black font-semibold m-0">
              7. THỜI GIAN (chỉ nhập số)
            </h3>
            <div className="flex gap-12 items-start">
              <div className="flex-1">
                <ShortAnswer
                  className="!m-0 !px-0"
                  name="time"
                  value={formData.time.replace(/[^\d]/g, "")}
                  error={
                    !timeUnit
                      ? "Vui lòng chọn đơn vị thời gian trước khi nhập số."
                      : formErrors.time
                  }
                  handleChange={(e) => {
                    const numeric = e.target.value.replace(/[^\d]/g, "");
                    const timeString = `${numeric} ${timeUnit}`;
                    onUpdateFormData(
                      "time",
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
                  const numeric = formData.time.replace(/[^\d]/g, "");
                  onUpdateFormData(
                    "time",
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
          <MonthPicker
            label="8. THÁNG BẮT ĐẦU THỰC HIỆN"
            value={formData.implementationTime}
            field="implementationTime"
            onChange={onUpdateFormData}
            error={formErrors.implementationTime}
          />

          <AddingTeacherField
            className="flex items-center relative text-start font-textFont text-lg m-8 px-10"
            title="9. CÁN BỘ HƯỚNG DẪN"
            teachersList={teachersList}
            setTeachersList={setTeachersList}
            swapTeachers={swapTeachers}
            formErrors={formErrors}
            openAddTeacherModal={openAddTeacherModal}
            setOpenAddTeacherModal={setOpenAddTeacherModal}
          ></AddingTeacherField>
          <ShortAnswer
            order="10"
            title="THÔNG TIN LIÊN HỆ (có thể chỉnh sửa)"
            name="contactInfo"
            value={formData.contactInfo}
            error={formErrors.contactInfo}
            handleChange={handleChange}
          ></ShortAnswer>

          <AddingMajorField
            className="flex items-center relative text-start font-textFont text-lg m-8 px-10"
            title="11. DÀNH CHO SINH VIÊN NGÀNH"
            majorsList={majorsList}
            setMajorsList={setMajorsList}
            formErrors={formErrors}
            openAddMajorModal={openAddMajorModal}
            setOpenAddMajorModal={setOpenAddMajorModal}
          ></AddingMajorField>
          <AddingStudentField
            className="flex items-start relative text-start font-textFont text-lg m-8 px-10"
            title="12. SINH VIÊN THỰC HIỆN (nếu có)"
            studentsList={studentsList}
            setStudentsList={setStudentsList}
            formErrors={formErrors}
            openAddStudentModal={openAddStudentModal}
            setOpenAddStudentModal={setOpenAddStudentModal}
          />

          {/* <div className="relative text-start font-textFont text-lg m-8 px-10">
            <h3 className="text-black font-semibold">
              12. THỜI ĐIỂM TẠO ĐỀ TÀI
            </h3>
            <div className="flex justify-between gap-3 items-start mt-2">
              <p className="w-1/2">Năm: {formData.year}</p>
              <p className="w-1/2">Học kỳ: {formData.semester}</p>
            </div>
          </div> */}
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
        {showConfirmPopup && (
          <ConfirmationPopup
            isOpen={true}
            text={
              initialData
                ? "Bạn chắc chắn cập nhật đề tài? Mọi thay đổi sẽ được lưu và hiển thị cho sinh viên!"
                : "Bạn chắc chắn muốn lưu đề tài?"
            }
            onConfirm={() => {
              setShowConfirmPopup(false);
              submitData();
            }}
            onDecline={() => {
              setShowConfirmPopup(false);
            }}
          ></ConfirmationPopup>
        )}
        {displaySuccessPopup && (
          <SuccessPopup
            isOpen={true}
            successPopupText={successPopupText}
            onClose={onSuccessPopupClosed}
          />
        )}
      </div>
    </div>
  );
};

export default TopicSuggestionPage;
