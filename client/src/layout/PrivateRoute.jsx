import { Navigate, useLocation } from "react-router-dom";

const PrivateRoute = ({ children }) => {
  const userInfo = localStorage.getItem("token") || {};

  console.log(userInfo);

  const location = useLocation();

  if (!userInfo) {
    // Redirect to login with return url
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return children;
};

export default PrivateRoute;
