import { useContext, useState } from "react";
import { Plus, Search, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { apiClient } from "@/lib/api-admin.js";
import {
  ADD_SHIFT_WORK_ROUTE,
  DELETE_SHIFT_WORK_ROUTE,
  UPDATE_SHIFT_WORK_ROUTE,
} from "@/API/index.api.js";
import { toast } from "sonner";
import { ShiftWorkContext } from "@/context/ShiftWorkContext.context.jsx";
import Loading from "../component/Loading.jsx";
import Header from "../component/Header.jsx";

const AdminShiftWork = () => {
  const { shiftWorks, setShiftWorks } = useContext(ShiftWorkContext);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedShift, setSelectedShift] = useState(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [newShift, setNewShift] = useState({
    name: "",
    timeSlots: [{ startTime: "", endTime: "" }],
    overtimeThreshold: 4,
    overtimeRate: 2,
    capacity: 2,
  });

  // Filter shifts based on search term
  const filteredShifts = shiftWorks.filter((shift) =>
    shift.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Add new shift
  const handleAddShift = async () => {
    try {
      setIsLoading(true);

      const res = await apiClient.post(ADD_SHIFT_WORK_ROUTE, newShift);
      if (res.status === 200 && res.data.status === 201) {
        setShiftWorks([...shiftWorks, res.data.data]);
        setIsAddDialogOpen(false);
        setNewShift({
          name: "",
          timeSlots: [{ startTime: "", endTime: "" }],
          overtimeThreshold: 4,
          overtimeRate: 2,
          capacity: 2,
        });
        toast.success(res.data.message);
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  // Edit shift
  const handleEditShift = async () => {
    try {
      setIsLoading(true);
      const updatedShift = {
        ...selectedShift,
        // eslint-disable-next-line no-unused-vars
        timeSlots: selectedShift.timeSlots.map(({ _id, ...rest }) => rest),
      };

      const res = await apiClient.put(
        `${UPDATE_SHIFT_WORK_ROUTE}/${selectedShift._id}`,
        updatedShift
      );

      if (res.status === 200 && res.data.status === 200) {
        setShiftWorks(
          shiftWorks.map((shift) =>
            shift._id === selectedShift._id ? selectedShift : shift
          )
        );
        setIsEditDialogOpen(false);
        toast.success(res.data.message);
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  // Delete shift
  const handleDeleteShift = async () => {
    try {
      setIsLoading(true);
      const res = await apiClient.delete(
        `${DELETE_SHIFT_WORK_ROUTE}/${selectedShift._id}`
      );

      if (res.status === 200 && res.data.status === 200) {
        setShiftWorks(
          shiftWorks.filter((shift) => shift._id !== selectedShift._id)
        );
        setIsDeleteDialogOpen(false);
        toast.success(res.data.message);
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  // Add time slot
  const handleAddTimeSlot = () => {
    setNewShift({
      ...newShift,
      timeSlots: [...newShift.timeSlots, { startTime: "", endTime: "" }],
    });
  };

  // Remove time slot
  const handleRemoveTimeSlot = (index) => {
    setNewShift({
      ...newShift,
      timeSlots: newShift.timeSlots.filter((_, i) => i !== index),
    });
  };

  return (
    <div>
      {isLoading && <Loading />}
      <Header title={"Danh sách ca làm việc"} />
      <div className="p-6">
        <div className="flex justify-between items-center mb-4">
          <div className="relative w-64">
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              type="text"
              placeholder="Tìm kiếm ca làm việc..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" /> Thêm ca làm việc
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg">
              <DialogHeader>
                <DialogTitle>Thêm ca làm việc mới</DialogTitle>
                <DialogDescription>
                  Nhập thông tin cho ca làm việc mới.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    Tên ca
                  </Label>
                  <Input
                    id="name"
                    value={newShift.name}
                    onChange={(e) =>
                      setNewShift({ ...newShift, name: e.target.value })
                    }
                    className="col-span-3"
                  />
                </div>
                {newShift.timeSlots.map((slot, index) => (
                  <div
                    key={index}
                    className="grid grid-cols-4 items-center gap-4"
                  >
                    <Label className="text-right">Thời gian</Label>
                    <div className="col-span-3 flex items-center gap-2">
                      <Input
                        type="time"
                        value={slot.startTime}
                        onChange={(e) => {
                          const updatedSlots = [...newShift.timeSlots];
                          updatedSlots[index].startTime = e.target.value;
                          setNewShift({ ...newShift, timeSlots: updatedSlots });
                        }}
                      />
                      <span>-</span>
                      <Input
                        type="time"
                        value={slot.endTime}
                        onChange={(e) => {
                          const updatedSlots = [...newShift.timeSlots];
                          updatedSlots[index].endTime = e.target.value;
                          setNewShift({ ...newShift, timeSlots: updatedSlots });
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
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleAddTimeSlot}
                >
                  Thêm khung giờ
                </Button>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="overtimeThreshold" className="text-right">
                    Ngưỡng làm thêm giờ
                  </Label>
                  <Input
                    id="overtimeThreshold"
                    type="number"
                    value={newShift.overtimeThreshold}
                    onChange={(e) =>
                      setNewShift({
                        ...newShift,
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
                    type="number"
                    step="0.1"
                    value={newShift.overtimeRate}
                    onChange={(e) =>
                      setNewShift({
                        ...newShift,
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
                    type="number"
                    value={newShift.capacity}
                    onChange={(e) =>
                      setNewShift({
                        ...newShift,
                        capacity: Number.parseInt(e.target.value),
                      })
                    }
                    className="col-span-3"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" onClick={handleAddShift}>
                  Thêm ca làm việc
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Tên ca</TableHead>
              <TableHead>Thời gian</TableHead>
              <TableHead>Ngưỡng làm thêm giờ</TableHead>
              <TableHead>Hệ số làm thêm giờ</TableHead>
              <TableHead>Sức chứa</TableHead>
              <TableHead>Hành động</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredShifts.map((shift) => (
              <TableRow key={shift.id}>
                <TableCell className="font-medium">{shift.name}</TableCell>
                <TableCell>
                  {shift.timeSlots.map((slot, index) => (
                    <Badge key={index} variant="secondary" className="mr-2">
                      {slot.startTime} - {slot.endTime}
                    </Badge>
                  ))}
                </TableCell>
                <TableCell>{shift.overtimeThreshold} giờ</TableCell>
                <TableCell>{shift.overtimeRate}x</TableCell>
                <TableCell>{shift.capacity} người</TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Dialog
                      open={isEditDialogOpen}
                      onOpenChange={setIsEditDialogOpen}
                    >
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedShift(shift);
                            setIsEditDialogOpen(true);
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                          <DialogTitle>Sửa thông tin ca làm việc</DialogTitle>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="edit-name" className="text-right">
                              Tên ca
                            </Label>
                            <Input
                              id="edit-name"
                              value={selectedShift?.name || ""}
                              onChange={(e) =>
                                setSelectedShift({
                                  ...selectedShift,
                                  name: e.target.value,
                                })
                              }
                              className="col-span-3"
                            />
                          </div>
                          {selectedShift?.timeSlots.map((slot, index) => (
                            <div
                              key={index}
                              className="grid grid-cols-4 items-center gap-4"
                            >
                              <Label className="text-right">
                                Thời gian {index + 1}
                              </Label>
                              <div className="col-span-3 flex items-center gap-2">
                                <Input
                                  type="time"
                                  value={slot.startTime}
                                  onChange={(e) => {
                                    const updatedSlots = [
                                      ...selectedShift.timeSlots,
                                    ];
                                    updatedSlots[index].startTime =
                                      e.target.value;
                                    setSelectedShift({
                                      ...selectedShift,
                                      timeSlots: updatedSlots,
                                    });
                                  }}
                                />
                                <span>-</span>
                                <Input
                                  type="time"
                                  value={slot.endTime}
                                  onChange={(e) => {
                                    const updatedSlots = [
                                      ...selectedShift.timeSlots,
                                    ];
                                    updatedSlots[index].endTime =
                                      e.target.value;
                                    setSelectedShift({
                                      ...selectedShift,
                                      timeSlots: updatedSlots,
                                    });
                                  }}
                                />
                                {index > 0 && (
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => {
                                      const updatedSlots =
                                        selectedShift.timeSlots.filter(
                                          (_, i) => i !== index
                                        );
                                      setSelectedShift({
                                        ...selectedShift,
                                        timeSlots: updatedSlots,
                                      });
                                    }}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                )}
                              </div>
                            </div>
                          ))}
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => {
                              setSelectedShift({
                                ...selectedShift,
                                timeSlots: [
                                  ...selectedShift.timeSlots,
                                  { startTime: "", endTime: "" },
                                ],
                              });
                            }}
                          >
                            Thêm khung giờ
                          </Button>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label
                              htmlFor="edit-overtimeThreshold"
                              className="text-right"
                            >
                              Ngưỡng làm thêm giờ
                            </Label>
                            <Input
                              id="edit-overtimeThreshold"
                              type="number"
                              value={selectedShift?.overtimeThreshold || 0}
                              onChange={(e) =>
                                setSelectedShift({
                                  ...selectedShift,
                                  overtimeThreshold: Number.parseInt(
                                    e.target.value
                                  ),
                                })
                              }
                              className="col-span-3"
                            />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label
                              htmlFor="edit-overtimeRate"
                              className="text-right"
                            >
                              Hệ số làm thêm giờ
                            </Label>
                            <Input
                              id="edit-overtimeRate"
                              type="number"
                              step="0.1"
                              value={selectedShift?.overtimeRate || 0}
                              onChange={(e) =>
                                setSelectedShift({
                                  ...selectedShift,
                                  overtimeRate: Number.parseFloat(
                                    e.target.value
                                  ),
                                })
                              }
                              className="col-span-3"
                            />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label
                              htmlFor="edit-capacity"
                              className="text-right"
                            >
                              Sức chứa
                            </Label>
                            <Input
                              id="edit-capacity"
                              type="number"
                              value={selectedShift?.capacity || 0}
                              onChange={(e) =>
                                setSelectedShift({
                                  ...selectedShift,
                                  capacity: Number.parseInt(e.target.value),
                                })
                              }
                              className="col-span-3"
                            />
                          </div>
                        </div>
                        <DialogFooter>
                          <Button type="submit" onClick={handleEditShift}>
                            Lưu thay đổi
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedShift(shift);
                        setIsDeleteDialogOpen(true);
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {/* Delete Dialog */}
        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Xóa ca làm việc</DialogTitle>
              <DialogDescription>
                Bạn có chắc chắn muốn xóa ca làm việc này không?
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="destructive" onClick={handleDeleteShift}>
                Xóa
              </Button>
              <Button
                variant="outline"
                onClick={() => setIsDeleteDialogOpen(false)}
              >
                Hủy
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default AdminShiftWork;
