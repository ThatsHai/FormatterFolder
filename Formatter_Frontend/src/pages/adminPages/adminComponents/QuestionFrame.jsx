import { IconButton } from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import DeleteIcon from "@mui/icons-material/Delete";
import { useState } from "react";
import PropTypes from "prop-types";

const ShortAnswerTemplate = () => {
  const [maxPage, setMaxPage] = useState(1);
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
      <p className="text-redError">hàng</p>
    </div>
  );
};

const LongAnswerTemplate = () => {
  const [maxPage, setMaxPage] = useState(1);
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
      <p className="text-redError">trang</p>
    </div>
  );
};

const QuestionFrame = ({ setForm, formField, emptyFields }) => {
  const questionTemplates = ["Trả lời ngắn", "Trả lời dài"];
  const [selectedMethod, setSelectedMethod] = useState(questionTemplates[0]);

  const handleFieldDataChange = (e) => {
    const { name, value } = e.target;
    setForm((prevForm) => {
      const updatedFields = prevForm.formFields.map((field) => {
        if (field.formFieldId === formField.formFieldId) {
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
      description: formField.description,
      formFieldId: "12424",
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
      <div className="grid grid-cols-3 gap-3 py-1">
        <input
          className="border-b-2 placeholder:text-gray placeholder:font-semibold bg-lightGray border-gray rounded-md col-span-2 p-1 px-3 focus:outline-none text-xl"
          placeholder="Câu hỏi"
          onChange={handleFieldDataChange}
          name="fieldName"
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

        <input
          className="col-span-2 focus:outline-none border-b-lightGray border-b-2 rounded-md p-1 px-3 text-base text-gray"
          placeholder="Chú thích"
          onChange={handleFieldDataChange}
          name="description"
          value={formField.description || ""}
        />
        {selectedMethod === "Trả lời ngắn" && <ShortAnswerTemplate />}
        {selectedMethod === "Trả lời dài" && <LongAnswerTemplate />}
        {emptyFields &&
          emptyFields.length > 0 &&
          emptyFields.some(
            (field) => formField.formFieldId === field.formFieldId
          ) && (
            <p className="col-span-3 pt-1 text-redError">
              Câu hỏi không được để trống
            </p>
          )}
      </div>

      {/* Edit buttons ... */}
      <div className="flex gap-2 mt-4 p-2 pt-3 border-t-2 border-gray">
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

export default QuestionFrame;

QuestionFrame.propTypes = {
  setForm: PropTypes.func,
  formField: PropTypes.object,
  emptyFields: PropTypes.array,
};
