import React, { useState } from "react";
import QueryStudentContent from "./QueryStudentContent";
const AddingStudent = ({ onSelectStudents, onClose }) => {
  const [selectedStudents, setSelectedStudents] = useState([]);

  const handleConfirm = () => {
    onSelectStudents(selectedStudents);
    console.log("Selected students form addignstudent:", selectedStudents);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40"
      onKeyDown={(e) => {
        if (e.key === "Enter" && selectedStudents.length > 0) {
          e.preventDefault();
          handleConfirm();
        }
      }}
      tabIndex={0}
    >
      <div className="bg-white rounded shadow-lg p-6 w-full max-w-3xl relative">
        <button
          className="absolute -top-4 -right-4 bg-white border border-gray-300 px-2 py-1 rounded-full z-20 shadow-md"
          onClick={onClose}
        >
          X
        </button>
        <QueryStudentContent
          selectedStudents={selectedStudents}
          setSelectedStudents={setSelectedStudents}
        />
        <div className="mt-4 text-right">
          <button
            className="bg-darkBlue text-white px-4 py-2 rounded"
            onClick={handleConfirm}
          >
            Xác nhận
          </button>
        </div>
      </div>
    </div>
  );
};
export default AddingStudent;
