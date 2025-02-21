import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select.jsx";
import { format } from "date-fns";
// import { Textarea } from "@/components/ui/textarea";

const AdminStaffForm = ({ staff, onSubmit, mode }) => {
  const [formData, setFormData] = useState({
    name: "",
    gender: "",
    date: "",
    phone: "",
    address: "",
    username: "",
    password: "",
    // workDate: new Date().toISOString().split("T")[0],
    workDate: "",
    isAdmin: false,
  });

  useEffect(() => {
    if (staff) {
      setFormData({
        name: staff.name || "",
        gender: staff.gender || "",
        date: staff.date || "",
        phone: staff.phone || "",
        address: staff.address || "",
        username: staff.username || "",
        password: staff.password || "",
        workDate: staff.workDate || "",
        isAdmin: staff.isAdmin || false,
      });
    }
  }, [staff]);

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
          Họ tên
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
        <Label htmlFor="gender" className="text-right">
          Giới tính
        </Label>
        <Select
          name="gender"
          value={formData.gender}
          onValueChange={(value) =>
            setFormData((prev) => ({ ...prev, gender: value }))
          }
        >
          <SelectTrigger className="col-span-3">
            <SelectValue placeholder="Chọn giới tính" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Nam">Nam</SelectItem>
            <SelectItem value="Nữ">Nữ</SelectItem>
            <SelectItem value="Khác">Khác</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="date" className="text-right">
          Ngày sinh
        </Label>
        <Input
          id="date"
          name="date"
          type="date"
          value={formData.date ? format(formData.date, "yyyy-MM-dd") : ""}
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
        <Label htmlFor="username" className="text-right">
          Tên đăng nhập
        </Label>
        <Input
          id="username"
          name="username"
          value={formData.username}
          onChange={handleChange}
          className="col-span-3"
        />
      </div>
      {!isEditMode && (
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="password" className="text-right">
            Mật khẩu
          </Label>
          <Input
            id="password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            className="col-span-3"
          />
        </div>
      )}
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="workDate" className="text-right">
          Ngày vào làm
        </Label>
        <Input
          id="workDate"
          name="workDate"
          type="date"
          value={
            formData.workDate ? format(formData.workDate, "yyyy-MM-dd") : ""
          }
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

export default AdminStaffForm;
