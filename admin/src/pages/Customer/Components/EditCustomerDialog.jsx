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
import { UPDATE_CUSTOMER_ROUTE } from "@/API/index.api.js";
import { toast } from "sonner";
import Loading from "@/pages/component/Loading.jsx";
import AdminCustomerForm from "./AdminCustomerForm.jsx";

const EditCustomerDialog = ({ customer, isOpen, onClose, setCustomers }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleEditCustomer = async (data, customer) => {
    try {
      setIsLoading(true);
      const res = await apiClient.put(
        `${UPDATE_CUSTOMER_ROUTE}/${customer._id}`,
        data
      );

      if (res.status === 200 && res.data.status === 200) {
        toast.success(res.data.message);
        setCustomers((prevCustomers) =>
          prevCustomers.map((item) =>
            item._id === customer._id ? { ...item, ...data } : item
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
            <DialogTitle>Sửa thông tin khách hàng</DialogTitle>
          </DialogHeader>
          <DialogDescription></DialogDescription>
          <AdminCustomerForm
            customer={customer}
            onSubmit={(data) => handleEditCustomer(data, customer)}
            mode="edit"
          />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default EditCustomerDialog;
