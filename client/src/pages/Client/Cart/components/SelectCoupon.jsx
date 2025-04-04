import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useContext } from "react";
import { PharmacyContext } from "@/context/Pharmacy.context.jsx";
import { CouponCard } from "./CouponCard";
import { useMediaQuery } from "@/hook/use-media-query.js";

const SelectCoupon = ({
  isOpen,
  setIsOpen,
  selectedCoupon,
  handleApplyCoupon,
}) => {
  const { couponData } = useContext(PharmacyContext);
  const isMobile = useMediaQuery("(max-width: 640px)");

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button className="p-0 bg-transparent shadow-none text-green-500 hover:bg-transparent">
          {selectedCoupon ? "Đổi mã" : "Chọn Mã"}
        </Button>
      </SheetTrigger>
      <SheetContent
        side={isMobile ? "bottom" : "right"}
        className={isMobile ? "h-[80vh]" : ""}
      >
        <SheetHeader>
          <SheetTitle>Mã Khuyến Mãi</SheetTitle>
          <SheetDescription>
            Chọn mã khuyến mãi để áp dụng cho đơn hàng của bạn.
          </SheetDescription>
        </SheetHeader>
        <div className="mt-4 space-y-4 overflow-auto max-h-[calc(100%-100px)]">
          {couponData && couponData.length > 0 ? (
            couponData.map((coupon) => (
              <CouponCard
                key={coupon._id}
                coupon={coupon}
                onSelect={handleApplyCoupon}
                isSelected={selectedCoupon && selectedCoupon._id === coupon._id}
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
  );
};

export default SelectCoupon;
