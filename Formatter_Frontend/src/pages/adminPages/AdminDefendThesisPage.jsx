import dayjs from "dayjs";
import { Link } from "react-router";
import { useEffect, useState } from "react";
import api from "../../services/api";

const StudentTopicTable = () => {
  const [data, setData] = useState([]);
  const [sortedData, setSortedData] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await api.get("/defenseSchedules");
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

  if(!data || data.length == 0){
    return <p>Đang tải</p>
  }

  return (
    <div className="p-4 font-textFont">
      <h2 className="text-xl font-semibold mb-4 border-b border-b-darkBlue">
        Danh sách đề tài
      </h2>
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

const AdminDefendThesisPage = () => {
  return <StudentTopicTable></StudentTopicTable>;
};

export default AdminDefendThesisPage;
