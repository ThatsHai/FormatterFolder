// router.js
import { createBrowserRouter } from "react-router-dom"; // Correct import
import Login from "../pages/Login";
import AuthTemplate from "../template/AuthTemplate";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <AuthTemplate>
        <Login/>
      </AuthTemplate>
    ),
  },
]);

export default router;
