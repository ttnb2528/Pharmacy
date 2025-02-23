import { useAppStore } from "@/store/index.js";
import { Navigate } from "react-router-dom";

const PrivateRoute2 = ({ children }) => {
  const { userInfo } = useAppStore();
//   console.log(userInfo);
  const isAuthenticated = !!userInfo;
  return isAuthenticated ? children : <Navigate to="/login" />;
};

export default PrivateRoute2;
