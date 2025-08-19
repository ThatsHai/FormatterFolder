import useBootstrapUser from "../hook/useBootstrapUser";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";
const NotFound = () => {
  const { loading } = useBootstrapUser(); // hydrates redux on mount
  const userData = useSelector((state) => state.auth.user);
  const navigate = useNavigate();

  if (loading) return null;

  const handleReturn = () => {
    if (userData.role.name === "STUDENT") {
      navigate("/student");
    } else if (userData.role.name === "TEACHER") {
      navigate("/teacher");
    } else if (userData.role.name === "ADMIN") {
      navigate("/admin");
    } else {
      navigate("/");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-gray-200 text-gray-800">
      <div className="text-center p-8 bg-white rounded-2xl shadow-lg">
        <h1 className="text-6xl font-extrabold text-darkBlue mb-4">404</h1>
        <p className="text-xl mb-6">Không tìm thấy trang này</p>
        <button
          onClick={handleReturn}
          className="px-6 py-2 rounded-lg bg-lightBlue text-white font-medium hover:bg-darkBlue transition"
        >
          Quay lại trang chủ
        </button>
      </div>
    </div>
  );
};

export default NotFound;
