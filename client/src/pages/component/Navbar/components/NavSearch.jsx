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
import { useContext, useEffect, useRef, useState } from "react";
import Login from "@/pages/Client/Home/components/Login.jsx";
import { PharmacyContext } from "@/context/Pharmacy.context.jsx";
import { Separator } from "@/components/ui/separator.jsx";
import { FaRegUserCircle } from "react-icons/fa";
import { LuNotepadText } from "react-icons/lu";
import { GrMapLocation } from "react-icons/gr";
import { IoIosLogOut } from "react-icons/io";
import { apiClient } from "@/lib/api-client.js";
import { LOGOUT_ROUTE } from "@/API/index.api.js";
import { Input } from "@/components/ui/input.jsx";

const NavSearch = () => {
  const [showLogin, setShowLogin] = useState(false);
  const navigate = useNavigate();
  const { userData, cart, CalculateTotalItems, allProducts } =
    useContext(PharmacyContext);

  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const inputRef = useRef(null);

  const handleShowLogin = () => {
    setShowLogin(true);
  };

  const handleSearchChange = (event) => {
    const newSearchTerm = event.target.value;
    setSearchTerm(newSearchTerm);

    if (!newSearchTerm) {
      setSearchResults([]);
      return;
    }

    // Tìm kiếm sản phẩm
    const filteredProducts = allProducts.filter((product) => {
      return product.name.toLowerCase().includes(newSearchTerm.toLowerCase());
    });
    setSearchResults(filteredProducts);
  };

  const handleFocus = () => {
    setShowResults(true);
  };

  // Xử lý click outside input
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        inputRef.current &&
        !inputRef.current.contains(event.target) &&
        !event.target.closest(".search-suggestions")
      ) {
        console.log("click outside");

        setShowResults(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="flex flex-wrap justify-between items-center relative gap-10">
      <div>
        <Link to="/">
          <img src={logo} alt="" className="h-20 w-25 my-2 mr-6" />
        </Link>
      </div>

      <div className="relative flex-1" ref={inputRef}>
        <Input
          className="w-full h-10 rounded border-none bg-white focus-visible:ring-0 p-2 outline-none"
          placeholder="Tìm kiếm sản phẩm..."
          value={searchTerm}
          onChange={handleSearchChange}
          onFocus={handleFocus}
        />
        <FaSearch className="absolute right-3 top-3" />
        {showResults && (
          <div className="absolute top-12 left-0 w-full bg-white rounded-md shadow-md search-suggestions">
            <ul>
              {searchResults.map((product) => (
                <li
                  key={product.id}
                  // className="py-2 px-4 flex items-center gap-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => {
                    setShowResults(false);
                    // navigate(`/product/${product.id}`);
                  }}
                >
                  <Link
                    to={`/product/${product.id}`}
                    className="py-2 px-4 flex items-center gap-2 hover:bg-gray-100 cursor-pointer"
                  >
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-8 h-8 rounded-md"
                    />
                    <span>{product.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
            {searchResults.length > 0 && (
              <>
                <Separator />
                <div
                  className="p-4 text-center"
                  onClick={() => {
                    const searchParams = new URLSearchParams();
                    searchParams.set("keyword", searchTerm);
                    navigate(`/search?${searchParams.toString()}`);
                    setShowResults(false);
                  }}
                >
                  <span className="text-[#f48120] font-semibold">
                    Xem tất cả {searchResults.length} sản phẩm
                  </span>
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {/* cart */}
      <DropdownMenu>
        <DropdownMenuTrigger className="text-[#fff] py-[2px] flex border-none">
          <div className="bg-[#0e562e] rounded px-[10px] py-[2px] mx-auto flex items-center h-10 w-32 box-border cursor-pointer">
            <div className="relative mr-3 text-center">
              <FaShoppingCart className="text-[#fff] text-[20px]" />
              <span className="absolute top-[-3px] min-w-[15px] bg-white rounded-full text-[9px] left-[14px] font-bold text-[#4cb551]">
                {CalculateTotalItems(cart)}
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
              className="bg-white rounded-full h-10 flex w-36 items-center gap-2 px-3 focus-visible:ring-0"
            >
              {userData?.avatar ? (
                <img
                  src={userData?.avatar}
                  alt="avatar user"
                  className="h-8 w-8 rounded-full object-cover"
                />
              ) : (
                <svg
                  width={20}
                  height={20}
                  fill="green"
                  version="1.1"
                  id="Layer_1"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="796 796 200 200"
                  enableBackground="new 796 796 200 200"
                  xmlSpace="preserve"
                  stroke="green"
                >
                  <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                  <g
                    id="SVGRepo_tracerCarrier"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  ></g>
                  <g id="SVGRepo_iconCarrier">
                    {" "}
                    <path d="M896,796c-55.14,0-99.999,44.86-99.999,100c0,55.141,44.859,100,99.999,100c55.141,0,99.999-44.859,99.999-100 C995.999,840.86,951.141,796,896,796z M896.639,827.425c20.538,0,37.189,19.66,37.189,43.921c0,24.257-16.651,43.924-37.189,43.924 s-37.187-19.667-37.187-43.924C859.452,847.085,876.101,827.425,896.639,827.425z M896,983.86 c-24.692,0-47.038-10.239-63.016-26.695c-2.266-2.335-2.984-5.775-1.84-8.82c5.47-14.556,15.718-26.762,28.817-34.761 c2.828-1.728,6.449-1.393,8.91,0.828c7.706,6.958,17.316,11.114,27.767,11.114c10.249,0,19.69-4.001,27.318-10.719 c2.488-2.191,6.128-2.479,8.932-0.711c12.697,8.004,22.618,20.005,27.967,34.253c1.144,3.047,0.425,6.482-1.842,8.817 C943.037,973.621,920.691,983.86,896,983.86z"></path>{" "}
                  </g>
                </svg>
              )}
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
