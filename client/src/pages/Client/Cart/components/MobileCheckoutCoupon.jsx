import { useState } from "react";
import { Ticket, ChevronRight, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { CouponCard } from "./CouponCard";
import { useContext } from "react";
import { PharmacyContext } from "@/context/Pharmacy.context.jsx";

const MobileCheckoutCoupon = ({
  selectedCoupon,
  setSelectedCoupon,
  handleApplyCoupon,
  handleRemoveCoupon,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const { couponData } = useContext(PharmacyContext);

  return (
    <div className="bg-white p-4 rounded-md">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Ticket className="h-5 w-5 text-green-600" />
          <h2 className="font-semibold">Khuyến mãi</h2>
        </div>

        <Button
          variant="ghost"
          size="sm"
          className="text-green-600 p-0 h-auto flex items-center"
          onClick={() => setIsOpen(true)}
        >
          {selectedCoupon ? "Thay đổi" : "Chọn mã"}
          <ChevronRight className="h-4 w-4 ml-1" />
        </Button>
      </div>

      {selectedCoupon ? (
        <div className="flex items-center justify-between bg-green-50 p-2 rounded-md mt-2">
          <span className="text-sm text-green-700 font-medium">
            {selectedCoupon.coupon_code}
          </span>
          <Button
            size="sm"
            variant="ghost"
            className="p-1 h-auto"
            onClick={handleRemoveCoupon}
          >
            <X className="h-4 w-4 text-green-700" />
          </Button>
        </div>
      ) : (
        <p className="text-sm text-gray-500 mt-1">
          Chọn mã khuyến mãi để được giảm giá
        </p>
      )}

      <Sheet open={isOpen} onOpenChange={setIsOpen}>
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
  );
};

export default MobileCheckoutCoupon;
