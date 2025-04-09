import {
  AlertDialog,
//   AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button.jsx";

const MobileAddressDeleteConfirm = ({ isOpen, onClose, onConfirm }) => {
  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Xóa địa chỉ</AlertDialogTitle>
          <AlertDialogDescription>
            Bạn có chắc chắn muốn xóa địa chỉ này? Hành động này không thể hoàn
            tác.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Hủy</AlertDialogCancel>
          <Button
            className="border-green-400 shadow-none text-white hover:bg-green-600 bg-green-500 border"
            onClick={onConfirm}
          >
            Đồng ý
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default MobileAddressDeleteConfirm;
