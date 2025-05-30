// router.js
import { createBrowserRouter } from "react-router-dom"; // Correct import
import Login from "../pages/Login";
import SignUp from "../pages/SignUp";
import AuthLayout from "../layout/AuthLayout";
import DefaultLayout from "../layout/DefaultLayout";
import HomePage from "../pages/HomePage";
import ThesisInfo from "../pages/ThesisInfo";
import AdminHomePage from "../pages/adminPages/AdminHomePage";
import ThesisInfoLayout from "../layout/ThesisInfoLayout";
import AdminLayout from "../layout/AdminLayout";
import AccountManagementPage from "../pages/adminPages/AccountManagementPage";
import FormCreationPage from "../pages/adminPages/FormCreationPage";

const Router = createBrowserRouter([
  {
    path: "/login",
    element: (
      <AuthLayout>
        <Login />
      </AuthLayout>
    ),
  },
  {
    path: "/signup",
    element: (
      <AuthLayout>
        <SignUp />
      </AuthLayout>
    ),
  },
  {
    path: "/",
    element: (
      <DefaultLayout>
        <HomePage />
      </DefaultLayout>
    ),
  },
  {
    path: "/teacher",
    element: (
      <DefaultLayout>
        <HomePage />
      </DefaultLayout>
    ),
  },
  {
    path: "/thesis",
    element: (
      <ThesisInfoLayout>
        <ThesisInfo />
      </ThesisInfoLayout>
    ),
  },
  {
    path: "/admin",
    element: (
      <AdminLayout>
        <AdminHomePage />
      </AdminLayout>
    ),
  },
  {
    path: "/admin/accounts",
    element: (
      <AdminLayout>
        <AccountManagementPage />
      </AdminLayout>
    ),
  },
  {
    path: "/forms/create",
    element: (
      <AdminLayout>
        <FormCreationPage />
      </AdminLayout>
    ),
  },
]);

export default Router;
