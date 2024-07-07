import React from "react";
import PropTypes from "prop-types";

function Layout({ children }) {
  Layout.propTypes = {
    children: PropTypes.node.isRequired,
  };
  return <div className="relative">{children}</div>;
}

export default Layout;
