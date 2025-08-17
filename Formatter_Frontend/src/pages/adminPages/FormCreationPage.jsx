import { useState, useRef } from "react";
import QuestionFrame from "./adminComponents/QuestionFrame";
import ConfirmationPopup from "../../component/ConfirmationPopup";
import { v4 as uuidv4 } from "uuid";
import api from "../../services/api";
import { useNavigate } from "react-router";
import SuccessPopup from "../../component/SuccessPopup";

const FormCreationPage = () => {
  const [form, setForm] = useState({
    title: "",
    description: "",
    readersList: ["TEACHER", "STUDENT"],
    formFields: [
      {
        position: 0,
        fieldName: "",
        formFieldId: uuidv4(),
        description: "",
        fieldType: "",
        length: 0,
      },
      {
        position: 1,
        fieldName: "",
        formFieldId: uuidv4(),
        description: "",
        fieldType: "",
        length: 0,
      },
    ],
  });

  //For popup
  const [displayConfirmationPopup, setDisplayConfirmationPopup] =
    useState(false);
  const [displaySuccessPopup, setDisplaySuccessPopup] = useState(false);
  //For validation
  const [emptyFields, setEmptyFields] = useState([]);
  const [emptyTitleError, setEmptyTitleError] = useState(false);

  const textareaRef = useRef(null);
  const navigate = useNavigate();

  const onBasicInfoChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const readerLabels = {
    "TEACHER AND STUDENT": "Giáo viên và Sinh viên",
    TEACHER: "Giáo viên",
    STUDENT: "Sinh viên",
  };

  const addNewFormField = () => {
    const newField = {
      position: form.formFields.length,
      fieldName: "",
      description: "",
      formFieldId: uuidv4(),
      fieldType: "",
      length: 0,
    };
    setForm((prev) => ({
      ...prev,
      formFields: [...prev.formFields, newField],
    }));
  };

  const autoResize = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      const scrollHeight = textarea.scrollHeight;
      textarea.style.height = Math.max(scrollHeight, 50) + "px"; // Min height ~50px
    }
  };

  //Display confirmation popup
  const handleValidateForm = () => {
    if (form.title.trim() === "") {
      setEmptyTitleError(true);
    } else {
      setEmptyTitleError(false);
    }
    //Check fields with empty question. Tables can have empty question
    const emptyFields = form.formFields.filter(
      (f) => f.fieldType !== "TABLE" && f.fieldName.trim() === ""
    );

    setEmptyFields(emptyFields);
    if (emptyFields.length === 0 && form.title !== "") {
      setDisplayConfirmationPopup(true);
    }
  };

  //When click ok, then send data
  const handleSendFormData = async () => {
    try {
      const dataToSend = {
        title: form.title.trim(),
        description: form.description.trim(),
        readersList: form.readersList,
        formFields: form.formFields.map((field) => {
          let fieldName = field.fieldName?.trim() || "";
  
          if (field.fieldType === "TABLE") {
            // Split once, keep everything after the first ::: intact
            const parts = (field.fieldName || "").split(":::");
            const questionName = (parts[0] || "").trim();
            const html = parts.slice(1).join(":::"); // safely rejoin
            fieldName = `${questionName}:::${field.tableHtml || html}`;
          }
  
          return {
            ...field,
            fieldName,
            fieldType: field.fieldType?.trim() || "",
            description: field.description?.trim() || "",
          };
        }),
      };
  
      const result = await api.post("/forms/create", dataToSend);
      console.log(result);
      setDisplaySuccessPopup(true);
    } catch (err) {
      const status = err.response?.status; // 409, 400, 500...
      const backendCode = err.response?.data?.code; // e.g. "DUPLICATE_NAME"
      if (status === 409 || backendCode === "DUPLICATE_NAME") {
        alert("Tên biểu mẫu đã tồn tại");
      }
    }
  };
  

  const onSuccessPopupClosed = () => {
    setDisplayConfirmationPopup(false);
    setDisplaySuccessPopup(false);
    navigate("/admin/forms");
  };

  return (
    <div className="w-full min-h-screen bg-lightGray p-4">
      <div className="grid place-items-center w-full h-full">
        <div className="w-2/3 space-y-4">
          {/* Basic info */}
          <div className="font-textFont bg-white p-6 rounded-md shadow-md border-t-4 border-darkBlue">
            <textarea
              ref={textareaRef}
              placeholder="Tiêu đề biểu mẫu"
              className="w-full text-center text-3xl font-semibold text-darkBlue border-b border-gray focus:outline-none p-2 pt resize-none overflow-hidden leading-tight rounded-md placeholder:text-lightBlue"
              onInput={autoResize}
              rows={1}
              onChange={(e) => onBasicInfoChange(e)}
              name="title"
            />
            {emptyTitleError && (
              <p className="text-redError">Tên biểu mẫu không được để trống</p>
            )}

            <div className="mt-4">
              <label className="text-sm">Đối tượng sử dụng:</label>
              <select
                className="w-full text-lg border border-gray rounded-md p-3 focus:outline-none focus:ring-1 focus:ring-darkBlue resize-none overflow-hidden leading-tight"
                value={
                  form.readersList.includes("TEACHER") &&
                  form.readersList.includes("STUDENT")
                    ? "TEACHER AND STUDENT"
                    : form.readersList[0]
                }
                onChange={(e) => {
                  const value = e.target.value;
                  const newReadersList =
                    value === "TEACHER AND STUDENT"
                      ? ["TEACHER", "STUDENT"]
                      : [value];

                  setForm((prev) => ({
                    ...prev,
                    readersList: newReadersList,
                  }));
                }}
              >
                {Object.keys(readerLabels).map((reader) => (
                  <option key={reader} value={reader}>
                    {readerLabels[reader]}
                  </option>
                ))}
              </select>
            </div>

            <div className="mt-4">
              <label className="text-sm">Mô tả biểu mẫu:</label>
              <textarea
                placeholder="Mô tả nội dung biểu mẫu"
                className="w-full text-lg border border-gray rounded-md p-3 focus:outline-none focus:ring-1 focus:ring-darkBlue resize-none overflow-hidden leading-tight"
                onInput={autoResize}
                rows={2}
                onChange={(e) => onBasicInfoChange(e)}
                name="description"
                value={form.description}
              />
            </div>
          </div>

          {/* Form field mapping */}
          {form.formFields.map((formField) => (
            <QuestionFrame
              key={formField.formFieldId}
              form={form}
              setForm={setForm}
              formField={formField}
              emptyFields={emptyFields}
            />
          ))}

          {/* Add new field layout */}
          <div className="bg-white w-full p-2 rounded-md shadow-md border-2 border-gray border-dashed">
            <button
              className="w-full text-lg text-gray"
              onClick={() => addNewFormField()}
            >
              Thêm đề mục
            </button>
          </div>

          <div className="w-full flex justify-end font-textFont">
            <button
              className="bg-darkGray text-white font-semibold shadow-md py-2 px-4  rounded-md"
              onClick={() => handleValidateForm()}
            >
              Lưu
            </button>
            <ConfirmationPopup
              isOpen={displayConfirmationPopup}
              text="Xác nhận tạo form này?"
              onDecline={() => setDisplayConfirmationPopup(false)}
              onConfirm={() => handleSendFormData()}
            ></ConfirmationPopup>
            <SuccessPopup
              isOpen={displaySuccessPopup}
              successPopupText="Đã tạo form thành công!"
              onClose={() => onSuccessPopupClosed()}
            ></SuccessPopup>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormCreationPage;
