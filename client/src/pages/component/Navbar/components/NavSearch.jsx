import logo from "@/assets/logo.png";

import { Link, useNavigate } from "react-router-dom";
import {
  FaSearch,
  FaShoppingCart,
  FaUserCircle,
  FaTrash,
  FaBars,
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
import {
  LOGOUT_ROUTE,
  REMOVE_PRODUCT_FROM_CART_ROUTE,
} from "@/API/index.api.js";
import { Input } from "@/components/ui/input.jsx";
import { convertVND } from "@/utils/ConvertVND.js";
import { CalculateProductWithSale } from "@/utils/Calculate.js";
import Loading from "../../Loading.jsx";
import slugify from "slugify";
import { useAppStore } from "@/store/index.js";
import { useMediaQuery } from "@/hook/use-media-query.js";
import { useTranslation } from "react-i18next";
import { useNotification } from "@/context/NotificationContext.jsx";

const NavSearch = ({ setMobileMenuOpen, mobileMenuOpen }) => {
  const { t } = useTranslation();
  const { userInfo, setUserInfo } = useAppStore();
  const [showLogin, setShowLogin] = useState(false);
  const navigate = useNavigate();
  const {
    cart,
    setCart,
    CalculateTotalItems,
    CalculateTotalPriceTemp,
    allProducts,
  } = useContext(PharmacyContext);

  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [loading, setIsLoading] = useState(false);
  const inputRef = useRef(null);
  const searchContainerRef = useRef(null);
  const { showNotification } = useNotification();
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const isMobile = useMediaQuery("(max-width: 640px)");

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

  useEffect(() => {
    setCart(userInfo?.accountId?.cartData);
  }, [userInfo, setCart]);

  // Xử lý click outside input
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Check if the click occurred outside the search container
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target) &&
        event.target !== inputRef.current
      ) {
        setShowResults(false);
      }
    };

    // Listen for clicks on the document
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      // Clean up the event listener when the component is unmounted
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleRemoveProduct = async (productId) => {
    try {
      setIsLoading(true);
      const res = await apiClient.post(REMOVE_PRODUCT_FROM_CART_ROUTE, {
        productId,
      });

      if (res.status === 200 && res.data.status === 200) {
        setCart((prev) => ({
          ...prev,
          [productId]: 0,
        }));

        showNotification("success", "Xóa sản phẩm", `${res.data.message}`);
      } else {
        showNotification(
          "error",
          "Lỗi",
          res.data.message || "Không thể xóa sản phẩm khỏi giỏ hàng"
        );
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNavigate = (product) => {
    navigate(
      `${slugify(product?.categoryId?.name, { lower: true })}/${slugify(
        product?.name,
        { lower: true }
      )}`,
      { state: { product } }
    );
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      const searchParams = new URLSearchParams();
      searchParams.set("keyword", searchTerm);
      navigate(`/search?${searchParams.toString()}`);
      setShowResults(false);
    }
  };

  return (
    <div className="flex flex-wrap justify-between items-center relative gap-2 sm:gap-4 md:gap-6 py-2">
      {loading && <Loading />}

      {/* Mobile menu toggle */}
      {!isDesktop && (
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          <FaBars className="h-5 w-5" />
        </Button>
      )}

      {/* Logo */}
      <div className={isMobile ? "w-24" : ""}>
        <Link to="/">
          <img
            src={logo || "/placeholder.svg"}
            alt="Pharmacy Logo"
            className={`${isMobile ? "h-12 w-auto" : "h-20 w-auto"} my-2`}
          />
        </Link>
      </div>

      {/* Search bar */}
      <div
        className={`relative ${isMobile ? "order-last w-full mt-2" : "flex-1"}`}
      >
        <Input
          ref={inputRef}
          className="w-full h-10 rounded border-none bg-white focus-visible:ring-0 p-2 outline-none"
          placeholder={t("search.placeholder")}
          value={searchTerm}
          onChange={handleSearchChange}
          onFocus={handleFocus}
          onKeyDown={handleKeyDown}
        />
        <FaSearch className="absolute right-3 top-3" />
        {showResults && (
          <div
            className="absolute top-12 left-0 w-full bg-white rounded-md shadow-md z-50"
            ref={searchContainerRef}
          >
            <ul>
              {searchResults.map((product) => (
                <li
                  key={product.id}
                  onClick={() => {
                    setShowResults(false);
                  }}
                >
                  <div
                    onClick={() => handleNavigate(product)}
                    className="py-2 px-4 flex items-center gap-2 hover:bg-gray-100 cursor-pointer"
                  >
                    <img
                      src={product.images[0] || "/placeholder.svg"}
                      alt={product.name}
                      className="w-8 h-8 rounded-md"
                    />
                    <span className="line-clamp-1">{product.name}</span>
                  </div>
                </li>
              ))}
            </ul>
            {searchResults.length > 0 && (
              <>
                <Separator />
                <div
                  className="p-4 text-center cursor-pointer"
                  onClick={() => {
                    const searchParams = new URLSearchParams();
                    searchParams.set("keyword", searchTerm);
                    navigate(`/search?${searchParams.toString()}`);
                    setShowResults(false);
                  }}
                >
                  <span className="text-[#f48120] font-semibold">
                    {t("search.view_all", { count: searchResults.length })}
                  </span>
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {/* Cart dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="relative bg-[#0e562e] text-white rounded-md h-10 w-10 sm:w-32 flex items-center justify-center hover:bg-[#13482b] hover:text-white transition-all duration-300"
          >
            <FaShoppingCart />
            <span className="absolute -top-1 -right-1 sm:top-1 sm:right-20 bg-white rounded-full text-[#4cb551] text-xs min-w-[18px] h-[18px] flex items-center justify-center">
              {CalculateTotalItems(cart)}
            </span>
            <span className="ml-2 hidden sm:inline">{t("cart.cart")}</span>
          </Button>
        </DropdownMenuTrigger>

        {cart && CalculateTotalItems(cart) > 0 ? (
          <DropdownMenuContent className="w-[320px] right-0 relative">
            <DropdownMenuLabel className="text-right">
              {t("cart.total")}:
              <span className="text-[#f48120] font-bold ml-1">
                {convertVND(CalculateTotalPriceTemp(cart))}
              </span>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />

            <DropdownMenuGroup className="overflow-y-auto max-h-80 overflow-hidden">
              {allProducts.map(
                (product, index) =>
                  cart[product.id] > 0 && (
                    <div key={product._id}>
                      <DropdownMenuItem
                        className="cursor-pointer group"
                        onClick={() =>
                          navigate(
                            `/${slugify(product?.categoryId?.name, {
                              lower: false,
                            })}/${slugify(product?.name, {
                              lower: false,
                            })}`,
                            { state: { product } }
                          )
                        }
                      >
                        <div className="flex gap-2 my-2 w-full">
                          <img
                            src={product?.images[0] || "/placeholder.svg"}
                            alt="product"
                            className="h-10 w-10"
                            onClick={() =>
                              navigate(
                                `/${slugify(product?.categoryId?.name, {
                                  lower: false,
                                })}/${slugify(product?.name, {
                                  lower: false,
                                })}`,
                                { state: { product } }
                              )
                            }
                          />

                          <div className="flex flex-1 flex-col justify-center">
                            <span
                              className="line-clamp-1 text-base"
                              onClick={() =>
                                navigate(
                                  `/${slugify(product?.categoryId?.name, {
                                    lower: false,
                                  })}/${slugify(product?.name, {
                                    lower: false,
                                  })}`,
                                  { state: { product } }
                                )
                              }
                            >
                              {product?.name}
                            </span>
                            <div className="flex">
                              <span>{cart[product.id]} x</span>
                              <span className="ml-1 text-[#f48120]">
                                {convertVND(
                                  CalculateProductWithSale(
                                    product.batches[0].retailPrice,
                                    product.discountPercentage
                                  )
                                )}
                              </span>
                            </div>
                          </div>
                          <div
                            className="hidden group-hover:block group-hover:text-green-500 mr-2"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              handleRemoveProduct(product.id);
                            }}
                          >
                            <FaTrash />
                          </div>
                        </div>
                      </DropdownMenuItem>
                      {index < allProducts.length - 1 && <Separator />}
                    </div>
                  )
              )}
            </DropdownMenuGroup>
            <DropdownMenuSeparator />

            <DropdownMenuGroup className="flex justify-between mb-3">
              <DropdownMenuItem onClick={() => navigate("/cart")}>
                <Button className="bg-white text-[#f48120] border-[#f48120] border hover:bg-[#f48120] hover:text-white transition-all duration-300">
                  {t("cart.view_cart")}
                </Button>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate("/checkout")}>
                <Button className="bg-[#0e562e] hover:bg-[#227748]">
                  {t("cart.checkout")}
                </Button>
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        ) : (
          <DropdownMenuContent className="w-56 right-0 relative">
            <DropdownMenuGroup>
              <DropdownMenuItem className="text-center justify-center">
                <span>{t("cart.empty_cart")}</span>
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        )}
      </DropdownMenu>

      {/* User dropdown */}
      {userInfo ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div
              // variant="outline"
              className="bg-white rounded-full h-10 flex w-36 items-center gap-2 px-3 focus-visible:ring-0"
            >
              {userInfo?.avatar ? (
                <img
                  src={userInfo?.avatar}
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
                {userInfo.name
                  ? t("user.greeting", { name: userInfo.name })
                  : t("user.greeting_default")}
              </div>
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56 right-10 top-1 relative ">
            <DropdownMenuGroup className="space-y-2">
              <DropdownMenuItem
                className="flex items-center"
                onClick={() => navigate("/account/info")}
              >
                <FaRegUserCircle /> {t("user.personal_info")}
              </DropdownMenuItem>

              <Separator />

              <DropdownMenuItem
                className="flex items-center"
                onClick={() => navigate("/account/history")}
              >
                <LuNotepadText /> {t("user.order_history")}
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
                {t("user.coupons")}
              </DropdownMenuItem>

              <Separator />

              <DropdownMenuItem
                className="flex items-center"
                onClick={() => navigate("/account/addresses")}
              >
                <GrMapLocation />
                {t("user.address_book")}
              </DropdownMenuItem>
            </DropdownMenuGroup>

            <DropdownMenuSeparator />

            <DropdownMenuItem
              className="flex items-center"
              onClick={async () => {
                localStorage.removeItem("token");
                setUserInfo(null);
                await apiClient.post(LOGOUT_ROUTE, {
                  role: "client",
                });
                window.location.reload();
              }}
            >
              <IoIosLogOut />
              {t("user.logout")}
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
            {t("user.login")}
          </span>
        </div>
      )}
      {showLogin && <Login close={() => setShowLogin(false)} />}
    </div>
  );
};

export default NavSearch;
