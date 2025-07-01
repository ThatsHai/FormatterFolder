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
import FormManagementPage from "../pages/adminPages/FormManagementPage";
import FormInfoPage from "../pages/adminPages/FormInfoPage";
import FormDesignCreationPage from "../pages/adminPages/FormDesignCreationPage";
import TopicSuggestionPage from "../pages/teacherPages/TopicSuggestionPage";
import RepoManagementPage from "../pages/adminPages/RepoManagementPage";
import Test from "../pages/Test";
import PDFViewer from "../component/forms/SubmitThesisFormComponents/PDFViewer";
import TopicContent from "../pages/teacherPages/topic/TopicContent";

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
    path: "/admin/forms/create",
    element: (
      <AdminLayout>
        <FormCreationPage />
      </AdminLayout>
    ),
  },
  {
    path: "/admin/forms",
    element: (
      <AdminLayout>
        <FormManagementPage />
      </AdminLayout>
    ),
  },
  {
    path: "/admin/forms/:formId",
    element: (
      <AdminLayout>
        <FormInfoPage />
      </AdminLayout>
    ),
  },
  {
    path: "/admin/designs/:formId",
    element: (
      <AdminLayout>
        <FormDesignCreationPage />
      </AdminLayout>
    ),
  },
  {
    path: "/teacher/topics/suggest",
    element: (
      <DefaultLayout>
        <TopicSuggestionPage />
      </DefaultLayout>
    ),
  },
  {
    path: "/teacher/topics",
    element: (
      <DefaultLayout>
        <TopicContent />
      </DefaultLayout>
    ),
  },
  {
    path: "/test",
    element: (
      <AdminLayout>
        <Test />
      </AdminLayout>
    ),
  },
  { 
    path: "/pdfviewer",
    element: (
      <AdminLayout>
        <PDFViewer>

        </PDFViewer>
      </AdminLayout>
    ),
  },
]);

export default Router;
