import { useState } from "react";
import FacultyTree from "./repoManagmentPage/FacultyTree";
import DisplayObjectInfo from "./repoManagmentPage/DisplayObjectInfo";
import AddRepoForm from "./repoManagmentPage/AddRepoForm";
import PropTypes from "prop-types";
import api from "../../services/api";
import useBootstrapUser from "../../hook/useBootstrapUser";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";

const RepoManagementPage = () => {
  const [objectInfo, setObjectInfo] = useState({});
  const [openAddForm, setOpenAddForm] = useState(false);
  const [addFormInfo, setAddFormInfo] = useState({});
  const [refreshKey, setRefreshKey] = useState(0);
  const [updatingObject, setUpdatingObject] = useState({});

  const handleOpenAddForm = (info) => {
    setAddFormInfo(info);
    setOpenAddForm(true);
  };

  const handleSelectFaculty = async (faculty) => {
    if (!faculty) return;
    const result = await api(`/departments?facultyId=${faculty.facultyId}`);
    const content = result.data.result;
    const object = {
      name: faculty.facultyName,
      id: faculty.facultyId,
      content: content || [],
      level: "faculty",
    };
    setObjectInfo(object);
  };

  const handleSelectDepartment = async (department) => {
    if (!department) return;
    const result = await api(`/majors?departmentId=${department.departmentId}`);
    const content = result.data.result;
    const object = {
      name: department.departmentName,
      id: department.departmentId,
      content: content || [],
      level: "department",
    };
    setObjectInfo(object);
  };

  const handleSelectMajor = async (major) => {
    if (!major) return;
    const result = await api(`/classes?majorId=${major.majorId}`);
    const content = result.data.result;
    const object = {
      name: major.majorName,
      id: major.majorId,
      content: content || [],
      level: "major",
    };
    setObjectInfo(object);
  };

  const handleSelectStudentClass = async (studentClass) => {
    if (!studentClass) return;
    const object = {
      name: studentClass.studentClassName,
      id: studentClass.studentClassId,
      content: [],
      level: "studentClass",
    };
    setObjectInfo(object);
  };

  const { loading } = useBootstrapUser(); // hydrates redux on mount
  const userData = useSelector((state) => state.auth.user);
  const navigate = useNavigate();

  if (loading) return null;
  if (userData.role.name !== "ADMIN") {
    navigate("/notFound");
  }

  return (
    <div className="mb-4">
      <div className="grid gap-4 grid-cols-3 px-4">
        <div className="col-span-1">
          <FacultyTree
            setObjectInfo={setObjectInfo}
            handleSelectDepartment={handleSelectDepartment}
            handleSelectFaculty={handleSelectFaculty}
            handleSelectMajor={handleSelectMajor}
            handleSelectClass={handleSelectStudentClass}
            handleOpenAddForm={handleOpenAddForm}
            refreshKey={refreshKey}
            setUpdatingObject={setUpdatingObject}
          />
        </div>
        {Object.keys(objectInfo).length > 0 && (
          <div className="col-span-2 border border-lightBlue rounded-md">
            <DisplayObjectInfo
              key={`${objectInfo.level}-${objectInfo.id}`}
              objectInfo={objectInfo}
              handleSelectDepartment={handleSelectDepartment}
              handleSelectFaculty={handleSelectFaculty}
              handleSelectMajor={handleSelectMajor}
              handleSelectStudentClass={handleSelectStudentClass}
              setOpenAddForm={setOpenAddForm}
              setUpdatingObject={setUpdatingObject}
            ></DisplayObjectInfo>
          </div>
        )}
      </div>

      <AddRepoForm
        isOpen={openAddForm}
        objectInfo={addFormInfo}
        onClose={() => setOpenAddForm(false)}
        setRefreshKey={setRefreshKey}
        handleSelectDepartment={handleSelectDepartment}
        handleSelectFaculty={handleSelectFaculty}
        handleSelectMajor={handleSelectMajor}
        handleSelectStudentClass={handleSelectStudentClass}
        initialData={updatingObject}
      />
    </div>
  );
};

export default RepoManagementPage;

DisplayObjectInfo.propTypes = {
  objectInfo: PropTypes.object,
};
