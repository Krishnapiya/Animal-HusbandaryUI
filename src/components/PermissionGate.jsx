import PropTypes from "prop-types";
import { Navigate } from "react-router-dom";
import { useAuthz } from "../context/AuthzContext";

const PermissionGate = ({ menuKey, action, fallbackPath = "/forbidden", children }) => {
  const { can } = useAuthz();
  if (!can(menuKey, action)) {
    return <Navigate to={fallbackPath} replace />;
  }
  return children;
};

PermissionGate.propTypes = {
  action: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  fallbackPath: PropTypes.string,
  menuKey: PropTypes.string.isRequired,
};

export default PermissionGate;
