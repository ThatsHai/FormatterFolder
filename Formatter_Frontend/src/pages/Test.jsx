import { useSelector, useDispatch } from "react-redux";
import api from "../services/api";
import axios from "axios";
import { loginSuccess } from "../redux/authSlice";

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
    </div>
  );
}

export default Test;
