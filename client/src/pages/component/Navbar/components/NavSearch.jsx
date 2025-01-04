import logo from "@/assets/logo.png";
import test_product_image from "@/assets/test_product_image.png";

import { Link, useNavigate } from "react-router-dom";
import {
  FaSearch,
  FaShoppingCart,
  FaUserCircle,
  FaTrash,
} from "react-icons/fa";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuGroup,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button.jsx";
import { useState } from "react";
import Login from "@/pages/Client/Home/components/Login.jsx";

const NavSearch = () => {
  const [showLogin, setShowLogin] = useState(false);
  const navigate = useNavigate();

  const handleShowLogin = () => {
    setShowLogin(true);
  };
  return (
    <div className="flex flex-wrap justify-between items-center relative gap-10">
      <div>
        <Link to="/">
          <img src={logo} alt="" className="h-20 w-25 my-2 mr-6" />
        </Link>
      </div>

      <div className="relative flex-1">
        <input
          type="text"
          className="w-full h-8 rounded border-none bg-white p-2 outline-none"
          placeholder="Tìm kiếm sản phẩm..."
        />
        <FaSearch className="absolute right-2 top-2" />
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger className="text-[#fff] py-[2px] flex border-none">
          <div className="bg-[#0e562e] rounded px-[10px] py-[2px] mx-auto flex items-center h-10 w-32 box-border cursor-pointer">
            <div className="relative mr-3 text-center">
              <FaShoppingCart className="text-[#fff] text-[20px]" />
              <span className="absolute top-[-3px] min-w-[15px] bg-white rounded-full text-[9px] left-[14px] font-bold text-[#4cb551]">
                1
              </span>
            </div>
            Giỏ hàng
          </div>
        </DropdownMenuTrigger>

        <DropdownMenuContent className="w-[320px] right-20 relative">
          <DropdownMenuLabel className="text-right">
            Tổng tiền:{" "}
            <span className="text-[#f48120] font-bold">100,000đ</span>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />

          <DropdownMenuGroup className="overflow-y-auto max-h-80 overflow-hidden">
            <DropdownMenuItem className="cursor-pointer group">
              <div className="flex gap-2 my-2">
                <img
                  src={test_product_image}
                  alt="product"
                  className="h-10 w-10"
                  onClick={() => navigate("/abc")}
                />

                <div className="flex flex-col justify-center">
                  <Link to="/abc">
                    <span className="line-clamp-1 text-base">
                      Dưỡng chất làm giảm rạn da Happy Event Stretch Mark
                      Repairing Essence Tuýp 40g
                    </span>
                  </Link>
                  <div className="flex">
                    <span>2 x</span>
                    <span className="ml-1 text-[#f48120]">100,000đ</span>
                  </div>
                </div>
                <div
                  className="hidden group-hover:block"
                  onClick={(e) => {
                    e.preventDefault();
                    alert("xóa sản phẩm");
                  }}
                >
                  <FaTrash />
                </div>
              </div>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer group">
              <div className="flex gap-2 my-2">
                <img
                  src={test_product_image}
                  alt="product"
                  className="h-10 w-10"
                />
                <div className="flex flex-col justify-center">
                  <span className="line-clamp-1 text-base">
                    Dưỡng chất làm giảm rạn da Happy Event Stretch Mark
                    Repairing Essence Tuýp 40g
                  </span>
                  <div className="flex">
                    <span>2 x</span>
                    <span className="ml-1 text-[#f48120]">100,000đ</span>
                  </div>
                </div>
                <div
                  className="hidden group-hover:block"
                  onClick={() => alert("xóa sản phẩm")}
                >
                  <FaTrash />
                </div>
              </div>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer group">
              <div className="flex gap-2 my-2">
                <img
                  src={test_product_image}
                  alt="product"
                  className="h-10 w-10"
                />
                <div className="flex flex-col justify-center">
                  <span className="line-clamp-1 text-base">
                    Dưỡng chất làm giảm rạn da Happy Event Stretch Mark
                    Repairing Essence Tuýp 40g
                  </span>
                  <div className="flex">
                    <span>2 x</span>
                    <span className="ml-1 text-[#f48120]">100,000đ</span>
                  </div>
                </div>
                <div
                  className="hidden group-hover:block"
                  onClick={() => alert("xóa sản phẩm")}
                >
                  <FaTrash />
                </div>
              </div>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer group">
              <div className="flex gap-2 my-2">
                <img
                  src={test_product_image}
                  alt="product"
                  className="h-10 w-10"
                />
                <div className="flex flex-col justify-center">
                  <span className="line-clamp-1 text-base">
                    Dưỡng chất làm giảm rạn da Happy Event Stretch Mark
                    Repairing Essence Tuýp 40g
                  </span>
                  <div className="flex">
                    <span>2 x</span>
                    <span className="ml-1 text-[#f48120]">100,000đ</span>
                  </div>
                </div>
                <div
                  className="hidden group-hover:block"
                  onClick={() => alert("xóa sản phẩm")}
                >
                  <FaTrash />
                </div>
              </div>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer group">
              <div className="flex gap-2 my-2">
                <img
                  src={test_product_image}
                  alt="product"
                  className="h-10 w-10"
                />
                <div className="flex flex-col justify-center">
                  <span className="line-clamp-1 text-base">
                    Dưỡng chất làm giảm rạn da Happy Event Stretch Mark
                    Repairing Essence Tuýp 40g
                  </span>
                  <div className="flex">
                    <span>2 x</span>
                    <span className="ml-1 text-[#f48120]">100,000đ</span>
                  </div>
                </div>
                <div
                  className="hidden group-hover:block"
                  onClick={() => alert("xóa sản phẩm")}
                >
                  <FaTrash />
                </div>
              </div>
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuGroup className="flex justify-between mb-3">
            <DropdownMenuItem>
              <Button className="bg-white text-[#f48120] border-[#f48120] border hover:bg-[#f48120] hover:text-white transition-all duration-300">
                Xem giỏ hàng
              </Button>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Button className="bg-[#0e562e] hover:bg-[#227748]">
                Thanh toán
              </Button>
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      <div
        className="bg-white rounded-full h-10 w-32 flex justify-center items-center gap-2 px-3"
        onClick={handleShowLogin}
      >
        <FaUserCircle />
        <span className="hover:opacity-85 transition-all duration-200 cursor-pointer">
          Đăng nhập
        </span>
      </div>
      {showLogin && <Login close={() => setShowLogin(false)}/>}
    </div>
  );
};

export default NavSearch;
