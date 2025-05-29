import { useState } from "react";

const DirectoryPanel = () => {
  return (
    <>
      <div className="absolute top-15 bg-lightGray w-full rounded-md">
        <ul>
          <li className="">
            <button className="hover:bg-gray border py-2 px-4 rounded-none border-gray w-full">Quản lý biểu mẫu</button>
          </li>
          <li className="">
            <button className="hover:bg-gray border py-2 px-4 rounded-none border-gray w-full">Quản lý trường</button>
          </li>
          <li className="">
            <button className="hover:bg-gray border py-2 px-4 rounded-none border-gray w-full">Quản lý đơn vị</button>
          </li>
          
        </ul>
      </div>
    </>
  );
};

const AdminNavbar = () => {
  const [directoryPanelDisplayed, setIsDirectoryPanelDisplayed] =
    useState(false);

  return (
    <div className="bg-lightGray pl-4 flex gap-8 text-base py-1 font-textFont">
      <div className="relative">
        <button
          className="hover:bg-gray border border-transparent hover:border-black p-2 px-4 my-1 rounded-lg"
          onMouseEnter={() => setIsDirectoryPanelDisplayed(true)}
          onClick={() => setIsDirectoryPanelDisplayed(true)}
        >
          Quản lý danh mục
        </button>
        {/* {directoryPanelDisplayed && <DirectoryPanel></DirectoryPanel>} */}
      </div>
      <button className="hover:bg-gray border border-transparent hover:border-black p-2 px-4 my-1 rounded-lg">
        Quản lý tài khoản
      </button>
      <button className="hover:bg-gray border border-transparent hover:border-black p-2 px-4 my-1 rounded-lg">
        Phân số lượng đề tài
      </button>
      <button className="hover:bg-gray border border-transparent hover:border-black p-2 px-4 my-1 rounded-lg">
        Sắp xếp lịch bảo vệ đề tài
      </button>
    </div>
  );
};

export default AdminNavbar;
