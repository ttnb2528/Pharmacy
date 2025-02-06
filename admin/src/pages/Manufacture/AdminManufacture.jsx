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
  ADD_MANUFACTURE_ROUTE,
  DELETE_MANUFACTURE_ROUTE,
  UPDATE_MANUFACTURE_ROUTE,
} from "@/API/index.api.js";
import { toast } from "sonner";
import Loading from "../component/Loading.jsx";
import { ManufactureContext } from "@/context/ManufactureContext.context.jsx";
import Header from "../component/Header.jsx";

const AdminManufacture = () => {
  const { manufactures, setManufactures } = useContext(ManufactureContext);

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [selectedManufacture, setSelectedManufacture] = useState(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [newManufacture, setNewManufacture] = useState({
    name: "",
    country: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  // Filter categories based on search term
  const filteredManufactures = manufactures.filter((manufacture) => {
    const name = manufacture?.name ?? "";
    const country = manufacture?.country ?? "";
    const isNotDeleted = !manufacture.isDeleted;

    return (
      (name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        country.toLowerCase().includes(searchTerm.toLowerCase())) &&
      isNotDeleted
    );
  });

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentCategories = filteredManufactures.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Add new category
  const handleAddCategory = async () => {
    try {
      setIsLoading(true);
      const res = await apiClient.post(ADD_MANUFACTURE_ROUTE, newManufacture);
      if (res.status === 200 && res.data.status === 201) {
        setManufactures([...manufactures, res.data.data]);
        toast.success(res.data.message);
        setNewManufacture({ name: "", country: "" });
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
  const handleEditCategory = async () => {
    try {
      setIsLoading(true);
      const res = await apiClient.put(
        `${UPDATE_MANUFACTURE_ROUTE}/${selectedManufacture._id}`,
        selectedManufacture
      );

      if (res.status === 200 && res.data.status === 200) {
        const updatedCategories = manufactures.map((c) =>
          c._id === selectedManufacture._id ? selectedManufacture : c
        );
        setManufactures(updatedCategories);
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
  const handleDeleteCategory = async () => {
    try {
      setIsLoading(true);
      const res = await apiClient.delete(
        `${DELETE_MANUFACTURE_ROUTE}/${selectedManufacture._id}`
      );

      if (res.status === 200 && res.data.status === 200) {
        setManufactures(
          manufactures.filter((c) => c._id !== selectedManufacture._id)
        );
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
      <Header title={"Danh sách nhà sản xuất"} />

      <div className="flex justify-between items-center mb-4">
        <div className="relative">
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input
            type="text"
            placeholder="Tìm kiếm nhà sản xuất..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Thêm nhà sản xuất
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Thêm nhà sản xuất mới</DialogTitle>
              <DialogDescription>
                Nhập thông tin cho nhà sản xuất mới.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Tên
                </Label>
                <Input
                  id="name"
                  value={newManufacture.name}
                  onChange={(e) =>
                    setNewManufacture({
                      ...newManufacture,
                      name: e.target.value,
                    })
                  }
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="country" className="text-right">
                  Nước sản xuất
                </Label>
                <Input
                  id="country"
                  value={newManufacture.country}
                  onChange={(e) =>
                    setNewManufacture({
                      ...newManufacture,
                      country: e.target.value,
                    })
                  }
                  className="col-span-3"
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" onClick={handleAddCategory}>
                Thêm nhà sản xuất
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
            <TableHead>Nước</TableHead>
            <TableHead>Hành động</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {currentCategories.map((manufacture) => (
            <TableRow key={manufacture.id}>
              <TableCell>{manufacture.id}</TableCell>
              <TableCell>{manufacture.name}</TableCell>
              <TableCell>{manufacture.country}</TableCell>
              <TableCell>
                <div className="flex space-x-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedManufacture(manufacture)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                      <DialogHeader>
                        <DialogTitle className="text-2xl font-bold">
                          Thông tin nhà sản xuất
                        </DialogTitle>
                      </DialogHeader>
                      <DialogDescription></DialogDescription>
                      <div className="mt-4">
                        <Card>
                          <CardHeader className="bg-primary/5">
                            <CardTitle className="text-lg font-semibold flex items-center justify-between">
                              {selectedManufacture?.name}
                              <Badge variant="outline">
                                ID: {selectedManufacture?.id}
                              </Badge>
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="pt-4">
                            <div className="space-y-4">
                              <div>
                                <h4 className="text-sm font-medium text-muted-foreground">
                                  Nước
                                </h4>
                                <p className="text-sm mt-1">
                                  {selectedManufacture?.country || "..."}
                                </p>
                              </div>
                              <div>
                                <h4 className="text-sm font-medium text-muted-foreground">
                                  Số lượng sản phẩm
                                </h4>
                                <p className="text-sm mt-1">
                                  {selectedManufacture?.productCount || 0}
                                </p>
                              </div>
                              {/* <div>
                                <h4 className="text-sm font-medium text-muted-foreground">
                                  Ngày tạo
                                </h4>
                                <p className="text-sm mt-1">
                                  {formatDate(
                                    selectedCategory?.createdAt || new Date()
                                  )}
                                </p>
                              </div> */}
                              {/* <div>
                                <h4 className="text-sm font-medium text-muted-foreground">
                                  Cập nhật lần cuối
                                </h4>
                                <p className="text-sm mt-1">
                                  {formatDate(
                                    selectedCategory?.updatedAt || new Date()
                                  )}
                                </p>
                              </div> */}
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
                          setSelectedManufacture(manufacture);
                          setIsEditDialogOpen(true);
                        }}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>Sửa thông tin nhà sản xuất</DialogTitle>
                      </DialogHeader>
                      <DialogDescription></DialogDescription>
                      <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="edit-name" className="text-right">
                            Tên
                          </Label>
                          <Input
                            id="edit-name"
                            value={selectedManufacture?.name || ""}
                            onChange={(e) =>
                              setSelectedManufacture({
                                ...selectedManufacture,
                                name: e.target.value,
                              })
                            }
                            className="col-span-3"
                          />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="edit-country" className="text-right">
                            Nước
                          </Label>
                          <Input
                            id="edit-country"
                            value={selectedManufacture?.country || ""}
                            onChange={(e) =>
                              setSelectedManufacture({
                                ...selectedManufacture,
                                country: e.target.value,
                              })
                            }
                            className="col-span-3"
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button type="submit" onClick={handleEditCategory}>
                          Lưu thay đổi
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSelectedManufacture(manufacture);
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
          length: Math.ceil(filteredManufactures.length / itemsPerPage),
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
                {selectedManufacture?.name}
              </span>{" "}
              này không?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="destructive" onClick={handleDeleteCategory}>
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

export default AdminManufacture;
