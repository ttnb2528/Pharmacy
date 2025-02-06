import { Navigate, useLocation } from "react-router-dom";

const PrivateRoute = ({ children, isAdmin }) => {
  const location = useLocation();
  const isLoggedIn = !!localStorage.getItem("user"); // Kiểm tra đăng nhập

  console.log(isLoggedIn);

  if (!isLoggedIn) {
    // Chuyển đến trang đăng nhập nếu chưa đăng nhập
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (isAdmin && !JSON.parse(localStorage.getItem("user")).isAdmin) {
    // Chuyển đến trang 403 nếu không phải admin
    return <Navigate to="/403" replace />;
  }

  // Hiển thị component con nếu đăng nhập và có quyền truy cập
  return children;
};

export default PrivateRoute;
