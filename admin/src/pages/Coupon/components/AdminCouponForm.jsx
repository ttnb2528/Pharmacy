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
// import { Textarea } from "@/components/ui/textarea";

const AdminCouponForm = ({ coupon, onSubmit, mode }) => {
  const [formData, setFormData] = useState({
    coupon_code: "",
    description: "",
    discount_type: "",
    discount_value: "",
    minimum_order_value: "",
    quantity: "",
    maximum_uses: "",
    start_date: "",
    end_date: "",
  });

  useEffect(() => {
    if (coupon) {
      setFormData({
        coupon_code: coupon.coupon_code || "",
        description: coupon.description || "",
        discount_type: coupon.discount_type || "",
        discount_value: coupon.discount_value || "",
        minimum_order_value: coupon.minimum_order_value || "",
        quantity: coupon.quantity || "",
        maximum_uses: coupon.maximum_uses || "",
        start_date: coupon.start_date || "",
        end_date: coupon.end_date || "",
      });
    }
  }, [coupon]);

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
        <Label htmlFor="coupon_code" className="text-right">
          Mã giảm giá
        </Label>
        <Input
          id="coupon_code"
          name="coupon_code"
          value={formData.coupon_code}
          onChange={handleChange}
          className="col-span-3"
        />
      </div>

      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="description" className="text-right">
          Mô tả
        </Label>
        <Input
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          className="col-span-3"
        />
      </div>

      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="discount_type" className="text-right">
          Loại giảm giá
        </Label>
        <Select
          value={formData.discount_type}
          onValueChange={(value) =>
            setFormData({ ...formData, discount_type: value })
          }
        >
          <SelectTrigger className="col-span-3">
            <SelectValue placeholder="Chọn loại giảm giá" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="percentage">Phần trăm</SelectItem>
            <SelectItem value="fixed_amount">Số tiền cố định</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="discount_value" className="text-right">
          Giá trị giảm
        </Label>
        <Input
          id="discount_value"
          name="discount_value"
          type="number"
          value={formData.discount_value}
          onChange={handleChange}
          className="col-span-3"
        />
      </div>

      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="minimum_order_value" className="text-right">
          Giá trị đơn hàng tối thiểu
        </Label>
        <Input
          id="minimum_order_value"
          name="minimum_order_value"
          type="number"
          value={formData.minimum_order_value}
          onChange={handleChange}
          className="col-span-3"
        />
      </div>

      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="quantity" className="text-right">
          Số lượng
        </Label>
        <Input
          id="quantity"
          name="quantity"
          type="number"
          value={formData.quantity}
          onChange={handleChange}
          className="col-span-3"
        />
      </div>

      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="maximum_uses" className="text-right">
          Số lần sử dụng tối đa
        </Label>
        <Input
          id="maximum_uses"
          name="maximum_uses"
          type="number"
          value={formData.maximum_uses}
          onChange={handleChange}
          className="col-span-3"
        />
      </div>

      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="start_date" className="text-right">
          Ngày bắt đầu
        </Label>
        <Input
          id="start_date"
          name="start_date"
          type="date"
          value={formData.start_date}
          onChange={handleChange}
          className="col-span-3"
        />
      </div>

      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="end_date" className="text-right">
          Ngày kết thúc
        </Label>
        <Input
          id="end_date"
          name="end_date"
          type="date"
          value={formData.end_date}
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

export default AdminCouponForm;
