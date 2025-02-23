import { useContext, useState } from "react";
import { Plus, Search, Eye, Edit, Trash2 } from "lucide-react";
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
import Loading from "../component/Loading.jsx";
import { StaffContext } from "@/context/StaffContext.context.jsx";
import { apiClient } from "@/lib/api-admin.js";
import { ADD_STAFF_ROUTE, DELETE_STAFF_ROUTE } from "@/API/index.api.js";
import { toast } from "sonner";
import Header from "../component/Header.jsx";
import ConfirmForm from "../component/ConfirmForm.jsx";
import AdminStaffDetail from "./components/AdminStaffDetail.jsx";
import AdminStaffForm from "./components/AdminStaffForm.jsx";
import EditStaffDialog from "./components/EditStaffDialog.jsx";

const AdminStaff = () => {
  const { staffs, setStaffs } = useContext(StaffContext);
  const [isLoading, setIsLoading] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);

  const [selectedStaff, setSelectedStaff] = useState(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  // Filter staff based on search term
  const filteredStaff = staffs.filter((s) => {
    const name = s?.name ?? "";
    const username = s?.username ?? "";
    const phone = s?.phone ?? "";
    return (
      (name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        phone.includes(searchTerm)) &&
      !s?.isAdmin
    );
  });

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentStaff = filteredStaff.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // View Staff
  const handleViewStaff = (staff) => {
    setSelectedStaff(staff);
  };

  // Add new staff member
  const handleAddStaff = async (data) => {
    try {
      setIsLoading(true);
      const res = await apiClient.post(ADD_STAFF_ROUTE, data);
      if (res.status === 200 && res.data.status === 201) {
        setStaffs((prevStaffs) => [...prevStaffs, res.data.data]);
        toast.success(res.data.message);
        setIsAddDialogOpen(false);
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  // Edit staff member
  const handleEditStaff = (staff) => {
    setSelectedStaff(staff);
    setIsEditDialogOpen(true);
  };

  const handleCancelEdit = () => {
    setIsEditDialogOpen(false);
    setSelectedStaff(null);
  };

  // Delete staff member
  const handleDeleteStaff = async () => {
    try {
      setIsLoading(true);
      const res = await apiClient.delete(
        `${DELETE_STAFF_ROUTE}/${selectedStaff._id}`
      );

      if (res.status === 200 && res.data.status === 200) {
        setStaffs(staffs.filter((s) => s._id !== selectedStaff._id));
        toast.success(res.data.message);
        setConfirmDelete(false);
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenConfirm = (staff) => {
    setConfirmDelete(true);
    setSelectedStaff(staff);
  };

  // Format date
  const formatDate = (date) => {
    return date ? new Date(date).toLocaleDateString("vi-VN") : "N/A";
  };

  return (
    <div>
      {isLoading && <Loading />}
      <Header title={"Danh sách nhân viên"} />
      <main className="p-6">
        <div className="flex justify-between items-center mb-4">
          <div className="relative w-64">
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              type="text"
              placeholder="Tìm kiếm nhân viên..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" /> Thêm nhân viên
              </Button>
            </DialogTrigger>
            <DialogContent
              className="sm:max-w-xl"
              onPointerDownOutside={(e) => {
                e.preventDefault();
              }}
            >
              <DialogHeader>
                <DialogTitle>Thêm nhân viên mới</DialogTitle>
                <DialogDescription>
                  Nhập thông tin cho nhân viên mới.
                </DialogDescription>
              </DialogHeader>
              <AdminStaffForm onSubmit={(data) => handleAddStaff(data)} />
            </DialogContent>
          </Dialog>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Họ tên</TableHead>
              <TableHead>Giới tính</TableHead>
              <TableHead>Ngày sinh</TableHead>
              <TableHead>Số điện thoại</TableHead>
              <TableHead>Tên đăng nhập</TableHead>
              <TableHead>Hành động</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentStaff.map((s) => (
              <TableRow key={s._id}>
                <TableCell className="font-medium">
                  {s?.name ?? "..."}
                </TableCell>
                <TableCell>{s?.gender ?? "..."}</TableCell>
                <TableCell>{s?.date ? formatDate(s?.date) : "..."}</TableCell>
                <TableCell>{s?.phone ?? "..."}</TableCell>
                <TableCell>{s?.username ?? "..."}</TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewStaff(s)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                          <DialogTitle className="text-2xl font-bold">
                            Thông tin nhân viên
                          </DialogTitle>
                          <DialogDescription></DialogDescription>
                        </DialogHeader>
                        <AdminStaffDetail staff={selectedStaff} />
                      </DialogContent>
                    </Dialog>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditStaff(s)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleOpenConfirm(s)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <div className="flex justify-center mt-4">
          {Array.from({
            length: Math.ceil(filteredStaff.length / itemsPerPage),
          }).map((_, index) => (
            <Button
              key={index}
              variant={currentPage === index + 1 ? "default" : "outline"}
              className="mx-1"
              onClick={() => paginate(index + 1)}
            >
              {index + 1}
            </Button>
          ))}
        </div>

        {/* Delete Dialog */}
        {confirmDelete && (
          <ConfirmForm
            info={selectedStaff}
            open={confirmDelete}
            onClose={() => {
              setConfirmDelete(false);
              setSelectedStaff(null);
            }}
            handleConfirm={() => handleDeleteStaff(selectedStaff)}
            type="staff"
          />
        )}

        {/* Edit Dialog */}
        {isEditDialogOpen && (
          <EditStaffDialog
            staff={selectedStaff}
            isOpen={isEditDialogOpen}
            onClose={handleCancelEdit}
            setStaffs={setStaffs}
          />
        )}
      </main>
    </div>
  );
};

export default AdminStaff;
