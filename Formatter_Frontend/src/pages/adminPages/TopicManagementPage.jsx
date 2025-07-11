import { useEffect, useState } from "react";
import React from "react";
import api from "../../services/api";
import PropTypes from "prop-types";
import PageNumberFooter from "../../component/PageNumberFooter";

const TopicQuery = ({
  semester,
  schoolYear,
  setSemester,
  setSchoolYear,
  teacherName,
  setTeacherName,
  // handleQueryCriteria,
  handleSearch,
}) => {
  const semesters = ["HK1", "HK2", "HK3"];

  const handleSemesterChange = (e) => {
    setSemester(e.target.value);
    // handleQueryCriteria(e);
  };

  const handleSchoolYearChange = (e) => {
    setSchoolYear(e.target.value);
    // handleQueryCriteria(e);
  };

  const handleTeacherNameChange = (e) => {
    setTeacherName(e.target.value);
  };

  return (
    <div>
      <div className="flex justify-center w-full ">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 py-4 rounded-md mb-2">
          {/* Teacher Name Input */}
          <div className="flex flex-col px-8 md:col-span-2">
            <label className="font-semibold mb-1">Tên CB</label>
            <input
              type="text"
              className="border px-2 py-1 rounded-md"
              placeholder="Tên CB"
              name="name"
              onChange={handleTeacherNameChange}
            />
          </div>

          {/* School Year Input */}
          <div className="flex flex-col px-8 md:col-span-1">
            <label className="font-semibold mb-1">Năm học</label>
            <input
              type="number"
              className="border px-2 py-1 rounded-md"
              placeholder="2025"
              name="schoolYear"
              min={2000}
              max={2300}
              value={schoolYear}
              onChange={handleSchoolYearChange}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleSearch();
                }
              }}
            />
          </div>

          {/* Semester Select */}
          <div className="flex flex-col px-8 md:col-span-2">
            <label className="font-semibold mb-1">Học kỳ</label>
            <select
              name="semester"
              className="border px-2 py-1 rounded-md"
              value={semester}
              onChange={handleSemesterChange}
            >
              <option value="">-- Chọn học kỳ --</option>
              {semesters.map((s, index) => (
                <option key={index} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
          {/* Search Button */}
          <div className="md:col-span-5 flex justify-end mr-8 ">
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
    </div>
  );
};

TopicQuery.propTypes = {
  handleQueryCriteria: PropTypes.func,
  handleSearch: PropTypes.func,
};

const TopicManagementPage = () => {
  const [topicsGroupByTeacher, setTopicsGroupByTeacher] = useState();
  const [semester, setSemester] = useState();
  const [schoolYear, setSchoolYear] = useState();
  const [expandedTeachers, setExpandedTeachers] = useState({});
  const [teacherName, setTeacherName] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    getCurrentSemester();
    setSchoolYear(new Date().getFullYear());
  }, []);

  useEffect(() => {
    fetchTopicsByTeacher();
  }, [currentPage]);

  const fetchTopicsByTeacher = async () => {
    if (schoolYear) {
      // Only require year
      let url = `/topics/groupByTeacher?year=${schoolYear}&name=${teacherName}&n=5&p=${currentPage}`;

      if (semester && semester !== "") {
        url = `/topics/groupByTeacher?semester=${semester}&year=${schoolYear}&name=${teacherName}&n=5&p=${currentPage}`;
      }

      const result = await api.get(url);
      setTopicsGroupByTeacher(result.data.result.content);
      setTotalPages(result.data.result.totalPages);
      console.log(result.data.result.content);
    }
  };

  const toggleTeacherTopics = (userId) => {
    setExpandedTeachers((prev) => ({
      ...prev,
      [userId]: !prev[userId],
    }));
  };

  const getCurrentSemester = () => {
    //Month is zero-based
    const date = new Date().getMonth() + 1;
    const semesterStr = date >= 9 ? "HK1" : date >= 6 ? "HK3" : "HK2";
    setSemester(semesterStr);
  };

  if (!topicsGroupByTeacher || topicsGroupByTeacher.length === 0) {
    return (
      <div className="flex justify-center">
        {/* department, faculty, class, major */}
        <div className="w-3/4 border-lightBlue rounded-md border mx-1 p-2 font-textFont px-6">
          <h2 className="border-b border-b-darkBlue text-xl font-medium ">
            Phân chia số lượng đề tài
          </h2>
          <TopicQuery
            semester={semester}
            schoolYear={schoolYear}
            setSemester={setSemester}
            setSchoolYear={setSchoolYear}
            teacherName={teacherName}
            setTeacherName={setTeacherName}
            handleSearch={fetchTopicsByTeacher}
          ></TopicQuery>
          <table className="w-full table-fixed mt-3 mb-2">
            <colgroup>
              <col className="w-[20%]" />
              <col className="w-[30%]" />
              <col className="w-[20%]" />
              <col className="w-[30%]" />
            </colgroup>
            <thead className="">
              <tr>
                <th className="border p-1">Mã số CB</th>
                <th className="border p-1">Họ và tên CB</th>
                <th className="border p-1">Số lượng đề tài</th>
                <th className="border p-1">Danh sách đề tài</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colSpan={7} className="border text-center">
                  <p className="text-gray-500 w-full p-1">Không có dữ liệu.</p>
                </td>
              </tr>
            </tbody>
          </table>
          <PageNumberFooter
            totalPages={totalPages}
            maxPage={5}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
          ></PageNumberFooter>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-center">
      {/* department, faculty, class, major */}
      <div className="w-3/4 border-lightBlue rounded-md border mx-1 p-2 font-textFont px-6">
        <span className="border-b border-b-darkBlue text-xl font-medium flex gap-2">
          <h2>Phân chia số lượng đề tài -</h2>
          <h2>{semester}</h2>
          <h2>{schoolYear}</h2>
        </span>
        <TopicQuery
          semester={semester}
          schoolYear={schoolYear}
          setSemester={setSemester}
          setSchoolYear={setSchoolYear}
          teacherName={teacherName}
          setTeacherName={setTeacherName}
          handleSearch={fetchTopicsByTeacher}
        ></TopicQuery>
        <table className="w-full table-fixed mt-3">
          <colgroup>
            <col className="w-[20%]" />
            <col className="w-[30%]" />
            <col className="w-[20%]" />
            <col className="w-[30%]" />
          </colgroup>
          <thead className="">
            <tr>
              <th className="border p-1">Mã số CB</th>
              <th className="border p-1">Họ và tên CB</th>
              <th className="border p-1">Số lượng đề tài</th>
              <th className="border p-1">Danh sách đề tài</th>
            </tr>
          </thead>
          <tbody>
            {topicsGroupByTeacher &&
              topicsGroupByTeacher.map((teacher) => (
                <React.Fragment key={teacher.userId}>
                  <tr>
                    <td className="p-1 border text-center">{teacher.userId}</td>
                    <td className="p-1 border px-2">{teacher.name}</td>
                    <td className="p-1 border">
                      <div className="flex justify-center rounded-md">
                        <input
                          className="border rounded w-1/4 px-1"
                          type="number"
                          max={20}
                          min={0}
                        />
                      </div>
                    </td>
                    <td className="p-1 border">
                      <div className="text-center">
                        <button
                          onClick={() => toggleTeacherTopics(teacher.userId)}
                          className="text-blue-500 "
                        >
                          {expandedTeachers[teacher.userId] ? (
                            <p className="text-center  p-2 rounded-full">
                              Ẩn danh sách
                            </p>
                          ) : (
                            <div className="text-md px-2 flex gap-2 items-center">
                              <p className=""> Đề tài đã nhập </p>
                              {teacher.topicResponses &&
                                teacher.topicResponses.length > 0 && (
                                  <p className="text-center bg-lightBlue text-white p-2 py-1 rounded-full">
                                    {teacher.topicResponses.length}
                                  </p>
                                )}
                            </div>
                          )}
                        </button>
                      </div>
                      {/* {expandedTeachers[teacher.userId] ? (
                        <div className="text-md px-2 flex gap-2">
                          <p className=""> - Đề tài đã nhập </p>
                          {teacher.topicResponses &&
                            teacher.topicResponses.length > 0 && (
                              <p className="font-bold">{teacher.topicResponses.length}</p>
                            )}
                        </div>
                      ) : (
                        ""
                      )} */}
                      {expandedTeachers[teacher.userId] && (
                        <tr>
                          <td colSpan={4} className="p-2">
                            <ol className="space-y-2">
                              {teacher.topicResponses &&
                              teacher.topicResponses.length > 0 ? (
                                teacher.topicResponses.map((topic) => (
                                  <li
                                    key={topic.topicId}
                                    title={topic.title}
                                    className="px-4"
                                  >
                                    {/* Topic Title */}
                                    <p className="font-medium">
                                      {topic.title.length > 50
                                        ? `${topic.title.substring(0, 30)}...`
                                        : topic.title}
                                    </p>

                                    {/* Created Date as Description */}
                                    <p className="text-gray-500 text-sm">
                                      {new Date(
                                        topic.createdAt
                                      ).toLocaleDateString("vi-VN")}
                                    </p>
                                  </li>
                                ))
                              ) : (
                                <li className="text-gray-500">
                                  Không có đề tài.
                                </li>
                              )}
                            </ol>
                          </td>
                        </tr>
                      )}
                    </td>
                  </tr>
                </React.Fragment>
              ))}
          </tbody>
        </table>
        <PageNumberFooter
          totalPages={totalPages}
          maxPage={5}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
        ></PageNumberFooter>
        <div className="w-full flex my-2 justify-end">
          <button className="text-lg bg-darkBlue px-4 py-1 rounded-md text-white">
            Lưu
          </button>
        </div>
      </div>
    </div>
  );
};

export default TopicManagementPage;
