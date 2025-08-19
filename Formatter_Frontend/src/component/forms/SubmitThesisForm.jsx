import PropTypes from "prop-types";
import { useState, useEffect, useCallback } from "react";

import DisabledField from "./SubmitThesisFormComponents/DisabledField";
import api from "../../services/api";
import { useSelector } from "react-redux";
import SelectField from "../SelectField";
import TopicDetail from "./SubmitThesisFormComponents/TopicDetail";
import AddingTeacherField from "../../pages/teacherPages/AddingTeacherField";
import FormField from "./SubmitThesisFormComponents/FormField";
import ConfirmationPopup from "../ConfirmationPopup";
import SuccessPopup from "../SuccessPopup";
import { debounce } from "lodash";
import axios from "axios";

const SubmitThesisForm = ({
  handleFormToggle = () => {},
  onSuccess = () => {},
  initialData = null,
}) => {
  const student = useSelector((state) => state.auth.user);
  const currentYear = new Date().getFullYear();
  const [formData, setFormData] = useState({
    formId: "",
    topicId: "",
    studentId: student?.userId,
    formRecordFields: [],
  });
  const [openAddTeacherTable, setOpenAddTeacherTable] = useState(false);
  const [forms, setForms] = useState([]);
  const [selectedForm, setSelectedForm] = useState("");
  const [topics, setTopics] = useState([]);
  const [selectedTopic, setSelectedTopic] = useState("");
  const [teachersList, setTeachersList] = useState([]);
  const [openAddTeacherModal, setOpenAddTeacherModal] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [currentStep, setCurrentStep] = useState(1);

  const [showConfirmPopup, setShowConfirmPopup] = useState(false);
  const [displaySuccessPopup, setDisplaySuccessPopup] = useState(false);
  const [successPopupText, setSuccessPopupText] = useState("");
  const [spellErrors, setSpellErrors] = useState({});
  const [activeSpellCheckField, setActiveSpellCheckField] = useState(null);

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setShowConfirmPopup(true);
  };

  const onSuccessPopupClosed = () => {
    setShowConfirmPopup(false);
    setDisplaySuccessPopup(false);
    onSuccess();
  };

  const submitData = async () => {
    try {
      let fieldsToSend = formData.formRecordFields;
      if (initialData) {
        fieldsToSend = formData.formRecordFields.filter((field) => {
          const initialField = initialData.formRecordFields.find(
            (f) => f.formRecordFieldId === field.formRecordFieldId
          );

          return !initialField || initialField.value !== field.value;
        });
      }
      console.log("fields to send: ", fieldsToSend);
      if (initialData && fieldsToSend.length === 0) {
        setSuccessPopupText(
          "Không có trường nào thay đổi, không cần cập nhật!"
        );
        setDisplaySuccessPopup(true);
        return;
      }

      const dataToSend = {
        ...formData,
        formRecordFields: fieldsToSend,
      };
      console.log("Data to send: ", dataToSend);
      if (initialData) {
        await api.put("/formRecords/update", dataToSend);
        setSuccessPopupText("Cập nhật bản ghi thành công!");
      } else {
        await api.post("/formRecords/create", dataToSend);
        setSuccessPopupText("Lưu bản ghi mới thành công!");
      }
      setDisplaySuccessPopup(true);
    } catch (error) {
      console.log("Error submitting " + error);
    }
  };
  useEffect(() => {
    if (initialData) {
      setFormData({
        formRecordId: initialData.formRecordId,
        // formId: initialData.topic.form.formId,
        // topicId: initialData.topic.topicId,
        // studentId: initialData.student.userId,
        formRecordFields: initialData.formRecordFields.map((f) => ({
          formRecordFieldId: f.formRecordFieldId,
          formFieldId: f.formField.formFieldId,
          value: f.value,
        })),
      });
    }

    console.log("initialData: ", initialData);
  }, [initialData]);
  useEffect(() => {
    if (!initialData && selectedForm?.formFields?.length > 0) {
      setFormData((prev) => ({
        ...prev,
        formRecordFields: selectedForm.formFields.map((field) => ({
          formFieldId: field.formFieldId,
          value: "", // giữ cả khi bỏ trống
        })),
      }));
    }
  }, [selectedForm, initialData]);

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

      if (initialData) {
        const matchedForm = forms.find(
          (f) => f.formId === initialData.topic.form.formId
        );
        if (matchedForm) {
          setSelectedForm(matchedForm);
          setFormData((prev) => ({
            ...prev,
            formId: matchedForm.formId,
          }));
        }
      }
    };
    getForms();
  }, []);

  useEffect(() => {
    const getTopics = async () => {
      const topics = await fetchTopics(formData.formId || selectedForm.formId);
      setTopics(topics);
      if (initialData) {
        const matchedTopic = topics.find(
          (t) => t.topicId === initialData.topic.topicId
        );
        // console.log("topic matched: ", matchedTopic);
        if (matchedTopic) {
          setSelectedTopic(matchedTopic);
          setFormData((prev) => ({
            ...prev,
            topicId: matchedTopic.topicId,
          }));
        }
      }
    };
    getTopics();
  }, [formData.formId]);

  const handleSelectChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (field === "formId") {
      const form = forms.find((f) => f.formId === value);
      setSelectedForm(form || null);
      setSelectedTopic(null);
      setFormData((prev) => ({ ...prev, topicId: "" })); // reset topicId
    }
    if (field === "topicId") {
      const topic = topics.find((t) => t.topicId === value);
      setSelectedTopic(topic || null);
    }
  };

  const checkSpelling = async (formFieldId, text) => {
    try {
      const response = await api.post("/client/spellcheck", { text });

      const data = response.data;

      const misspelledWordsWithSuggestions = {};
      if (data.result) {
        Object.entries(data.result).forEach(([word, suggestions]) => {
          misspelledWordsWithSuggestions[word.toLowerCase()] = suggestions;
        });
      }

      setSpellErrors((prev) => ({
        ...prev,
        [formFieldId]: misspelledWordsWithSuggestions,
      }));

      setActiveSpellCheckField(formFieldId);

      console.log("Spell check results:", misspelledWordsWithSuggestions);
    } catch (err) {
      console.error("Spell check failed:", err);
    }
  };

  // const handleFormFieldChange = (formFieldId, value) => {
  //   setFormData((prev) => {
  //     const existingIndex = prev.formRecordFields.findIndex(
  //       (f) => f.formFieldId === formFieldId
  //     );

  //     let updatedFields;
  //     if (existingIndex !== -1) {
  //       updatedFields = [...prev.formRecordFields];
  //       updatedFields[existingIndex].value = value;
  //     } else {
  //       updatedFields = [...prev.formRecordFields, { formFieldId, value }];
  //     }

  //     return {
  //       ...prev,
  //       formRecordFields: updatedFields,
  //     };
  //   });
  // };

  const handleFormFieldChange = (formFieldId, value) => {
    setFormData((prev) => {
      const existingIndex = prev.formRecordFields.findIndex(
        (f) => f.formFieldId === formFieldId
      );

      let updatedFields;
      if (existingIndex !== -1) {
        updatedFields = [...prev.formRecordFields];
        updatedFields[existingIndex].value = value;
      } else {
        updatedFields = [...prev.formRecordFields, { formFieldId, value }];
      }

      return {
        ...prev,
        formRecordFields: updatedFields,
      };
    });
  };

  return (
    <div className="fixed inset-0 z-40 flex items-start justify-center overflow-y-auto bg-black bg-opacity-50 p-6">
      {/* Modal content wrapper */}
      <div className="relative z-10 mt-10 w-full max-w-4xl bg-white rounded shadow-lg p-6">
        {/* Close button just outside modal corner */}
        <button
          className="absolute -top-4 -right-4 bg-white border border-gray-300 px-2 py-1 rounded-full z-20 shadow-md"
          onClick={handleFormToggle}
        >
          X
        </button>

        <form className="w-full" onSubmit={handleSubmit}>
          {/* Page 1*/}
          {currentStep === 1 && (
            <>
              <h1 className="text-4xl font-headerFont text-darkBlue font-bold text-center mb-6">
                THÔNG TIN CHUNG
              </h1>

              {/* Form */}
              <div className="relative text-start w-full font-textFont text-lg mb-8 px-10">
                <h3 className="text-black font-semibold">
                  1. CHỌN LOẠI BIỂU MẪU
                </h3>
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
                  disabled={!!initialData}
                ></SelectField>
              </div>
              {/* Topic */}
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
                  disabled={!!initialData}
                ></SelectField>
              </div>
              {/* Student Information */}
              <div className="relative text-start w-full font-textFont text-lg mb-8 px-10">
                <h3 className="text-black font-semibold mb-3">
                  3. NGƯỜI THỰC HIỆN
                </h3>
                <DisabledField
                  title="Tên sinh viên"
                  value={student?.name}
                ></DisabledField>
                <DisabledField
                  title="Khóa (MSSV)"
                  value={student?.userId}
                ></DisabledField>
                <DisabledField
                  title="Ngành"
                  value={student?.studentClass.major.majorName}
                ></DisabledField>
                <DisabledField
                  title="Đơn vị (Khoa/Bộ môn)"
                  value={student?.studentClass.major.department.departmentName}
                ></DisabledField>
                <DisabledField
                  title="Khoa/Trường"
                  value={
                    student?.studentClass.major.department.faculty.facultyName
                  }
                ></DisabledField>
              </div>
              <div className="relative text-start w-full font-textFont text-lg mb-8 px-10">
                <h3 className="text-black font-semibold">
                  4. THÔNG TIN ĐỀ TÀI
                </h3>
                <TopicDetail
                  topic={selectedTopic || {}}
                  onChange={handleSelectChange}
                  formErrors={formErrors}
                ></TopicDetail>
              </div>
              {!initialData && selectedTopic?.students?.length > 0 ? (
                <p className="text-redError pt-2 text-center">
                  Đề tài này đã có sinh viên thực hiện, vui lòng chọn đề tài
                  khác!
                </p>
              ) : selectedTopic?.majors?.length > 0 ? (
                selectedTopic.majors.some(
                  (major) =>
                    major.majorId === student?.studentClass?.major?.majorId
                ) ? (
                  <div className="mt-6 text-center">
                    <button
                      type="button"
                      className="bg-darkBlue text-white px-6 py-2 rounded-full"
                      onClick={() => setCurrentStep(2)}
                    >
                      Tiếp tục
                    </button>
                  </div>
                ) : (
                  <p className="text-redError pt-2 text-center">
                    Đề tài không thuộc ngành học của bạn
                  </p>
                )
              ) : null}
            </>
          )}
          {/* Page 2 */}
          {currentStep === 2 && (
            <>
              <h1 className="text-4xl font-headerFont text-darkBlue font-bold text-center mb-6">
                {selectedForm.title}
              </h1>
              {selectedForm?.formFields?.length > 0 &&
                selectedForm.formFields
                  ?.slice()
                  .sort((a, b) => (a.position ?? 0) - (b.position ?? 0))
                  .map((field) => {
                    const fieldValue =
                      formData.formRecordFields.find(
                        (f) => f.formFieldId === field.formFieldId
                      )?.value || "";

                    const fieldErrors = spellErrors[field.formFieldId] || {};

                    return (
                      <div key={field.formFieldId} className="mb-6">
                        <FormField
                          type={field.fieldType || ""}
                          name={field.fieldName}
                          title={field.fieldName}
                          order={field.position + 1}
                          maxWords={field.length}
                          value={fieldValue}
                          handleChange={(e) =>
                            handleFormFieldChange(
                              field.formFieldId,
                              e.target.value
                            )
                          }
                        />

                        {field.fieldType !== "TABLE" && (
                          <button
                            type="button"
                            className="mx-8 my-0 px-10 text-sm text-blue-600"
                            onClick={() =>
                              checkSpelling(field.formFieldId, fieldValue)
                            }
                          >
                            Kiểm tra chính tả
                          </button>
                        )}

                        {/* Hiển thị lỗi sai dưới field */}
                        {activeSpellCheckField === field.formFieldId &&
                          (Object.keys(fieldErrors).length > 0 ? (
                            <div className="m-8 px-10 mt-2 text-sm text-red-600">
                              <p>Từ có thể sai:</p>
                              <ul className="list-disc list-inside">
                                {Object.entries(fieldErrors).map(
                                  ([word, suggestions]) => (
                                    <li key={word}>
                                      <span className="font-semibold">
                                        {word}
                                      </span>
                                      {suggestions.length > 0 && (
                                        <span> → {suggestions.join(", ")}</span>
                                      )}
                                    </li>
                                  )
                                )}
                              </ul>
                            </div>
                          ) : (
                            <div className="m-8 px-10 mt-2 text-sm text-green-600">
                              <p> Không phát hiện lỗi sai.</p>
                            </div>
                          ))}
                      </div>
                    );
                  })}

              <div className="mt-6 flex justify-between">
                <button
                  type="button"
                  className="bg-darkBlue text-white px-6 py-2 rounded-full"
                  onClick={() => setCurrentStep(1)}
                >
                  Quay lại
                </button>

                <button
                  type="submit"
                  className="bg-darkBlue text-white px-6 py-2 rounded-full"
                  onClick={(e) => handleSubmit(e)}
                >
                  Lưu
                </button>
              </div>
            </>
          )}

          {/* Submit Button */}
        </form>
        {showConfirmPopup && (
          <ConfirmationPopup
            isOpen={true}
            text={
              initialData
                ? "Bạn chắc chắn cập nhật bản ghi?"
                : "Bạn chắc chắn muốn lưu bản ghi?"
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

SubmitThesisForm.propTypes = {
  handleFormToggle: PropTypes.func,
  onSuccess: PropTypes.func,
  initialData: PropTypes.object,
};

export default SubmitThesisForm;
//Chưa gán điều kiện topic hiện theo ngành sinh viên đang học
