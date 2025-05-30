import React, { useState, useRef, useEffect } from "react";
import GridSplitter from "./adminComponents/GridSplitter";
import InputStyleEditor from "./adminComponents/InputStyleEditor";

import { Button, Icon, IconButton, Stack } from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import DeleteIcon from "@mui/icons-material/Delete";
import { CoPresentOutlined } from "@mui/icons-material";

const ShortAnswerTemplate = () => {
  const [maxPage, setMaxPage] = useState();
  return (
    <div className="flex items-end gap-2 text-sm ">
      <p>Dài</p>
      <input
        type="number"
        min={1}
        max={99}
        className="w-1/3 bg-lightGray rounded-md border-b-2 border-gray text-sm p-1 px-3"
        value={maxPage}
        onChange={(e) => setMaxPage(e.target.value)}
      />
      <p>hàng</p>
    </div>
  );
};

const LongAnswerTemplate = () => {
  const [maxPage, setMaxPage] = useState();
  return (
    <div className="flex align-bottom gap-2">
      <p>Dài </p>
      <input
        type="number"
        min={1}
        max={99}
        className="w-1/3 bg-lightGray rounded-md border-b-2 border-gray text-sm p-1 px-3"
        value={maxPage}
        onChange={(e) => setMaxPage(e.target.value)}
      ></input>
      <p>trang A4</p>
    </div>
  );
};

const QuestionFrame = ({ setForm, formField }) => {
  const questionTemplates = ["Trả lời ngắn", "Trả lời dài"];
  const [selectedMethod, setSelectedMethod] = useState(questionTemplates[0]);

  const handleFieldDataChange = (e) => {
    const { name, value } = e.target;
    setForm((prevForm) => {
      const updatedFields = prevForm.formFields.map((field) => {
        if (field.fieldId === formField.fieldId) {
          return { ...field, [name]: value };
        }
        return field;
      });
      return { ...prevForm, formFields: updatedFields };
    });
  };

  const handleCopy = (index) => {
    const newField = {
      position: index,
      fieldName: formField.fieldName,
      fieldId: "12424",
    };
    setForm((prev) => {
      const updatedFields = [
        ...prev.formFields.slice(0, index),
        newField,
        ...prev.formFields.slice(index),
      ];
      const reindexedFields = updatedFields.map((field, idx) => ({
        ...field,
        position: idx,
      }));
      return {
        ...prev,
        formFields: reindexedFields,
      };
    });
  };

  const handleDelete = (index) => {
    setForm((prev) => {
      const updatedFields = prev.formFields
        .filter((field) => field.position !== index)
        .map((field, i) => ({ ...field, position: i }));

      return {
        ...prev,
        formFields: updatedFields,
      };
    });
  };

  return (
    <div className="bg-white w-full p-6 pb-3 rounded-md shadow-md border border-lightGray font-textFont">
      <div className="grid grid-cols-3 gap-3">
        <input
          className="border-b-2 placeholder:text-gray bg-lightGray border-gray rounded-md col-span-2 p-1 px-3 focus:outline-none text-xl"
          placeholder="Câu hỏi"
          onChange={handleFieldDataChange}
          name="fieldName" // Make sure this matches the field key in your formFields
          value={formField.fieldName || ""}
        />
        <select
          className="border border-lightGray focus:outline-none p-1 px-3 rounded-md"
          onChange={(e) => setSelectedMethod(e.target.value)}
          value={selectedMethod}
        >
          {questionTemplates.map((question, index) => (
            <option key={index} value={question}>
              {question}
            </option>
          ))}
        </select>

        <p className="col-span-2 p-1 px-3 text-base">Văn bản câu trả lời</p>
        {selectedMethod === "Trả lời ngắn" && <ShortAnswerTemplate />}
        {selectedMethod === "Trả lời dài" && <LongAnswerTemplate />}
      </div>

      {/* Edit buttons ... */}
      <div className="flex gap-2 mt-3 p-2 pt-3 border-t-2 border-lightGray">
        <IconButton
          size=""
          color="info"
          onMouseDown={(e) => {
            e.preventDefault();
            handleCopy(formField.position + 1);
          }}
          sx={{
            border: "1px solid #2196f3",
            width: "26px",
            height: "26px",
          }}
        >
          <ContentCopyIcon sx={{ fontSize: "18px", padding: "2px" }} />
        </IconButton>

        <IconButton
          size="small"
          color="error"
          onMouseDown={(e) => {
            e.preventDefault();
            handleDelete(formField.position);
          }}
          sx={{
            border: "1px solid #f44336",
            width: "26px",
            height: "26px",
          }}
        >
          <DeleteIcon sx={{ fontSize: "18px", padding: "2px" }} />
        </IconButton>
      </div>
    </div>
  );
};

const FormCreationPage = () => {
  const [form, setForm] = useState({
    title: "",
    description: "",
    formFields: [
      { position: 0, fieldName: "Field thu nhat", fieldId: "12345" },
      { position: 1, fieldName: "Day la field thu 2", fieldId: "23132" },
    ],
  });
  const textareaRef = useRef(null);

  useEffect(() => {
    console.log(form);
  }, [form]);

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
      fieldId: "1234",
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
            <div className="mt-4">
              <label className="text-sm">Mô tả biểu mẫu:</label>
              <textarea
                placeholder="Mô tả nội dung biểu mẫu"
                className="w-full text-lg border border-gray rounded-md p-3 focus:outline-none focus:ring-1 focus:ring-darkBlue resize-none overflow-hidden leading-tight"
                onInput={autoResize}
                rows={2}
                onChange={(e) => onBasicInfoChange(e)}
                name="description"
              />
            </div>
          </div>

          {/* Chapter template */}
          {form.formFields.map((formField) => (
            <QuestionFrame
              key={formField.fieldId}
              form={form}
              setForm={setForm}
              formField={formField}
            />
          ))}
          {/* Add grid layout */}
          <div className="bg-white w-full p-2 rounded-md shadow-md border-2 border-gray border-dashed">
            <button
              className="w-full text-lg text-gray"
              onClick={() => addNewFormField()}
            >
              Thêm đề mục
            </button>
          </div>
        </div>
      </div>
      {/* <GridSplitter></GridSplitter> */}
    </div>
  );
};

export default FormCreationPage;
