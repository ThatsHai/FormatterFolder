import { useEffect, useState } from "react";
import TeachersTable from "./accountManagementPage/TeachersTable";
import TeacherQuery from "./accountManagementPage/TeacherQuery";
import PropTypes from "prop-types";
import api from "../../services/api";
import PageNumberFooter from "../../component/PageNumberFooter";

const QueryContent = ({ selectedTab }) => {
  const [queryCriteria, setQueryCriteria] = useState({});
  const [teachers, setTeachers] = useState([]);
  const [students, setStudents] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const handleQueryCriteria = (e) => {
    const { name, value } = e.target;
    setQueryCriteria((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleSearchTeacher = async () => {
    if (queryCriteria) {
      try {
        const cleanQueryCriteria = Object.fromEntries(
          Object.entries(queryCriteria).filter(
            ([, value]) => value !== "" && value !== null && value !== undefined
          )
        );
        const result = await api.post(
          `/teachers/search?p=${currentPage}&n=3`,
          cleanQueryCriteria
        );
        setTeachers(result.data.result.content);
        setTotalPages(result.data.result.totalPages);
        return;
      } catch (e) {
        console.log("Error fetching teachers with query, error: ", e);
      }
    }
    setTeachers({});
  };

  useEffect(() => {
    handleSearchTeacher();
  }, [currentPage])

  return (
    <>
      {selectedTab === "teacher" && (
        <div className="w-full border-lightBlue rounded-md border mx-1 p-2 font-textFont">
          <h2 className="border-b border-b-darkBlue text-xl font-medium">
            Quản lý tài khoản giáo viên
          </h2>
          <TeacherQuery
            queryCriteria={queryCriteria}
            handleQueryCriteria={handleQueryCriteria}
            handleSearch={handleSearchTeacher}
          ></TeacherQuery>
          <TeachersTable
            teachers={teachers}
            setTeachers={setTeachers}
          ></TeachersTable>
          <PageNumberFooter
            totalPages={totalPages}
            maxPage={3}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
          ></PageNumberFooter>
        </div>
      )}
      {selectedTab === "student" && (
        <div className="w-full border-lightBlue rounded-md border mx-1 p-2 font-textFont">
          <h2 className="border-b border-b-darkBlue text-xl font-medium">
            Quản lý tài khoản sinh viên
          </h2>
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
