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
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] p-0">
        <DialogHeader className="px-4 py-2.5">
          {type === "product" ? (
            <DialogTitle className="text-2xl font-bold">
              Xóa sản phẩm
            </DialogTitle>
          ) : (
            <DialogTitle className="text-2xl font-bold">
              Xóa địa chỉ
            </DialogTitle>
          )}
          <DialogDescription></DialogDescription>
        </DialogHeader>
        {type === "product" ? (
          <p className="px-4">
            Bạn có chắc chắn muốn xóa sản phẩm{" "}
            <span className="font-semibold text-green-500">{info.name}</span>{" "}
            không?
          </p>
        ) : (
          <p className="px-4">Bạn có chắc chắn muốn xóa địa chỉ này không?</p>
        )}
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
