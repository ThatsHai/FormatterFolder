import { useState, useEffect } from "react";
import useBootstrapUser from "../../hook/useBootstrapUser";
import Tooltip from "@mui/material/Tooltip";
import Checkbox from "@mui/material/Checkbox";
import { useSelector } from "react-redux";
import TeacherNotificationPage from "../teacherPages/TeacherNotificationPage";
import { useNavigate } from "react-router";
import PropTypes from "prop-types";
import ConfirmationPopup from "../../component/ConfirmationPopup";
import PageNumberFooter from "../../component/PageNumberFooter";
import api from "../../services/api";


const StudentNotificationPage = () => {
  return <p>Student NotificationPage</p>;
};

// const AdminNotificationPage = () => {
//   return <div>AdminNotificationPage</div>;
// };

const RoleToComponentMapping = (role, userId) => {
  switch (role?.name) {
    case "TEACHER":
      return <TeacherNotificationPage userId={userId} />;
    case "STUDENT":
      return <StudentNotificationPage />;
    default:
      return <p>No notifications available for this role.</p>;
  }
};

const NotificationPage = () => {
  const { loading } = useBootstrapUser(); // hydrates redux on mount
  const user = useSelector((state) => state.auth.user);
  const role = user?.role; // safe access

  if (loading) return null;
  if (!role) return null;
  if (!user.userId) return null;
  return (
    <>
      {/* <div className="flex justify-end pt-5">
        <div className="w-1/3 flex mr-3">
          <Button label="Tìm kiếm..." handleClick={() => {}}></Button>
        </div>
      </div> */}
      <div className="m-5 p-2">{RoleToComponentMapping(role, user.userId)}</div>
    </>
  );
};

export default NotificationPage;
