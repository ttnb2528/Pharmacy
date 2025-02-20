import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import AdminCategoryForm from "./AdminCategoryForm.jsx";
import { useState } from "react";
import { apiClient } from "@/lib/api-admin.js";
import { UPDATE_CATEGORY_ROUTE } from "@/API/index.api.js";
import { toast } from "sonner";
import Loading from "@/pages/component/Loading.jsx";

const EditCategoryDialog = ({ category, isOpen, onClose, setCategories }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleUpdateCategory = async (data, category) => {
    try {
      setIsLoading(true);
      const res = await apiClient.put(
        `${UPDATE_CATEGORY_ROUTE}/${category._id}`,
        data
      );

      if (res.status === 200 && res.data.status === 200) {
        // const updatedCategories = categories.map((c) =>
        //   c._id === selectedCategory._id ? selectedCategory : c
        // );
        setCategories((prevCategories) =>
          prevCategories.map((item) =>
            item._id === category._id ? { ...item, ...data } : item
          )
        );
        toast.success(res.data.message);
        // setIsEditDialogOpen(false);
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
            <DialogTitle>Sửa thông tin danh mục</DialogTitle>
          </DialogHeader>
          <DialogDescription></DialogDescription>
          <AdminCategoryForm
            category={category}
            onSubmit={(data) => handleUpdateCategory(data, category)}
            mode="edit"
          />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default EditCategoryDialog;
