import React from "react";
import PropTypes from "prop-types";

const AuthLayout = ({ children }) => {
  return (
    <>
      <div className="bg-white mt-10 mx-5 flex justify-center items-center">
        <div>{children}</div>
      </div>
    </>
  );
};

export default AuthLayout;

AuthLayout.propTypes = {
  children: PropTypes.node.isRequired,
};
