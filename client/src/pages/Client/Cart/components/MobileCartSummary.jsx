import { LuTicketPercent, LuX } from "react-icons/lu";
import { useContext, useState } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import SelectCoupon from "./SelectCoupon.jsx";
import { PharmacyContext } from "@/context/Pharmacy.context.jsx";
import { convertVND } from "@/utils/ConvertVND.js";
import { useModalNotification } from "@/pages/component/Notification.jsx";

const MobileCartSummary = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const { showNotification, ModalNotificationComponent } =
    useModalNotification();

  const {
    cart,
    allProducts,
    selectedCoupon,
    setSelectedCoupon,
    CalculateTotalItems,
    // CalculateTotalPriceTemp,
    // CalculatePriceWithSale,
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
  };

  const handleRemoveCoupon = () => {
    setSelectedCoupon(null);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-3 md:hidden">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <LuTicketPercent className="w-5 h-5 text-green-500" />
          <p className="text-sm font-medium">Khuyến mãi</p>
        </div>

        <SelectCoupon
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          selectedCoupon={selectedCoupon}
          handleApplyCoupon={handleApplyCoupon}
        />
      </div>

      {selectedCoupon && (
        <div className="flex items-center justify-between bg-green-100 p-2 rounded-md mb-3">
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

      <div className="flex items-center justify-between mb-2">
        <div>
          <p className="text-sm text-gray-500">Tổng tiền</p>
          <p className="text-lg font-bold text-red-500">
            {convertVND(CalculateTotalPrice())}
          </p>
        </div>

        <Button
          className="bg-green-500 hover:bg-green-600 font-bold px-4"
          onClick={() => navigate("/checkout")}
          disabled={allProducts?.some((p) => cart[p.id] > 20)}
        >
          Mua hàng ({CalculateTotalItems(cart)})
        </Button>
      </div>

      {ModalNotificationComponent}
    </div>
  );
};

export default MobileCartSummary;
