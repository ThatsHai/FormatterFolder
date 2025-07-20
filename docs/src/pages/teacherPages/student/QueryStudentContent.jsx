import { useState } from "react";
import StudentsTable from "./StudentsTable";
import StudentQuery from "./StudentQuery";
import api from "../../../services/api";
import PropTypes from "prop-types";

const QueryStudentContent = ({ selectedStudents, setSelectedStudents }) => {
  const [id, setId] = useState("");
  const [students, setStudents] = useState([]);

  const handleSearch = async () => {
    if (!id.trim()) {
      setStudents([]);
      return;
    }
    try {
      const res = await api.get("/students/get", {
        params: { id: id.trim() },
      });

      const newStudent = res.data.result;
      console.log("Search students response:", newStudent);

      const exists = selectedStudents.some(
        (s) => s.userId === newStudent.userId
      );
      if (!exists) {
        console.log("Adding new student:", newStudent);
        const updatedStudents = [...selectedStudents, newStudent];
        setStudents(updatedStudents);
      }
    } catch (err) {
      console.error("Search students failed:", err);
    }
  };

  return (
    <div className="w-full border-lightBlue rounded-md border mx-1 p-2 font-textFont">
      <h2 className="border-b border-b-darkBlue text-xl font-medium mb-2">
        Thêm sinh viên
      </h2>
      <StudentQuery id={id} setId={setId} handleSearch={handleSearch} />
      <StudentsTable
        students={students}
        setSelectedStudents={setSelectedStudents}
        selectable
      />
    </div>
  );
};

QueryStudentContent.propTypes = {
  selectedStudents: PropTypes.array.isRequired,
  setSelectedStudents: PropTypes.func.isRequired,
};

export default QueryStudentContent;
