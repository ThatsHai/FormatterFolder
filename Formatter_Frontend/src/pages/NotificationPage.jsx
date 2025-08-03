import useBootstrapUser from "../hook/useBootstrapUser";
import { useSelector } from "react-redux";

import TeacherNotificationPage from "./teacherPages/TeacherNotificationPage";
import StudentNotificationPage from "./studentPages/StudentNotificationPage";

const NotificationPage = () => {
  const { loading } = useBootstrapUser(); // hydrates redux on mount
  const userData = useSelector((state) => state.auth.user);
  if (loading) return null;

  switch (userData.role.name) {
    case "TEACHER":
      return (
        <TeacherNotificationPage userData={userData}></TeacherNotificationPage>
      );
    case "STUDENT":
      return (
        <StudentNotificationPage userData={userData}></StudentNotificationPage>
      );
    default:
      return <p>Vai trò không xác định</p>;
  }
};

export default NotificationPage;
