import { Button } from "@/components/ui/button.jsx";
import { Input } from "@/components/ui/input.jsx";
import { Label } from "@/components/ui/label.jsx";
import { Textarea } from "@/components/ui/textarea";
import { useEffect, useState } from "react";

const AdminManufactureForm = ({ manufacture, onSubmit, mode }) => {
  const [formData, setFormData] = useState({
    name: "",
    country: "",
  });

  useEffect(() => {
    if (manufacture) {
      setFormData({
        name: manufacture.name || "",
        country: manufacture.country || "",
      });
    }
  }, [manufacture]);

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
    <form onSubmit={handleSubmit} className="grid gap-4 py-4">
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
        <Label htmlFor="country" className="text-right">
          Nước sản xuất
        </Label>
        <Textarea
          id="country"
          name="country"
          value={formData.country}
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

export default AdminManufactureForm;
