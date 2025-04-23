import { ADD_TO_CART_ROUTE } from "@/API/index.api.js";
import { Button } from "@/components/ui/button.jsx";
import { PharmacyContext } from "@/context/Pharmacy.context.jsx";
import { apiClient } from "@/lib/api-client.js";
import { useAppStore } from "@/store/index.js";
import { CalculateProductWithSale } from "@/utils/Calculate.js";
import { convertVND } from "@/utils/ConvertVND.js";
import { useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";
import slugify from "slugify";
import { useNotification } from "@/context/NotificationContext.jsx";

const Item = ({ product, setIsLoading, setViewedProducts, setShowLogin }) => {
  const { t } = useTranslation();
  const { userInfo } = useAppStore();
  const navigate = useNavigate();
  const { setCart } = useContext(PharmacyContext);
  const [startPosition, setStartPosition] = useState({ x: 0, y: 0 });
  const { showNotification } = useNotification();

  const handleMouseDown = (e) => {
    setStartPosition({ x: e.clientX, y: e.clientY });
  };

  const handleClick = (e) => {
    const endPosition = { x: e.clientX, y: e.clientY };
    const distance = Math.sqrt(
      Math.pow(endPosition.x - startPosition.x, 2) +
        Math.pow(endPosition.y - startPosition.y, 2)
    );
    if (distance > 5) {
      e.preventDefault();
    } else {
      handleProductClick();
    }
  };

  const location = useLocation();
  const [prevPath, setPrevPath] = useState(location.pathname);

  useEffect(() => {
    if (location.pathname !== prevPath) {
      window.scrollTo(0, 0);
      setPrevPath(location.pathname);
    }
  }, [location, prevPath]);

  const categorySlug = slugify(
    product?.categoryId?.name || "unknown-category",
    {
      lower: true,
    }
  );

  const productSlug = slugify(product?.name || "unknown-name", { lower: true });
  const path = `/${categorySlug}/${productSlug}`;

  const AddToCart = async (productId) => {
    try {
      setIsLoading(true);

      const res = await apiClient.post(ADD_TO_CART_ROUTE, {
        productId: productId,
        quantity: 1,
      });

      if (res.status === 200 && res.data.status === 200) {
        setCart((prev) => {
          return {
            ...prev,
            [productId]: (prev[productId] || 0) + 1,
          };
        });

        showNotification(
          "success",
          "Thêm vào giỏ hàng",
          `${product.name} đã được thêm vào giỏ hàng!`
        );
      } else {
        showNotification(
          "error",
          "Lỗi",
          res.data.message || "Không thể thêm sản phẩm vào giỏ hàng"
        );
      }
    } catch (error) {
      console.error("Lỗi khi thêm vào giỏ hàng:", error);
      showNotification(
        "error",
        "Lỗi",
        "Đã xảy ra lỗi khi thêm sản phẩm vào giỏ hàng"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleProductClick = () => {
    navigate(path, {
      state: { product },
    });

    const storedProducts =
      JSON.parse(localStorage.getItem("viewedProducts")) || [];

    let updatedProducts = storedProducts.filter((p) => p.id !== product.id);

    updatedProducts = [...updatedProducts, product];

    if (updatedProducts.length > 10) {
      updatedProducts = updatedProducts.slice(1);
    }

    localStorage.setItem("viewedProducts", JSON.stringify(updatedProducts));
    window.dispatchEvent(new CustomEvent("viewedProductsUpdated"));

    setViewedProducts?.(updatedProducts);
  };

  return (
    <>
      <div className="p-2 w-full sm:w-auto" onMouseDown={handleMouseDown}>
        <div className="border border-green-500 rounded-lg hover:border hover:border-red-300 h-full flex flex-col">
          <div className="h-full overflow-hidden rounded-lg border bg-white shadow-sm flex flex-col">
            <div className="product-card-image flex-shrink-0">
              <div className="relative min-h-36 md:min-h-48">
                <div onClick={handleClick}>
                  <img
                    className="w-full h-full object-contain cursor-pointer max-h-36 md:max-h-48"
                    src={product?.images[0] || "/placeholder.svg"}
                    alt="product"
                  />
                </div>
                {product.isDiscount && (
                  <span className="absolute top-2 left-2 bg-red-400 py-1 px-2 md:px-3 text-xs font-bold text-white rounded-xl">
                    {product.discountPercentage}%
                  </span>
                )}
              </div>
            </div>
            <div className="p-2 pb-1 font-medium flex-grow flex flex-col justify-between">
              <div>
                <h3 className="line-clamp-2 h-8 md:h-10 text-xs md:text-sm font-semibold">
                  {product?.name}
                </h3>
              </div>
              {product?.batches.length > 0 && product?.quantityStock > 0 ? (
                <div className="my-1 items-center whitespace-nowrap">
                  {product?.isDiscount ? (
                    <>
                      <del className="block h-4 md:h-5 text-xs md:text-sm font-semibold text-neutral-600">
                        {convertVND(product?.batches[0]?.retailPrice)}
                      </del>
                      <span className="mt-1 block h-5 md:h-6 text-sm md:text-base font-bold text-green-600">
                        {convertVND(
                          CalculateProductWithSale(
                            product?.batches[0]?.retailPrice,
                            product?.discountPercentage
                          )
                        )}
                      </span>
                    </>
                  ) : (
                    <>
                      <div className="h-4 md:h-5"></div>
                      <span className="mt-1 block h-5 md:h-6 text-sm md:text-base font-bold text-green-600">
                        {convertVND(product?.batches[0]?.retailPrice)}
                      </span>
                    </>
                  )}
                </div>
              ) : (
                <div className="my-1 items-center whitespace-nowrap">
                  <div className="h-4 md:h-5"></div>
                  <span className="mt-1 block h-5 md:h-6 text-sm md:text-base font-bold text-red-600">
                    {t("Item.tempEmptyStock")}
                  </span>
                </div>
              )}
            </div>
            <div className="flex justify-center items-center my-2 md:my-3">
              {product?.isRx ? (
                <a
                  href="https://zalo.me/84866554764"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-5/6 text-center bg-[#0068ff] hover:bg-[#0054cc] text-white text-xs md:text-sm py-2 rounded-md font-medium"
                >
                  Tư vấn trực tuyến
                </a>
              ) : product?.batches.length > 0 && product?.quantityStock > 0 ? (
                <Button
                  className="w-5/6 bg-[#26773d] hover:bg-[#0e562e] text-xs md:text-sm py-1 md:py-2"
                  onClick={() =>
                    userInfo ? AddToCart(product.id) : setShowLogin(true)
                  }
                >
                  {t("Item.add_to_cart")}
                </Button>
              ) : (
                <Button
                  className="w-5/6 bg-[#26773d] hover:bg-[#0e562e] text-xs md:text-sm py-1 md:py-2"
                  disabled
                >
                  {t("Item.tempEmptyStock")}
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Item;
