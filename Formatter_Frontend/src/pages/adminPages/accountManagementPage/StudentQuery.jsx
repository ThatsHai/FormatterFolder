import { useEffect, useState } from "react";
import api from "../../../services/api";
import PropTypes from "prop-types";

const StudentQuery = ({ handleQueryCriteria, handleSearch }) => {
  const [facultiesList, setFacultiesList] = useState([]);
  const [departmentsList, setDepartmentsList] = useState([]);
  const [majorsList, setMajorsList] = useState([]);
  const [classesList, setClassesList] = useState([]);

  const [selectedFacultyId, setSelectedFacultyId] = useState("");
  const [selectedDepartmentId, setSelectedDepartmentId] = useState("");
  const [selectedMajorId, setSelectedMajorId] = useState("");
  const [selectedClassId, setSelectedClassId] = useState("");

  // Fetch faculties on page load
  useEffect(() => {
    const fetchFaculty = async () => {
      const fetchedFaculty = await api.get("/faculties");
      setFacultiesList(fetchedFaculty.data.result);
    };
    fetchFaculty();
  }, []);

  // Fetch departments when faculty changes
  useEffect(() => {
    const fetchDepartment = async () => {
      if (selectedFacultyId === "") return;

      const fetchedDepartment = await api.get(`/departments?facultyId=${selectedFacultyId}`);
      setDepartmentsList(fetchedDepartment.data.result);
    };
    fetchDepartment();
  }, [selectedFacultyId]);

  // Fetch majors when department changes
  useEffect(() => {
    const fetchMajor = async () => {
      if (selectedDepartmentId === "") return;

      const fetchedMajor = await api.get(`/majors?departmentId=${selectedDepartmentId}`);
      setMajorsList(fetchedMajor.data.result);
    };
    fetchMajor();
  }, [selectedDepartmentId]);

  // Fetch classes when major changes
  useEffect(() => {
    const fetchClass = async () => {
      if (selectedMajorId === "") return;

      const fetchedClass = await api.get(`/classes?majorId=${selectedMajorId}`);
      setClassesList(fetchedClass.data.result);
    };
    fetchClass();
  }, [selectedMajorId]);

  // --- Event Handlers ---
  const handleFacultyChange = (e) => {
    const { value } = e.target;

    setSelectedFacultyId(value);
    handleQueryCriteria(e);

    // If unselecting faculty, reset all lower levels
    if (value === "") {
      setDepartmentsList([]);
      setMajorsList([]);
      setClassesList([]);
      setSelectedDepartmentId("");
      setSelectedMajorId("");
      setSelectedClassId("");

      handleQueryCriteria({ target: { name: "departmentId", value: "" } });
      handleQueryCriteria({ target: { name: "majorId", value: "" } });
      handleQueryCriteria({ target: { name: "classId", value: "" } });
    } else {
      // If selecting faculty, reset lower selections
      setSelectedDepartmentId("");
      setSelectedMajorId("");
      setSelectedClassId("");

      handleQueryCriteria({ target: { name: "departmentId", value: "" } });
      handleQueryCriteria({ target: { name: "majorId", value: "" } });
      handleQueryCriteria({ target: { name: "classId", value: "" } });
    }
  };

  const handleDepartmentChange = (e) => {
    const { value } = e.target;

    setSelectedDepartmentId(value);
    handleQueryCriteria(e);

    if (value === "") {
      setMajorsList([]);
      setClassesList([]);
      setSelectedMajorId("");
      setSelectedClassId("");

      handleQueryCriteria({ target: { name: "majorId", value: "" } });
      handleQueryCriteria({ target: { name: "classId", value: "" } });
    } else {
      setSelectedMajorId("");
      setSelectedClassId("");

      handleQueryCriteria({ target: { name: "majorId", value: "" } });
      handleQueryCriteria({ target: { name: "classId", value: "" } });
    }
  };

  const handleMajorChange = (e) => {
    const { value } = e.target;

    setSelectedMajorId(value);
    handleQueryCriteria(e);

    if (value === "") {
      setClassesList([]);
      setSelectedClassId("");

      handleQueryCriteria({ target: { name: "classId", value: "" } });
    } else {
      setSelectedClassId("");
      handleQueryCriteria({ target: { name: "classId", value: "" } });
    }
  };

  const handleClassChange = (e) => {
    const { value } = e.target;

    setSelectedClassId(value);
    handleQueryCriteria(e);
  };

  return (
    <div className="flex justify-center w-full ">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded-md mb-2 w-3/5 ">
        {/* Faculty Select */}
        <div className="flex flex-col px-8">
          <label className="font-semibold mb-1">Khoa</label>
          <select
            name="facultyId"
            id="facultyId"
            className="border px-2 py-1 rounded-md"
            onChange={handleFacultyChange}
            value={selectedFacultyId}
          >
            <option value="">-- Chọn khoa --</option>
            {facultiesList.map((faculty) => (
              <option key={faculty.facultyId} value={faculty.facultyId}>
                {faculty.facultyName}
              </option>
            ))}
          </select>
        </div>

        {/* Department Select */}
        <div className="flex flex-col px-8">
          <label className="font-semibold mb-1">Tên bộ môn</label>
          <select
            name="departmentId"
            id="departmentId"
            className={`border px-2 py-1 rounded-md ${selectedFacultyId === "" && "bg-gray"}`}
            disabled={selectedFacultyId === ""}
            onChange={handleDepartmentChange}
            value={selectedDepartmentId}
          >
            <option value="">-- Chọn bộ môn --</option>
            {departmentsList.map((department) => (
              <option key={department.departmentId} value={department.departmentId}>
                {department.departmentName}
              </option>
            ))}
          </select>
        </div>

        {/* Major Select */}
        <div className="flex flex-col px-8">
          <label className="font-semibold mb-1">Tên ngành</label>
          <select
            name="majorId"
            id="majorId"
            className={`border px-2 py-1 rounded-md ${selectedDepartmentId === "" && "bg-gray"}`}
            disabled={selectedDepartmentId === ""}
            onChange={handleMajorChange}
            value={selectedMajorId}
          >
            <option value="">-- Chọn ngành --</option>
            {majorsList.map((major) => (
              <option key={major.majorId} value={major.majorId}>
                {major.majorName}
              </option>
            ))}
          </select>
        </div>

        {/* Class Select */}
        <div className="flex flex-col px-8">
          <label className="font-semibold mb-1">Tên lớp</label>
          <select
            name="classId"
            id="classId"
            className={`border px-2 py-1 rounded-md ${selectedMajorId === "" && "bg-gray"}`}
            disabled={selectedMajorId === ""}
            onChange={handleClassChange}
            value={selectedClassId}
          >
            <option value="">-- Chọn lớp --</option>
            {classesList.map((classItem) => (
              <option key={classItem.studentClassId} value={classItem.studentClassId}>
                {classItem.studentClassName}
              </option>
            ))}
          </select>
        </div>

        {/* User ID Input */}
        <div className="flex flex-col px-8">
          <label className="font-semibold mb-1">Mã SV</label>
          <input
            type="text"
            className="border px-2 py-1 rounded-md"
            placeholder="Mã SV"
            name="userId"
            onChange={handleQueryCriteria}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleSearch();
              }
            }}
          />
        </div>

        {/* Student Name Input */}
        <div className="flex flex-col px-8">
          <label className="font-semibold mb-1">Tên SV</label>
          <input
            type="text"
            className="border px-2 py-1 rounded-md"
            placeholder="Tên SV"
            name="name"
            onChange={handleQueryCriteria}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleSearch();
              }
            }}
          />
        </div>

        {/* Search Button */}
        <div className="md:col-span-2 flex justify-end mr-8">
          <button
            type="button"
            className="bg-darkBlue text-white px-4 py-1 rounded-md shadow-md"
            onClick={handleSearch}
          >
            Tìm kiếm
          </button>
        </div>
      </div>
    </div>
  );
};

export default StudentQuery;

StudentQuery.propTypes = {
  handleQueryCriteria: PropTypes.func,
  handleSearch: PropTypes.func,
};
