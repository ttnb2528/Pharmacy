import { convertVND } from "@/utils/ConvertVND.js";
import { handleRenderPriceWithCoupon } from "@/utils/Calculate.js";
import { Separator } from "@/components/ui/separator";
import { Receipt } from "lucide-react";

const MobileCheckoutSummary = ({
  CalculateTotalItems,
  CalculateTotalPriceTemp,
  CalculatePriceWithSale,
  CalculateTotalPrice,
  cart,
  selectedCoupon,
  coinUsed,
}) => {
  return (
    <div className="bg-white p-4 rounded-md">
      <div className="flex items-center gap-2 mb-3">
        <Receipt className="h-5 w-5 text-green-600" />
        <h2 className="font-semibold">Chi tiết thanh toán</h2>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">
            Tạm tính ({CalculateTotalItems(cart)} sản phẩm)
          </span>
          <span className="text-sm">
            {convertVND(CalculateTotalPriceTemp(cart))}
          </span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Phí vận chuyển</span>
          <span className="text-sm">{convertVND(30000)}</span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Giảm giá vận chuyển</span>
          <span className="text-sm">- {convertVND(30000)}</span>
        </div>

        {selectedCoupon && (
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Giảm giá ưu đãi</span>
            <span className="text-sm">
              {handleRenderPriceWithCoupon(selectedCoupon)}
            </span>
          </div>
        )}

        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Giảm giá sản phẩm</span>
          <span className="text-sm">
            - {convertVND(CalculatePriceWithSale(cart))}
          </span>
        </div>

        {coinUsed > 0 && (
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Xu sử dụng</span>
            <span className="text-sm">- {convertVND(coinUsed)}</span>
          </div>
        )}

        <Separator className="my-1" />

        <div className="flex justify-between items-center">
          <span className="font-semibold">Tổng thanh toán</span>
          <span className="text-lg font-bold text-red-500">
            {convertVND(CalculateTotalPrice() - coinUsed)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default MobileCheckoutSummary;
