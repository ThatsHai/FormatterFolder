// router.js
import { createBrowserRouter } from "react-router-dom"; // Correct import
import Login from "../pages/Login";
import SignUp from "../pages/SignUp"
import AuthLayout from "../layout/AuthLayout";
import DefaultLayout from "../layout/DefaultLayout"
import HomePage from "../pages/HomePage";

const Router = createBrowserRouter([
  {
    path: "/login",
    element: (
      <AuthLayout>
        <Login/>
      </AuthLayout>
    ),
  },
  {
    path: "/signup",
    element: (
      <AuthLayout>
        <SignUp/>
      </AuthLayout>
    ),
  },
  {
    path: "/",
    element: (
      <DefaultLayout>
        <HomePage/>
      </DefaultLayout>
    ),
  },
]);

export default Router;
