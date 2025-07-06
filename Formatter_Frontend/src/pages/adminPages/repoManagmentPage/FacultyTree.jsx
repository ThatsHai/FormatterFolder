import { useState, useEffect } from "react";
import api from "../../../services/api";

import { IconButton } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import PropTypes from "prop-types";

const FacultyTree = ({
  handleSelectFaculty,
  handleSelectDepartment,
  handleSelectMajor,
}) => {
  const [expanded, setExpanded] = useState({});
  const [faculties, setFaculties] = useState([]);
  const [departmentsByFaculty, setDepartmentsByFaculty] = useState({});
  const [majorsByDepartment, setMajorsByDepartment] = useState({});

  useEffect(() => {
    const initializeFaculties = async () => {
      const result = await api.get("/faculties");
      console.log(result.data.result);
      setFaculties(result.data.result);
    };
    initializeFaculties();
  }, []);

  const toggleFaculty = async (facultyId) => {
    setExpanded((prev) => ({ ...prev, [facultyId]: !prev[facultyId] }));

    if (!departmentsByFaculty[facultyId]) {
      try {
        const response = await api.get(`/departments?facultyId=${facultyId}`);
        setDepartmentsByFaculty((prev) => ({
          ...prev,
          [facultyId]: response.data.result,
        }));
      } catch (error) {
        console.error("Failed to fetch departments", error);
      }
    }
  };

  const toggleDepartment = async (departmentId) => {
    setExpanded((prev) => ({ ...prev, [departmentId]: !prev[departmentId] }));

    if (!majorsByDepartment[departmentId]) {
      try {
        const response = await api.get(`/majors?departmentId=${departmentId}`);
        setMajorsByDepartment((prev) => ({
          ...prev,
          [departmentId]: response.data.result,
        }));
      } catch (error) {
        console.error("Failed to fetch majors", error);
      }
    }
  };

  if (!faculties || faculties.length === 0) {
    return (
      <div className="p-4 border font-textFont">
        <h1 className="text-2xl font-medium mb-2">Danh sách đơn vị</h1>
        <p>Danh sách trống</p>
      </div>
    );
  }

  return (
    <div className="p-4 border font-textFont">
      <h1 className="text-2xl font-medium mb-2">Danh sách đơn vị</h1>
      {faculties.map((faculty) => (
        <div key={faculty.facultyId} className="mb-2">
          <div className="flex items-center">
            <IconButton
              disableRipple
              disableFocusRipple
              onClick={() => toggleFaculty(faculty.facultyId)}
              size="small"
              sx={{ padding: 0, "&:hover": { backgroundColor: "transparent" } }}
            >
              {expanded[faculty.facultyId] ? (
                <ExpandMoreIcon />
              ) : (
                <ChevronRightIcon />
              )}
            </IconButton>
            <div className="hover:bg-lightGray rounded-md px-2">
              <span
                className="font-bold text-darkBlue hover:cursor-pointer text-lg "
                onClick={() => handleSelectFaculty(faculty)}
              >
                {faculty.facultyName}
              </span>
            </div>
          </div>

          {/* Departments */}
          {expanded[faculty.facultyId] &&
            departmentsByFaculty[faculty.facultyId]?.map((dept) => (
              <div key={dept.departmentId} className="ml-8 mt-1">
                <div className="flex items-center">
                  <IconButton
                    disableRipple
                    disableFocusRipple
                    onClick={() => toggleDepartment(dept.departmentId)}
                    size="small"
                    sx={{
                      padding: 0,
                      "&:hover": { backgroundColor: "transparent" },
                    }}
                  >
                    {expanded[dept.departmentId] ? (
                      <ExpandMoreIcon />
                    ) : (
                      <ChevronRightIcon />
                    )}
                  </IconButton>
                  <div className="hover:bg-lightGray rounded-md hover:cursor-pointer px-2">
                    <span
                      className=""
                      onClick={() => handleSelectDepartment(dept)}
                    >
                      {dept.departmentName}
                    </span>
                  </div>
                </div>

                {/* Majors */}
                {expanded[dept.departmentId] &&
                  majorsByDepartment[dept.departmentId]?.map((major) => (
                    <div key={major.majorId}>
                      <span
                        className="ml-10 text-darkGray px-2 rounded-md hover:cursor-pointer hover:bg-lightGray"
                        onClick={() => handleSelectMajor(major)}
                      >
                        {major.majorName}
                      </span>
                    </div>
                  ))}
              </div>
            ))}
        </div>
      ))}
    </div>
  );
};
export default FacultyTree;

FacultyTree.propTypes = {
  handleSelectFaculty: PropTypes.func,
  handleSelectDepartment: PropTypes.func,
  handleSelectMajor: PropTypes.func,
}