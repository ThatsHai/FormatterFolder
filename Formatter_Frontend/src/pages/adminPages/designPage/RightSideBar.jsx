import PropTypes from "prop-types";
import { useState } from "react";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore"; // from MUI

const fieldTypeLabels = {
  SHORT_ANSWER: "Trả lời ngắn",
  LONG_ANSWER: "Trả lời dài",
  BULLETS: "Kiểu liệt kê",
  SELECT: "Bảng chọn",
  TABLE: "Bảng",
  DATE: "Ngày",
};

const enumToLabel = (fieldType) => fieldTypeLabels[fieldType];

const TeacherInfoDiv = () => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="pt-4 grid grid-cols-1 gap-3">
      <div className="w-full flex items-center gap-2">
        <label className="font-semibold">Thông tin giảng viên</label>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="transition-transform duration-200"
        >
          <ExpandMoreIcon
            style={{
              transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
              transition: "transform 0.2s ease-in-out",
            }}
          />
        </button>
      </div>

      {isOpen && (
        <div className="gap-3 grid grid-cols-1 border-b-[1px] border-x-[0px] border-t-[0px] pb-4 border-lightGray shadow-[0_1px_0_rgba(0,0,0,0.1)]">
          <div
            className="border p-2 rounded-md cursor-move"
            draggable
            onDragStart={(e) => {
              e.dataTransfer.setData(
                "text/plain",
                JSON.stringify({
                  formFieldId: 0,
                  fieldName: "Họ và tên giảng viên",
                })
              );
            }}
          >
            <div className="flex">
              <p>Họ và tên giảng viên</p>
            </div>
          </div>
          <div
            className="border p-2 rounded-md cursor-move"
            draggable
            onDragStart={(e) => {
              e.dataTransfer.setData(
                "text/plain",
                JSON.stringify({
                  formFieldId: 0,
                  fieldName: "Email giảng viên",
                })
              );
            }}
          >
            <div className="flex">
              <p>Email giảng viên</p>
            </div>
          </div>
          <div
            className="border p-2 rounded-md cursor-move"
            draggable
            onDragStart={(e) => {
              e.dataTransfer.setData(
                "text/plain",
                JSON.stringify({
                  formFieldId: 0,
                  fieldName: "Khoa/Bộ môn giảng viên",
                })
              );
            }}
          >
            <div className="flex">
              <p>Khoa/Bộ môn giảng viên</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const StudentInfoDiv = () => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="pt-4 grid grid-cols-1 gap-3">
      <div className="w-full flex items-center gap-2">
        <label className="font-semibold">Thông tin sinh viên</label>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="transition-transform duration-200"
        >
          <ExpandMoreIcon
            style={{
              transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
              transition: "transform 0.2s ease-in-out",
            }}
          />
        </button>
      </div>

      {isOpen && (
        <div className="gap-3 grid grid-cols-1 border-b-[1px] border-x-[0px] border-t-[0px] pb-4 border-lightGray shadow-[0_1px_0_rgba(0,0,0,0.1)]">
          <div
            className="border p-2 rounded-md cursor-move"
            draggable
            onDragStart={(e) => {
              e.dataTransfer.setData(
                "text/plain",
                JSON.stringify({
                  formFieldId: 0,
                  fieldName: "Họ và tên sinh viên",
                })
              );
            }}
          >
            <div className="flex">
              <p>Họ và tên sinh viên</p>
            </div>
          </div>
          <div
            className="border p-2 rounded-md cursor-move"
            draggable
            onDragStart={(e) => {
              e.dataTransfer.setData(
                "text/plain",
                JSON.stringify({
                  formFieldId: 0,
                  fieldName: "MSSV",
                })
              );
            }}
          >
            <div className="flex">
              <p>MSSV</p>
            </div>
          </div>
          <div
            className="border p-2 rounded-md cursor-move"
            draggable
            onDragStart={(e) => {
              e.dataTransfer.setData(
                "text/plain",
                JSON.stringify({
                  formFieldId: 0,
                  fieldName: "Email sinh viên",
                })
              );
            }}
          >
            <div className="flex">
              <p>Email sinh viên</p>
            </div>
          </div>
          <div
            className="border p-2 rounded-md cursor-move"
            draggable
            onDragStart={(e) => {
              e.dataTransfer.setData(
                "text/plain",
                JSON.stringify({
                  formFieldId: 0,
                  fieldName: "Trường/Viện/Khoa sinh viên",
                })
              );
            }}
          >
            <div className="flex">
              <p>Trường/Viện/Khoa sinh viên</p>
            </div>
          </div>
          <div
            className="border p-2 rounded-md cursor-move"
            draggable
            onDragStart={(e) => {
              e.dataTransfer.setData(
                "text/plain",
                JSON.stringify({
                  formFieldId: 0,
                  fieldName: "Khoa/Bộ môn sinh viên",
                })
              );
            }}
          >
            <div className="flex">
              <p>Khoa/Bộ môn sinh viên</p>
            </div>
          </div>
          <div
            className="border p-2 rounded-md cursor-move"
            draggable
            onDragStart={(e) => {
              e.dataTransfer.setData(
                "text/plain",
                JSON.stringify({
                  formFieldId: 0,
                  fieldName: "Ngành học sinh viên",
                })
              );
            }}
          >
            <div className="flex">
              <p>Ngành học sinh viên</p>
            </div>
          </div>
          <div
            className="border p-2 rounded-md cursor-move"
            draggable
            onDragStart={(e) => {
              e.dataTransfer.setData(
                "text/plain",
                JSON.stringify({
                  formFieldId: 0,
                  fieldName: "Lớp sinh viên",
                })
              );
            }}
          >
            <div className="flex">
              <p>Lớp sinh viên</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const Fields = ({ formData }) => {
  const [isOpen, setIsOpen] = useState(true);
  return (
    <div className="pt-4 grid grid-cols-1 gap-3">
      <div className="w-full flex items-center gap-2">
        <label className="font-semibold">Danh sách câu hỏi</label>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="transition-transform duration-200"
        >
          <ExpandMoreIcon
            style={{
              transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
              transition: "transform 0.2s ease-in-out",
            }}
          />
        </button>
      </div>

      {isOpen && (
        <div className="pt-4 grid grid-cols-1 gap-3">
          {formData.formFields.length > 0 &&
            formData.formFields.map((formField) => (
              <div
                key={formField.formFieldId}
                className="border p-2 rounded-md cursor-move" // add cursor style
                draggable
                onDragStart={(e) => {
                  e.dataTransfer.setData(
                    "text/plain",
                    JSON.stringify({
                      formFieldId: formField.formFieldId,
                      fieldName: formField.fieldName,
                      fieldType: formField.fieldType,
                    })
                  );
                }}
              >
                <div className="flex">
                  <p>
                    {formField.fieldType === "TABLE"
                      ? (() => {
                          const [q, raw = ""] = (
                            formField.fieldName || ""
                          ).split(":::");
                          const question = (q || "").trim();
                          if (question) return question;

                          // Extract headers from HTML <th>
                          const headers = [];
                          const thRegex = /<th\b[^>]*>(.*?)<\/th>/gi;
                          let m;
                          while ((m = thRegex.exec(raw)) !== null) {
                            headers.push(m[1].replace(/<[^>]+>/g, "").trim());
                          }

                          return (
                            <table className="inline-table border border-gray-400 border-collapse text-sm max-w-xs">
                              <thead>
                                <tr>
                                  {headers.map((header, idx) => (
                                    <th
                                      key={idx}
                                      className="border border-gray-400 px-2 py-1 font-semibold"
                                    >
                                      {header}
                                    </th>
                                  ))}
                                </tr>
                              </thead>
                            </table>
                          );
                        })()
                      : formField.fieldName}
                  </p>
                </div>
                <p className="text-sm text-gray">
                  {formField.description || "Không có mô tả"}
                </p>
                <div className="w-full items-end justify-end flex">
                  <p className="inline-block border px-2 rounded-md bg-darkGray text-white py-1">
                    {enumToLabel(formField.fieldType) || "Chưa chọn"}
                  </p>
                </div>
              </div>
            ))}
        </div>
      )}
    </div>
  );
};

const RightSidebar = ({ formData }) => {
  const [isOpen, setIsOpen] = useState();

  if (!formData || Object.keys(formData).length === 0) {
    return (
      <>
        <div
          className={`overflow-y-auto fixed top-0 right-0 h-full bg-white shadow-lg transition-all duration-300 ease-in-out z-50 font-textFont ${
            isOpen ? "w-64" : "w-0 overflow-hidden"
          }`}
        >
          <h1 className="text-redError text-center p-3 italic text-sm border m-2 rounded-md">
            Lỗi, không tải được dữ liệu
          </h1>
        </div>
        <button
          className={`fixed top-1/2 transform ease-in-out duration-300 -translate-y-1/2 z-50 bg-white rounded-l-full px-2 py-1 ${
            isOpen ? "right-64 shadow-sm" : "right-0 shadow-md"
          }`}
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? ">" : "<"}
        </button>
      </>
    );
  }

  return (
    <>
      {/* Sidebar */}
      <div
        className={`fixed top-0 right-0 h-full bg-white shadow-lg transition-all duration-300 ease-in-out z-50 font-textFont ${
          isOpen ? "w-64" : "w-0 overflow-hidden"
        }`}
      >
        <div className="flex flex-col h-full overflow-y-auto p-4 hide-scrollbar">
          <h2 className="text-lg font-semibold">{formData.title}</h2>
          <p className="text-sm text-gray">
            {formData.description || "Không có mô tả"}
          </p>

          {/* Reader information */}
          {formData.readersList.includes("TEACHER") && (
            <TeacherInfoDiv></TeacherInfoDiv>
          )}

          {formData.readersList.includes("STUDENT") && (
            <StudentInfoDiv></StudentInfoDiv>
          )}

          {/* All form fields */}
          <Fields formData={formData}></Fields>
        </div>
      </div>

      {/* Toggle Button */}
      <button
        className={`fixed top-1/2 transform ease-in-out duration-300 -translate-y-1/2 z-50 bg-white rounded-l-full px-2 py-1 ${
          isOpen ? "right-64 shadow-sm" : "right-0 shadow-md"
        }`}
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? ">" : "<"}
      </button>
    </>
  );
};

export default RightSidebar;

RightSidebar.propTypes = {
  formData: PropTypes.object,
};

Fields.propTypes = {
  formData: PropTypes.object,
};
