import { useSelector, useDispatch } from "react-redux";
import api from "../services/api";
import axios from "axios";
import { loginSuccess } from "../redux/authSlice";

const CreateTeacherButton = () => {
  const handleCreateTeacher = async () => {
    const teacherData = {
      password: "strongPass789",
      name: "Nguyen Van GV",
      dateOfBirth: "1975-10-20",
      gender: "Male",
      address: "789 Academy Avenue, Metropolis",
      phoneNumber: "555-987-6543",
      email: "michael.brown@university.edu",
      avatar: "https://example.com/avatars/michael-brown.png",
      status: "active",
      userId: "TC0013",
      degree: "PhD in Artificial Intelligence",
      position: "Associate Professor",
      department: {
        departmentId: "D001",
      },
    };

    try {
      const response = await api.post(
        "http://localhost:8080/teachers",
        teacherData
      );
      console.log("Teacher created:", response.data);
      alert("Teacher created successfully!");
    } catch (error) {
      console.error("Failed to create teacher:", error);
      alert("Failed to create teacher.");
    }
  };

  return (
    <button
      onClick={handleCreateTeacher}
      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
    >
      Create Teacher
    </button>
  );
};

function Test() {
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);

  const userData = {
    userId: "TC0012",
    password: "strongPass789",
  };

  const fetchInfo = async () => {
    const response = await api.get("/myInfo");
    return response.data.result;
  };

  const handleLogin = async () => {
    try {
      const response = await axios.post(
        "http://localhost:8080/auth/token",
        userData
      );
      const result = response.data.result;
      console.log(result);
      // Example: fetch user data
      const accessToken = result.accesstoken;
      sessionStorage.setItem("accessToken", accessToken);

      const user = await fetchInfo();
      console.log(user);

      dispatch(loginSuccess({ user, accessToken }));
    } catch (err) {
      console.error("Login failed", err);
    }
  };

  return (
    <div>
      <button onClick={handleLogin}>Login</button>
      {auth.isAuthenticated && auth.user?.name && (
        <p>Welcome, {auth.user.name}</p>
      )}
      <CreateTeacherButton></CreateTeacherButton>
    </div>
  );
}

export default Test;
