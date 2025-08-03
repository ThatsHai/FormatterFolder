import { IconButton, Badge, Tooltip } from "@mui/material";
import { Link } from "react-router";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import NotificationsIcon from "@mui/icons-material/Notifications";
import useBootstrapUser from "../hook/useBootstrapUser";
import { useSelector } from "react-redux";
import LogoutButton from "./LogoutButton";

const Header = () => {
  const { loading } = useBootstrapUser(); // hydrates redux on mount
  const userData = useSelector((state) => state.auth.user);
  if (loading) return null;

  return (
    <div className="bg-lightBlue h-15 p-5 pl-7 flex items-center">
      <p className="font-headerFont text-white text-4xl font-semibold w-11/12">
        Đề cương luận văn luận án
      </p>
      <div
        className={`flex ${userData.role.name !== "ADMIN" ? "gap-8" : "gap-0"}`}
      >
        <Tooltip title="Thông báo">
          <Link
            to={`${
              userData.role.name !== "ADMIN"
                ? "/notifications"
                : "/admin/notifications"
            }`}
          >
            <IconButton
              aria-label="notifications"
              style={{ color: "white", padding: "0px" }}
            >
              <Badge badgeContent={1} color="error">
                <NotificationsIcon style={{ height: "28px", width: "28px" }} />
              </Badge>
            </IconButton>
          </Link>
        </Tooltip>

        {userData.role.name !== "ADMIN" ? (
          <Tooltip title="Trang cá nhân">
            <Link to={"/profile"}>
              <IconButton
                aria-label="account"
                style={{ color: "white", padding: "0px" }}
              >
                <AccountCircleIcon style={{ height: "28px", width: "28px" }} />
              </IconButton>
            </Link>
          </Tooltip>
        ) : (
          <Tooltip title="Đăng xuất">
            <div className="w-32 h-10">
              <LogoutButton className=" px-2 py-1 rounded-md text-white bg-redError"></LogoutButton>
            </div>
          </Tooltip>
        )}
      </div>
    </div>
  );
};

export default Header;
