import { LuTicketPercent, LuX } from "react-icons/lu";
import { useContext, useState } from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator.jsx";
import { useNavigate } from "react-router-dom";
import SelectCoupon from "./SelectCoupon.jsx";
import { PharmacyContext } from "@/context/Pharmacy.context.jsx";
import { convertVND } from "@/utils/ConvertVND.js";
import { handleRenderPriceWithCoupon } from "@/utils/Calculate.js";
import { useModalNotification } from "@/pages/component/Notification.jsx";
import { useMediaQuery } from "@/hook/use-media-query.js";

const CartItemBoxBuy = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const { showNotification, ModalNotificationComponent } =
    useModalNotification();

  const isMobile = useMediaQuery("(max-width: 640px)");

  const {
    cart,
    allProducts,
    selectedCoupon,
    setSelectedCoupon,
    CalculateTotalItems,
    CalculateTotalPriceTemp,
    CalculatePriceWithSale,
    CalculateTotalPrice,
  } = useContext(PharmacyContext);

  const handleApplyCoupon = (coupon) => {
    if (coupon.minimum_order_value > CalculateTotalPrice()) {
      showNotification({
        title: "Không thể áp dụng mã giảm giá",
        message: "Đơn hàng của bạn chưa đạt điều kiện áp dụng mã giảm giá",
        type: "error",
      });
      return;
    }
    setSelectedCoupon(coupon);
    setIsOpen(false);
    // showNotification({
    //   title: "Áp dụng mã giảm giá thành công",
    //   message: `Mã giảm giá ${coupon.coupon_code} đã được áp dụng`,
    //   type: "success",
    // });
  };

  const handleRemoveCoupon = () => {
    setSelectedCoupon(null);
    // showNotification({
    //   title: "Đã xóa mã giảm giá",
    //   message: "Mã giảm giá đã được xóa khỏi đơn hàng",
    //   type: "info",
    // });
  };

  return (
    <div
      className={`${
        isMobile ? "hidden" : ""
      } sticky top-[calc(var(--header-position-start-sticky)+12px)] hidden gap-4 md:grid`}
      style={{ "--header-position-start-sticky": "0px" }}
    >
      {/* Existing JSX code */}
      <div>
        <div className="flex flex-col space-y-3 rounded-sm bg-white px-4 md:p-3">
          <div className="grid w-full grid-flow-col items-center justify-between">
            <div className="grid grid-cols-[24px_1fr] items-center justify-start gap-1">
              <LuTicketPercent className="w-6 h-6 text-green-500" />
              <p className="text-sm font-semibold">Khuyến mãi</p>
            </div>

            <SelectCoupon
              isOpen={isOpen}
              setIsOpen={setIsOpen}
              selectedCoupon={selectedCoupon}
              handleApplyCoupon={handleApplyCoupon}
            />
          </div>
          {selectedCoupon && (
            <div className="flex items-center justify-between bg-green-100 p-2 rounded-md">
              <span className="text-sm text-green-700">
                {selectedCoupon?.coupon_code}
              </span>
              <Button
                size="sm"
                variant="ghost"
                className="p-1 h-auto"
                onClick={handleRemoveCoupon}
              >
                <LuX className="w-4 h-4 text-green-700" />
              </Button>
            </div>
          )}
        </div>
      </div>
      <div>
        <div className="grid grid-flow-col items-center gap-2 rounded-sm bg-white md:grid-flow-row md:items-start md:gap-4 md:p-4">
          <div className="grid gap-4">
            <div className="hidden grid-flow-col items-center justify-between gap-2 md:grid">
              <p className="text-sm text-neutral-900">Tạm tính</p>
              <p className="text-sm font-semibold text-neutral-900">
                {convertVND(CalculateTotalPriceTemp(cart))}
              </p>
            </div>
            <div className="hidden grid-flow-col  items-center justify-between gap-2 md:grid">
              <p className="text-sm text-neutral-900">Giảm giá ưu đãi</p>
              <p className="text-sm font-semibold text-neutral-900">
                {selectedCoupon
                  ? handleRenderPriceWithCoupon(selectedCoupon)
                  : "-"}
              </p>
            </div>
            <div className="hidden grid-flow-col  items-center justify-between gap-2 md:grid">
              <p className="text-sm text-neutral-900">Giảm giá sản phẩm</p>
              <p className="text-sm font-semibold text-neutral-900">
                - {convertVND(CalculatePriceWithSale(cart))}
              </p>
            </div>
            <Separator />
            <div className="grid items-center justify-items-end gap-0.5 md:grid-flow-col md:justify-between md:gap-2">
              <p className="text-sm text-neutral-900 md:text-base md:font-semibold">
                Tổng tiền
              </p>
              <p className="text-xl font-bold leading-8 text-red-500 no-underline md:text-2xl">
                {convertVND(CalculateTotalPrice())}
              </p>
            </div>
          </div>
          <Button
            className="bg-green-500 hover:bg-green-600 text-lg font-bold disabled:bg-neutral-500"
            onClick={() => navigate("/checkout")}
            disabled={allProducts?.some((p) => cart[p.id] > 20)}
          >
            Mua hàng
            <span className="ms-1 md:inline inline">
              ({CalculateTotalItems(cart)})
            </span>
          </Button>
        </div>
      </div>
      {ModalNotificationComponent}
    </div>
  );
};

export default CartItemBoxBuy;
