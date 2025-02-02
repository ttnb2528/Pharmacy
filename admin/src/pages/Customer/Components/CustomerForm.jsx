import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";

const CustomerForm = ({ customer, onSubmit, mode }) => {
  const [formData, setFormData] = useState({
    name: "",
    gender: "",
    date: "",
    email: "",
    phone: "",
    address: "",
  });

  useEffect(() => {
    if (customer) {
      setFormData({
        name: customer.name || "",
        gender: customer.gender || "",
        date: customer.date ? new Date(customer.date) : "",
        email: customer.accountId?.email || "",
        phone: customer.phone || "",
        address: customer.address || "",
      });
    }
  }, [customer]);

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
  const hasAccount = customer && customer.accountId;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="name">Tên</Label>
        <Input
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
        />
      </div>

      <div>
        <Label>Giới tính</Label>
        <RadioGroup
          name="gender"
          value={formData.gender}
          onValueChange={(value) =>
            setFormData((prev) => ({ ...prev, gender: value }))
          }
          className="flex space-x-4"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="Nam" id="male" />
            <Label htmlFor="male">Nam</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="Nữ" id="female" />
            <Label htmlFor="female">Nữ</Label>
          </div>
        </RadioGroup>
      </div>

      <div>
        <Label>Ngày sinh</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="w-full justify-start text-left font-normal"
            >
              {formData.date ? (
                format(formData.date, "dd/MM/yyyy")
              ) : (
                <span>Chọn ngày sinh</span>
              )}
              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={formData.date}
              onSelect={(date) => setFormData((prev) => ({ ...prev, date }))}
              disabled={(date) =>
                date > new Date() || date < new Date("1900-01-01")
              }
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>

      {(!isEditMode || !hasAccount) && (
        <>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required={!isEditMode}
              disabled={isEditMode && hasAccount}
            />
          </div>

          <div>
            <Label htmlFor="phone">Số điện thoại</Label>
            <Input
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
            />
          </div>
        </>
      )}

      <div>
        <Label htmlFor="address">Địa chỉ</Label>
        <Textarea
          id="address"
          name="address"
          value={formData.address}
          onChange={handleChange}
          rows={3}
        />
      </div>

      <Button type="submit" className="w-full">
        {isEditMode ? "Cập nhật" : "Thêm khách hàng"}
      </Button>
    </form>
  );
};

export default CustomerForm;
