import React from "react";

const Navbar = () => {
  return (
    <div className="bg-lightGray pl-4 flex gap-8 text-lg py-1 font-textFont">
        <button className="hover:bg-gray border border-transparent hover:border-black p-2 px-4 my-1 rounded-lg">
          Đề cương
        </button>
        <button className="hover:bg-gray border border-transparent hover:border-black p-2 px-4 my-1 rounded-lg">
          Tiến độ
        </button>
        <button className="hover:bg-gray border border-transparent hover:border-black p-2 px-4 my-1 rounded-lg">
          Đề tài gợi ý
        </button>
        <button className="hover:bg-gray border border-transparent hover:border-black p-2 px-4 my-1 rounded-lg">
          Liên lạc
        </button>
    </div>
  );
};

export default Navbar;
