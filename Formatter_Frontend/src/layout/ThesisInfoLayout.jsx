import PropTypes from "prop-types";
import Header from "../component/Header"
import Navbar from "../component/Navbar";

const ThesisInfoLayout = ({ children }) => {
  return (
    <>
      <div className="">
        <Header></Header>
        <Navbar></Navbar>
        <div className="pt-5">{children}</div>
      </div>
    </>
  );
};

export default ThesisInfoLayout;

ThesisInfoLayout.propTypes = {
  children: PropTypes.node.isRequired,
};
