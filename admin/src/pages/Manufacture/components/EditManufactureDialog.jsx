import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import AdminCategoryForm from "./AdminManufactureForm.jsx";
import { useState } from "react";
import { apiClient } from "@/lib/api-admin.js";
import { UPDATE_MANUFACTURE_ROUTE } from "@/API/index.api.js";
import { toast } from "sonner";
import Loading from "@/pages/component/Loading.jsx";

const EditManufactureDialog = ({
  manufacture,
  isOpen,
  onClose,
  setManufactures,
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleEditManufacture = async (data, manufacture) => {
    try {
      setIsLoading(true);
      const res = await apiClient.put(
        `${UPDATE_MANUFACTURE_ROUTE}/${manufacture._id}`,
        data
      );

      if (res.status === 200 && res.data.status === 200) {
        setManufactures((prevManufactures) =>
          prevManufactures.map((item) =>
            item._id === manufacture._id ? { ...item, ...data } : item
          )
        );
        toast.success(res.data.message);
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
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Sửa thông tin nhà sản xuất</DialogTitle>
          </DialogHeader>
          <DialogDescription></DialogDescription>
          <AdminCategoryForm
            manufacture={manufacture}
            onSubmit={(data) => handleEditManufacture(data, manufacture)}
            mode="edit"
          />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default EditManufactureDialog;
