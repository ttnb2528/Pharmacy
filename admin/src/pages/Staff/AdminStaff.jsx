"use client";

import { useContext, useState } from "react";
import {
  Plus,
  Search,
  Eye,
  Edit,
  Trash2,
  User,
  Phone,
  MapPin,
  Calendar,
  Briefcase,
} from "lucide-react";
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SidebarTrigger } from "@/components/ui/sidebar";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Loading from "../component/Loading.jsx";
import { StaffContext } from "@/context/StaffContext.context.jsx";
import { apiClient } from "@/lib/api-admin.js";
import {
  ADD_STAFF_ROUTE,
  DELETE_STAFF_ROUTE,
  UPDATE_STAFF_ROUTE,
} from "@/API/index.api.js";
import { toast } from "sonner";

const AdminStaff = () => {
  const { staffs, setStaffs } = useContext(StaffContext);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [newStaff, setNewStaff] = useState({
    name: "",
    gender: "",
    date: "",
    phone: "",
    address: "",
    username: "",
    password: "",
    workDate: new Date().toISOString().split("T")[0],
    isAdmin: false,
  });

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

  // Add new staff member
  const handleAddStaff = async () => {
    try {
      setIsLoading(true);
      const res = await apiClient.post(ADD_STAFF_ROUTE, newStaff);
      if (res.status === 200 && res.data.status === 201) {
        setStaffs([...staffs, res.data.data]);
        toast.success(res.data.message);
        setNewStaff({
          name: "",
          gender: "",
          date: "",
          phone: "",
          address: "",
          username: "",
          password: "",
          workDate: new Date().toISOString().split("T")[0],
          isAdmin: false,
        });
        setIsAddDialogOpen(false);
      } else {
        toast.error(res.data.message);
        setIsAddDialogOpen(false);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  // Edit staff member
  const handleEditStaff = async () => {
    try {
      setIsLoading(true);
      const res = await apiClient.put(
        `${UPDATE_STAFF_ROUTE}/${selectedStaff._id}`,
        selectedStaff
      );

      if (res.status === 200 && res.data.status === 200) {
        const updatedStaffs = staffs.map((s) =>
          s._id === selectedStaff._id ? selectedStaff : s
        );
        setStaffs(updatedStaffs);
        toast.success(res.data.message);
        setIsEditDialogOpen(false);
      } else {
        toast.error(res.data.message);
        setIsEditDialogOpen(false);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
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
        setIsDeleteDialogOpen(false);
      } else {
        toast.error(res.data.message);
        setIsDeleteDialogOpen(false);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  // Format date
  const formatDate = (date) => {
    return date ? new Date(date).toLocaleDateString("vi-VN") : "N/A";
  };

  return (
    <div>
      {isLoading && <Loading />}
      <header className="flex items-center justify-between p-4 border-b">
        <SidebarTrigger />
        <h1 className="text-2xl font-bold">Danh sách nhân viên</h1>
        <Button variant="outline">Đăng xuất</Button>
      </header>
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
            <DialogContent className="sm:max-w-xl">
              <DialogHeader>
                <DialogTitle>Thêm nhân viên mới</DialogTitle>
                <DialogDescription>
                  Nhập thông tin cho nhân viên mới.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    Họ tên
                  </Label>
                  <Input
                    id="name"
                    value={newStaff.name}
                    onChange={(e) =>
                      setNewStaff({ ...newStaff, name: e.target.value })
                    }
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="gender" className="text-right">
                    Giới tính
                  </Label>
                  <Select
                    value={newStaff.gender}
                    onValueChange={(value) =>
                      setNewStaff({ ...newStaff, gender: value })
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
                    type="date"
                    value={newStaff.date}
                    onChange={(e) =>
                      setNewStaff({ ...newStaff, date: e.target.value })
                    }
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="phone" className="text-right">
                    Số điện thoại
                  </Label>
                  <Input
                    id="phone"
                    value={newStaff.phone}
                    onChange={(e) =>
                      setNewStaff({ ...newStaff, phone: e.target.value })
                    }
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="address" className="text-right">
                    Địa chỉ
                  </Label>
                  <Input
                    id="address"
                    value={newStaff.address}
                    onChange={(e) =>
                      setNewStaff({ ...newStaff, address: e.target.value })
                    }
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="username" className="text-right">
                    Tên đăng nhập
                  </Label>
                  <Input
                    id="username"
                    value={newStaff.username}
                    onChange={(e) =>
                      setNewStaff({ ...newStaff, username: e.target.value })
                    }
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="password" className="text-right">
                    Mật khẩu
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    value={newStaff.password}
                    onChange={(e) =>
                      setNewStaff({ ...newStaff, password: e.target.value })
                    }
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="workDate" className="text-right">
                    Ngày vào làm
                  </Label>
                  <Input
                    id="workDate"
                    type="date"
                    value={newStaff.workDate}
                    onChange={(e) =>
                      setNewStaff({ ...newStaff, workDate: e.target.value })
                    }
                    className="col-span-3"
                  />
                </div>
                {/* <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="isAdmin" className="text-right">
                    Là Admin
                  </Label>
                  <Select
                    value={newStaff.isAdmin.toString()}
                    onValueChange={(value) =>
                      setNewStaff({ ...newStaff, isAdmin: value === "true" })
                    }
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Chọn quyền" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="true">Có</SelectItem>
                      <SelectItem value="false">Không</SelectItem>
                    </SelectContent>
                  </Select>
                </div> */}
              </div>
              <DialogFooter>
                <Button type="submit" onClick={handleAddStaff}>
                  Thêm nhân viên
                </Button>
              </DialogFooter>
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
              <TableRow key={s.id}>
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
                          onClick={() => setSelectedStaff(s)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                          <DialogTitle className="text-2xl font-bold">
                            Thông tin nhân viên
                          </DialogTitle>
                        </DialogHeader>
                        <div className="mt-4">
                          <Card>
                            <CardHeader className="bg-primary/5">
                              <CardTitle className="text-lg font-semibold flex items-center justify-between">
                                {selectedStaff?.name}
                                <Badge variant="secondary">Nhân viên</Badge>
                              </CardTitle>
                            </CardHeader>
                            <CardContent className="pt-4">
                              <div className="space-y-4">
                                <div className="flex items-center">
                                  <User className="h-4 w-4 mr-2 text-muted-foreground" />
                                  <div>
                                    <h4 className="text-sm font-medium text-muted-foreground">
                                      Tên đăng nhập
                                    </h4>
                                    <p className="text-sm mt-1">
                                      {selectedStaff?.username}
                                    </p>
                                  </div>
                                </div>
                                <div className="flex items-center">
                                  <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                                  <div>
                                    <h4 className="text-sm font-medium text-muted-foreground">
                                      Số điện thoại
                                    </h4>
                                    <p className="text-sm mt-1">
                                      {selectedStaff?.phone}
                                    </p>
                                  </div>
                                </div>
                                <div className="flex items-center">
                                  <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                                  <div>
                                    <h4 className="text-sm font-medium text-muted-foreground">
                                      Địa chỉ
                                    </h4>
                                    <p className="text-sm mt-1">
                                      {selectedStaff?.address}
                                    </p>
                                  </div>
                                </div>
                                <div className="flex items-center">
                                  <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                                  <div>
                                    <h4 className="text-sm font-medium text-muted-foreground">
                                      Ngày sinh
                                    </h4>
                                    <p className="text-sm mt-1">
                                      {selectedStaff?.date
                                        ? formatDate(selectedStaff?.date)
                                        : "..."}
                                    </p>
                                  </div>
                                </div>
                                <div className="flex items-center">
                                  <Briefcase className="h-4 w-4 mr-2 text-muted-foreground" />
                                  <div>
                                    <h4 className="text-sm font-medium text-muted-foreground">
                                      Ngày vào làm
                                    </h4>
                                    <p className="text-sm mt-1">
                                      {formatDate(selectedStaff?.workDate)}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </div>
                      </DialogContent>
                    </Dialog>

                    <Dialog
                      open={isEditDialogOpen}
                      onOpenChange={setIsEditDialogOpen}
                    >
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedStaff(s);
                            setIsEditDialogOpen(true);
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>

                      <DialogContent className="sm:max-w-xl">
                        <DialogHeader>
                          <DialogTitle>Sửa thông tin nhân viên</DialogTitle>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="edit-name" className="text-right">
                              Họ tên
                            </Label>
                            <Input
                              id="edit-name"
                              value={selectedStaff?.name || ""}
                              onChange={(e) =>
                                setSelectedStaff({
                                  ...selectedStaff,
                                  name: e.target.value,
                                })
                              }
                              className="col-span-3"
                            />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="edit-gender" className="text-right">
                              Giới tính
                            </Label>
                            <Select
                              value={selectedStaff?.gender}
                              onValueChange={(value) =>
                                setSelectedStaff({
                                  ...selectedStaff,
                                  gender: value,
                                })
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
                            <Label htmlFor="edit-date" className="text-right">
                              Ngày sinh
                            </Label>
                            <Input
                              id="edit-date"
                              type="date"
                              value={
                                selectedStaff?.date
                                  ? new Date(selectedStaff.date)
                                      .toISOString()
                                      .split("T")[0]
                                  : ""
                              }
                              onChange={(e) =>
                                setSelectedStaff({
                                  ...selectedStaff,
                                  date: e.target.value,
                                })
                              }
                              className="col-span-3"
                            />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="edit-phone" className="text-right">
                              Số điện thoại
                            </Label>
                            <Input
                              id="edit-phone"
                              value={selectedStaff?.phone || ""}
                              onChange={(e) =>
                                setSelectedStaff({
                                  ...selectedStaff,
                                  phone: e.target.value,
                                })
                              }
                              className="col-span-3"
                            />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label
                              htmlFor="edit-address"
                              className="text-right"
                            >
                              Địa chỉ
                            </Label>
                            <Input
                              id="edit-address"
                              value={selectedStaff?.address || ""}
                              onChange={(e) =>
                                setSelectedStaff({
                                  ...selectedStaff,
                                  address: e.target.value,
                                })
                              }
                              className="col-span-3"
                            />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label
                              htmlFor="edit-username"
                              className="text-right"
                            >
                              Tên đăng nhập
                            </Label>
                            <Input
                              id="edit-username"
                              value={selectedStaff?.username || ""}
                              onChange={(e) =>
                                setSelectedStaff({
                                  ...selectedStaff,
                                  username: e.target.value,
                                })
                              }
                              className="col-span-3"
                            />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label
                              htmlFor="edit-workDate"
                              className="text-right"
                            >
                              Ngày vào làm
                            </Label>
                            <Input
                              id="edit-workDate"
                              type="date"
                              value={
                                selectedStaff?.workDate
                                  ? new Date(selectedStaff.workDate)
                                      .toISOString()
                                      .split("T")[0]
                                  : ""
                              }
                              onChange={(e) =>
                                setSelectedStaff({
                                  ...selectedStaff,
                                  workDate: e.target.value,
                                })
                              }
                              className="col-span-3"
                            />
                          </div>
                          {/* <div className="grid grid-cols-4 items-center gap-4">
                            <Label
                              htmlFor="edit-isAdmin"
                              className="text-right"
                            >
                              Là Admin
                            </Label>
                            <Select
                              value={selectedStaff?.isAdmin.toString()}
                              onValueChange={(value) =>
                                setSelectedStaff({
                                  ...selectedStaff,
                                  isAdmin: value === "true",
                                })
                              }
                            >
                              <SelectTrigger className="col-span-3">
                                <SelectValue placeholder="Chọn quyền" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="true">Có</SelectItem>
                                <SelectItem value="false">Không</SelectItem>
                              </SelectContent>
                            </Select>
                          </div> */}
                        </div>
                        <DialogFooter>
                          <Button type="submit" onClick={handleEditStaff}>
                            Lưu thay đổi
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedStaff(s);
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
        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Xóa nhân viên</DialogTitle>
              <DialogDescription>
                Bạn có chắc chắn muốn xóa nhân viên{" "}
                <span className="font-semibold text-green-500">
                  {selectedStaff?.name}
                </span>{" "}
                này không?
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="destructive" onClick={handleDeleteStaff}>
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
      </main>
    </div>
  );
};

export default AdminStaff;
