import TeacherProfilePage from "./teacherPages/TeacherProfilePage";
import useBootstrapUser from "../hook/useBootstrapUser";
import { useSelector } from "react-redux";
import StudentProfilePage from "./studentPages/StudentProfilePage";

const ProfilePage = () => {
  const { loading } = useBootstrapUser(); // hydrates redux on mount
  const userData = useSelector((state) => state.auth.user);
  console.log(userData);
  if (loading) return null;

  switch (userData.role.name) {
    case "TEACHER":
      return <TeacherProfilePage userData={userData}></TeacherProfilePage>;
    case "STUDENT":
      return <StudentProfilePage userData={userData}></StudentProfilePage>;
    default:
      return <p>Vai trò không xác định</p>;
  }
};

export default ProfilePage;
