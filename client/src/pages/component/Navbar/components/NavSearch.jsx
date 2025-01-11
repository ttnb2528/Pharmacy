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
import { useContext, useState } from "react";
import Login from "@/pages/Client/Home/components/Login.jsx";
import { PharmacyContext } from "@/context/Pharmacy.context.jsx";
import { Separator } from "@/components/ui/separator.jsx";
import { FaRegUserCircle } from "react-icons/fa";
import { LuNotepadText } from "react-icons/lu";
import { GrMapLocation } from "react-icons/gr";
import { IoIosLogOut } from "react-icons/io";
import userAvatar from "@/assets/user_avatar.jpg";
import { apiClient } from "@/lib/api-client.js";
import { LOGOUT_ROUTE } from "@/API/index.api.js";

const NavSearch = () => {
  const [showLogin, setShowLogin] = useState(false);
  const navigate = useNavigate();
  const { userData } = useContext(PharmacyContext);

  console.log(userData);

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
          className="w-full h-10 rounded border-none bg-white p-2 outline-none"
          placeholder="Tìm kiếm sản phẩm..."
        />
        <FaSearch className="absolute right-3 top-3" />
      </div>

      {/* cart */}
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
            <DropdownMenuItem onClick={() => navigate("/cart")}>
              <Button className="bg-white text-[#f48120] border-[#f48120] border hover:bg-[#f48120] hover:text-white transition-all duration-300">
                Xem giỏ hàng
              </Button>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate("/checkout")}>
              <Button className="bg-[#0e562e] hover:bg-[#227748]">
                Thanh toán
              </Button>
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* user */}
      {userData ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div
              // variant="outline"
              className="bg-white rounded-full h-10 flex w-40 items-center gap-2 px-3 focus-visible:ring-0"
            >
              <img
                src={userAvatar}
                alt="avatar user"
                className="h-8 w-8 rounded-full object-cover"
              />
              <div className="line-clamp-1 flex-1 text-left text-xs font-bold">
                {userData.name ? `Chào, ${userData.name}` : "Chào, Khach Hang"}
              </div>
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56 right-10 top-1 relative ">
            <DropdownMenuGroup className="space-y-2">
              <DropdownMenuItem
                className="flex items-center"
                onClick={() => navigate("/account/info")}
              >
                <FaRegUserCircle /> Thông tin cá nhân
              </DropdownMenuItem>

              <Separator />

              <DropdownMenuItem
                className="flex items-center"
                onClick={() => navigate("/account/history")}
              >
                <LuNotepadText /> Lịch sử đơn hàng
              </DropdownMenuItem>

              <Separator />

              <DropdownMenuItem
                className="flex items-center"
                onClick={() => navigate("/account/coupons")}
              >
                <svg
                  stroke="currentColor"
                  fill="none"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-6 h-6 "
                  height="1em"
                  width="1em"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M2 9a3 3 0 1 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 1 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z"></path>
                  <path d="M9 9h.01"></path>
                  <path d="m15 9-6 6"></path>
                  <path d="M15 15h.01"></path>
                </svg>
                Mã giảm giá
              </DropdownMenuItem>

              <Separator />

              <DropdownMenuItem
                className="flex items-center"
                onClick={() => navigate("/account/addresses")}
              >
                <GrMapLocation />
                Sổ tay địa chỉ
              </DropdownMenuItem>
            </DropdownMenuGroup>

            <DropdownMenuSeparator />

            <DropdownMenuItem
              className="flex items-center"
              onClick={async () => {
                localStorage.removeItem("token");
                await apiClient.post(LOGOUT_ROUTE);
                window.location.reload();
              }}
            >
              <IoIosLogOut />
              Đăng xuất
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <div
          className="bg-white rounded-full h-10 w-32 flex justify-center items-center gap-2 px-3"
          onClick={handleShowLogin}
        >
          <FaUserCircle />
          <span className="hover:opacity-85 transition-all duration-200 cursor-pointer">
            Đăng nhập
          </span>
        </div>
      )}
      {showLogin && <Login close={() => setShowLogin(false)} />}
    </div>
  );
};

export default NavSearch;
