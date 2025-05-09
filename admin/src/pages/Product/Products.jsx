import { Edit, Eye, Plus, Trash, Upload } from "lucide-react";

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

import { useContext, useRef, useState } from "react";
import { MedicineContext } from "@/context/ProductContext.context";
import MedicineDetails from "./components/MedicineDetails.jsx";
import { apiClient } from "@/lib/api-admin.js";
import {
  BULK_ADD_MEDICINES_ROUTE,
  BULK_IMPORT_BATCHES_ROUTE,
  DELETE_MEDICINE_ROUTE,
} from "@/API/index.api.js";
import { toast } from "sonner";
import ConfirmForm from "../component/ConfirmForm.jsx";
import Loading from "../component/Loading.jsx";
import Header from "../component/Header.jsx";
import AddMedicineForm from "./components/AddMedicineForm.jsx";
import EditMedicineDialog from "./components/EditMedicineDialog.jsx";
import ImportMedicineDialog from "./components/ImportMedicineDialog.jsx";

import * as XLSX from "xlsx";
import { Label } from "@/components/ui/label.jsx";
import CustomPagination from "../component/Pagination.jsx";
import { useAppStore } from "@/store/index.js";

export default function Products() {
  const { medicines, categories, setMedicines } = useContext(MedicineContext);
  const filterCategories = [{ _id: "all", name: "Tất cả" }, ...categories];
  const { userInfo } = useAppStore();

  const [isEditing, setIsEditing] = useState(false);
  const [isImport, setIsImport] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  const [selectedMedicine, setSelectedMedicine] = useState(null);

  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [selectedCategory, setSelectedCategory] = useState("Tất cả");
  const [searchTerm, setSearchTerm] = useState("");

  const inputMedicineRef = useRef(null);
  const inputBatchRef = useRef(null);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const handleEdit = (medicine) => {
    setSelectedMedicine(medicine);
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setSelectedMedicine(null);
  };

  const handleView = (medicine) => {
    setSelectedMedicine(medicine);
  };

  const handleImport = (medicine) => {
    setSelectedMedicine(medicine);
    setIsImport(true);
  };

  const handleCancelImport = () => {
    setIsImport(false);
    setSelectedMedicine(null);
  };

  const handleCancel = () => {
    setIsEditing(false); // Set isEditing về false trước
    setIsAdding(false);
    setIsImport(false);
    setSelectedMedicine(null);
  };

  const handleExcelUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsLoading(true);
    const formData = new FormData();
    formData.append("zipFile", file);

    try {
      const res = await apiClient.post(BULK_ADD_MEDICINES_ROUTE, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (res.status === 200 && res.data.status === 201) {
        toast.success(res.data.message);
        setMedicines((prev) => [...prev, ...res.data.data]);
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      toast.error("Có lỗi khi nhập dữ liệu từ file zip");
      console.error(error);
    } finally {
      setIsLoading(false);
      if (inputMedicineRef.current) {
        inputMedicineRef.current.value = "";
      }
    }
  };

  const handleExcelImport = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      const data = new Uint8Array(event.target.result);
      const workbook = XLSX.read(data, {
        type: "array",
        dateNF: "yyyy-mm-dd", // Định dạng ngày đầu ra
      });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet, {
        raw: false, // Tắt chế độ raw để xử lý ngày
        dateNF: "yyyy-mm-dd", // Ép định dạng ngày
      });
      console.log(jsonData);

      try {
        const res = await apiClient.post(BULK_IMPORT_BATCHES_ROUTE, {
          batches: jsonData,
        });

        if (res.status === 200 && res.data.status === 201) {
          toast.success(res.data.message);
          setMedicines((prev) =>
            prev.map((med) => {
              const batch = res.data.data.find((b) => b.MedicineId === med._id);
              if (batch) {
                return {
                  ...med,
                  quantityStock: med.quantityStock + Number(batch.quantity),
                };
              }
              return med;
            })
          );
        } else if (res.data.status === 206) {
          toast.warning("Một số lô không được nhập", {
            description: res.data.data.errors.join("\n"),
          });
          setMedicines((prev) =>
            prev.map((med) => {
              const batch = res.data.data.added.find(
                (b) => b.MedicineId === med._id
              );
              if (batch) {
                return {
                  ...med,
                  quantityStock: med.quantityStock + Number(batch.quantity),
                };
              }
              return med;
            })
          );
        } else {
          toast.error(res.data.message);
        }
      } catch (error) {
        toast.error("Có lỗi khi nhập kho từ Excel");
        console.error(error);
      } finally {
        if (inputBatchRef.current) {
          inputBatchRef.current.value = ""; // Reset input
        }
      }
    };
    reader.readAsArrayBuffer(file);
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

  const handleFilterChange = (value) => {
    setSelectedCategory(value);
    setCurrentPage(1);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

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
    <div className="relative">
      {isLoading && <Loading />}
      <Header title={"Danh sách thuốc"} />
      <main className="p-6">
        <div className="grid lg:grid-cols-2 gap-6 mb-4">
          <div className="w-full space-y-3 sm:space-y-0 sm:flex sm:items-center sm:space-x-3">
            <Input
              placeholder="Tìm kiếm thuốc..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="w-full sm:w-auto sm:flex-1"
            />
            <Select value={selectedCategory} onValueChange={handleFilterChange}>
              <SelectTrigger className="w-full sm:w-[180px] text-gray-500 mt-2 sm:mt-0">
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
          <div className="space-y-3 sm:space-y-0 sm:flex sm:items-center sm:space-x-3">
            <Dialog open={isAdding} onOpenChange={setIsAdding}>
              <DialogTrigger asChild>
                <Button className="w-full sm:w-auto">
                  <Plus className="hidden sm:block h-4 w-4 mr-2" /> Thêm thuốc
                </Button>
              </DialogTrigger>
              <DialogContent
                className="max-w-4xl"
                onPointerDownOutside={(e) => {
                  e.preventDefault();
                }}
              >
                <DialogHeader>
                  <DialogTitle>Thêm thuốc mới</DialogTitle>
                </DialogHeader>
                <DialogDescription></DialogDescription>
                <AddMedicineForm handleCancel={handleCancel} />
              </DialogContent>
            </Dialog>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full sm:flex-1">
              <div>
                <Label
                  htmlFor="zip-upload"
                  className="w-full inline-flex items-center justify-center px-4 py-2 border border-gray-300 
                shadow-sm text-sm font-medium rounded-md text-gray-700 
                bg-white hover:bg-gray-50 cursor-pointer"
                >
                  <Upload className="hidden sm:block mr-2 h-4 w-4" /> Nhập thuốc
                  (zip)
                </Label>
                <Input
                  id="zip-upload"
                  type="file"
                  accept=".zip"
                  onChange={handleExcelUpload}
                  className="hidden"
                  ref={inputMedicineRef}
                />
              </div>
              <div>
                <Label
                  htmlFor="excel-import-upload"
                  className="w-full inline-flex items-center justify-center px-4 py-2 border border-gray-300 
                shadow-sm text-sm font-medium rounded-md text-gray-700 
                bg-white hover:bg-gray-50 cursor-pointer"
                >
                  <Upload className="hidden sm:block mr-2 h-4 w-4" /> Nhập kho
                </Label>
                <Input
                  id="excel-import-upload"
                  type="file"
                  accept=".xlsx, .xls"
                  onChange={handleExcelImport}
                  className="hidden"
                  ref={inputBatchRef}
                />
              </div>
            </div>
            {/* <Label
              htmlFor="excel-upload"
              className="inline-flex items-center px-4 py-2 border border-gray-300 
             shadow-sm text-sm font-medium rounded-md text-gray-700 
             bg-white hover:bg-gray-50 cursor-pointer"
            >
              <Upload className="mr-2 h-4 w-4" />
              Nhập thuốc
            </Label>
            <Input
              id="excel-upload"
              type="file"
              accept=".xlsx, .xls"
              onChange={handleExcelUpload}
              className="hidden"
              ref={inputMedicineRef}
            /> */}
          </div>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="whitespace-nowrap">Mã</TableHead>
              <TableHead className="whitespace-nowrap">Tên thuốc</TableHead>
              <TableHead className="whitespace-nowrap">Kê đơn</TableHead>
              <TableHead className="whitespace-nowrap">Loại thuốc</TableHead>
              <TableHead className="whitespace-nowrap">Số lượng</TableHead>
              <TableHead className="whitespace-nowrap">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedMedicines.length > 0 ? (
              paginatedMedicines.map((medicine) => (
                <TableRow key={medicine._id}>
                  <TableCell>{medicine.id}</TableCell>
                  <TableCell className="whitespace-nowrap line-clamp-1 leading-10">
                    {medicine.name}
                  </TableCell>
                  <TableCell>{medicine.isRx ? "Có" : "Không"}</TableCell>
                  <TableCell className="whitespace-nowrap">
                    {medicine.categoryId.name}
                  </TableCell>
                  <TableCell>{medicine.quantityStock}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      {/* Nút xem luôn hiển thị */}
                      <Dialog>
                        <DialogTrigger asChild>
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
                          <MedicineDetails medicine={selectedMedicine} />
                        </DialogContent>
                      </Dialog>

                      {userInfo.isAdmin && (
                        <>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handleEdit(medicine)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>

                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handleImport(medicine)}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>

                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handleOpenConfirm(medicine)}
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow className="hover:bg-transparent">
                <TableCell colSpan={6} className="text-center py-10">
                  Không có dữ liệu
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        <CustomPagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </main>

      {isEditing && (
        <EditMedicineDialog
          medicine={selectedMedicine}
          isOpen={isEditing}
          onClose={handleCancelEdit}
        />
      )}

      {isImport && (
        <ImportMedicineDialog
          medicine={selectedMedicine}
          isOpen={isImport}
          onClose={handleCancelImport}
        />
      )}

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
