import { ADD_TO_CART_ROUTE } from "@/API/index.api.js";
import { Button } from "@/components/ui/button.jsx";
import { PharmacyContext } from "@/context/Pharmacy.context.jsx";
import { apiClient } from "@/lib/api-client.js";
import { useAppStore } from "@/store/index.js";
import { CalculateProductWithSale } from "@/utils/Calculate.js";
import { convertVND } from "@/utils/ConvertVND.js";
import { useContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import slugify from "slugify";
import { toast } from "sonner";

const Item = ({
  product,
  setIsLoading,
  setViewedProducts,
  // hasLogin,
  setShowLogin,
}) => {
  // const { setSelectedProduct } = useContext(ProductContext);
  const { userInfo } = useAppStore();
  const navigate = useNavigate();
  const { setCart } = useContext(PharmacyContext);
  const [startPosition, setStartPosition] = useState({ x: 0, y: 0 });

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
    // Chỉ scroll to top khi đường dẫn thay đổi thực sự
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

      console.log(res);
      

      if (res.status === 200 && res.data.status === 200) {
        setCart((prev) => {
          return {
            ...prev,
            [productId]: prev[productId] + 1,
          };
        });
        toast.success(res.data.message);
      }

      console.log(res);
    } catch (error) {
      console.error(error);
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

    // Lọc bỏ sản phẩm cũ nếu đã tồn tại
    let updatedProducts = storedProducts.filter((p) => p.id !== product.id);

    // Thêm sản phẩm mới vào cuối danh sách
    updatedProducts = [...updatedProducts, product];

    // Nếu vượt quá 10 sản phẩm, loại bỏ sản phẩm đầu tiên
    if (updatedProducts.length > 10) {
      updatedProducts = updatedProducts.slice(1);
    }

    // Cập nhật localStorage và dispatch một custom event
    localStorage.setItem("viewedProducts", JSON.stringify(updatedProducts));
    window.dispatchEvent(new CustomEvent("viewedProductsUpdated"));

    // Cập nhật state nếu có
    setViewedProducts?.(updatedProducts);
  };

  return (
    <>
      <div className=" p-2" onMouseDown={handleMouseDown}>
        <div className="border border-green-500 rounded-lg hover:border hover:border-red-300 h-full flex flex-col">
          <div className="h-full overflow-hidden rounded-lg border bg-white shadow-sm flex flex-col">
            <div className="product-card-image flex-shrink-0">
              <div className="relative min-h-48">
                <div onClick={handleClick}>
                  <img
                    className="w-full h-full object-contain cursor-pointer max-h-48"
                    src={product?.images[0]}
                    alt="product"
                  />
                </div>
                {product.isDiscount && (
                  <span className="absolute top-2 left-2 bg-red-400 py-1 px-3 text-xs font-bold text-white rounded-xl">
                    {product.discountPercentage}%
                  </span>
                )}
              </div>
            </div>
            <div className="p-2 pb-1 font-medium flex-grow flex flex-col justify-between">
              <div>
                <h3 className="line-clamp-2 h-10 text-sm font-semibold">
                  {product?.name}
                </h3>
              </div>
              {product?.batches.length > 0 && product?.quantityStock > 0 ? (
                <div className="my-1 items-center whitespace-nowrap">
                  {product?.isDiscount ? (
                    <>
                      <del className="block h-5 text-sm font-semibold text-neutral-600">
                        {convertVND(product?.batches[0]?.price)}
                      </del>
                      <span className="mt-1 block h-6 text-base font-bold text-green-600">
                        {convertVND(
                          CalculateProductWithSale(
                            product?.batches[0]?.price,
                            product?.discountPercentage
                          )
                        )}
                      </span>
                    </>
                  ) : (
                    <>
                      <div className="h-5"></div>
                      <span className="mt-1 block h-6 text-base font-bold text-green-600">
                        {convertVND(product?.batches[0]?.price)}
                      </span>
                    </>
                  )}
                </div>
              ) : (
                <div className="my-1 items-center whitespace-nowrap">
                  <div className="h-5"></div>
                  <span className="mt-1 block h-6 text-base font-bold text-red-600">
                    Tạm hết hàng
                  </span>
                </div>
              )}
            </div>
            <div className="flex justify-center items-center my-3">
              {product?.batches.length > 0 && product?.quantityStock > 0 ? (
                <Button
                  className="w-5/6 bg-[#26773d] hover:bg-[#0e562e]"
                  onClick={() =>
                    userInfo ? AddToCart(product.id) : setShowLogin(true)
                  }
                >
                  Thêm giỏ hàng
                </Button>
              ) : (
                <Button
                  className="w-5/6 bg-[#26773d] hover:bg-[#0e562e]"
                  disabled
                >
                  Tạm hết hàng
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
