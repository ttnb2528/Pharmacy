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

import { Badge } from "@/components/ui/badge";
import { apiClient } from "@/lib/api-admin.js";
import { ADD_SUPPLIER_ROUTE, DELETE_SUPPLIER_ROUTE } from "@/API/index.api.js";
import { toast } from "sonner";
import Loading from "../component/Loading.jsx";
import { SupplierContext } from "@/context/SupllierContext.controller.jsx";
import Header from "../component/Header.jsx";
import AdminSupplierForm from "./components/AdminSupplierForm.jsx";
import AdminSupplierDetail from "./components/AdminSupplierDetail.jsx";
import EditSupplierDialog from "./components/EditSupplierDialog.jsx";
import ConfirmForm from "../component/ConfirmForm.jsx";

const AdminSupplier = () => {
  const { suppliers, setSuppliers } = useContext(SupplierContext);
  const [isLoading, setIsLoading] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState(null);

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

  // View Supplier
  const handleViewSupplier = (supplier) => {
    setSelectedSupplier(supplier);
  };

  // Add new Supplier
  const handleAddSupplier = async (data) => {
    try {
      setIsLoading(true);
      const res = await apiClient.post(ADD_SUPPLIER_ROUTE, data);
      if (res.status === 200 && res.data.status === 201) {
        setSuppliers((prevSuppliers) => [...prevSuppliers, res.data.data]);
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

  // Edit Supplier
  const handleEditSupplier = (supplier) => {
    setSelectedSupplier(supplier);
    setIsEditDialogOpen(true);
  };

  const handleCancelEdit = () => {
    setIsEditDialogOpen(false);
    setSelectedSupplier(null);
  };

  // Delete Supplier
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

  const handleOpenConfirm = (supplier) => {
    setConfirmDelete(true);
    setSelectedSupplier(supplier);
  };

  return (
    <div>
      {isLoading && <Loading />}
      <Header title={"Danh sách nhà cung cấp"} />

      <main className="p-6">
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
            <DialogContent
              onPointerDownOutside={(e) => {
                e.preventDefault();
              }}
            >
              <DialogHeader>
                <DialogTitle>Thêm nhà cung cấp mới</DialogTitle>
                <DialogDescription>
                  Nhập thông tin cho nhà cung cấp mới.
                </DialogDescription>
              </DialogHeader>
              <AdminSupplierForm onSubmit={(data) => handleAddSupplier(data)} />
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
                  <Badge
                    variant={supplier.isDeleted ? "destructive" : "success"}
                  >
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
                          onClick={() => handleViewSupplier(supplier)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                          <DialogTitle className="text-2xl font-bold">
                            Thông tin nhà cung cấp
                          </DialogTitle>
                          <DialogDescription></DialogDescription>
                        </DialogHeader>
                        <AdminSupplierDetail supplier={selectedSupplier} />
                      </DialogContent>
                    </Dialog>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditSupplier(supplier)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleOpenConfirm(supplier)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </main>

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

      {/* Delete Dialog */}
      {confirmDelete && (
        <ConfirmForm
          info={selectedSupplier}
          open={confirmDelete}
          onClose={() => {
            setConfirmDelete(false);
            setSelectedSupplier(null);
          }}
          handleConfirm={() => handleDeleteSupplier(selectedSupplier)}
          type="supplier"
        />
      )}

      {/* Edit Dialog */}
      {isEditDialogOpen && (
        <EditSupplierDialog
          supplier={selectedSupplier}
          isOpen={isEditDialogOpen}
          onClose={handleCancelEdit}
          setSuppliers={setSuppliers}
        />
      )}
    </div>
  );
};

export default AdminSupplier;
