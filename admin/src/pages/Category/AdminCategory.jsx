import { useContext, useState } from "react";
import { Plus, Search, Eye, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SidebarTrigger } from "@/components/ui/sidebar";
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
import { CategoryContext } from "@/context/CategoryContext.context.jsx";
import { apiClient } from "@/lib/api-admin.js";
import {
  ADD_CATEGORY_ROUTE,
  DELETE_CATEGORY_ROUTE,
  UPDATE_CATEGORY_ROUTE,
} from "@/API/index.api.js";
import { toast } from "sonner";
import Loading from "../component/Loading.jsx";

const AdminCategory = () => {
  const { categories, setCategories } = useContext(CategoryContext);

  console.log(categories);

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [newCategory, setNewCategory] = useState({ name: "", description: "" });
  const [isLoading, setIsLoading] = useState(false);

  // Filter categories based on search term
  const filteredCategories = categories.filter((category) => {
    const name = category?.name ?? "";
    const description = category?.description ?? "";

    return (
      name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      description.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentCategories = filteredCategories.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Add new category
  const handleAddCategory = async () => {
    try {
      setIsLoading(true);
      const res = await apiClient.post(ADD_CATEGORY_ROUTE, newCategory);
      if (res.status === 200 && res.data.status === 201) {
        setCategories([...categories, res.data.data]);
        toast.success(res.data.message);
        setNewCategory({ name: "", description: "" });
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
        `${UPDATE_CATEGORY_ROUTE}/${selectedCategory._id}`,
        selectedCategory
      );

      if (res.status === 200 && res.data.status === 200) {
        const updatedCategories = categories.map((c) =>
          c._id === selectedCategory._id ? selectedCategory : c
        );
        setCategories(updatedCategories);
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
        `${DELETE_CATEGORY_ROUTE}/${selectedCategory._id}`
      );

      if (res.status === 200 && res.data.status === 200) {
        setCategories(categories.filter((c) => c._id !== selectedCategory._id));
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
      <header className="flex items-center justify-between mb-6 border-b pb-4">
        <SidebarTrigger />
        <h1 className="text-2xl font-bold">Danh sách danh mục</h1>
        <Button variant="outline">Đăng xuất</Button>
      </header>

      <div className="flex justify-between items-center mb-4">
        <div className="relative">
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input
            type="text"
            placeholder="Tìm kiếm danh mục..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Thêm danh mục
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Thêm danh mục mới</DialogTitle>
              <DialogDescription>
                Nhập thông tin cho danh mục mới.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Tên
                </Label>
                <Input
                  id="name"
                  value={newCategory.name}
                  onChange={(e) =>
                    setNewCategory({ ...newCategory, name: e.target.value })
                  }
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="description" className="text-right">
                  Mô tả
                </Label>
                <Input
                  id="description"
                  value={newCategory.description}
                  onChange={(e) =>
                    setNewCategory({
                      ...newCategory,
                      description: e.target.value,
                    })
                  }
                  className="col-span-3"
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" onClick={handleAddCategory}>
                Thêm danh mục
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
            <TableHead>Mô tả</TableHead>
            <TableHead>Hành động</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {currentCategories.map((category) => (
            <TableRow key={category.id}>
              <TableCell>{category.id}</TableCell>
              <TableCell>{category.name}</TableCell>
              <TableCell>{category.description}</TableCell>
              <TableCell>
                <div className="flex space-x-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedCategory(category)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                      <DialogHeader>
                        <DialogTitle className="text-2xl font-bold">
                          Thông tin danh mục
                        </DialogTitle>
                      </DialogHeader>
                      <div className="mt-4">
                        <Card>
                          <CardHeader className="bg-primary/5">
                            <CardTitle className="text-lg font-semibold flex items-center justify-between">
                              {selectedCategory?.name}
                              <Badge variant="outline">
                                ID: {selectedCategory?.id}
                              </Badge>
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="pt-4">
                            <div className="space-y-4">
                              <div>
                                <h4 className="text-sm font-medium text-muted-foreground">
                                  Mô tả
                                </h4>
                                <p className="text-sm mt-1">
                                  {selectedCategory?.description ||
                                    "Không có mô tả"}
                                </p>
                              </div>
                              <div>
                                <h4 className="text-sm font-medium text-muted-foreground">
                                  Số lượng sản phẩm
                                </h4>
                                <p className="text-sm mt-1">
                                  {selectedCategory?.productCount || 0}
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
                          setSelectedCategory(category);
                          setIsEditDialogOpen(true);
                        }}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>Sửa thông tin danh mục</DialogTitle>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="edit-name" className="text-right">
                            Tên
                          </Label>
                          <Input
                            id="edit-name"
                            value={selectedCategory?.name || ""}
                            onChange={(e) =>
                              setSelectedCategory({
                                ...selectedCategory,
                                name: e.target.value,
                              })
                            }
                            className="col-span-3"
                          />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label
                            htmlFor="edit-description"
                            className="text-right"
                          >
                            Mô tả
                          </Label>
                          <Input
                            id="edit-description"
                            value={selectedCategory?.description || ""}
                            onChange={(e) =>
                              setSelectedCategory({
                                ...selectedCategory,
                                description: e.target.value,
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
                      setSelectedCategory(category);
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
          length: Math.ceil(filteredCategories.length / itemsPerPage),
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
            <DialogTitle>Xóa danh mục</DialogTitle>
            <DialogDescription>
              Bạn có chắc chắn muốn xóa danh mục này không?
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

export default AdminCategory;
