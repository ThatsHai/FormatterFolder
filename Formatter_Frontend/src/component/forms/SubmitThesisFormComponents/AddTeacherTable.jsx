import PropTypes from "prop-types";
import { useState } from "react";
import React from "react";

const AddTeacherTable = ({ formData, setFormData }) => {
  const [teacherList, setTeacherList] = useState([
    {
      Khoa: "Trường CNTT",
      MaBM: "Khoa CNTT",
      TenCB: "Nguyen V",
      MaCB: "0111",
    },
    {
      Khoa: "Trường CNTT",
      MaBM: "Khoa CNTT",
      TenCB: "Nguyen V",
      MaCB: "0123",
    },
  ]);
  const handleSearch = () => {
    if (teacherList) {
      return teacherList;
    }
  };
  const handleCheckboxChanged = (selectedTeacher, checked) => {
    if (checked) {
      if (formData.teachersList.length >= 2) {
        return;
      }
      setFormData((prev) => ({
        ...prev,
        teachersList: [...prev.teachersList, selectedTeacher],
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        teachersList: prev.teachersList.filter(
          (t) => t.MaCB !== selectedTeacher.MaCB
        ),
      }));
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-lightGray rounded-md mb-2">
      <div className="flex flex-col">
        <label className="font-semibold mb-1">Khoa</label>
        <select
          name="school"
          id="school"
          className="border px-2 py-1 rounded-md"
        >
          <option value="CNTT">Trường CNTT</option>
        </select>
      </div>

      <div className="flex flex-col">
        <label className="font-semibold mb-1">Mã BM</label>
        <select
          name="department"
          id="department"
          className="border px-2 py-1 rounded-md"
        >
          <option value="CNTT">Khoa CNTT</option>
        </select>
      </div>

      <div className="flex flex-col">
        <label className="font-semibold mb-1">Mã CB</label>
        <input
          type="text"
          className="border px-2 py-1 rounded-md"
          placeholder="Mã CB"
          value="Mã CB"
        />
      </div>

      <div className="flex flex-col">
        <label className="font-semibold mb-1">Tên CB</label>
        <input
          type="text"
          className="border px-2 py-1 rounded-md"
          placeholder="Tên CB"
          value="Tên CB"
        />
      </div>

      <div className="md:col-span-2 flex justify-end">
        <button
          type="button"
          className="bg-darkBlue text-white px-4 py-1 rounded-md shadow-md"
          onClick={handleSearch}
        >
          Tìm kiếm
        </button>
      </div>

      {teacherList && (
        <div className="md:col-span-2 w-full">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2 w-full text-center border-t pt-4 border-gray">
            <label className="font-semibold">Mã CB</label>
            <label className="font-semibold">Tên CB</label>
            <label className="font-semibold size">Chọn</label>

            {teacherList.map((teacher, index) => (
              <React.Fragment key={index}>
                <p>{teacher.MaCB}</p>
                <p>{teacher.TenCB}</p>
                <div className="flex items-center justify-center">
                  <input
                    type="checkbox"
                    className="size-5"
                    onChange={(e) =>
                      handleCheckboxChanged(teacher, e.target.checked)
                    }
                    checked={formData.teachersList.some(
                      (t) => t.MaCB === teacher.MaCB
                    )}
                    disabled={
                      !formData.teachersList.some(
                        (t) => t.MaCB === teacher.MaCB
                      ) && formData.teachersList.length >= 2
                    }
                  />
                </div>
              </React.Fragment>
            ))}
          </div>
          {formData.teachersList.length >= 2 && (
            <p className="text-redError">Chỉ có thể có tối đa 2 CBHD</p>
          )}
        </div>
      )}
    </div>
  );
};

export default AddTeacherTable;

AddTeacherTable.propTypes = {
  formData: PropTypes.object,
  setFormData: PropTypes.func,
}