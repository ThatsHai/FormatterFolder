import { useEffect, useState } from "react";
import React from "react";
import api from "../../services/api";
import PageNumberFooter from "../../component/PageNumberFooter";
import TopicQuery from "./topicManagementPage/TopicQuery";
import NumberInput from "../../component/NumberInput";
import PropTypes from "prop-types";

const TopicManagementPageContent = ({
  tempMaxTopics = [],
  setTempMaxTopics = () => {},
}) => {
  //This array state should include teacherTopicLimit too
  const [topicsGroupByTeacher, setTopicsGroupByTeacher] = useState([]);
  const [semester, setSemester] = useState("HK1");
  const [schoolYear, setSchoolYear] = useState(2025);
  const [expandedTeachers, setExpandedTeachers] = useState({});
  const [teacherName, setTeacherName] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  //This use to track whether user queried with or without semester to display it in UI
  const [queriedWithSemester, setQueriedWithSemester] = useState(true);

  // useEffect(() => {
  //   getCurrentSemester();
  //   setSchoolYear(new Date().getFullYear());
  // }, []);

  // useEffect(() => {console.log(typeof semester)}, [semester])

  //Fetch on mount
  useEffect(() => {
    fetchTopicsByTeacher();
  }, []);

  useEffect(() => {
    fetchTopicsByTeacher();
  }, [currentPage]);

  const fetchTopicsByTeacher = async () => {
    if (schoolYear) {
      let url =
        semester && semester !== "Cả năm"
          ? `/teachers/withTopicsAndLimits?semester=${semester}&year=${schoolYear}&name=${teacherName}&n=5&p=${currentPage}`
          : `/teachers/withTopicsAndLimits?year=${schoolYear}&name=${teacherName}&n=5&p=${currentPage}`;

      const result = await api.get(url);
      let fetched = result.data.result.content;

      // 💡 Merge temp edits
      setTopicsGroupByTeacher(fetched);
      setTotalPages(result.data.result.totalPages);
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

  const handleSubmit = async () => {
    try {
      const changed = tempMaxTopics.filter(
        (temp) => temp.maxTopics !== temp.original
      );
      await api.post("/teacherTopicLimit/userId", changed);
      alert("Lưu thành công.");
    } catch (e) {
      alert("Lưu không thành công, vui lòng thử lại sau");
      console.log("Can't save limit: " + e);
    }
  };

  const handleMaxTopicsChange = (userId, value) => {
    setTempMaxTopics((prev) => {
      const exists = prev.find((t) => t.userId === userId);
      const current = topicsGroupByTeacher.find((t) => t.userId === userId);

      if (exists) {
        return prev.map((t) =>
          t.userId === userId ? { ...t, maxTopics: value } : t
        );
      } else {
        return [
          ...prev,
          {
            userId,
            maxTopics: value,
            original: current?.maxTopics ?? value,
            semester: semester,
            schoolYear: schoolYear.toString(),
          },
        ];
      }
    });
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
                <th className="border p-1">
                  <p>Số lượng đề tài</p>
                  <p>{queriedWithSemester ? "trong học kỳ" : "cả năm"}</p>
                </th>
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
        <span className="border-b border-b-darkBlue text-xl font-medium flex">
          <h2 className="pr-2">Phân chia số lượng đề tài -</h2>
          {semester && <h2 className="pr-2">{semester}</h2>}
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
        {/* Table for display */}
        <div className="min-h-[250px] mt-3 w-full overflow-x-auto">
          <table className="w-full table-fixed">
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
                <th className="border p-1">
                  <p>Số lượng đề tài</p>
                  <p>{queriedWithSemester ? "trong học kỳ" : "cả năm"}</p>
                </th>
                <th className="border p-1">Danh sách đề tài</th>
              </tr>
            </thead>
            <tbody>
              {topicsGroupByTeacher &&
                topicsGroupByTeacher.map((teacher) => {
                  const temp = tempMaxTopics.find(
                    (t) => t.userId === teacher.userId
                  );
                  return (
                    <React.Fragment key={teacher.userId}>
                      <tr>
                        <td className="p-1 border text-center">
                          {teacher.userId}
                        </td>
                        <td className="p-1 border px-2">{teacher.name}</td>
                        <td className="p-1 border">
                          <div className="flex justify-center rounded-md">
                            {/* <input
                            className="border rounded w-1/4 px-1"
                            type="number"
                            max={20}
                            min={0}
                          /> */}
                            <NumberInput
                              min={0}
                              max={20}
                              name="schoolYear"
                              placeholder={new Date().getFullYear().toString()}
                              className="border rounded w-1/3 text-center px-1 bg-lightGray"
                              value={temp?.maxTopics ?? teacher.maxTopics} // show temp if exists
                              onChange={(e) => {
                                const val = Number(e?.target?.value ?? e); // handle both native input or direct number
                                handleMaxTopicsChange(teacher.userId, val);
                              }}
                            />
                          </div>
                        </td>
                        <td className="p-1 border">
                          <div className="text-center">
                            <button
                              onClick={() =>
                                toggleTeacherTopics(teacher.userId)
                              }
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
                          {expandedTeachers[teacher.userId] && (
                            <ol className="space-y-2">
                              {teacher.topicResponses &&
                              teacher.topicResponses.length > 0 ? (
                                teacher.topicResponses.map((topic, index) => (
                                  <li
                                    key={topic.topicId}
                                    title={topic.title}
                                    className="px-4"
                                  >
                                    {/* Topic Title */}
                                    <p className="font-medium">
                                      {topic.title.length > 50
                                        ? `${
                                            index + 1
                                          }. ${topic.title.substring(0, 30)}...`
                                        : `${index + 1}. ${topic.title}`}
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
                                <li className="flex justify-center text-gray-500">
                                  Không có đề tài
                                </li>
                              )}
                            </ol>
                          )}
                        </td>
                      </tr>
                    </React.Fragment>
                  );
                })}
            </tbody>
          </table>
        </div>
        <PageNumberFooter
          totalPages={totalPages}
          maxPage={5}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
        ></PageNumberFooter>
        <div className="w-full flex my-2 justify-end">
          <button
            className="text-lg bg-darkBlue px-4 py-1 rounded-md text-white"
            onClick={handleSubmit}
          >
            Lưu
          </button>
        </div>
      </div>
    </div>
  );
};

const TopicManagementPage = () => {
  const [tempMaxTopics, setTempMaxTopics] = useState([]); // each item: { userId, maxTopics }
  return (
    <TopicManagementPageContent
      tempMaxTopics={tempMaxTopics}
      setTempMaxTopics={setTempMaxTopics}
    ></TopicManagementPageContent>
  );
};

export default TopicManagementPage;

TopicManagementPageContent.propTypes = {
  tempMaxTopics: PropTypes.array,
  setTempMaxTopics: PropTypes.func,
};
