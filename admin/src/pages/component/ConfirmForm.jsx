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
      default:
        return "Xác nhận hành động"; // Default title
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] p-0">
        <DialogHeader className="px-4 py-2.5">
          <DialogTitle className="text-2xl font-bold">
            {getTitleText()}
          </DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <p
          className="px-4"
          dangerouslySetInnerHTML={{ __html: getConfirmationText() }}
        />{" "}
        {/* Use dangerouslySetInnerHTML for HTML in text */}
        <DialogFooter className="px-4 py-2.5">
          <Button type="button" variant="outline" onClick={onClose}>
            Quay lại
          </Button>

          <Button
            className="border-green-400 shadow-none text-white hover:bg-green-600 bg-green-500 border"
            onClick={handleConfirm}
          >
            Đồng ý
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ConfirmForm;
