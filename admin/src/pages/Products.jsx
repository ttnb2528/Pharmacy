import { Edit, Eye, Plus, Trash } from "lucide-react";

import { Button } from "@/components/ui/button";
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
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";


import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useContext, useState } from "react";
import { MedicineContext } from "@/context/ProductContext.context";
import MedicineDetails from "./component/MedicineDetails.jsx";
import { apiClient } from "@/lib/api-admin.js";
import { DELETE_MEDICINE_ROUTE } from "@/API/index.api.js";
import { toast } from "sonner";
import ConfirmForm from "./component/ConfirmForm.jsx";
import Loading from "./component/Loading.jsx";
import Header from "./component/Header.jsx";

export default function Products() {
  const { medicines, categories, setMedicines } = useContext(MedicineContext);
  const filterCategories = [{ _id: "all", name: "Tất cả" }, ...categories];

  const [isEditing, setIsEditing] = useState(false);
  const [isImport, setIsImport] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  const [selectedMedicine, setSelectedMedicine] = useState(null);

  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [selectedCategory, setSelectedCategory] = useState("Tất cả");
  const [searchTerm, setSearchTerm] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const handleEdit = (medicine) => {
    setSelectedMedicine(medicine);
    setIsEditing(true);
  };

  const handleView = (medicine) => {
    setSelectedMedicine(medicine);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setSelectedMedicine(null);
    setIsEditing(false);
    setIsAdding(false);
    setIsImport(false);
  };

  const filteredMedicines = medicines.filter((medicine) => {
    const isMatchCategory =
      selectedCategory === "Tất cả" ||
      medicine.categoryId.name === selectedCategory;
    const isMatchSearch = medicine.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    // Kết hợp điều kiện deleted
    const isNotDeleted = !medicine.deleted;

    return isMatchCategory && isMatchSearch && isNotDeleted;
  });

  const totalPages = Math.ceil(filteredMedicines.length / itemsPerPage);
  const paginatedMedicines = filteredMedicines.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleDeleteMEdicine = async (medicine) => {
    try {
      setIsLoading(true);
      const res = await apiClient.delete(
        `${DELETE_MEDICINE_ROUTE}/${medicine._id}`
      );
      console.log(res);

      if (res.status === 200 && res.data.status === 200) {
        toast.success("Xóa thuốc thành công");
        setIsConfirmOpen(false);
        setSelectedMedicine(null);
        setMedicines((prevMedicines) => {
          return prevMedicines.map((item) => {
            if (item._id === medicine._id) {
              return { ...item, deleted: true }; // Cập nhật deleted: true
            }
            return item;
          });
        });
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenConfirm = (medicine) => {
    setSelectedMedicine(medicine);
    setIsConfirmOpen(true);
  };

  return (
    <div>
      {isLoading && <Loading />}
      <Header title={"Danh sách thuốc"} />
      <main className="p-6">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center space-x-2">
            <Input
              placeholder="Tìm kiếm thuốc..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-64"
            />
            <Select
              value={selectedCategory}
              onValueChange={setSelectedCategory}
            >
              <SelectTrigger className="w-[180px] text-gray-500">
                <SelectValue placeholder="Chọn danh mục" />
              </SelectTrigger>
              <SelectContent>
                {filterCategories.map((category) => (
                  <SelectItem key={category._id} value={category.name}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Dialog open={isAdding} onOpenChange={setIsAdding}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" /> Thêm thuốc
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl">
              <DialogHeader>
                <DialogTitle>Thêm thuốc mới</DialogTitle>
              </DialogHeader>
              <DialogDescription></DialogDescription>
              <MedicineDetails
                medicine={null}
                isEditing={false}
                isImport={false}
                isAdding={true}
                handleCancel={handleCancel}
              />
            </DialogContent>
          </Dialog>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Mã</TableHead>
              <TableHead>Tên thuốc</TableHead>
              <TableHead>Kê đơn</TableHead>
              <TableHead>Loại thuốc</TableHead>
              <TableHead>Số lượng</TableHead>
              <TableHead>Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedMedicines.map((medicine) => (
              <TableRow key={medicine.id}>
                <TableCell>{medicine.id}</TableCell>
                <TableCell>{medicine.name}</TableCell>
                <TableCell>{medicine.isRx ? "Có" : "Không"}</TableCell>
                <TableCell>{medicine.categoryId.name}</TableCell>
                <TableCell>{medicine.quantityStock}</TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        {/* view product */}
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleView(medicine)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-4xl">
                        <DialogHeader>
                          <DialogTitle>Chi tiết thuốc</DialogTitle>
                        </DialogHeader>
                        <DialogDescription></DialogDescription>
                        <MedicineDetails
                          medicine={selectedMedicine}
                          isEditing={false}
                          isAdding={false}
                          isImport={false}
                          handleCancel={handleCancel}
                        />
                      </DialogContent>
                    </Dialog>
                    <Dialog>
                      <DialogTrigger asChild>
                        {/* edit product */}
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleEdit(medicine)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-4xl">
                        <DialogHeader>
                          <DialogTitle>Sửa thông tin thuốc</DialogTitle>
                          <DialogDescription></DialogDescription>
                        </DialogHeader>
                        <MedicineDetails
                          medicine={selectedMedicine}
                          isEditing={true}
                          isAdding={false}
                          isImport={true}
                          handleCancel={handleCancel}
                        />
                      </DialogContent>
                    </Dialog>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleOpenConfirm(medicine)}
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <Pagination className="mt-4">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              />
            </PaginationItem>
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
            <PaginationItem>
              <PaginationNext
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </main>

      {isConfirmOpen && (
        <ConfirmForm
          info={selectedMedicine}
          open={isConfirmOpen}
          onClose={() => {
            setIsConfirmOpen(false);
            setSelectedMedicine(null);
          }}
          handleConfirm={() => handleDeleteMEdicine(selectedMedicine)}
          type="product"
        />
      )}
    </div>
  );
}
