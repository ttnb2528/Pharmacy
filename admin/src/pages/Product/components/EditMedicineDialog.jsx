import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog.jsx";
import EditMedicineForm from "./EditMedicineForm.jsx";

const EditMedicineDialog = ({ medicine, isOpen, onClose }) => {
  console.log("edit");

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="max-w-4xl"
        onPointerDownOutside={(e) => {
          e.preventDefault();
        }}
      >
        <DialogHeader>
          <DialogTitle>Sửa thông tin thuốc</DialogTitle>
        </DialogHeader>
        <DialogDescription></DialogDescription>
        {medicine && (
          <EditMedicineForm medicine={medicine} handleCancel={onClose} />
        )}
      </DialogContent>
    </Dialog>
  );
};

export default EditMedicineDialog;
