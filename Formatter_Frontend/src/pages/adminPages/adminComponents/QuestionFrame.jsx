import { IconButton } from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import DeleteIcon from "@mui/icons-material/Delete";
import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import NumberInput from "../../../component/NumberInput";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import Tooltip from "@mui/material/Tooltip";
import TableEditor from "./TableEditor";
// Field type labels
const fieldTypeLabels = {
  SHORT_ANSWER: "Trả lời ngắn",
  LONG_ANSWER: "Trả lời dài",
  BULLETS: "Kiểu liệt kê",
  SELECT: "Bảng chọn",
  TABLE: "Bảng",
  DATE: "Ngày",
};

const labelToEnum = Object.fromEntries(
  Object.entries(fieldTypeLabels).map(([k, v]) => [v, k])
);

const enumToLabel = fieldTypeLabels;

const LengthInput = ({ formFieldId, setForm, unit, length }) => {
  const handleLengthChange = (e) => {
    const value = parseInt(e.target.value, 10) || 0;
    setForm((prev) => {
      const updatedFields = prev.formFields.map((field) =>
        field.formFieldId === formFieldId ? { ...field, length: value } : field
      );
      return { ...prev, formFields: updatedFields };
    });
  };

  return (
    <div className="flex items-end gap-2 text-sm py-[5px]">
      <p className="text-gray">Tối đa</p>
      <NumberInput
        type="number"
        min={0}
        max={5000}
        value={length || ""}
        onChange={handleLengthChange}
        className="w-1/3 bg-lightGray rounded-md border-b-2 border-gray text-sm p-1 px-3"
      />
      <p className="text-redError">{unit}</p>
    </div>
  );
};

LengthInput.propTypes = {
  formFieldId: PropTypes.string.isRequired,
  setForm: PropTypes.func.isRequired,
  unit: PropTypes.string.isRequired,
  length: PropTypes.number,
};

const QuestionFrame = ({ setForm, formField, emptyFields }) => {
  const [selectedMethod, setSelectedMethod] = useState(
    enumToLabel[formField.fieldType] || "Trả lời ngắn"
  );

  // Sync field type and clear length if needed
  useEffect(() => {
    const fieldType = labelToEnum[selectedMethod];
    // const supportsLength = ["SHORT_ANSWER", "LONG_ANSWER", "BULLETS"].includes(
    //   fieldType
    // );

    if (fieldType) {
      setForm((prevForm) => {
        const updatedFields = prevForm.formFields.map((field) =>
          field.formFieldId === formField.formFieldId
            ? {
                ...field,
                fieldType,
                length: 0,
              }
            : field
        );
        return { ...prevForm, formFields: updatedFields };
      });
    }
  }, [selectedMethod]);

  const handleFieldDataChange = (e) => {
    const { name, value } = e.target;
    setForm((prevForm) => {
      const updatedFields = prevForm.formFields.map((field) =>
        field.formFieldId === formField.formFieldId
          ? { ...field, [name]: value }
          : field
      );
      return { ...prevForm, formFields: updatedFields };
    });
  };

  const handleCopy = (index) => {
    const newField = {
      ...formField,
      position: index,
      formFieldId: crypto.randomUUID(),
    };
    setForm((prev) => {
      const updatedFields = [
        ...prev.formFields.slice(0, index),
        newField,
        ...prev.formFields.slice(index),
      ];
      const reindexed = updatedFields.map((f, i) => ({ ...f, position: i }));
      return { ...prev, formFields: reindexed };
    });
  };

  const handleDelete = (index) => {
    setForm((prev) => {
      const updatedFields = prev.formFields
        .filter((f) => f.position !== index)
        .map((f, i) => ({ ...f, position: i }));
      return { ...prev, formFields: updatedFields };
    });
  };

  const renderFieldTypeDetails = () => {
    switch (selectedMethod) {
      case "Trả lời ngắn":
      case "Trả lời dài":
        return (
          <LengthInput
            formFieldId={formField.formFieldId}
            setForm={setForm}
            unit="từ"
            length={formField.length}
          />
        );
      case "Kiểu liệt kê":
        return (
          <LengthInput
            formFieldId={formField.formFieldId}
            setForm={setForm}
            unit="chấm đầu dòng"
            length={formField.length}
          />
        );
      case "Bảng chọn":
        return (
          <div className="flex flex-col gap-2 font-textFont">
            <div className="flex items-center gap-2 text-gray">
              <Tooltip
                title={
                  <div className="p-3 flex gap-6 items-center text-md md:min-w-48">
                    <p>Kiểu bảng chọn — người dùng chọn/không chọn ô.</p>
                    <label className="flex items-center gap-2 text-md text-gray">
                      <input
                        type="checkbox"
                        disabled
                        checked
                        className="w-4 h-4 accent-blue-500"
                      />
                      Đã chọn
                    </label>
                    <label className="flex items-center gap-2 text-md text-gray">
                      <input
                        type="checkbox"
                        disabled
                        checked={false}
                        className="w-4 h-4 accent-blue-500"
                      />
                      Chưa chọn
                    </label>
                  </div>
                }
                arrow
                placement="right"
              >
                <IconButton size="medium">
                  <HelpOutlineIcon fontSize="medium" />
                </IconButton>
              </Tooltip>
            </div>
          </div>
        );

      case "Bảng":
        return (
          // <p className="text-gray col-span-3">
          //   Kiểu bảng — chưa có cấu hình chi tiết.
          // </p>
          <div className="col-span-3">
            <TableEditor></TableEditor>
          </div>
        );
      case "Ngày":
        return (
          <div className="flex flex-col gap-2 font-textFont">
            <div className="flex items-center gap-2 text-gray">
              <Tooltip
                title={
                  <div className="p-3 flex gap-6 items-center text-md md:min-w-48">
                    <p>Người dùng chọn một ngày theo định dạng DD/YY/MMMM.</p>
                  </div>
                }
                arrow
                placement="right"
              >
                <IconButton size="medium">
                  <HelpOutlineIcon
                    fontSize="medium"
                    sx={{ color: "#D9D9D9" }}
                  />
                </IconButton>
              </Tooltip>
            </div>
          </div>
        );
      default:
        return null;
    }
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
          {Object.values(enumToLabel).map((label, index) => (
            <option key={index} value={label}>
              {label}
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

        {renderFieldTypeDetails()}

        {emptyFields?.some((f) => f.formFieldId === formField.formFieldId) && (
          <p className="col-span-3 pt-1 text-redError">
            Câu hỏi không được để trống
          </p>
        )}
      </div>

      <div className="flex gap-2 mt-4 p-2 pt-3 border-t-2 border-gray">
        <IconButton
          color="info"
          onMouseDown={(e) => {
            e.preventDefault();
            handleCopy(formField.position + 1);
          }}
          sx={{ border: "1px solid #2196f3", width: "26px", height: "26px" }}
        >
          <ContentCopyIcon sx={{ fontSize: "18px", padding: "2px" }} />
        </IconButton>

        <IconButton
          color="error"
          onMouseDown={(e) => {
            e.preventDefault();
            handleDelete(formField.position);
          }}
          sx={{ border: "1px solid #f44336", width: "26px", height: "26px" }}
        >
          <DeleteIcon sx={{ fontSize: "18px", padding: "2px" }} />
        </IconButton>
      </div>
    </div>
  );
};

QuestionFrame.propTypes = {
  setForm: PropTypes.func.isRequired,
  formField: PropTypes.object.isRequired,
  emptyFields: PropTypes.array,
};

export default QuestionFrame;
