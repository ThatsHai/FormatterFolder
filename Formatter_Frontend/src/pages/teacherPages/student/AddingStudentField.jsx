import PropTypes from "prop-types";
import StudentTable from "./StudentsTable.jsx";
import AddingStudent from "./AddingStudent.jsx";

const AddingStudentField = ({
  title,
  studentsList,
  setStudentsList,
  formErrors,
  openAddStudentModal,
  setOpenAddStudentModal,
  className = "",
  maxStudents = 1,
}) => {
  return (
    <>
      <div className={className}>
        <h3 className="text-black font-semibold">{title}</h3>
        <button
          type="button"
          className="border text-xs rounded-md p-1 px-2 mx-3"
          onClick={() => setOpenAddStudentModal(true)}
        >
          {"+ Thêm sinh viên"}
        </button>
      </div>
      <div className="max-w-xl mx-auto">
        <StudentTable
          students={studentsList}
          setSelectedStudents={setStudentsList}
        />
        {formErrors?.studentIds && (
          <p className="text-redError pt-2">{formErrors.studentIds}</p>
        )}
      </div>
      {openAddStudentModal && (
        <AddingStudent
          onSelectStudents={(selected) =>
            setStudentsList((prev) => {

              const newStudents = selected.filter(
                (student) => !prev.some((s) => s.userId === student.userId)
              );
            
              
              if (prev.length + newStudents.length > maxStudents) {
                alert("Chỉ chọn tối đa "+maxStudents+ " sinh viên.");
                return prev;
              }
              return [...prev, ...newStudents];
            })
          }
          onClose={() => setOpenAddStudentModal(false)}
        />
      )}
    </>
  );
};

AddingStudentField.propTypes = {
  title: PropTypes.string.isRequired,
  studentsList: PropTypes.array.isRequired,
  setStudentsList: PropTypes.func.isRequired,
  formErrors: PropTypes.object,
  openAddStudentModal: PropTypes.bool.isRequired,
  setOpenAddStudentModal: PropTypes.func.isRequired,
  maxStudents: PropTypes.number,
};

export default AddingStudentField;
import React, { useState } from "react";
