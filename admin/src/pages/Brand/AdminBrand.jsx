import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Plus, Eye, Edit, Trash2 } from "lucide-react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { apiClient } from "@/lib/api-admin.js";
import {
  ADD_BRAND_ROUTE,
  DELETE_BRAND_ROUTE,
  GET_ALL_BRANDS_ROUTE,
  // UPDATE_BRAND_ROUTE,
} from "@/API/index.api.js";
import { toast } from "sonner";
import Loading from "../component/Loading.jsx";
import ConfirmForm from "../component/ConfirmForm.jsx";
import AdminBrandDetail from "./Component/AdminBrandDetail.jsx";
import AdminBrandForm from "./Component/AdminBrandForm.jsx";
import Header from "../component/Header.jsx";
import EditBranDialog from "./Component/EditBranDialog.jsx";
import CustomPagination from "../component/Pagination.jsx";

const AdminBrand = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [brands, setBrands] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        setIsLoading(true);
        const res = await apiClient.get(GET_ALL_BRANDS_ROUTE);

        if (res.status === 200 && res.data.status === 200) {
          setBrands(res.data.data);
        } else {
          toast.error(res.data.message);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBrands();
  }, []);

  const filterBrands = brands.filter((brand) => {
    const name = brand?.name ?? "";

    return name.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const handleViewBrand = (brand) => {
    setSelectedBrand(brand);
  };

  const handleSubmitAdd = async (data) => {
    try {
      setIsLoading(true);
      const res = await apiClient.post(ADD_BRAND_ROUTE, data);

      if (res.status === 200 && res.data.status === 201) {
        toast.success(res.data.message);
        setBrands((prevBrands) => [...prevBrands, res.data.data]);
        setIsAdding(false);
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (brand) => {
    setSelectedBrand(brand);
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setSelectedBrand(null);
  };

  const handleDeleteBrand = async (brand) => {
    try {
      const res = await apiClient.delete(`${DELETE_BRAND_ROUTE}/${brand._id}`);

      if (res.status === 200 && res.data.status === 200) {
        toast.success(res.data.message);
        setBrands((prevBrands) =>
          prevBrands.filter((item) => item._id !== brand._id)
        );
        setConfirmDelete(false);
      } else {
        toast.error(res.data.message);
        setConfirmDelete(false);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenConfirm = (brand) => {
    setConfirmDelete(true);
    setSelectedBrand(brand);
  };

  const totalPages = Math.ceil(filterBrands.length / itemsPerPage);
  const paginatedBrands = filterBrands.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  return (
    <div>
      {isLoading && <Loading />}
      <Header title={"Danh sách thương hiệu"} />
      <main className="p-6">
        <div className="w-full space-y-3 sm:space-y-0 sm:flex sm:items-center sm:justify-between sm:space-x-3 mb-4">
          <div className="flex items-center space-x-2">
            <Input
              placeholder="Tìm kiếm thương hiệu..."
              className="w-full sm:w-auto sm:flex-1"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <Dialog open={isAdding} onOpenChange={setIsAdding}>
            <DialogTrigger asChild>
              <Button className="w-full sm:w-auto">
                <Plus className="hidden sm:block h-4 w-4" /> Thêm thương hiệu
              </Button>
            </DialogTrigger>
            <DialogContent
              className="max-w-2xl"
              onPointerDownOutside={(e) => {
                e.preventDefault();
              }}
            >
              <DialogHeader>
                <DialogTitle>Thêm thương hiệu</DialogTitle>
              </DialogHeader>
              <DialogDescription></DialogDescription>
              <AdminBrandForm onSubmit={(data) => handleSubmitAdd(data)} />
            </DialogContent>
          </Dialog>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="whitespace-nowrap">STT</TableHead>
              <TableHead className="whitespace-nowrap">
                Tên thương hiệu
              </TableHead>
              <TableHead className="whitespace-nowrap">Mô tả</TableHead>
              <TableHead className="whitespace-nowrap">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedBrands.length > 0 ? (
              paginatedBrands.map((brand) => (
                <TableRow key={brand._id}>
                  <TableCell>{brand.id || "..."}</TableCell>
                  <TableCell>{brand.name || "..."}</TableCell>
                  <TableCell className="line-clamp-2 max-h-12">
                    {brand.description || "..."}
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleViewBrand(brand)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>

                        {/* Nội dung Dialog */}
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>Thông tin thương hiệu</DialogTitle>
                          </DialogHeader>
                          <DialogDescription></DialogDescription>
                          <AdminBrandDetail brand={selectedBrand} />
                        </DialogContent>
                      </Dialog>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(brand)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleOpenConfirm(brand)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
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
      {confirmDelete && (
        <ConfirmForm
          info={selectedBrand}
          open={confirmDelete}
          onClose={() => {
            setConfirmDelete(false);
            setSelectedBrand(null);
          }}
          handleConfirm={() => handleDeleteBrand(selectedBrand)}
          type="brand"
        />
      )}

      {isEditing && (
        <EditBranDialog
          brand={selectedBrand}
          isOpen={isEditing}
          onClose={handleCancel}
          setBrands={setBrands}
        />
      )}
    </div>
  );
};

export default AdminBrand;
