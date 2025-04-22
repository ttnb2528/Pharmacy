import { ADD_TO_CART_ROUTE } from "@/API/index.api.js";
import { Button } from "@/components/ui/button.jsx";
import { Input } from "@/components/ui/input.jsx";
import { Separator } from "@/components/ui/separator.jsx";
import { HomeContext } from "@/context/HomeContext.context.jsx";
import { useNotification } from "@/context/NotificationContext.jsx";
import { PharmacyContext } from "@/context/Pharmacy.context.jsx";
import { apiClient } from "@/lib/api-client.js";
import Loading from "@/pages/component/Loading.jsx";
import { useAppStore } from "@/store/index.js";
import {
  CalculatePointEarned,
  CalculateProductWithSale,
} from "@/utils/Calculate.js";
import { convertVND } from "@/utils/ConvertVND.js";
import { useContext, useState } from "react";
import { FaMinus, FaPlus } from "react-icons/fa";


const ProductDetailInfo = ({ product }) => {
  const { userInfo } = useAppStore();
  const { setShowLogin } = useContext(HomeContext);
  const { setCart } = useContext(PharmacyContext);
  const [qty, setQty] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const { showNotification } = useNotification();

  const rank = userInfo?.accountId?.loyaltyProgramId?.rank;

  const handleDecrease = () => {
    if (qty > 1) {
      setQty(qty - 1);
    }
  };

  const handleIncrease = () => {
    setQty(qty + 1);
  };

  const handleQuantityChange = (value) => {
    // Chỉ cho phép nhập số
    if (value && !/^\d{0,2}$/.test(value)) return;

    setQty(value);
  };

  const AddToCart = async (productId, quantity) => {
    try {
      setIsLoading(true);
      if (quantity > 20) {
        showNotification(
          "error",
          "Lỗi",
          "Số lượng sản phẩm không được vượt quá 20"
        );
        setIsLoading(false);
        return;
      }
      const res = await apiClient.post(ADD_TO_CART_ROUTE, {
        productId: productId,
        quantity: Number(quantity),
      });

      if (res.status === 200 && res.data.status === 200) {
        setCart((prev) => {
          return {
            ...prev,
            [productId]: prev[productId] + Number(quantity),
          };
        });

        showNotification(
          "success",
          "Thêm vào giỏ hàng",
          `${product.name} đã được thêm vào giỏ hàng!`
        );
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div>
      {isLoading && <Loading />}
      <div className="flex flex-col">
        <div className="flex flex-col px-4 md:px-0">
          <div className="grid grid-cols-[1fr,calc(24rem/16)] gap-4 md:grid-cols-1 mb-2">
            <h1
              title="Sữa bột ít đường Calosure Gold (900g)"
              className="line-clamp-3 text-base font-semibold text-neutral-900 md:text-xl md:font-bold"
            >
              {product?.name}
            </h1>
          </div>

          <div className="flex items-center justify-between mb-3 md:mb-4">
            <div className="flex content-start items-center space-x-1 py-[calc(2rem/16)]">
              <p className="text-sm leading-5 text-neutral-600">
                {product?.id}
              </p>
              <span className="h-1 w-1 rounded-full bg-neutral-600"></span>
              <span className="text-sm leading-5">
                Thương hiệu: {product?.brandId?.name}
              </span>
            </div>
          </div>

          {product?.isDiscount && (
            <div className="flex flex-row items-center md:mb-1">
              <span className="rounded-sm py-[2px] text-xs font-medium bg-green-600 px-1 text-white">
                Giảm {product?.discountPercentage}%
              </span>
              {product?.batches[0]?.retailPrice ? (
                <del className="ml-1 text-sm font-semibold text-neutral-600 md:ml-2 md:text-xl">
                  {convertVND(product?.batches[0]?.retailPrice)}
                </del>
              ) : (
                <span className="ml-1 text-sm font-semibold text-neutral-600 md:ml-2 md:text-xl">
                  Đang cập nhật
                </span>
              )}
            </div>
          )}

          {product?.batches[0]?.retailPrice ? (
            <div className="text-xl font-bold md:mb-2 md:text-[28px]">
              {convertVND(
                CalculateProductWithSale(
                  product?.batches[0]?.retailPrice,
                  product?.discountPercentage
                )
              )}
            </div>
          ) : (
            <div className="text-xl text-gray-500 font-bold md:mb-2 md:text-[28px]">
              Đang cập nhật
            </div>
          )}

          <p className="text-[12px] leading-[20px] font-normal text-neutral-700 md:text-sm mb-1.5 md:mb-1">
            Giá đã bao gồm thuế. Phí vận chuyển và các chi phí khác (nếu có) sẽ
            được thể hiện khi đặt hàng.
          </p>

          <div className="flex items-center justify-start space-x-1 md:space-x-2 mb-3 md:mb-1">
            {product?.batches[0]?.retailPrice ? (
              <span className="text-xs font-semibold text-gold-500 md:text-sm">
                Tích lũy{" "}
                {CalculatePointEarned(
                  rank,
                  product?.batches[0]?.retailPrice,
                  product?.discountPercentage
                )}{" "}
                Xu
              </span>
            ) : (
              <span className="text-xs font-semibold text-gold-500 md:text-sm">
                Tích lũy 0 Xu
              </span>
            )}
            <div>
              <span className="inline-flex align-[-0.175em] justify-center max-h-full max-w-full h-3 w-3 items-center text-neutral-700 md:h-4 md:w-4">
                <svg
                  viewBox="0 0 25 25"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12.5 2.5C7 2.5 2.5 7 2.5 12.5C2.5 18 7 22.5 12.5 22.5C18 22.5 22.5 18 22.5 12.5C22.5 7 18 2.5 12.5 2.5ZM12.5 18.75C11.81 18.75 11.25 18.19 11.25 17.5C11.25 16.81 11.81 16.25 12.5 16.25C13.19 16.25 13.75 16.81 13.75 17.5C13.75 18.19 13.19 18.75 12.5 18.75ZM14.5288 12.615C13.9075 13.1488 13.75 13.3287 13.75 13.75C13.75 14.4412 13.19 15 12.5 15C11.81 15 11.25 14.4412 11.25 13.75C11.25 12.1325 12.2437 11.28 12.9025 10.7162C13.5237 10.185 13.6812 10.0037 13.6812 9.58375C13.6812 9.355 13.6813 8.75 12.5013 8.75C11.9563 8.78 11.375 9.03 10.9288 9.45125C10.4275 9.92375 9.635 9.9 9.16125 9.4C8.6875 8.8975 8.71 8.10625 9.2125 7.6325C10.09 6.80625 11.2337 6.315 12.4362 6.2525H12.44C14.705 6.2525 16.1812 7.59125 16.1812 9.585C16.1812 11.2013 15.1875 12.0538 14.53 12.6163L14.5288 12.615Z"
                    fill="currentColor"
                  ></path>
                </svg>
              </span>
            </div>
          </div>

          {/* <div className="flex content-center justify-between mb-3 md:mb-4">
            <div className="flex items-center justify-start space-x-1 ">
              <div className="flex items-center justify-start">
                <div className="h-6 w-6 ">
                  <span className="inline-flex align-[-0.125em] justify-center max-h-full max-w-full w-4 h-4 text-neutral-700">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="25"
                      height="24"
                      fill="none"
                      viewBox="0 0 25 24"
                    >
                      <path
                        fill="currentColor"
                        d="M17.22 2a6.2 6.2 0 0 0-4.72 2.16A6.2 6.2 0 0 0 7.78 2a6.26 6.26 0 0 0-4.55 10.58l8.55 8.9a1 1 0 0 0 1.44 0l8.55-8.9h.01A6.26 6.26 0 0 0 17.22 2Z"
                      ></path>
                    </svg>
                  </span>
                </div>
                <div className="flex items-center justify-start space-x-1 text-sm">
                  <p className="text-neutral-900">40.9k</p>
                </div>
              </div>
              <span className="h-[12px] w-[1px] bg-neutral-500"></span>
              <p className="text-sm text-neutral-900">Đã bán 6.6k</p>
            </div>
          </div> */}

          <div className="flex flex-col space-y-4 mb-5">
            <div className="flex gap-10 items-center">
              <label className="font-medium text-lg">Sẵn có:</label>
              <span className="text-left text-green-400 font-semibold text-lg">
                {product?.quantityStock > 0 ? "Còn hàng" : "Hết hàng"}
              </span>
            </div>
            <div className="flex gap-10">
              <label className="font-medium text-lg">Số lượng:</label>
              <div className="w-36 flex">
                <Button
                  disabled={!(product?.quantityStock > 0)}
                  className="rounded-l-full rounded-r-none bg-green-500 hover:bg-green-600"
                  onClick={handleDecrease}
                >
                  <FaMinus style={{ width: "12px", height: "12px" }} />
                </Button>
                <Input
                  disabled={!(product?.quantityStock > 0)}
                  className="rounded-l-none rounded-r-none focus-visible:ring-0 text-center"
                  value={qty}
                  min={1}
                  onChange={(e) => handleQuantityChange(e.target.value)}
                />
                <Button
                  disabled={!(product?.quantityStock > 0)}
                  className="rounded-l-none rounded-r-full bg-green-500 hover:bg-green-600"
                  onClick={handleIncrease}
                >
                  <FaPlus style={{ width: "12px", height: "12px" }} />
                </Button>
              </div>
            </div>
          </div>
          <div className="mb-5">
            <Button
              className="w-full bg-green-500 hover:bg-green-600 disabled:text-neutral-200 disabled:bg-neutral-500"
              onClick={() => {
                if (qty > 0) {
                  userInfo ? AddToCart(product?.id, qty) : setShowLogin(true);
                } else {
                  showNotification(
                    "warning",
                    "Lỗi",
                    "Số lượng phải lớn hơn không"
                  );
                }
              }}
              disabled={!(product?.quantityStock > 0)}
            >
              <span className="text-sm font-semibold text-white ">
                {product?.quantityStock > 0
                  ? "Thêm vào giỏ hàng"
                  : "Tạm hết hàng"}
              </span>
            </Button>
          </div>

          <Separator />

          <div className="my-3 md:mb-4">
            <div className="space-y-3">
              <span className="w-fit text-sm font-semibold text-neutral-900">
                Phân loại sản phẩm
              </span>
              <div className="flex flex-wrap gap-2">
                <Button className="relative flex justify-center outline-none font-semibold bg-white border border-solid disabled:border-neutral-200 disabled:text-neutral-600 disabled:!bg-white text-sm px-4 py-2 items-center rounded-lg h-8 min-w-[82px] md:h-8 text-neutral-900 hover:text-white hover:bg-green-600 md:hover:border-green-600 md:hover:text-neutral-200">
                  <span>{product?.unit}</span>
                </Button>
              </div>
            </div>
          </div>

          <div className="-mx-4 mb-4 grid gap-4 md:mx-0">
            <div className="grid gap-2">
              <div className="grid grid-flow-col justify-between pb-2 pe-4 md:pe-0">
                <h4 className="text-base leading-[24px] relative whitespace-nowrap bg-green-500 px-4 font-semibold text-white">
                  Khuyến mãi
                  <span className="absolute right-0 top-0 block h-0 w-0 border-b-[12px] border-r-[8px] border-t-[12px] border-white border-b-transparent border-t-transparent"></span>
                </h4>
              </div>
              <div className="grid gap-2 px-4 md:px-0">
                <div className="grid grid-flow-col items-start justify-start gap-1.5">
                  <div className="relative h-6 w-6 shrink-0">
                    <img
                      className="object-cover"
                      src="https://prod-cdn.pharmacity.io/e-com/images/ecommerce/20240222060820-0-Group.png"
                      alt="Icon of Deal Giảm 10%"
                      loading="lazy"
                      width="500"
                      height="500"
                      sizes="(max-width: 768px) 3rem, 3rem"
                    />
                  </div>
                  <p className="text-[12px] leading-[20px] first-letter:uppercase md:text-sm">
                    <span className="inline pe-1 font-semibold">
                      Deal Giảm {product?.discountPercentage}%
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          <div className="gap-3 md:gap-4 mb-3 grid md:mb-4">
            <div className="grid gap-3 md:gap-2">
              <div className="grid grid-cols-1 gap-1.5 md:grid-cols-[1fr,291px]">
                <p className="text-[14px] leading-[20px] font-semibold md:text-base">
                  Danh mục
                </p>
                <div className="md:text-base">{product?.categoryId?.name}</div>
              </div>
              <div className="grid grid-cols-1 gap-1.5 md:grid-cols-[1fr,291px]">
                <p className="text-[14px] leading-[20px] font-semibold md:text-base">
                  Công dụng
                </p>
                <div className="md:text-base">{product?.uses}</div>
              </div>
              <div className="grid grid-cols-1 gap-1.5 md:grid-cols-[1fr,291px]">
                <p className="text-[14px] leading-[20px] font-semibold md:text-base">
                  Nhà sản xuất
                </p>
                <div className="md:text-base">
                  {product?.batches[0]?.ManufactureId?.name ??
                    "(Đang cập nhật)"}
                </div>
              </div>
              <div className="grid grid-cols-1 gap-1.5 md:grid-cols-[1fr,291px]">
                <p className="text-[14px] leading-[20px] font-semibold md:text-base">
                  Quy cách
                </p>
                <div className="md:text-base">{product?.packaging}</div>
              </div>
              <div className="grid grid-cols-1 gap-1.5 md:grid-cols-[1fr,291px]">
                <p className="text-[14px] leading-[20px] font-semibold md:text-base">
                  Lưu ý
                </p>
                <div className="md:text-base">
                  Mọi thông tin trên đây chỉ mang tính chất tham khảo. Đọc kỹ
                  hướng dẫn sử dụng trước khi dùng
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailInfo;
