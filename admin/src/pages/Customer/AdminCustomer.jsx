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
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
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
  ADD_CUSTOMER_ROUTE,
  DELETE_CUSTOMER_ROUTE,
  GET_ALL_CUSTOMERS_ROUTE,
  UPDATE_CUSTOMER_ROUTE,
} from "@/API/index.api.js";
import CustomerDetails from "./Components/CustomerDetail.jsx";
// import CustomerForm from "./Components/CustomerForm.jsx";
import CustomerForm1 from "./Components/CustomerForm1.jsx";
import { toast } from "sonner";
import Loading from "../component/Loading.jsx";
import ConfirmForm from "../component/ConfirmForm.jsx";
import Header from "../component/Header.jsx";

const AdminCustomer = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [customers, setCustomers] = useState([]);
  const totalPages = Math.ceil(customers.length / itemsPerPage);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const [isAdding, setIsAdding] = useState(false); // State cho nút "Thêm"
  const [isEditing, setIsEditing] = useState(false); // State cho nút "Sửa"
  const [editingCustomer, setEditingCustomer] = useState(null);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const res = await apiClient.get(GET_ALL_CUSTOMERS_ROUTE);

        if (res.status === 200 && res.data.status === 200) {
          setCustomers(res.data.data);
        } else {
          console.error(res.data.message);
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchCustomers();
  }, []);

  const filteredCustomers = customers.filter((customer) => {
    const customerName = customer?.name ?? "";
    const customerPhone = customer?.phone ?? "";
    const searchTermLower = searchTerm.toLowerCase();

    // Kiểm tra xem tên hoặc số điện thoại có chứa searchTerm hay không
    return (
      customerName.toLowerCase().includes(searchTermLower) ||
      customerPhone.includes(searchTermLower)
    );
  });

  const handleViewCustomer = (customer) => {
    setSelectedCustomer(customer);
  };

  const handleCreateCustomer = async (data) => {
    try {
      setIsLoading(true);
      const res = await apiClient.post(ADD_CUSTOMER_ROUTE, data);

      console.log(res);

      if (res.status === 200 && res.data.status === 201) {
        setCustomers((prev) => [...prev, res.data.data]);
        setIsAdding(false);
        toast.success(res.data.message);
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateCustomer = async (data, customer) => {
    try {
      setIsLoading(true);
      const res = await apiClient.put(
        `${UPDATE_CUSTOMER_ROUTE}/${customer._id}`,
        data
      );

      if (res.status === 200 && res.data.status === 200) {
        const updatedCustomer = res.data.data;
        setCustomers((prev) =>
          prev.map((customer) =>
            customer._id === updatedCustomer._id ? updatedCustomer : customer
          )
        );
        setIsEditing(false);
        toast.success(res.data.message);
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteCustomer = async (customer) => {
    try {
      setIsLoading(true);
      const res = await apiClient.delete(
        `${DELETE_CUSTOMER_ROUTE}/${customer._id}`
      );

      if (res.status === 200 && res.data.status === 200) {
        setCustomers((prev) =>
          prev.filter((item) => item._id !== customer._id)
        );
        setConfirmDelete(false);
        toast.success(res.data.message);
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenConfirm = (customer) => {
    setConfirmDelete(true);
    setSelectedCustomer(customer);
  };

  return (
    <div>
      {isLoading && <Loading />}
      <Header title={"Danh sách khách hàng"} />
      <main className="p-6">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center space-x-2">
            <Input
              placeholder="Tìm kiếm khách hàng..."
              className="w-64"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Dialog open={isAdding} onOpenChange={setIsAdding}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" /> Thêm khách hàng
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Thêm khách hàng</DialogTitle>
              </DialogHeader>
              <DialogDescription></DialogDescription>
              <CustomerForm1
                onSubmit={(data) => handleCreateCustomer(data)}
                mode="add" // Thêm props mode="add"
              />
            </DialogContent>
          </Dialog>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Mã KH</TableHead>
              <TableHead>Tên</TableHead>
              <TableHead>Số điện thoại</TableHead>
              <TableHead>Giới tính</TableHead>
              <TableHead>Ngày sinh</TableHead>
              <TableHead>Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCustomers.map((customer) => (
              <TableRow key={customer._id}>
                <TableCell>{customer.id}</TableCell>
                <TableCell>{customer.name || "..."}</TableCell>
                <TableCell>{customer.phone || "..."}</TableCell>
                <TableCell>{customer.gender || "..."}</TableCell>
                <TableCell>
                  {new Date(customer.date).toLocaleDateString("vi") || "..."}
                </TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewCustomer(customer)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>

                      {/* Nội dung Dialog */}
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>Thông tin khách hàng</DialogTitle>
                        </DialogHeader>
                        <DialogDescription></DialogDescription>
                        <CustomerDetails customer={selectedCustomer} />
                      </DialogContent>
                    </Dialog>

                    <Dialog open={isEditing} onOpenChange={setIsEditing}>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setIsEditing(true);
                            setEditingCustomer(customer);
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>Sửa thông tin khách hàng</DialogTitle>
                        </DialogHeader>
                        <DialogDescription></DialogDescription>
                        <CustomerForm1
                          customer={editingCustomer}
                          onSubmit={(data) =>
                            handleUpdateCustomer(data, editingCustomer)
                          }
                          mode="edit" // Thêm props mode="edit"
                        />
                      </DialogContent>
                    </Dialog>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleOpenConfirm(customer)}
                    >
                      <Trash2 className="h-4 w-4" />
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
      {confirmDelete && (
        <ConfirmForm
          info={selectedCustomer}
          open={confirmDelete}
          onClose={() => {
            setConfirmDelete(false);
            setSelectedCustomer(null);
          }}
          handleConfirm={() => handleDeleteCustomer(selectedCustomer)}
          type="customer"
        />
      )}
    </div>
  );
};

export default AdminCustomer;
