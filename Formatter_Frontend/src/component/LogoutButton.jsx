import { useDispatch } from "react-redux";
import { logout } from "../redux/authSlice";
import api, { refreshTokenApi } from "../services/api";
import { useNavigate } from "react-router";

const LogoutButton = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleLogOut = async () => {
    try {
      await refreshTokenApi.post("/auth/logout");
      dispatch(logout());
      sessionStorage.removeItem("accessToken");
      alert("Đã đăng xuất");
      api.defaults.headers.common['Authorization'] = "";
      refreshTokenApi.defaults.headers.common['Authorization'] = "";
      navigate("/login");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="w-full flex items-end justify-end ">
      <button
        className="border-redError text-redError border px-2 py-1 rounded-md hover:text-white hover:bg-redError"
        onClick={handleLogOut}
      >
        Đăng xuất
      </button>
    </div>
  );
};
export default LogoutButton;
