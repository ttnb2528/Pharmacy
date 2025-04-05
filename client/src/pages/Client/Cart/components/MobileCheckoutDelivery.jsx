import { Truck } from "lucide-react";
import { convertVND } from "@/utils/ConvertVND.js";

const MobileCheckoutDelivery = () => {
  return (
    <div className="bg-white p-4 rounded-md">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Truck className="h-5 w-5 text-green-600" />
          <h2 className="font-semibold">Đơn vị vận chuyển</h2>
        </div>
      </div>

      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <span className="font-medium">Viettel Post</span>
          <span className="text-xs bg-green-50 text-green-600 px-2 py-0.5 rounded">
            Giao hàng tiêu chuẩn
          </span>
        </div>

        <div className="text-right">
          <p className="text-sm text-gray-500 line-through">
            {convertVND(30000)}
          </p>
          <p className="font-medium text-green-600">Miễn phí</p>
        </div>
      </div>
    </div>
  );
};

export default MobileCheckoutDelivery;
