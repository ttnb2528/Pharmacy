import { useState } from "react";
import { convertVND } from "@/utils/ConvertVND.js";
import { Button } from "@/components/ui/button";
import { LuTicketPercent, LuX } from "react-icons/lu";
import { PayPalButtons, PayPalScriptProvider } from "@paypal/react-paypal-js";
import { toast } from "sonner";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useContext } from "react";
import { PharmacyContext } from "@/context/Pharmacy.context.jsx";
import { CouponCard } from "./CouponCard";

const MobileCheckoutFooter = ({
  CalculateTotalPrice,
  selectedCoupon,
  setSelectedCoupon,
  coinUsed,
  paymentMethod,
  handleSubmit,
  handleVNPayPayment,
  createPayPalOrder,
  onApprovePayPalPayment,
  isProcessingPayment,
  paypalOptions,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const { couponData } = useContext(PharmacyContext);

  const handleApplyCoupon = (coupon) => {
    if (coupon.minimum_order_value > CalculateTotalPrice()) {
      toast.error("Đơn hàng của bạn chưa đạt điều kiện áp dụng mã giảm giá");
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

        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <Button
            variant="ghost"
            size="sm"
            className="p-0 text-green-500 hover:bg-transparent"
            onClick={() => setIsOpen(true)}
          >
            {selectedCoupon ? "Đổi mã" : "Chọn mã"}
          </Button>

          <SheetContent side="bottom" className="h-[80vh]">
            <SheetHeader>
              <SheetTitle>Mã Khuyến Mãi</SheetTitle>
            </SheetHeader>

            <div className="mt-4 space-y-4 overflow-auto max-h-[calc(100%-80px)]">
              {couponData && couponData.length > 0 ? (
                couponData.map((coupon) => (
                  <CouponCard
                    key={coupon._id}
                    coupon={coupon}
                    onSelect={handleApplyCoupon}
                    isSelected={
                      selectedCoupon && selectedCoupon._id === coupon._id
                    }
                  />
                ))
              ) : (
                <div className="text-center text-gray-500 font-semibold">
                  Tạm thời chưa có mã khuyến mãi
                </div>
              )}
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {selectedCoupon && (
        <div className="flex items-center justify-between bg-green-50 p-2 rounded-md mb-3">
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
            {convertVND(CalculateTotalPrice() - coinUsed)}
          </p>
        </div>

        {paymentMethod === "COD" ? (
          <Button
            className="bg-green-500 hover:bg-green-600 font-bold px-4"
            onClick={handleSubmit}
          >
            Đặt hàng
          </Button>
        ) : paymentMethod === "PAYPAL" ? (
          <div className="w-40">
            <PayPalScriptProvider options={paypalOptions}>
              <PayPalButtons
                style={{ layout: "horizontal", height: 35 }}
                createOrder={createPayPalOrder}
                onApprove={onApprovePayPalPayment}
                onError={(err) => {
                  toast.error("Có lỗi xảy ra với PayPal");
                  console.error(err);
                }}
                disabled={isProcessingPayment}
              />
            </PayPalScriptProvider>
          </div>
        ) : paymentMethod === "VNPAY" ? (
          <Button
            className="bg-blue-500 hover:bg-blue-600 font-bold px-4"
            onClick={handleVNPayPayment}
          >
            VNPay
          </Button>
        ) : null}
      </div>
    </div>
  );
};

export default MobileCheckoutFooter;
