import { useState, useEffect } from "react";
import api from "../../../services/api";

import { IconButton, Button } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import AddIcon from "@mui/icons-material/Add";
import PropTypes from "prop-types";

const FacultyTree = ({
  handleSelectFaculty,
  handleSelectDepartment,
  handleSelectMajor,
  handleOpenAddForm,
  setUpdatingObject,
  refreshKey,
}) => {
  const [expanded, setExpanded] = useState({});
  const [faculties, setFaculties] = useState([]);
  const [departmentsByFaculty, setDepartmentsByFaculty] = useState({});
  const [majorsByDepartment, setMajorsByDepartment] = useState({});
  const [hoveredId, setHoveredId] = useState(null); // New: Track which item is hovered

  useEffect(() => {
    const initializeFaculties = async () => {
      const result = await api.get("/faculties");
      setFaculties(result.data.result);
      setDepartmentsByFaculty({});
      setMajorsByDepartment({});
      setExpanded({});
    };
    initializeFaculties();
  }, [refreshKey]);

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

  const handleAddClick = (level, parent = null) => {
    setUpdatingObject({});
    handleOpenAddForm({
      level: level,
      parentId:
        parent?.facultyId || parent?.departmentId || parent?.majorId || "",
      parentName:
        parent?.facultyName ||
        parent?.departmentName ||
        parent?.majorName ||
        "",
    });
  };

  if (!faculties || faculties.length === 0) {
    return (
      <div className="p-4 border rounded-md border-lightBlue font-textFont">
        <div className="flex justify-between items-center mb-2">
          <h1 className="text-2xl font-medium">Danh sách đơn vị</h1>
          <Button
            variant="outlined"
            size="small"
            startIcon={<AddIcon />}
            onClick={() => handleAddClick("faculty")}
          >
            Thêm
          </Button>
        </div>
        <p>Danh sách trống</p>
      </div>
    );
  }

  return (
    <div className="p-4 border rounded-md border-lightBlue font-textFont">
      <div className="flex justify-between items-center mb-2">
        <h1 className="text-2xl font-medium">Danh sách đơn vị</h1>
        <Button
          variant="outlined"
          color="black"
          size="small"
          startIcon={<AddIcon />}
          onClick={() => handleAddClick("faculty")}
        >
          Thêm
        </Button>
      </div>

      {faculties.map((faculty) => (
        <div key={faculty.facultyId} className="">
          <div
            className="flex items-center gap-2"
            onMouseEnter={() => setHoveredId(faculty.facultyId)}
            onMouseLeave={() => setHoveredId(null)}
          >
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
            <span
              className="font-bold text-lightBlue hover:cursor-pointer text-lg p-1"
              onClick={() => handleSelectFaculty(faculty)}
            >
              {faculty.facultyName}
            </span>
            {hoveredId === faculty.facultyId && (
              <IconButton
                size="small"
                onClick={() => handleAddClick("department", faculty)}
              >
                <AddIcon fontSize="small" />
              </IconButton>
            )}
          </div>

          {/* Departments */}
          {expanded[faculty.facultyId] &&
            departmentsByFaculty[faculty.facultyId]?.map((dept) => (
              <div key={dept.departmentId} className="ml-8">
                <div
                  className="flex items-center gap-2"
                  onMouseEnter={() => setHoveredId(dept.departmentId)}
                  onMouseLeave={() => setHoveredId(null)}
                >
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
                  <span
                    className="hover:bg-lightGray rounded-md hover:cursor-pointer px-2 p-1"
                    onClick={() => handleSelectDepartment(dept)}
                  >
                    {dept.departmentName}
                  </span>
                  {hoveredId === dept.departmentId && (
                    <IconButton
                      size="small"
                      onClick={() => handleAddClick("major", dept)}
                    >
                      <AddIcon fontSize="small" />
                    </IconButton>
                  )}
                </div>

                {/* Majors */}
                {expanded[dept.departmentId] &&
                  majorsByDepartment[dept.departmentId]?.map((major) => (
                    <div
                      key={major.majorId}
                      className="flex items-center gap-2 ml-10 my-1"
                    >
                      <span
                        className="text-darkGray px-2 rounded-md hover:cursor-pointer hover:bg-lightGray"
                        onClick={() => handleSelectMajor(major)}
                      >
                        {major.majorName}
                      </span>
                      {/* No add button for class level */}
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
  handleOpenAddForm: PropTypes.func,
  setUpdatingObject: PropTypes.func,
  refreshKey: PropTypes.number,
};
