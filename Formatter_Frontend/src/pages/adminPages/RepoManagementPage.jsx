import { useState } from "react";

import FacultyTree from "./repoManagmentPage/FacultyTree";
import DisplayObjectInfo from "./repoManagmentPage/DisplayObjectInfo";
import PropTypes from "prop-types";
import api from "../../services/api";


const RepoManagementPage = () => {
  const [objectInfo, setObjectInfo] = useState({});
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
    const result = await api(`/majors?department=${department.departmentId}`);
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
    const object = {
      name: major.majorName,
      id: major.majorId,
      content: [],
      level: "major",
    };
    setObjectInfo(object);
  };

  return (
    <div>
      <div className="grid gap-4 grid-cols-3">
        <div className="col-span-1">
          <FacultyTree
            setObjectInfo={setObjectInfo}
            handleSelectDepartment={handleSelectDepartment}
            handleSelectFaculty={handleSelectFaculty}
            handleSelectMajor={handleSelectMajor}
          />
        </div>
        <div className="col-span-2 border">
          <DisplayObjectInfo
            objectInfo={objectInfo}
            setObjectInfo={setObjectInfo}
            handleSelectDepartment={handleSelectDepartment}
            handleSelectFaculty={handleSelectFaculty}
            handleSelectMajor={handleSelectMajor}
          ></DisplayObjectInfo>
        </div>
      </div>
    </div>
  );
};

export default RepoManagementPage;

DisplayObjectInfo.propTypes = {
  objectInfo: PropTypes.object,
};
