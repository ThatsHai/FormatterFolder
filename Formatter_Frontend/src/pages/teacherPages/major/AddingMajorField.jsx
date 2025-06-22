import PropTypes from "prop-types";
import MajorsTable from "./MajorsTable.jsx";
import AddingMajor from "./AddingMajor.jsx";

const AddingMajorField = ({
  title,
  majorsList,
  setMajorsList,
  formErrors,
  openAddMajorModal,
  setOpenAddMajorModal,
  className = "",
}) => {
  return (
    <>
      <div className={className}>
        <h3 className="text-black font-semibold">{title}</h3>
        <button
          type="button"
          className="border text-xs rounded-md p-1 px-2 mx-3"
          onClick={() => setOpenAddMajorModal(true)}
        >
          {"+ Thêm ngành"}
        </button>
      </div>
      <div className="max-w-xl mx-auto">
        <MajorsTable majors={majorsList}
        setSelectedMajors={setMajorsList} />
        {formErrors?.majorIds && (
          <p className="text-redError pt-2">{formErrors.majorIds}</p>
        )}
      </div>
      {openAddMajorModal && (
        <AddingMajor
          onSelectMajors={(selected) => setMajorsList((prev)=>{
            const newMajors = selected.filter(
              (major) => !prev.some(
                (m) => m.majorId === major.majorId
              )
            );
            if (prev.length + newMajors.length > 3) {
              alert("Chỉ chọn tối đa 2 ngành.");
              return prev;
            }
            return [...prev, ...newMajors];
          })}
          onClose={() => setOpenAddMajorModal(false)}
        />
      )}
    </>
  );
};

AddingMajorField.propTypes = {
  title: PropTypes.string.isRequired,
  majorsList: PropTypes.array.isRequired,
  setMajorsList: PropTypes.func.isRequired,
  formErrors: PropTypes.object,
  openAddMajorModal: PropTypes.bool.isRequired,
  setOpenAddMajorModal: PropTypes.func.isRequired,
};

export default AddingMajorField;
import React, { useState } from "react";