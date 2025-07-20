import { useState } from "react";
import TeachersTable from "./TeachersTable";
import TeacherQuery from "../adminPages/AccountManagementPage/TeacherQuery";
import PropTypes from "prop-types";
import api from "../../services/api";
import PageNumberFooter from "../../component/PageNumberFooter"

const QueryContent = ({ setSelectedTeachers, selectedTeachers }) => {
  const [queryCriteria, setQueryCriteria] = useState({});
  const [teachers, setTeachers] = useState([]);
  const [currentTeacherPage, setCurrentTeacherPage] = useState(0);
  const [totalTeacherPages, setTotalTeacherPages] = useState(1);

  const handleQueryCriteria = (e) => {
    const { name, value } = e.target;
    setQueryCriteria((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleSearch = async (page =0) => {
    if (queryCriteria) {
      try {
        const cleanQueryCriteria = Object.fromEntries(
          Object.entries(queryCriteria).filter(
            ([, value]) => value !== "" && value !== null && value !== undefined
          )
        );
        const result = await api.post(`/teachers/search?p=${page}&n=5`, cleanQueryCriteria);
        const newTeachers = result.data.result.content || [];
        const updatedTeachers = [
          ...selectedTeachers,
          ...newTeachers.filter(
            (newTeacher) =>
              !selectedTeachers.some((t) => t.userId === newTeacher.userId)
          ),
        ];
        setTeachers(updatedTeachers);
        setTotalTeacherPages(result.data.result.totalPages || 1);
        setCurrentTeacherPage(page);
        return;
      } catch (e) {
        console.log("Error fetching teachers with query, error: ", e);
      }
    }
    setTeachers({});
  };
  const handlePageChange = (page) => {
    handleSearch(page);
  };

  return (
    <>
      <div className="w-full border-lightBlue rounded-md border mx-1 p-2 font-textFont">
        <h2 className="border-b border-b-darkBlue text-xl font-medium">
          Thêm cán bộ hướng dẫn
        </h2>
        <TeacherQuery
          queryCriteria={queryCriteria}
          handleQueryCriteria={handleQueryCriteria}
          handleSearch={()=>handleSearch(0)}
        ></TeacherQuery>
        <TeachersTable
          teachers={teachers}
          selectedTeachers={selectedTeachers}
          setSelectedTeachers={setSelectedTeachers}
          selectable={true}
        ></TeachersTable> 
        <PageNumberFooter
          totalPages={totalTeacherPages}
          currentPage={currentTeacherPage}
          setCurrentPage={handlePageChange}
        />
      </div>
    </>
  );
};

const AddingTeacher = ({ onSelectTeachers, onClose }) => {
  const [selectedTeachers, setSelectedTeachers] = useState([]);

  const handleConfirm = () => {
    onSelectTeachers(selectedTeachers); // Trả về danh sách đã chọn
    onClose(); // Đóng modal
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40"
      onKeyDown={(e) => {
        if (e.key === "Enter" && selectedTeachers.length > 0) {
          e.preventDefault();
          handleConfirm();
        }
      }}
      tabIndex={0}
    >
      <div className="bg-white rounded shadow-lg p-6 w-full max-w-3xl relative">
        <button
          className="absolute -top-4 -right-4 bg-white border border-gray-300 px-2 py-1 rounded-full z-20 shadow-md"
          onClick={onClose}
        >
          X
        </button>
        <QueryContent
          setSelectedTeachers={setSelectedTeachers}
          selectedTeachers={selectedTeachers}
        />
        <div className="mt-4 text-right">
          <button
            className="bg-darkBlue text-white px-4 py-2 rounded"
            onClick={handleConfirm}
          >
            Xác nhận
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddingTeacher;

QueryContent.propTypes = {
  selectedTab: PropTypes.string,
};
