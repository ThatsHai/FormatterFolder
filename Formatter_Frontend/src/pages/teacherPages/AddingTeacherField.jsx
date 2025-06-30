import PropTypes from "prop-types";
import TeachersTable from "./TeachersTable.jsx";
import AddingTeacher from "./AddingTeacher.jsx";

const AddingTeacherField = ({
  title,
  teachersList,
  setTeachersList,
  formErrors,
  swapTeachers,
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
          {"+ Thêm CBHD"}
        </button>
      </div>
      <div className="max-w-xl mx-auto">
        <TeachersTable teachers={teachersList} 
        selectedTeachers={teachersList}
        setSelectedTeachers={setTeachersList}
        swapTeachers={swapTeachers}
        />
        {formErrors?.teacherIds && (
          <p className="text-redError pt-2">{formErrors.teacherIds}</p>
        )}
      </div>
      {openAddTeacherModal && (
        <AddingTeacher
          onSelectTeachers={(selected) =>
            setTeachersList((prev) => {
              const newTeachers = selected.filter(
                (teacher) => !prev.some((t) => t.userId === teacher.userId)
              );

              if (prev.length + newTeachers.length > 2) {
                alert("Chỉ chọn tối đa 2 cán bộ hướng dẫn.");
                return prev;
              }

              return [...prev, ...newTeachers];
            })
          }
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
  swapTeachers: PropTypes.func,
  formErrors: PropTypes.object,
  openAddTeacherModal: PropTypes.bool.isRequired,
  setOpenAddTeacherModal: PropTypes.func.isRequired,
};

export default AddingTeacherField;
