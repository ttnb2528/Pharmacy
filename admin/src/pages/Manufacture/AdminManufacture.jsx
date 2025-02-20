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

import { apiClient } from "@/lib/api-admin.js";
import {
  ADD_MANUFACTURE_ROUTE,
  DELETE_MANUFACTURE_ROUTE,
} from "@/API/index.api.js";
import { toast } from "sonner";
import Loading from "../component/Loading.jsx";
import { ManufactureContext } from "@/context/ManufactureContext.context.jsx";
import Header from "../component/Header.jsx";
import AdminManufactureForm from "./components/AdminManufactureForm.jsx";
import AdminManufactureDetail from "./components/AdminManufactureDetail.jsx";
import EditManufactureDialog from "./components/EditManufactureDialog.jsx";
import ConfirmForm from "../component/ConfirmForm.jsx";

const AdminManufacture = () => {
  const { manufactures, setManufactures } = useContext(ManufactureContext);
  const [isLoading, setIsLoading] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [selectedManufacture, setSelectedManufacture] = useState(null);

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

  // View Manufacture
  const handleViewManufacture = (manufacture) => {
    setSelectedManufacture(manufacture);
  };

  // Add new Manufacture
  const handleAddManufacture = async (data) => {
    try {
      setIsLoading(true);
      const res = await apiClient.post(ADD_MANUFACTURE_ROUTE, data);
      if (res.status === 200 && res.data.status === 201) {
        toast.success(res.data.message);
        setManufactures((prevManufactures) => [
          ...prevManufactures,
          res.data.data,
        ]);
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

  // Edit Manufacture

  const handleEditManufacture = (manufacture) => {
    setSelectedManufacture(manufacture);
    setIsEditDialogOpen(true);
  };

  const handleCancelEdit = () => {
    setIsEditDialogOpen(false);
    setSelectedManufacture(null);
  };

  // Delete Manufacture
  const handleDeleteManufacture = async (manufacture) => {
    try {
      setIsLoading(true);
      const res = await apiClient.delete(
        `${DELETE_MANUFACTURE_ROUTE}/${manufacture._id}`
      );

      if (res.status === 200 && res.data.status === 200) {
        toast.success(res.data.message);
        setManufactures((prevManufactures) =>
          prevManufactures.filter((item) => item._id !== manufacture._id)
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

  const handleOpenConfirm = (manufacture) => {
    setConfirmDelete(true);
    setSelectedManufacture(manufacture);
  };

  return (
    <div>
      {isLoading && <Loading />}
      <Header title={"Danh sách nhà sản xuất"} />
      <main className="p-6">
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
              <AdminManufactureForm
                onSubmit={(data) => handleAddManufacture(data)}
              />
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
                          onClick={() => handleViewManufacture(manufacture)}
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
                        <AdminManufactureDetail
                          manufacture={selectedManufacture}
                        />
                      </DialogContent>
                    </Dialog>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditManufacture(manufacture)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleOpenConfirm(manufacture)}
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
      </main>

      {/* Delete Dialog */}
      {confirmDelete && (
        <ConfirmForm
          info={selectedManufacture}
          open={confirmDelete}
          onClose={() => {
            setConfirmDelete(false);
            setSelectedManufacture(null);
          }}
          handleConfirm={() => handleDeleteManufacture(selectedManufacture)}
          type="manufacture"
        />
      )}

      {/* Edit Dialog */}
      {isEditDialogOpen && (
        <EditManufactureDialog
          manufacture={selectedManufacture}
          isOpen={isEditDialogOpen}
          onClose={handleCancelEdit}
          setManufactures={setManufactures}
        />
      )}
    </div>
  );
};

export default AdminManufacture;
