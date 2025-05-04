import React from "react";
import PropTypes from "prop-types";

const AuthTemplate = ({ children }) => {
  return (
    <>
      <div className="bg-white mt-10 mx-5 flex justify-center items-center">
        <div>{children}</div>
      </div>
    </>
  );
};

export default AuthTemplate;

AuthTemplate.propTypes = {
  children: PropTypes.node.isRequired,
};
