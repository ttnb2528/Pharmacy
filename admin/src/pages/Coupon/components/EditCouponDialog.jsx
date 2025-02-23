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
import { UPDATE_COUPON_ROUTE } from "@/API/index.api.js";
import { toast } from "sonner";
import Loading from "@/pages/component/Loading.jsx";
import AdminSupplierForm from "./AdminCouponForm.jsx";

const EditCouponDialog = ({ coupon, isOpen, onClose, setCoupons }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleEditCoupon = async (data, coupon) => {
    try {
      setIsLoading(true);
      const res = await apiClient.put(
        `${UPDATE_COUPON_ROUTE}/${coupon._id}`,
        data
      );

      if (res.status === 200 && res.data.status === 200) {
        toast.success(res.data.message);
        setCoupons((prevCoupon) =>
          prevCoupon.map((item) =>
            item._id === coupon._id ? { ...item, ...data } : item
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
            <DialogTitle>Sửa thông tin mã giảm giá</DialogTitle>
          </DialogHeader>
          <DialogDescription></DialogDescription>
          <AdminSupplierForm
            coupon={coupon}
            onSubmit={(data) => handleEditCoupon(data, coupon)}
            mode="edit"
          />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default EditCouponDialog;
