import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import api from "../../../services/api";
import { useNavigate } from "react-router";
import ProgressCard from "../../studentPages/progress/ProgressCard";
import PageNumberFooter from "../../../component/PageNumberFooter";
import useBootstrapUser from "../../../hook/useBootstrapUser";

const ProgressPage = () => {
  const user = useSelector((state) => state.auth.user);
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const [progresses, setProgresses] = useState([]);
  useEffect(() => {
    const fetchProgress = async () => {
      const result = await api.get(
        `/progresses/list?teacherId=${user.userId}&page=${currentPage}&size=4`
      );
      setProgresses(result.data.result.content || []);
      setTotalPages(result.data.result.totalPages || 1);
    };
    fetchProgress();
  }, [user]);

  const handleClick = (progressId) => {
    navigate(`/teacher/progresses/${progressId}`);
  };
  if (!progresses) return;

  const { loading } = useBootstrapUser(); // hydrates redux on mount
  const userData = useSelector((state) => state.auth.user);

  if (loading) return null;
if (userData.role.name !== "TEACHER") {
    navigate("/notFound");
  }

  return (
    <div className="bg-lightGray m-5 p-6 rounded-md">
      <p className="text-2xl">
        DANH SÁCH TIẾN ĐỘ CỦA SINH VIÊN TRONG HỌC KỲ NÀY
      </p>
      <div className="min-h-[300px] mt-5 rounded-md grid grid-cols-2 md:grid-cols-4 gap-3 mb-0">
        {progresses.map((progress, index) => (
          <ProgressCard progress={progress} />
        ))}
      </div>
      <PageNumberFooter
        totalPages={totalPages}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
      />
    </div>
  );
};

export default ProgressPage;
