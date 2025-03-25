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
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { apiClient } from "@/lib/api-admin.js";
import {
  ADD_SHIFT_WORK_ROUTE,
  DELETE_SHIFT_WORK_ROUTE,
} from "@/API/index.api.js";
import { toast } from "sonner";
import { ShiftWorkContext } from "@/context/ShiftWorkContext.context.jsx";
import Loading from "../component/Loading.jsx";
import Header from "../component/Header.jsx";
import AdminShiftWorkForm from "./components/AdminShiftWorkForm.jsx";
import EditShiftWorkDialog from "./components/EditShiftWorkDialog.jsx";
import ConfirmForm from "../component/ConfirmForm.jsx";

const AdminShiftWork = () => {
  const { shiftWorks, setShiftWorks } = useContext(ShiftWorkContext);
  const [isLoading, setIsLoading] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [selectedShift, setSelectedShift] = useState(null);

  // Filter shifts based on search term
  const filteredShifts = shiftWorks.filter((shift) =>
    shift.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Add new shift
  const handleAddShift = async (data) => {
    try {
      setIsLoading(true);

      const res = await apiClient.post(ADD_SHIFT_WORK_ROUTE, data);
      if (res.status === 200 && res.data.status === 201) {
        setShiftWorks((prevShiftWorks) => [...prevShiftWorks, res.data.data]);
        setIsAddDialogOpen(false);

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
  const handleEditShift = (shift) => {
    setSelectedShift(shift);
    setIsEditDialogOpen(true);
  };

  const handleCancelEdit = () => {
    setSelectedShift(null);
    setIsEditDialogOpen(false);
  };

  // Delete shift
  const handleDeleteShift = async (shift) => {
    try {
      setIsLoading(true);
      const res = await apiClient.delete(
        `${DELETE_SHIFT_WORK_ROUTE}/${selectedShift._id}`
      );

      if (res.status === 200 && res.data.status === 200) {
        setShiftWorks((prevShiftWorks) =>
          prevShiftWorks.filter((item) => item._id !== shift._id)
        );
        setConfirmDelete(false);
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

  const handleOpenConfirm = (shift) => {
    setConfirmDelete(true);
    setSelectedShift(shift);
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
            <DialogContent
              className="sm:max-w-lg"
              onPointerDownOutside={(e) => {
                e.preventDefault();
              }}
            >
              <DialogHeader>
                <DialogTitle>Thêm ca làm việc mới</DialogTitle>
                <DialogDescription>
                  Nhập thông tin cho ca làm việc mới.
                </DialogDescription>
              </DialogHeader>
              <AdminShiftWorkForm onSubmit={(data) => handleAddShift(data)} />
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
            {filteredShifts.length > 0 ? (
              filteredShifts.map((shift) => (
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
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditShift(shift)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleOpenConfirm(shift)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center">
                  Không tìm thấy ca làm việc
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        {/* Delete Dialog */}
        {confirmDelete && (
          <ConfirmForm
            info={selectedShift}
            open={confirmDelete}
            onClose={() => {
              setConfirmDelete(false);
              setSelectedShift(null);
            }}
            handleConfirm={() => handleDeleteShift(selectedShift)}
            type="shift"
          />
        )}
      </div>

      {/* Edit Dialog */}
      {isEditDialogOpen && (
        <EditShiftWorkDialog
          shift={selectedShift}
          isOpen={isEditDialogOpen}
          onClose={handleCancelEdit}
          setShifts={setShiftWorks}
        />
      )}
    </div>
  );
};

export default AdminShiftWork;
