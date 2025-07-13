import { useState, useRef, useEffect } from "react";
import QuestionFrame from "./adminComponents/QuestionFrame";
import ConfirmationPopup from "../../component/ConfirmationPopup";
import { v4 as uuidv4 } from "uuid";
import api from "../../services/api";
import { useNavigate } from "react-router";

const FormCreationPage = () => {
  const [form, setForm] = useState({
    title: "Tiêu đề biểu mẫu",
    description: "Tua cua cai form",
    formFields: [
      {
        position: 0,
        fieldName: "",
        formFieldId: uuidv4(),
        description: "",
        fieldType: "",
      },
      {
        position: 1,
        fieldName: "",
        formFieldId: uuidv4(),
        description: "",
        fieldType: "",
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

  // useEffect(() => {
  //   console.log(form);
  // }, [form]);

  const onBasicInfoChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const addNewFormField = () => {
    const newField = {
      position: form.formFields.length,
      fieldName: "",
      description: "",
      formFieldId: uuidv4(),
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
  const handleSaveForm = () => {
    const emptyFields = form.formFields.filter((form) => form.fieldName === "");
    if (form.title.trim() === "") {
      setEmptyTitleError(true);
    } else {
      setEmptyTitleError(false);
    }
    setEmptyFields(emptyFields);
    if (emptyFields.length === 0 && form.title !== "") {
      setDisplayConfirmationPopup(true);
    }
  };

  const handleSendFormData = async () => {
    try {
      const result = await api.post("/forms/create", form);
      console.log(result);
      setDisplaySuccessPopup(true);
    } catch (e) {
      console.log("Lỗi không gửi được dữ liệu" + e);
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
              onClick={() => handleSaveForm()}
            >
              Lưu
            </button>
            <ConfirmationPopup
              isOpen={displayConfirmationPopup}
              text="Xác nhận gửi đơn"
              onDecline={() => setDisplayConfirmationPopup(false)}
              onConfirm={() => handleSendFormData()}
              displaySuccessPopup={displaySuccessPopup}
              onSuccessPopupClosed={() => onSuccessPopupClosed()}
            ></ConfirmationPopup>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormCreationPage;
