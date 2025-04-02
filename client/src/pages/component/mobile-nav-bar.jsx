import {
  Home,
  MessageCircle,
  ShoppingBag,
  User,
  ShoppingCart,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const MobileNavBar = () => {
  const location = useLocation();
  const path = location.pathname;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex justify-between items-center px-2 py-2 md:hidden z-50">
      <Link to="/" className="flex flex-col items-center justify-center w-1/5">
        <Home
          size={20}
          className={`${path === "/" ? "text-[#26773d]" : "text-gray-600"}`}
        />
        <span
          className={`text-xs mt-1 ${
            path === "/" ? "text-[#26773d] font-medium" : "text-gray-600"
          }`}
        >
          Trang chủ
        </span>
      </Link>

      <Link
        to="/cart"
        className="flex flex-col items-center justify-center w-1/5"
      >
        <ShoppingCart
          size={20}
          className={`${
            path.includes("/cart") ? "text-[#26773d]" : "text-gray-600"
          }`}
        />
        <span
          className={`text-xs mt-1 ${
            path.includes("/cart")
              ? "text-[#26773d] font-medium"
              : "text-gray-600"
          }`}
        >
          Giỏ hàng
        </span>
      </Link>

      <Link
        to="https://zalo.me/84866554764"
        className="flex flex-col items-center justify-center w-1/5"
      >
        <MessageCircle
          size={20}
          className={`${
            path.includes("/consultation") ? "text-[#26773d]" : "text-gray-600"
          }`}
        />
        <span
          className={`text-xs mt-1 ${
            path.includes("/consultation")
              ? "text-[#26773d] font-medium"
              : "text-gray-600"
          }`}
        >
          Tư vấn
        </span>
      </Link>

      <Link
        to="/account/history"
        className="flex flex-col items-center justify-center w-1/5"
      >
        <ShoppingBag
          size={20}
          className={`${
            path.includes("/account/history")
              ? "text-[#26773d]"
              : "text-gray-600"
          }`}
        />
        <span
          className={`text-xs mt-1 ${
            path.includes("/account/history")
              ? "text-[#26773d] font-medium"
              : "text-gray-600"
          }`}
        >
          Đơn hàng
        </span>
      </Link>

      <Link
        to="/account"
        className="flex flex-col items-center justify-center w-1/5"
      >
        <User
          size={20}
          className={`${
            path.includes("/account") ? "text-[#26773d]" : "text-gray-600"
          }`}
        />
        <span
          className={`text-xs mt-1 ${
            path.includes("/account")
              ? "text-[#26773d] font-medium"
              : "text-gray-600"
          }`}
        >
          Tài khoản
        </span>
      </Link>
    </div>
  );
};

export default MobileNavBar;
