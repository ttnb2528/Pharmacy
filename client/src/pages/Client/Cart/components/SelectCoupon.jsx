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
const SelectCoupon = ({
  isOpen,
  setIsOpen,
  selectedCoupon,
  handleApplyCoupon,
}) => {
  const { couponData } = useContext(PharmacyContext);

  console.log(couponData);

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button className="p-0 bg-transparent shadow-none text-green-500 hover:bg-transparent">
          {selectedCoupon ? "Đổi mã" : "Chọn Mã"}
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Mã Khuyến Mãi</SheetTitle>
          <SheetDescription>
            Chọn mã khuyến mãi để áp dụng cho đơn hàng của bạn.
          </SheetDescription>
        </SheetHeader>
        <div className="mt-4 space-y-4">
          {couponData?.map((coupon) => (
            <div key={coupon._id} className="rounded-lg border p-3">
              <h3 className="font-semibold">{coupon.coupon_code}</h3>
              <p className="text-sm text-gray-500">{coupon.description}</p>
              <Button
                className="mt-2 bg-green-500 hover:bg-green-600"
                size="sm"
                onClick={() => handleApplyCoupon(coupon)}
              >
                Áp dụng
              </Button>
            </div>
          ))}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default SelectCoupon;
