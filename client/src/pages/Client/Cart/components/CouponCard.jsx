import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { convertVND } from "@/utils/ConvertVND.js";

export const CouponCard = ({ coupon, onSelect, isSelected }) => {
  const getDiscountText = () => {
    if (coupon.discount_type === "percentage") {
      return `${coupon.discount_value}%`;
    } else {
      return convertVND(coupon.discount_value);
    }
  };

  const getMinimumOrderText = () => {
    return `Đơn tối thiểu ${convertVND(coupon.minimum_order_value)}`;
  };

  return (
    <div
      className={`border rounded-lg p-3 relative ${
        isSelected ? "border-green-500 bg-green-50" : "border-gray-200"
      } ${!coupon.canUse ? "opacity-60" : ""}`}
    >
      <div className="flex justify-between items-start">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-bold text-green-600 bg-green-100 px-2 py-1 rounded text-sm">
              {coupon.coupon_code}
            </span>
            {isSelected && (
              <span className="bg-green-500 text-white p-1 rounded-full">
                <Check className="h-3 w-3" />
              </span>
            )}
          </div>
          <h3 className="font-medium mt-2">{getDiscountText()} giảm</h3>
          <p className="text-sm text-gray-500 mt-1">{getMinimumOrderText()}</p>
          <p className="text-xs text-gray-500 mt-2 line-clamp-2">
            {coupon.description}
          </p>
        </div>
      </div>

      <div className="mt-3">
        <Button
          className={`w-full ${
            isSelected
              ? "bg-green-100 text-green-700 hover:bg-green-200"
              : "bg-green-500 hover:bg-green-600 text-white"
          }`}
          size="sm"
          onClick={() => onSelect(coupon)}
          disabled={!coupon.canUse}
        >
          {isSelected
            ? "Đã chọn"
            : coupon.canUse
            ? "Áp dụng"
            : "Đã hết lượt sử dụng"}
        </Button>
      </div>

      {!coupon.canUse && (
        <div className="absolute inset-0 bg-gray-100 bg-opacity-30 flex items-center justify-center rounded-lg">
          <span className="bg-gray-800 text-white px-2 py-1 rounded text-sm font-medium">
            Đã hết lượt sử dụng
          </span>
        </div>
      )}
    </div>
  );
};
