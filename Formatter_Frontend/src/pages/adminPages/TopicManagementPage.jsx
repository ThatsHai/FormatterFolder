import { useEffect, useState } from "react";
import api from "../../services/api";

const TopicManagementPage = () => {
  const [topicsGroupByTeacher, setTopicsGroupByTeacher] = useState();

  useEffect(() => {
    const fetchTopicsByTeacher = async () => {
      const result = await api.get("/topics/groupByTeacher");
      setTopicsGroupByTeacher(result.data.result.content);
      console.log(result.data.result.content);
    };
    fetchTopicsByTeacher();
  }, []);

  if (!topicsGroupByTeacher || topicsGroupByTeacher.length === 0) {
    return (
      <div className="flex justify-center">
        {/* department, faculty, class, major */}
        <div className="w-3/4 border-lightBlue rounded-md border mx-1 p-2 font-textFont px-6">
          <h2 className="border-b border-b-darkBlue text-xl font-medium ">
            Phân chia số lượng đề tài
          </h2>
          <p className="text-gray-500">Không có dữ liệu.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-center">
      {/* department, faculty, class, major */}
      <div className="w-3/4 border-lightBlue rounded-md border mx-1 p-2 font-textFont px-6">
        <h2 className="border-b border-b-darkBlue text-xl font-medium ">
          Phân chia số lượng đề tài
        </h2>
        <table className="w-full table-fixed mt-3">
          <colgroup>
            <col className="w-[20%]" />
            <col className="w-[30%]" />
            <col className="w-[20%]" />
            <col className="w-[30%]" />
          </colgroup>
          <thead className="">
            <tr>
              <th className="border">Mã số CB</th>
              <th className="border">Họ và tên CB</th>
              <th className="border">Số lượng đề tài</th>
              <th className="border">Danh sách đề tài</th>
            </tr>
          </thead>
          <tbody>
            {topicsGroupByTeacher &&
              topicsGroupByTeacher.map((teacher) => (
                <tr key={teacher.userId}>
                  <td>{teacher.userId}</td>
                  <td>{teacher.name}</td>
                  <input></input>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TopicManagementPage;
