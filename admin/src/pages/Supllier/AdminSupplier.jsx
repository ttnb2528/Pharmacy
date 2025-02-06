import { useContext, useState } from "react";
import { Plus, Search, Eye, Edit, Trash2, MapPin, Phone } from "lucide-react";
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

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { apiClient } from "@/lib/api-admin.js";
import {
  ADD_SUPPLIER_ROUTE,
  DELETE_SUPPLIER_ROUTE,
  UPDATE_SUPPLIER_ROUTE,
} from "@/API/index.api.js";
import { toast } from "sonner";
import Loading from "../component/Loading.jsx";
import { SupplierContext } from "@/context/SupllierContext.controller.jsx";
import Header from "../component/Header.jsx";

const AdminSupplier = () => {
  const { suppliers, setSuppliers } = useContext(SupplierContext);

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [newSupplier, setNewSupplier] = useState({
    name: "",
    address: "",
    phone: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  // Filter categories based on search term
  const filteredSuppliers = suppliers.filter((supplier) => {
    const name = supplier?.name ?? "";
    const address = supplier?.address ?? "";
    const phone = supplier?.phone ?? "";

    return (
      name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      address.toLowerCase().includes(searchTerm.toLowerCase()) ||
      phone.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentSuppliers = filteredSuppliers.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Add new category
  const handleAddSupplier = async () => {
    try {
      setIsLoading(true);
      const res = await apiClient.post(ADD_SUPPLIER_ROUTE, newSupplier);
      if (res.status === 200 && res.data.status === 201) {
        setSuppliers([...suppliers, res.data.data]);
        toast.success(res.data.message);
        setNewSupplier({ name: "", address: "", phone: "" });
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

  // Edit category
  const handleEditSupplier = async () => {
    try {
      setIsLoading(true);
      const res = await apiClient.put(
        `${UPDATE_SUPPLIER_ROUTE}/${selectedSupplier._id}`,
        selectedSupplier
      );

      if (res.status === 200 && res.data.status === 200) {
        const updatedCategories = suppliers.map((c) =>
          c._id === selectedSupplier._id ? selectedSupplier : c
        );
        setSuppliers(updatedCategories);
        toast.success(res.data.message);
        setIsEditDialogOpen(false);
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  // Delete category
  const handleDeleteSupplier = async () => {
    try {
      setIsLoading(true);
      const res = await apiClient.delete(
        `${DELETE_SUPPLIER_ROUTE}/${selectedSupplier._id}`
      );

      if (res.status === 200 && res.data.status === 200) {
        // setSuppliers(suppliers.filter((c) => c._id !== selectedSupplier._id));
        const updatedCategories = suppliers.map((c) =>
          c._id === selectedSupplier._id ? { ...c, isDeleted: true } : c
        );
        setSuppliers(updatedCategories);
        toast.success(res.data.message);
        setIsDeleteDialogOpen(false);
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  //   const formatDate = (date) => {
  //     return new Intl.DateTimeFormat("vi-VN", {
  //       year: "numeric",
  //       month: "long",
  //       day: "numeric",
  //       hour: "2-digit",
  //       minute: "2-digit",
  //     }).format(date);
  //   };

  return (
    <div className="container mx-auto p-4">
      {isLoading && <Loading />}
      <Header title={"Danh sách nhà cung cấp"} />

      <div className="flex justify-between items-center mb-4">
        <div className="relative">
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input
            type="text"
            placeholder="Tìm kiếm nhà cung cấp..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Thêm nhà cung cấp
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Thêm nhà cung cấp mới</DialogTitle>
              <DialogDescription>
                Nhập thông tin cho nhà cung cấp mới.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Tên
                </Label>
                <Input
                  id="name"
                  value={newSupplier.name}
                  onChange={(e) =>
                    setNewSupplier({
                      ...newSupplier,
                      name: e.target.value,
                    })
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
                  value={newSupplier.address}
                  onChange={(e) =>
                    setNewSupplier({
                      ...newSupplier,
                      address: e.target.value,
                    })
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
                  value={newSupplier.phone}
                  onChange={(e) =>
                    setNewSupplier({
                      ...newSupplier,
                      phone: e.target.value,
                    })
                  }
                  className="col-span-3"
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" onClick={handleAddSupplier}>
                Thêm nhà cung cấp
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Tên</TableHead>
            <TableHead>Địa chỉ</TableHead>
            <TableHead>Số điện thoại</TableHead>
            <TableHead>Trạng thái</TableHead>
            <TableHead>Hành động</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {currentSuppliers.map((supplier) => (
            <TableRow key={supplier.id}>
              <TableCell>{supplier.id}</TableCell>
              <TableCell>{supplier.name}</TableCell>
              <TableCell>{supplier.address}</TableCell>
              <TableCell>{supplier.phone}</TableCell>
              <TableCell>
                <Badge variant={supplier.isDeleted ? "destructive" : "success"}>
                  {supplier.isDeleted ? "Đã xóa" : "Hoạt động"}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="flex space-x-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedSupplier(supplier)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                      <DialogHeader>
                        <DialogTitle className="text-2xl font-bold">
                          Thông tin nhà cung cấp
                        </DialogTitle>
                      </DialogHeader>
                      <div className="mt-4">
                        <Card>
                          <CardHeader className="bg-primary/5">
                            <CardTitle className="text-lg font-semibold flex items-center justify-between">
                              {selectedSupplier?.name}
                              <Badge variant="outline">
                                ID: {selectedSupplier?.id}
                              </Badge>
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="pt-4">
                            <div className="space-y-4">
                              <div className="flex items-center">
                                <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                                <div>
                                  <h4 className="text-sm font-medium text-muted-foreground">
                                    Địa chỉ
                                  </h4>
                                  <p className="text-sm mt-1">
                                    {selectedSupplier?.address}
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
                                    {selectedSupplier?.phone}
                                  </p>
                                </div>
                              </div>
                              <div>
                                <h4 className="text-sm font-medium text-muted-foreground">
                                  Trạng thái
                                </h4>
                                <Badge
                                  variant={
                                    selectedSupplier?.isDeleted
                                      ? "destructive"
                                      : "success"
                                  }
                                  className="mt-1"
                                >
                                  {selectedSupplier?.isDeleted
                                    ? "Đã xóa"
                                    : "Hoạt động"}
                                </Badge>
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
                          setSelectedSupplier(supplier);
                          setIsEditDialogOpen(true);
                        }}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>Sửa thông tin nhà cung cấp</DialogTitle>
                      </DialogHeader>
                      <DialogDescription></DialogDescription>
                      <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="edit-name" className="text-right">
                            Tên
                          </Label>
                          <Input
                            id="edit-name"
                            value={selectedSupplier?.name || ""}
                            onChange={(e) =>
                              setSelectedSupplier({
                                ...selectedSupplier,
                                name: e.target.value,
                              })
                            }
                            className="col-span-3"
                          />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="edit-address" className="text-right">
                            Địa chỉ
                          </Label>
                          <Input
                            id="edit-address"
                            value={selectedSupplier?.address || ""}
                            onChange={(e) =>
                              setSelectedSupplier({
                                ...selectedSupplier,
                                address: e.target.value,
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
                            value={selectedSupplier?.phone || ""}
                            onChange={(e) =>
                              setSelectedSupplier({
                                ...selectedSupplier,
                                phone: e.target.value,
                              })
                            }
                            className="col-span-3"
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button type="submit" onClick={handleEditSupplier}>
                          Lưu thay đổi
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSelectedSupplier(supplier);
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
          length: Math.ceil(filteredSuppliers.length / itemsPerPage),
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

      {/* Edit Dialog */}
      {/* This dialog is now nested within the TableCell */}

      {/* Delete Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Xóa nhà sản xuất</DialogTitle>
            <DialogDescription>
              Bạn có chắc chắn muốn xóa nhà sản xuất{" "}
              <span className="text-green-500 font-semibold">
                {selectedSupplier?.name}
              </span>{" "}
              này không?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="destructive" onClick={handleDeleteSupplier}>
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
  );
};

export default AdminSupplier;
