import { useNavigate } from "react-router";
import { useSelector } from "react-redux";

const Navbar = () => {
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);
  const handleClick = (path) => {
    
    if (user.role.name === "STUDENT") {
      path = "/student" + path;
    } else if (user.role.name === "TEACHER") {
      path = "/teacher" + path;
    }
    navigate(path);
  };
  return (
    <div className="bg-lightGray pl-4 flex gap-8 text-base py-1 font-textFont">
      <button className="hover:bg-gray border border-transparent hover:border-black p-2 px-4 my-1 rounded-lg"
        onClick={() => handleClick("")}>
        Đề cương
      </button>
      <button className="hover:bg-gray border border-transparent hover:border-black p-2 px-4 my-1 rounded-lg">
        Tiến độ
      </button>
      <button
        className="hover:bg-gray border border-transparent hover:border-black p-2 px-4 my-1 rounded-lg"
        onClick={() => handleClick("/topics")}
      >
        Đề tài gợi ý
      </button>
      <button className="hover:bg-gray border border-transparent hover:border-black p-2 px-4 my-1 rounded-lg">
        Liên lạc
      </button>
    </div>
  );
};

export default Navbar;
