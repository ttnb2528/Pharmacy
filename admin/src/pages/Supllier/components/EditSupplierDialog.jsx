import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";
import { apiClient } from "@/lib/api-admin.js";
import { UPDATE_SUPPLIER_ROUTE } from "@/API/index.api.js";
import { toast } from "sonner";
import Loading from "@/pages/component/Loading.jsx";
import AdminSupplierForm from "./AdminSupplierForm.jsx";
const EditSupplierDialog = ({ supplier, isOpen, onClose, setSuppliers }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleEditSupplier = async (data, supplier) => {
    try {
      setIsLoading(true);
      const res = await apiClient.put(
        `${UPDATE_SUPPLIER_ROUTE}/${supplier._id}`,
        data
      );

      if (res.status === 200 && res.data.status === 200) {
        toast.success(res.data.message);
        setSuppliers((prevSupplier) =>
          prevSupplier.map((item) =>
            item._id === supplier._id ? { ...item, ...data } : item
          )
        );
        onClose();
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {isLoading && <Loading />}
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogTrigger asChild></DialogTrigger>
        <DialogContent
          className="max-w-2xl"
          onPointerDownOutside={(e) => {
            e.preventDefault();
          }}
        >
          <DialogHeader>
            <DialogTitle>Sửa thông tin nhà cung cấp</DialogTitle>
          </DialogHeader>
          <DialogDescription></DialogDescription>
          <AdminSupplierForm
            supplier={supplier}
            onSubmit={(data) => handleEditSupplier(data, supplier)}
            mode="edit"
          />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default EditSupplierDialog;
