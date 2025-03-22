import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog.jsx";
import EditSliderForm from "./EditSliderForm.jsx";

const EditSliderDialog = ({ slider, isOpen, onClose }) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="max-w-4xl"
        onPointerDownOutside={(e) => {
          e.preventDefault();
        }}
      >
        <DialogHeader>
          <DialogTitle>Sửa thông tin Slider ảnh</DialogTitle>
        </DialogHeader>
        <DialogDescription></DialogDescription>
        {slider && <EditSliderForm slider={slider} handleCancel={onClose} />}
      </DialogContent>
    </Dialog>
  );
};

export default EditSliderDialog;
