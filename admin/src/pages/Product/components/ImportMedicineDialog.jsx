import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog.jsx";
import ImportMedicineForm from "./ImportMedicineForm.jsx";

const ImportMedicineDialog = ({ medicine, isOpen, onClose }) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="max-w-4xl"
        onPointerDownOutside={(e) => {
          e.preventDefault();
        }}
      >
        <DialogHeader>
          <DialogTitle>Nhập kho</DialogTitle>
        </DialogHeader>
        <DialogDescription></DialogDescription>
        {medicine && (
          <ImportMedicineForm medicine={medicine} handleCancel={onClose} />
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ImportMedicineDialog;
