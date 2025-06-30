import { useState } from "react";
import TeachersTable from "./accountManagementPage/TeachersTable";
import TeacherQuery from "./accountManagementPage/TeacherQuery";
import StudentQuery from "./accountManagementPage/StudentQuery";
import StudentsTable from "./accountManagementPage/StudentsTable";
import PropTypes from "prop-types";
import api from "../../services/api";
import PageNumberFooter from "../../component/PageNumberFooter";


const QueryContent = ({ selectedTab }) => {
  const [teacherQueryCriteria, setTeacherQueryCriteria] = useState({});
  const [studentQueryCriteria, setStudentQueryCriteria] = useState({});
  const [teachers, setTeachers] = useState([]);
  const [students, setStudents] = useState([]);
  const [currentTeacherPage, setCurrentTeacherPage] = useState(0);
  const [currentStudentPage, setCurrentStudentPage] = useState(0);
  const [totalTeacherPages, setTotalTeacherPages] = useState(0);
  const [totalStudentPages, setTotalStudentPages] = useState(0);

  const handleQueryCriteria = (e) => {
    const { name, value } = e.target;
    if (selectedTab === "teacher") {
      setTeacherQueryCriteria((prevState) => ({ ...prevState, [name]: value }));
    } else if (selectedTab === "student") {
      setStudentQueryCriteria((prevState) => ({ ...prevState, [name]: value }));
    }
  };

  const handleSearchTeacher = async () => {
    if (teacherQueryCriteria) {
      try {
        const cleanQueryCriteria = Object.fromEntries(
          Object.entries(teacherQueryCriteria).filter(
            ([, value]) => value !== "" && value !== null && value !== undefined
          )
        );
        const result = await api.post(
          `/teachers/search?p=${currentTeacherPage}&n=5`,
          cleanQueryCriteria
        );
        setTeachers(result.data.result.content);
        setTotalTeacherPages(result.data.result.totalPages);
        return;
      } catch (e) {
        console.log("Error fetching teachers with query, error: ", e);
      }
    }
    setTeachers({});
  };

  const handleSearchStudent = async () => {
    if (studentQueryCriteria) {
      try {
        const cleanQueryCriteria = Object.fromEntries(
          Object.entries(studentQueryCriteria).filter(
            ([, value]) => value !== "" && value !== null && value !== undefined
          )
        );
        const result = await api.post(
          `/students/search?p=${currentStudentPage}&n=5`,
          cleanQueryCriteria
        );
        console.log(result);
        setStudents(result.data.result.content);
        setTotalStudentPages(result.data.result.totalPages);
        return;
      } catch (e) {
        console.log("Error fetching students with query, error: ", e);
      }
    }
    setTeachers({});
  };

  useEffect(() => {
    handleSearchTeacher();
  }, [currentTeacherPage]);

  useEffect(() => {
    handleSearchStudent();
  }, [currentStudentPage]);

  return (
    <>
      {selectedTab === "teacher" && (
        <div className="w-full border-lightBlue rounded-md border mx-1 p-2 font-textFont">
          <h2 className="border-b border-b-darkBlue text-xl font-medium">
            Quản lý tài khoản giáo viên
          </h2>
          <TeacherQuery
            queryCriteria={teacherQueryCriteria}
            handleQueryCriteria={handleQueryCriteria}
            handleSearch={handleSearchTeacher}
          ></TeacherQuery>
          <TeachersTable
            teachers={teachers}
            setTeachers={setTeachers}
          ></TeachersTable>
          <PageNumberFooter
            totalPages={totalTeacherPages}
            maxPage={3}
            currentPage={currentTeacherPage}
            setCurrentPage={setCurrentTeacherPage}
          ></PageNumberFooter>
        </div>
      )}
      {selectedTab === "student" && (
        <div className="w-full border-lightBlue rounded-md border mx-1 p-2 font-textFont">
          <h2 className="border-b border-b-darkBlue text-xl font-medium">
            Quản lý tài khoản sinh viên
          </h2>
          <StudentQuery
            queryCriteria={studentQueryCriteria}
            handleQueryCriteria={handleQueryCriteria}
            handleSearch={handleSearchStudent}
          ></StudentQuery>
          <StudentsTable
            students={students}
            setStudents={setStudents}
          ></StudentsTable>
          <PageNumberFooter
            totalPages={totalStudentPages}
            maxPage={3}
            currentPage={currentStudentPage}
            setCurrentPage={setCurrentStudentPage}
          ></PageNumberFooter>
        </div>
      )}
    </>
  );
};

const ManagementTabs = ({ selectedTab, setSelectedTab }) => {
  return (
    <div className="flex gap-1 w-1/4">
      <ul className="w-full">
        <li className="w-full font-textFont">
          <button
            className={`${
              selectedTab === "teacher"
                ? "bg-lightBlue text-white"
                : "bg-lightGray text-black"
            } p-5 rounded-t-md w-full`}
            onClick={() => setSelectedTab("teacher")}
          >
            Tài khoản giáo viên
          </button>
        </li>
        <li className="w-full ">
          <button
            className={`${
              selectedTab === "student"
                ? "bg-lightBlue text-white"
                : "bg-lightGray text-black"
            } p-5 rounded-b-md w-full`}
            onClick={() => setSelectedTab("student")}
          >
            Tài khoản sinh viên
          </button>
        </li>
      </ul>
    </div>
  );
};

const AccountManagementPage = () => {
  const [selectedTab, setSelectedTab] = useState("teacher");

  return (
    <div className="flex">
      <ManagementTabs
        selectedTab={selectedTab}
        setSelectedTab={setSelectedTab}
      ></ManagementTabs>
      <QueryContent selectedTab={selectedTab}></QueryContent>
    </div>
  );
};

export default AccountManagementPage;

QueryContent.propTypes = {
  selectedTab: PropTypes.string,
};

ManagementTabs.propTypes = {
  selectedTab: PropTypes.string,
  setSelectedTab: PropTypes.func,
};
