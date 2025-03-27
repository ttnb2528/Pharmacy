import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const ConfirmForm = ({ open, onClose, handleConfirm, type, info }) => {
  const getConfirmationText = () => {
    switch (type) {
      case "product":
        return `Bạn có chắc chắn muốn xóa sản phẩm <span class="font-semibold text-green-500">${
          info?.name || "này"
        }</span> không?`;
      case "address":
        return "Bạn có chắc chắn muốn xóa địa chỉ này không?";
      case "order":
        return "Bạn có chắc chắn muốn hủy đơn hàng này không?";
      case "customer":
        return `Bạn có chắc chắn muốn xóa khách hàng <span class="font-semibold text-green-500">${info.name}</span> không?`;
      case "category":
        return `Bạn có chắc chắn muốn xóa danh mục <span class="font-semibold text-green-500">${
          info?.name || "này"
        }</span> không?`;
      case "brand":
        return `Bạn có chắc chắn muốn xóa thương hiệu <span class="font-semibold text-green-500">${
          info?.name || "này"
        }</span> không?`;
      case "manufacture":
        return `Bạn có chắc chắn muốn xóa nhà sản xuất <span class="font-semibold text-green-500">${
          info?.name || "này"
        }</span> không?`;
      case "supplier":
        return `Bạn có chắc chắn muốn xóa nhà cung cấp <span class="font-semibold text-green-500">${
          info?.name || "này"
        }</span> không?`;
      case "coupon":
        return `Bạn có chắc chắn muốn xóa mã giảm giá <span class="font-semibold text-green-500">${
          info?.coupon_code || "này"
        }</span> không?`;
      case "staff":
        return `Bạn có chắc chắn muốn xóa nhân viên <span class="font-semibold text-green-500">${
          info?.name || "này"
        }</span> không?`;
      case "shift":
        return `Bạn có chắc chắn muốn xóa ca làm việc <span class="font-semibold text-green-500">${
          info?.name || "này"
        }</span> không?`;
      case "slider":
        return `Bạn có chắc chắn muốn xóa slider  này không?`;
      default:
        return "Bạn có chắc chắn muốn thực hiện hành động này không?"; // Default text
    }
  };

  const getTitleText = () => {
    switch (type) {
      case "product":
        return "Xóa sản phẩm";
      case "address":
        return "Xóa địa chỉ";
      case "order":
        return "Hủy đơn hàng";
      case "account":
        return "Xóa tài khoản";
      case "category":
        return "Xóa danh mục";
      case "brand":
        return "Xóa thương hiệu";
      case "manufacture":
        return "Xóa nhà sản xuất";
      case "supplier":
        return "Xóa nhà cung cấp";
      case "coupon":
        return "Xóa mã giảm giá";
      case "staff":
        return "Xóa nhân viên";
      case "shift":
        return "Xóa ca làm việc";
      case "slider":
        return "Xóa slider";
      default:
        return "Xác nhận hành động"; // Default title
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] p-0 rounded-lg">
        <div className="px-6 py-4">
          <DialogHeader className="pb-2">
            <DialogTitle className="text-2xl font-bold">
              {getTitleText()}
            </DialogTitle>
            <DialogDescription></DialogDescription>
          </DialogHeader>

          <div className="my-4">
            <p dangerouslySetInnerHTML={{ __html: getConfirmationText() }} />
          </div>

          <DialogFooter className="flex flex-col sm:flex-row gap-3 sm:gap-2 mt-6 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="w-full sm:w-auto order-2 sm:order-1"
            >
              Quay lại
            </Button>

            <Button
              className="w-full sm:w-auto border-green-400 shadow-none text-white hover:bg-green-600 bg-green-500 border order-1 sm:order-2"
              onClick={handleConfirm}
            >
              Đồng ý
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ConfirmForm;
