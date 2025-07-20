import PropTypes from "prop-types";
import Header from "../component/Header"
import Navbar from "../component/Navbar";

const DefaultLayout = ({ children }) => {
  return (
    <>
      <div className="">
        <Header></Header>
        <Navbar></Navbar>
        <div>{children}</div>
      </div>
    </>
  );
};

export default DefaultLayout;

DefaultLayout.propTypes = {
  children: PropTypes.node.isRequired,
};

