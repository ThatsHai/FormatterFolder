import { useEffect, useState } from "react";
import api from "../../../services/api";
import PropTypes from "prop-types";

const TeacherQuery = ({ handleQueryCriteria, handleSearch }) => {
  const [facultiesList, setFacultiesList] = useState([]);
  const [departmentsList, setDepartmentsList] = useState([]);
  const [selectedFacultyId, setSelectedFacultyId] = useState("");

  useEffect(() => {
    const fetchFaculty = async () => {
      const fetchedFaculty = await api.get("/faculties");
      setFacultiesList(fetchedFaculty.data.result);
    };
    fetchFaculty();
  }, []);

  useEffect(() => {
    const fetchDepartment = async () => {
      if (selectedFacultyId === "") {
        return;
      }
      const fetchedDepartment = await api.get(
        `/departments?facultyId=${selectedFacultyId}`
      );
      setDepartmentsList(fetchedDepartment.data.result);
    };
    fetchDepartment();
  }, [selectedFacultyId]);

  const handleFacultyChange = (e) => {
    if (e.target.value !== "") {
      const { value } = e.target;
      setSelectedFacultyId(value);
      handleQueryCriteria(e);
    }
  };

  return (
    <div className="flex justify-center w-full ">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded-md mb-2 w-3/5 ">
        <div className="flex flex-col px-8">
          <label className="font-semibold mb-1">Khoa</label>
          <select
            name="facultyId"
            id="facultyId"
            className="border px-2 py-1 rounded-md"
            onChange={(e) => handleFacultyChange(e)}
          >
            <option
              selected
              className={`${selectedFacultyId !== "" && "hidden"}`}
            ></option>
            {facultiesList.length > 0 &&
              facultiesList.map((faculty) => (
                <option key={faculty.facultyId} value={faculty.facultyId}>
                  {faculty.facultyName}
                </option>
              ))}
          </select>
        </div>

        <div className="flex flex-col px-8">
          <label className="font-semibold mb-1">Tên ngành</label>
          <select
            name="departmentId"
            id="departmentId"
            className={`border px-2 py-1 rounded-md ${
              selectedFacultyId === "" && "bg-gray"
            }`}
            disabled={selectedFacultyId === ""}
            onChange={(e) => handleQueryCriteria(e)}
          >
            {selectedFacultyId !== "" && (
              <>
                <option></option>
                {departmentsList.map((department) => (
                  <option
                    key={department.departmentId}
                    value={department.departmentId}
                  >
                    {department.departmentName}
                  </option>
                ))}
              </>
            )}
          </select>
        </div>

        <div className="flex flex-col px-8">
          <label className="font-semibold mb-1">Mã CB</label>
          <input
            type="text"
            className="border px-2 py-1 rounded-md"
            placeholder="Mã CB"
            name="userId"
            onChange={(e) => handleQueryCriteria(e)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleSearch();
              }
            }}
          />
        </div>

        <div className="flex flex-col px-8">
          <label className="font-semibold mb-1">Tên CB</label>
          <input
            type="text"
            className="border px-2 py-1 rounded-md"
            placeholder="Tên CB"
            name="name"
            onChange={(e) => handleQueryCriteria(e)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault(); 
                handleSearch(); 
              }
            }}
          />
        </div>

        <div className="md:col-span-2 flex justify-end mr-8">
          <button
            type="button"
            className="bg-darkBlue text-white px-4 py-1 rounded-md shadow-md"
            onClick={() => handleSearch()}
          >
            Tìm kiếm
          </button>
        </div>
      </div>
    </div>
  );
};
export default TeacherQuery;

TeacherQuery.propTypes = {
  handleQueryCriteria: PropTypes.func,
  handleSearch: PropTypes.func,
};
