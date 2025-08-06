import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import api from "../../../services/api";
import { useNavigate } from "react-router";

const ProgressPage = () => {
  const user = useSelector((state) => state.auth.user);
  const navigate = useNavigate();

  const [progresses, setProgresses] = useState([]);
  useEffect(() => {
    const fetchProgress = async () => {
      const result = await api.get(
        `/progresses/list?teacherId=${user.userId}&page=0&size=10`
      );
      setProgresses(result.data.result.content || "");
    };
    fetchProgress();
  }, [user]);

  const handleClick = (progressId) =>{
    navigate(`/teacher/progresses/${progressId}`);
  }
  if (!progresses) return;

  return (
    <div className="bg-lightGray m-5 p-6 rounded-md min-h-[500px]">
      <p className="text-center font-semibold text-lg">
        DANH SÁCH TIẾN ĐỘ CỦA SINH VIÊN TRONG HỌC KỲ NÀY
      </p>
      {progresses.map((progress) => {
        return (
          <div className="max-w-5xl mx-auto bg-sky-200 p-6 rounded-lg shadow mt-5" onClick={()=>handleClick(progress.progressId)}>
            <div className="flex items-center">
              <p className="font-semibold text-lg flex-1">
                {progress.formRecord.topic.title}
              </p>
              <button className="text-red-500">Xem tiến độ</button>
            </div>
            <p className="mt-2">Người thực hiện: {progress.formRecord.student.name}</p>
          </div>
        );
      })}
    </div>
  );
};

export default ProgressPage;
