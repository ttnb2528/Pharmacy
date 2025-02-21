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
import { UPDATE_SHIFT_WORK_ROUTE } from "@/API/index.api.js";
import { toast } from "sonner";
import Loading from "@/pages/component/Loading.jsx";
import AdminShiftWorkForm from "./AdminShiftWorkForm.jsx";

const EditShiftWorkDialog = ({ shift, isOpen, onClose, setShifts }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleUpdateBrand = async (data, shift) => {
    try {
      setIsLoading(true);
      const updatedShift = {
        ...shift,
        // eslint-disable-next-line no-unused-vars
        timeSlots: shift.timeSlots.map(({ _id, ...rest }) => rest),
      };

      const res = await apiClient.put(
        `${UPDATE_SHIFT_WORK_ROUTE}/${shift._id}`,
        updatedShift
      );

      if (res.status === 200 && res.data.status === 200) {
        toast.success(res.data.message);
        setShifts((prevShifts) =>
          prevShifts.map((item) =>
            item._id === shift._id ? { ...item, ...data } : item
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
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Sửa thông tin ca làm việc</DialogTitle>
          </DialogHeader>
          <DialogDescription></DialogDescription>
          <AdminShiftWorkForm
            shift={shift}
            onSubmit={(data) => handleUpdateBrand(data, shift)}
            mode="edit"
          />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default EditShiftWorkDialog;
