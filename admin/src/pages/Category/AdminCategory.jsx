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

// import { Label } from "@/components/ui/label";
import { CategoryContext } from "@/context/CategoryContext.context.jsx";
import { apiClient } from "@/lib/api-admin.js";
import {
  ADD_CATEGORY_ROUTE,
  DELETE_CATEGORY_ROUTE,
  // UPDATE_CATEGORY_ROUTE,
} from "@/API/index.api.js";
import { toast } from "sonner";
import Loading from "../component/Loading.jsx";
import Header from "../component/Header.jsx";
import AdminCategoryDetail from "./components/AdminCategoryDetail.jsx";
import EditCategoryDialog from "./components/EditCategoryDialog.jsx";
import ConfirmForm from "../component/ConfirmForm.jsx";
import AdminCategoryForm from "./components/AdminCategoryForm.jsx";

const AdminCategory = () => {
  const { categories, setCategories } = useContext(CategoryContext);
  const [isLoading, setIsLoading] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");

  const [itemsPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);

  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

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
  const totalPages = Math.ceil(filteredCategories.length / itemsPerPage);
  const paginatedCategories = filteredCategories.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Add new category
  const handleAddCategory = async (data) => {
    try {
      setIsLoading(true);
      const res = await apiClient.post(ADD_CATEGORY_ROUTE, data);
      if (res.status === 200 && res.data.status === 201) {
        setCategories([...categories, res.data.data]);
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

  // Edit category
  const handleEditCategory = (category) => {
    setSelectedCategory(category);
    setIsEditDialogOpen(true);
  };

  const handleCancelEdit = () => {
    setIsEditDialogOpen(false);
    setSelectedCategory(null);
  };

  // Delete category
  const handleOpenConfirm = (category) => {
    setConfirmDelete(true);
    setSelectedCategory(category);
  };
  const handleDeleteCategory = async (category) => {
    try {
      setIsLoading(true);
      const res = await apiClient.delete(
        `${DELETE_CATEGORY_ROUTE}/${category._id}`
      );

      if (res.status === 200 && res.data.status === 200) {
        toast.success(res.data.message);
        setCategories((prevCategories) =>
          prevCategories.filter((item) => item._id !== category._id)
        );
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

  // View category
  const handleViewCategory = (category) => {
    setSelectedCategory(category);
  };

  return (
    <div>
      {isLoading && <Loading />}
      <Header title={"Danh sách danh mục"} />
      <main className="p-6">
        <div className="w-full space-y-3 sm:space-y-0 sm:flex sm:items-center sm:justify-between sm:space-x-3 mb-4">
          <div className="flex items-center space-x-2">
            {/* <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" /> */}
            <Input
              placeholder="Tìm kiếm danh mục..."
              className="w-full sm:w-auto sm:flex-1"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="w-full sm:w-auto">
                <Plus className="hidden sm:block h-4 w-4" /> Thêm danh mục
              </Button>
            </DialogTrigger>
            <DialogContent
              onPointerDownOutside={(e) => {
                e.preventDefault();
              }}
            >
              <DialogHeader>
                <DialogTitle>Thêm danh mục mới</DialogTitle>
                <DialogDescription>
                  Nhập thông tin cho danh mục mới.
                </DialogDescription>
              </DialogHeader>
              <AdminCategoryForm onSubmit={(data) => handleAddCategory(data)} />
            </DialogContent>
          </Dialog>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="whitespace-nowrap">ID</TableHead>
              <TableHead className="whitespace-nowrap">Tên</TableHead>
              <TableHead className="whitespace-nowrap">Mô tả</TableHead>
              <TableHead className="whitespace-nowrap">Hành động</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedCategories.length > 0 ? (
              paginatedCategories.map((category) => (
                <TableRow key={category.id}>
                  <TableCell>{category.id}</TableCell>
                  <TableCell className="whitespace-nowrap">{category.name}</TableCell>
                  <TableCell className="line-clamp-2 max-h-12">{category.description}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleViewCategory(category)}
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
                          <DialogDescription></DialogDescription>
                          <AdminCategoryDetail category={selectedCategory} />
                        </DialogContent>
                      </Dialog>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditCategory(category)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleOpenConfirm(category)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow className="hover:bg-transparent">
                <TableCell colSpan={4} className="text-center py-10">
                  Không tìm thấy danh mục
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </main>

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

      {confirmDelete && (
        <ConfirmForm
          info={selectedCategory}
          open={confirmDelete}
          onClose={() => {
            setConfirmDelete(false);
            setSelectedCategory(null);
          }}
          handleConfirm={() => handleDeleteCategory(selectedCategory)}
          type="category"
        />
      )}

      {isEditDialogOpen && (
        <EditCategoryDialog
          category={selectedCategory}
          isOpen={isEditDialogOpen}
          onClose={handleCancelEdit}
          setCategories={setCategories}
        />
      )}
    </div>
  );
};

export default AdminCategory;
