import PropTypes from "prop-types";
import { useState } from "react";
import { Link } from "react-router";

const DirectoryPanel = ({ onMouseEnter, onMouseLeave }) => {
  return (
    <>
      <div
        className="absolute top-15 bg-lightGray w-full rounded-md z-50"
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      >
        <ul>
          <li className="">
            <Link to={"/admin/forms"}>
              <button className="hover:bg-gray border py-2 px-4 rounded-none border-gray w-full">
                Quản lý biểu mẫu
              </button>
            </Link>
          </li>
          <li className="">
            <Link to={"/admin/repos"}>
              <button className="hover:bg-gray border py-2 px-4 rounded-none border-gray w-full">
                Quản lý đơn vị
              </button>
            </Link>
          </li>
        </ul>
      </div>
    </>
  );
};
const ThesisCalendarPane = ({ onMouseEnter, onMouseLeave }) => {
  return (
    <>
      <div
        className="absolute top-15 bg-lightGray w-full rounded-md z-50"
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      >
        <ul>
          <li className="text-center">
            <Link to={"/admin/defenseSchedules/create"}>
              <button className="hover:bg-gray border py-2 px-4 rounded-none border-gray w-full">
                Sắp xếp lịch
              </button>
            </Link>
          </li>
          <li className="text-center">
            <Link to={"/admin/defenseSchedules"}>
              <button className="hover:bg-gray border py-2 px-4 rounded-none border-gray w-full">
                Quản lý tổng lịch
              </button>
            </Link>
          </li>
        </ul>
      </div>
    </>
  );
};

const AdminNavbar = () => {
  const [directoryPanelDisplayed, setIsDirectoryPanelDisplayed] =
    useState(false);
  const [calender, setCalender] = useState(false);

  return (
    <div className="bg-lightGray pl-4 flex gap-8 text-base py-1 font-textFont">
      <div
        className="relative"
        onMouseEnter={() => setIsDirectoryPanelDisplayed(true)}
        onMouseLeave={() => setIsDirectoryPanelDisplayed(false)}
      >
        <button className="hover:bg-gray border border-transparent hover:border-black p-2 px-4 my-1 rounded-lg">
          Quản lý danh mục
        </button>
        {directoryPanelDisplayed && (
          <DirectoryPanel
            onMouseEnter={() => setIsDirectoryPanelDisplayed(true)}
            onMouseLeave={() => setIsDirectoryPanelDisplayed(false)}
          ></DirectoryPanel>
        )}
      </div>
      <Link to={"/admin/accounts"}>
        <button className="hover:bg-gray border border-transparent hover:border-black p-2 px-4 my-1 rounded-lg">
          Quản lý tài khoản
        </button>
      </Link>
      <Link to={"/admin/topics"}>
        <button className="hover:bg-gray border border-transparent hover:border-black p-2 px-4 my-1 rounded-lg">
          Phân số lượng đề tài
        </button>
      </Link>

      <div
        className="relative"
        onMouseEnter={() => setCalender(true)}
        onMouseLeave={() => setCalender(false)}
      >
        <button className="hover:bg-gray border border-transparent hover:border-black p-2 px-4 my-1 rounded-lg">
          Quản lý danh mục
        </button>
        {calender && <ThesisCalendarPane></ThesisCalendarPane>}
      </div>
    </div>
  );
};

export default AdminNavbar;

DirectoryPanel.propTypes = {
  onMouseEnter: PropTypes.func,
  onMouseLeave: PropTypes.func,
};
