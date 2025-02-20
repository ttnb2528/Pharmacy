import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import AdminBrandForm from "./AdminBrandForm.jsx";
import { useState } from "react";
import { apiClient } from "@/lib/api-admin.js";
import { UPDATE_BRAND_ROUTE } from "@/API/index.api.js";
import { toast } from "sonner";
import Loading from "@/pages/component/Loading.jsx";
const EditBranDialog = ({ brand, isOpen, onClose, setBrands }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleUpdateBrand = async (data, brand) => {
    try {
      setIsLoading(true);
      const res = await apiClient.put(
        `${UPDATE_BRAND_ROUTE}/${brand._id}`,
        data
      );

      if (res.status === 200 && res.data.status === 200) {
        toast.success(res.data.message);
        setBrands((prevBrands) =>
          prevBrands.map((item) =>
            item._id === brand._id ? { ...item, ...data } : item
          )
        );
        // setIsEditing(false);
        onClose();
      } else {
        toast.error(res.data.message);
        // setIsEditing(false);
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
            <DialogTitle>Sửa thông tin thương hiệu</DialogTitle>
          </DialogHeader>
          <DialogDescription></DialogDescription>
          <AdminBrandForm
            brand={brand}
            onSubmit={(data) => handleUpdateBrand(data, brand)}
            mode="edit"
          />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default EditBranDialog;
