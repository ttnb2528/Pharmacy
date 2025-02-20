import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
// import { Textarea } from "@/components/ui/textarea";

const AdminSupplierForm = ({ supplier, onSubmit, mode }) => {
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    phone: "",
  });

  useEffect(() => {
    if (supplier) {
      setFormData({
        name: supplier.name || "",
        address: supplier.address || "",
        phone: supplier.phone || "",
      });
    }
  }, [supplier]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const isEditMode = mode === "edit";

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="name" className="text-right">
          Tên
        </Label>
        <Input
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className="col-span-3"
        />
      </div>

      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="address" className="text-right">
          Địa chỉ
        </Label>
        <Input
          id="address"
          name="address"
          value={formData.address}
          onChange={handleChange}
          className="col-span-3"
        />
      </div>

      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="phone" className="text-right">
          Số điện thoại
        </Label>
        <Input
          id="phone"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          className="col-span-3"
        />
      </div>

      <div className="flex justify-end">
        <Button type="submit">{isEditMode ? "Cập nhật" : "Thêm mới"}</Button>
      </div>
    </form>
  );
};

export default AdminSupplierForm;
