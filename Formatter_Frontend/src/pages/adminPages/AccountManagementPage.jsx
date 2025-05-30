import { useState } from "react";
import TeachersTable from "./AccountManagementPage/TeachersTable";
import TeacherQuery from "./AccountManagementPage/TeacherQuery";
import PropTypes from "prop-types";
import api from "../../services/api";

const QueryContent = ({ selectedTab }) => {
  const [queryCriteria, setQueryCriteria] = useState({});
  const [teachers, setTeachers] = useState([]);

  const handleQueryCriteria = (e) => {
    const { name, value } = e.target;
    setQueryCriteria((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleSearch = async () => {
    if (queryCriteria) {
      try {
        const result = await api.post("/teachers/search", queryCriteria);
        setTeachers(result.data.result);
        return;
      } catch (e) {
        console.log("Error fetching teachers with query, error: ", e);
      }
    }
    setTeachers({});
  };

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
            handleSearch={handleSearch}
          ></TeacherQuery>
          <TeachersTable
            teachers={teachers}
            setTeachers={setTeachers}
          ></TeachersTable>
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
