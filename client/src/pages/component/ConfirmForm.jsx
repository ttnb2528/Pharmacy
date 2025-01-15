import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const ConfirmForm = ({
  open,
  onClose,
  handleDeleteAddress,
  confirmDeleteId,
}) => {
  const handleConfirm = () => {
    handleDeleteAddress(confirmDeleteId);
  };
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] p-0">
        <DialogHeader className="px-4 py-2.5">
          <DialogTitle>Xóa địa chỉ</DialogTitle>
          <DialogDescription>
            Bạn có chắc chắn muốn xóa địa chỉ này không?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="px-4 py-2.5">
          <Button type="button" variant="outline">
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
