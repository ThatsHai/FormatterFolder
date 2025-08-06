import { useNavigate } from "react-router";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import useBootstrapUser from "../hook/useBootstrapUser";
import AdminNavbar from "../pages/adminPages/adminComponents/AdminNavbar";

const Navbar = () => {
  const navigate = useNavigate();

  const { loading } = useBootstrapUser(); // hydrates redux on mount
  const user = useSelector((state) => state.auth.user);
  const role = user?.role; // safe access

  useEffect(() => {
    if (!loading && !role) {
      alert("Phiên đăng nhập hết hạn, vui lòng đăng nhập lại.");
      navigate("/login", { replace: true });
    }
  }, [loading, role, navigate]);

  if (loading) return null;
  if (!role) return null;

  const handleClick = (path) => {
    if (user.role.name === "STUDENT") {
      path = "/student" + path;
    } else if (user.role.name === "TEACHER") {
      path = "/teacher" + path;
    }
    navigate(path);
  };

  //Check if user is ADMIN
  if (user.role.name === "ADMIN") return <AdminNavbar></AdminNavbar>;

  return (
    <div className="bg-lightGray pl-4 flex gap-8 text-base py-1 font-textFont">
      <button
        className="hover:bg-gray border border-transparent hover:border-black p-2 px-4 my-1 rounded-lg"
        onClick={() => handleClick("")}
      >
        Đề cương
      </button>
      <button className="hover:bg-gray border border-transparent hover:border-black p-2 px-4 my-1 rounded-lg">
        Tiến độ
      </button>
      {user.role.name && user.role.name !== "STUDENT" && (
        <button
          className="hover:bg-gray border border-transparent hover:border-black p-2 px-4 my-1 rounded-lg"
          onClick={() => handleClick("/topics")}
        >
          Đề tài gợi ý
        </button>
      )}
    </div>
  );
};

export default Navbar;
