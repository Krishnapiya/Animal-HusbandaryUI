/*eslint-disable*/
import PropTypes from "prop-types";
import { Navigate, useLocation } from "react-router-dom";

const ProtectedRoute = ({ element: Element, ...rest }) => {
  const location = useLocation(); // Access the current route location

  return <Element {...rest} />;
};

ProtectedRoute.propTypes = {
  element: PropTypes.elementType.isRequired,
};

export default ProtectedRoute;
