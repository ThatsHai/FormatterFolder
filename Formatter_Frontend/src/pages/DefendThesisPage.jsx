import dayjs from "dayjs";
import { Link } from "react-router";
import { useEffect, useState } from "react";
import api from "../services/api";
import useBootstrapUser from "../hook/useBootstrapUser";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";
import NumberInput from "../component/NumberInput";

const QueryFields = ({
  semester,
  schoolYear,
  setSemester,
  setSchoolYear,
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

  return (
    <div>
      <div className="flex justify-center w-full ">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 py-4 rounded-md mb-2">
          {/* School Year Input */}
          <div className="flex flex-col px-8 md:col-span-1">
            <label className="font-semibold mb-1">Năm học</label>
            <NumberInput
              min={2000}
              max={2300}
              name="schoolYear"
              placeholder="2025"
              className="border px-2 py-1 rounded-md"
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

const StudentTopicTable = () => {
  const [data, setData] = useState([]);
  const [sortedData, setSortedData] = useState([]);
  //Query params
  const [semester, setSemester] = useState("HK3");
  const [schoolYear, setSchoolYear] = useState(new Date().getFullYear());

  const handleSearch = async () => {
    try {
      const response = await api.get(
        `/defenseSchedules/getBySemesterAndYear?semester=${semester}&year=${schoolYear}`
      );
      setData(response.data.result);
      //Sort by place -> date -> time
      const sorted = [...response.data.result].sort((a, b) => {
        const placeCompare = a.place.localeCompare(b.place);
        if (placeCompare !== 0) return placeCompare;

        const dateA = new Date(a.startTime).toISOString().split("T")[0];
        const dateB = new Date(b.startTime).toISOString().split("T")[0];
        const dateCompare = dateA.localeCompare(dateB);
        if (dateCompare !== 0) return dateCompare;

        return new Date(a.startTime) - new Date(b.startTime);
      });
      setSortedData(sorted);
    } catch (error) {
      alert("Không thể lấy kết quả.");
      console.log(error);
    }
  };

  useEffect(() => {
    handleSearch();
  }, []);

  const handleGetPDF = async () => {
    const updated = data.map((item) => ({
      ...item,
      startTime: dayjs(item.startTime).format("HH:mm DD-MM-YY"),
    }));

    try {
      const response = await api.post("/defenseSchedules/getPDF", updated, {
        responseType: "blob",
      });

      const blob = new Blob([response.data], { type: "application/pdf" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = "thong-tin-bao-ve.pdf";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(link.href);
    } catch (error) {
      alert("Lỗi tải file");
      console.error(error);
    }
  };

  if (!data || data.length == 0) {
    return (
      <div className="p-4 font-textFont">
        <h2 className="text-xl font-semibold mb-4 border-b border-b-darkBlue">
          Danh sách đề tài
        </h2>
        <QueryFields
          semester={semester}
          setSemester={setSemester}
          schoolYear={schoolYear}
          setSchoolYear={setSchoolYear}
          handleSearch={handleSearch}
        ></QueryFields>
        <div className="flex justify-center">
          <p>Không có dữ liệu</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 font-textFont">
      <h2 className="text-xl font-semibold mb-4 border-b border-b-darkBlue">
        Danh sách đề tài
      </h2>
      <QueryFields
        semester={semester}
        setSemester={setSemester}
        schoolYear={schoolYear}
        setSchoolYear={setSchoolYear}
        handleSearch={handleSearch}
      ></QueryFields>
      <table className="w-full border border-gray-300 text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="border px-2 py-1">STT</th>
            <th className="border px-2 py-1 hidden md:table-cell">MSSV</th>
            <th className="border px-2 py-1 hidden md:table-cell">Tên SV</th>
            <th className="border px-2 py-1">Tên đề tài</th>
            <th className="border px-2 py-1">GVHD</th>
            <th className="border px-2 py-1 hidden md:table-cell">
              Giảng viên phản biện
            </th>
            <th className="border px-2 py-1">Thời gian</th>
            <th className="border px-2 py-1">Ngày</th>
            <th className="border px-2 py-1">Địa điểm</th>
          </tr>
        </thead>

        <tbody>
          {sortedData.map((record, index) => (
            <tr key={index}>
              <td className="border px-2 py-1 text-center">{index + 1}</td>
              <td className="border px-2 py-1 text-center hidden md:table-cell">
                {record.studentId}
              </td>
              <td className="border px-2 py-1 hidden md:table-cell">
                {record.studentName}
              </td>
              <td className="border border-black px-2 py-1 hover:text-darkBlue hover:bg-lightGray underline text-lightBlue">
                <Link to={`/formRecordReview/${record.formRecordId}`}>
                  {record.topicName}
                </Link>
              </td>
              <td className="border px-2 py-1">
                <ul>
                  {record.guideNames.map((guideName, index) => (
                    <li key={index}>{guideName}</li>
                  ))}
                </ul>
              </td>
              <td className="border px-2 py-1 hidden md:table-cell">
                <ul>
                  {record.teacherNames.map((teacherName, index) => (
                    <li key={index}>{teacherName}</li>
                  ))}
                </ul>
              </td>
              <td className="border px-2 py-1 text-center">
                {dayjs(record.startTime).format("HH:mm")}
              </td>
              <td className="border px-2 py-1 text-center">
                {dayjs(record.startTime).format("DD-MM-YYYY")}
              </td>
              <td className="border px-2 py-1 text-center">{record.place}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex py-2 w-full justify-end ">
        <button
          className="bg-lightBlue text-white font-semibold hover:bg-darkBlue p-1 rounded-md px-2"
          onClick={handleGetPDF}
        >
          Xuất file PDF
        </button>
      </div>
    </div>
  );
};

const DefenseThesisPage = () => {
  const { loading } = useBootstrapUser(); // hydrates redux on mount
  const userData = useSelector((state) => state.auth.user);
  const navigate = useNavigate();

  if (loading) return null;
  if (userData.role.name !== "TEACHER") {
    console.log(userData.role.name)
    navigate("/notFound");
  }
  return <StudentTopicTable></StudentTopicTable>;
};

export default DefenseThesisPage;
