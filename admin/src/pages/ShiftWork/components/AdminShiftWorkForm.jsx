import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Trash2 } from "lucide-react";

const AdminShiftWorkForm = ({ shift, onSubmit, mode }) => {
  const [formData, setFormData] = useState({
    name: "",
    timeSlots: [{ startTime: "", endTime: "" }],
    overtimeThreshold: 4,
    overtimeRate: 2,
    capacity: 2,
  });

  useEffect(() => {
    if (shift) {
      setFormData({
        name: shift.name || "",
        timeSlots: shift.timeSlots || [{ startTime: "", endTime: "" }],
        overtimeThreshold: shift.overtimeThreshold || 4,
        overtimeRate: shift.overtimeRate || 2,
        capacity: shift.capacity || 2,
      });
    }
  }, [shift]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Add time slot
  const handleAddTimeSlot = () => {
    setFormData({
      ...formData,
      timeSlots: [...formData.timeSlots, { startTime: "", endTime: "" }],
    });
  };

  // Remove time slot
  const handleRemoveTimeSlot = (index) => {
    setFormData({
      ...formData,
      timeSlots: formData.timeSlots.filter((_, i) => i !== index),
    });
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
          Tên ca
        </Label>
        <Input
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className="col-span-3"
        />
      </div>
      {formData.timeSlots.map((slot, index) => (
        <div key={index} className="grid grid-cols-4 items-center gap-4">
          <Label className="text-right">Thời gian</Label>
          <div className="col-span-3 flex items-center gap-2">
            <Input
              type="time"
              name="startTime"
              value={slot.startTime}
              onChange={(e) => {
                const updatedSlots = [...formData.timeSlots];
                updatedSlots[index].startTime = e.target.value;
                setFormData({ ...formData, timeSlots: updatedSlots });
              }}
            />
            <span>-</span>
            <Input
              type="time"
              name="endTime"
              value={slot.endTime}
              onChange={(e) => {
                const updatedSlots = [...formData.timeSlots];
                updatedSlots[index].endTime = e.target.value;
                setFormData({ ...formData, timeSlots: updatedSlots });
              }}
            />
            {index > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleRemoveTimeSlot(index)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      ))}
      <Button type="button" variant="outline" onClick={handleAddTimeSlot}>
        Thêm khung giờ
      </Button>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="overtimeThreshold" className="text-right">
          Ngưỡng làm thêm giờ
        </Label>
        <Input
          id="overtimeThreshold"
          type="number"
          name="overtimeThreshold"
          value={formData.overtimeThreshold}
          onChange={(e) =>
            setFormData({
              ...formData,
              overtimeThreshold: Number.parseInt(e.target.value),
            })
          }
          className="col-span-3"
        />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="overtimeRate" className="text-right">
          Hệ số làm thêm giờ
        </Label>
        <Input
          id="overtimeRate"
          name="overtimeRate"
          type="number"
          step="0.1"
          value={formData.overtimeRate}
          onChange={(e) =>
            setFormData({
              ...formData,
              overtimeRate: Number.parseFloat(e.target.value),
            })
          }
          className="col-span-3"
        />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="capacity" className="text-right">
          Sức chứa
        </Label>
        <Input
          id="capacity"
          name="capacity"
          type="number"
          value={formData.capacity}
          onChange={(e) =>
            setFormData({
              ...formData,
              capacity: Number.parseInt(e.target.value),
            })
          }
          className="col-span-3"
        />
      </div>

      <div className="flex justify-end">
        <Button type="submit">{isEditMode ? "Cập nhật" : "Thêm mới"}</Button>
      </div>
    </form>
  );
};

export default AdminShiftWorkForm;
