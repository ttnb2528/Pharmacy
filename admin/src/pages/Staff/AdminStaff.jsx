import { useContext, useState } from "react";
import { Plus, Eye, Edit, Trash2 } from "lucide-react";
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

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
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
  const totalPages = Math.ceil(filteredStaff.length / itemsPerPage);
  const paginatedStaffs = filteredStaff.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

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
        <div className="w-full space-y-3 sm:space-y-0 sm:flex sm:items-center sm:justify-between mb-4">
          <div>
            {/* <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" /> */}
            <Input
              placeholder="Tìm kiếm nhân viên..."
              className="w-full sm:w-auto"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="w-full sm:w-auto">
                <Plus className="hidden sm:block h-4 w-4" /> Thêm nhân viên
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
              <TableHead className="whitespace-nowrap">Họ tên</TableHead>
              <TableHead className="whitespace-nowrap">Giới tính</TableHead>
              <TableHead className="whitespace-nowrap">Ngày sinh</TableHead>
              <TableHead className="whitespace-nowrap">Số điện thoại</TableHead>
              <TableHead className="whitespace-nowrap">Tên đăng nhập</TableHead>
              <TableHead className="whitespace-nowrap">Hành động</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedStaffs.length > 0 ? (
              paginatedStaffs.map((s) => (
                <TableRow key={s._id}>
                  <TableCell className="font-medium whitespace-nowrap">
                    {s?.name ?? "..."}
                  </TableCell>
                  <TableCell className="whitespace-nowrap">
                    {s?.gender ?? "..."}
                  </TableCell>
                  <TableCell className="whitespace-nowrap">
                    {s?.date ? formatDate(s?.date) : "..."}
                  </TableCell>
                  <TableCell className="whitespace-nowrap">
                    {s?.phone ?? "..."}
                  </TableCell>
                  <TableCell className="whitespace-nowrap">
                    {s?.username ?? "..."}
                  </TableCell>
                  <TableCell className="whitespace-nowrap">
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
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center">
                  Không có nhân viên nào
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        {totalPages > 1 && (
          <Pagination className="mt-4">
            <PaginationContent>
              {totalPages > 1 && (
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(prev - 1, 1))
                    }
                    disabled={currentPage === 1}
                  />
                </PaginationItem>
              )}
              {[...Array(totalPages)].map((_, index) => (
                <PaginationItem key={index}>
                  <PaginationLink
                    onClick={() => setCurrentPage(index + 1)}
                    isActive={currentPage === index + 1}
                  >
                    {index + 1}
                  </PaginationLink>
                </PaginationItem>
              ))}
              {totalPages > 1 && (
                <PaginationItem>
                  <PaginationNext
                    onClick={() =>
                      setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                    }
                    disabled={currentPage === totalPages}
                  />
                </PaginationItem>
              )}
            </PaginationContent>
          </Pagination>
        )}

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
