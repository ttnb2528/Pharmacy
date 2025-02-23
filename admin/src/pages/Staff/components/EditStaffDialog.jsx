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
import { UPDATE_STAFF_ROUTE } from "@/API/index.api.js";
import { toast } from "sonner";
import Loading from "@/pages/component/Loading.jsx";
import AdminStaffForm from "./AdminStaffForm.jsx";

const EditStaffDialog = ({ staff, isOpen, onClose, setStaffs }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleEditStaff = async (data, supplier) => {
    try {
      setIsLoading(true);
      const res = await apiClient.put(
        `${UPDATE_STAFF_ROUTE}/${supplier._id}`,
        data
      );

      if (res.status === 200 && res.data.status === 200) {
        toast.success(res.data.message);
        setStaffs((prevStaff) =>
          prevStaff.map((item) =>
            item._id === staff._id ? { ...item, ...data } : item
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
            <DialogTitle>Sửa thông tin nhân viên</DialogTitle>
          </DialogHeader>
          <DialogDescription></DialogDescription>
          <AdminStaffForm
            staff={staff}
            onSubmit={(data) => handleEditStaff(data, staff)}
            mode="edit"
          />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default EditStaffDialog;
