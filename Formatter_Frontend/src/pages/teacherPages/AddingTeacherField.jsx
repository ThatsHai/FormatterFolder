import PropTypes from "prop-types";
import TeachersTable from "./TeachersTable.jsx";
import AddingTeacher from "./AddingTeacher.jsx";

const AddingTeacherField = ({
  title,
  teachersList,
  setTeachersList,
  formErrors,
  openAddTeacherModal,
  setOpenAddTeacherModal,
  className = "",
}) => {
  return (
    <>
      <div className={className}>
        <h3 className="text-black font-semibold">{title}</h3>
        <button
          type="button"
          className="border text-xs rounded-md p-1 px-2 mx-3"
          onClick={() => setOpenAddTeacherModal(true)}
        >
          {teachersList.length > 0 ? "Sửa CBHD" : "+ Thêm CBHD"}
        </button>
      </div>
      <div className="max-w-xl mx-auto">
        <TeachersTable teachers={teachersList} />
        {formErrors?.teacherIds && (
          <p className="text-redError pt-2">{formErrors.teacherIds}</p>
        )}
      </div>
      {openAddTeacherModal && (
        <AddingTeacher
          onSelectTeachers={(selected) => setTeachersList(selected)}
          onClose={() => setOpenAddTeacherModal(false)}
        />
      )}
    </>
  );
};

AddingTeacherField.propTypes = {
  title: PropTypes.string.isRequired,
  teachersList: PropTypes.array.isRequired,
  setTeachersList: PropTypes.func.isRequired,
  formErrors: PropTypes.object,
  openAddTeacherModal: PropTypes.bool.isRequired,
  setOpenAddTeacherModal: PropTypes.func.isRequired,
};

export default AddingTeacherField;
