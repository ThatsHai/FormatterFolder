import { useNavigate } from "react-router";

const Navbar = () => {
  const navigate = useNavigate();
  return (
    <div className="bg-lightGray pl-4 flex gap-8 text-base py-1 font-textFont">
        <button className="hover:bg-gray border border-transparent hover:border-black p-2 px-4 my-1 rounded-lg">
          Đề cương
        </button>
        <button className="hover:bg-gray border border-transparent hover:border-black p-2 px-4 my-1 rounded-lg">
          Tiến độ
        </button>
        <button onClick = {() => navigate("/teacher/topics")} className="hover:bg-gray border border-transparent hover:border-black p-2 px-4 my-1 rounded-lg">
          Đề tài gợi ý
        </button >
        <button className="hover:bg-gray border border-transparent hover:border-black p-2 px-4 my-1 rounded-lg">
          Liên lạc
        </button>
    </div>
  );
};

export default Navbar;
