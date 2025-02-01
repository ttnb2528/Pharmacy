import { Navigate, useLocation } from "react-router-dom";

const PrivateRoute = ({ children }) => {
  const { userInfo } = JSON.parse(localStorage.getItem("token")) || {};
  const location = useLocation();

  if (!userInfo) {
    // Redirect to login with return url
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return children;
};

export default PrivateRoute;
