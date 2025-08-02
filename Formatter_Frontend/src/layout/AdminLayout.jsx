import PropTypes from "prop-types";
import Header from "../component/Header"
import AdminNavbar from "../pages/adminPages/adminComponents/AdminNavbar";

const AdminLayout = ({ children }) => {
  return (
    <>
      <div className="">
        <Header></Header>
        <AdminNavbar></AdminNavbar>
        <div className="pt-4">{children}</div>
      </div>
    </>
  );
};

export default AdminLayout;

AdminLayout.propTypes = {
  children: PropTypes.node.isRequired,
};

