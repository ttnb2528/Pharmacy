import { useState, useEffect } from "react";
import { Check, X, Mail, Phone, MapPin, Calendar, User } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format } from "date-fns";

const CustomerForm1 = ({ customer, onSubmit, mode }) => {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    gender: "",
    date: "",
  });

  useEffect(() => {
    if (customer && mode === "edit") {
      setFormData({
        name: customer.name || "",
        phone: customer.phone || "",
        email: customer.accountId?.email || customer.email || "",
        address: customer.address || "",
        gender: customer.gender || "",
        date: customer.date ? new Date(customer.date) : "",
      });
    }
  }, [customer, mode]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Card className="w-full max-h-[calc(100vh-120px)] h-fit overflow-y-auto mx-auto">
      <CardHeader className="flex flex-row items-center gap-4">
        {mode === "edit" && (
          <>
            <Avatar className="w-20 h-20">
              <AvatarImage
                src={customer?.avatar}
                alt={customer?.name}
                className="bg-cover"
              />
              <AvatarFallback>
                {customer?.name?.charAt(0) ?? "K"}
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-2xl">
                {customer?.name ?? "..."}
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Mã KH: {customer?.id ?? "..."}
              </p>
            </div>
          </>
        )}
        {mode === "add" && (
          <CardTitle className="text-2xl">Thêm khách hàng mới</CardTitle>
        )}
      </CardHeader>
      <CardContent className="grid gap-4">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-4">
            <InfoItem
              // mode={mode}
              icon={User}
              label="Họ và Tên"
              name="name"
              value={formData.name}
              onChange={handleChange}
            />
            <InfoItem
              // mode={mode}
              icon={Phone}
              label="Số điện thoại"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
            />
            <InfoItem
              // mode={mode}
              icon={Mail}
              label="Email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              disabled={mode === "edit" && customer?.accountId}
            />
            <InfoItem
              // mode={mode}
              icon={MapPin}
              label="Địa chỉ"
              name="address"
              value={formData.address}
              onChange={handleChange}
            />
            <div className="flex flex-col gap-2">
              <Label htmlFor="gender">Giới tính</Label>
              <Select
                name="gender"
                value={formData.gender}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, gender: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn giới tính" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Nam">Nam</SelectItem>
                  <SelectItem value="Nữ">Nữ</SelectItem>
                  <SelectItem value="Khác">Khác</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <InfoItem
              // mode={mode}
              icon={Calendar}
              label="Ngày sinh"
              name="date"
              type="date"
              value={formData.date ? format(formData.date, "yyyy-MM-dd") : ""}
              onChange={handleChange}
            />
          </div>
          {mode === "edit" && (
            <div className="flex items-center gap-2 mt-4">
              <span className="font-semibold">Tài khoản:</span>
              {customer?.accountId ? (
                <Badge variant="success" className="flex items-center gap-1">
                  <Check className="w-4 h-4" /> Đã kích hoạt
                </Badge>
              ) : (
                <Badge
                  variant="destructive"
                  className="flex items-center gap-1"
                >
                  <X className="w-4 h-4" /> Chưa kích hoạt
                </Badge>
              )}
            </div>
          )}
          <Button type="submit" className="w-full mt-4">
            {mode === "edit" ? "Cập nhật" : "Thêm khách hàng"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

const InfoItem = ({
  icon: Icon,
  label,
  name,
  value,
  onChange,
  // mode,
  type = "text",
  disabled = false,
}) => (
  <div className="flex flex-col gap-2">
    <Label htmlFor={name} className="flex items-center gap-2">
      <Icon className="w-4 h-4 text-muted-foreground" />
      {label}
    </Label>
    <Input
      type={type}
      id={name}
      name={name}
      value={value}
      onChange={onChange}
      disabled={disabled}
    />
  </div>
);

export default CustomerForm1;
