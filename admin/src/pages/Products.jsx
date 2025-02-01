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

import { SidebarTrigger } from "@/components/ui/sidebar";
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

export default function Products() {
  const { medicines, categories } = useContext(MedicineContext);
  const filterCategories = [{ _id: "all", name: "Tất cả" }, ...categories];

  const [selectedMedicine, setSelectedMedicine] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Tất cả");
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
    setIsDialogOpen(false);
  };

  const filteredMedicines = medicines.filter(
    (medicine) =>
      medicine.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (selectedCategory === "Tất cả" ||
        medicine.categoryId.name === selectedCategory)
  );

  const totalPages = Math.ceil(filteredMedicines.length / itemsPerPage);
  const paginatedMedicines = filteredMedicines.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  

  return (
    <div>
      <header className="flex items-center justify-between p-4 border-b">
        <SidebarTrigger />
        <h1 className="text-2xl font-bold">Danh sách thuốc</h1>
        <Button>Đăng xuất</Button>
      </header>
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
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
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
                isEditing={true}
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
                        </DialogHeader>
                        <MedicineDetails
                          medicine={selectedMedicine}
                          isEditing={true}
                        />
                      </DialogContent>
                    </Dialog>
                    <Button variant="outline" size="icon">
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
    </div>
  );
}
