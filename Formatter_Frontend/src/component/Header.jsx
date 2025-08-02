import { IconButton, Badge } from "@mui/material";
import { Link } from "react-router";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import NotificationsIcon from "@mui/icons-material/Notifications";

const Header = () => {
  return (
    <div className="bg-lightBlue h-15 p-5 pl-7 flex items-center">
      <p className="font-headerFont text-white text-4xl font-semibold w-11/12">
        Đề cương luận văn luận án
      </p>
      <div className="flex gap-10">
        <Link to={"/notifications"}>
          <IconButton
            aria-label="notifications"
            style={{ color: "white", padding: "0px" }}
          >
            <Badge badgeContent={1} color="error">
              <NotificationsIcon style={{ height: "28px", width: "28px" }} />
            </Badge>
          </IconButton>
        </Link>

        <Link to={"/profile"}>
          <IconButton
            aria-label="account"
            style={{ color: "white", padding: "0px" }}
          >
            <AccountCircleIcon style={{ height: "28px", width: "28px" }} />
          </IconButton>
        </Link>
      </div>
    </div>
  );
};

export default Header;
