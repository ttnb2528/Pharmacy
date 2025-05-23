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
  ADD_CUSTOMER_ROUTE,
  DELETE_CUSTOMER_ROUTE,
  GET_ALL_CUSTOMERS_ROUTE,
} from "@/API/index.api.js";
import CustomerDetails from "./Components/CustomerDetail.jsx";
// import CustomerForm from "./Components/CustomerForm.jsx";
import CustomerForm1 from "./Components/CustomerForm1.jsx";
import { toast } from "sonner";
import Loading from "../component/Loading.jsx";
import ConfirmForm from "../component/ConfirmForm.jsx";
import Header from "../component/Header.jsx";
import EditCustomerDialog from "./Components/EditCustomerDialog.jsx";
import { formatDate } from "@/utils/formatDate.js";
import CustomPagination from "../component/Pagination.jsx";

const AdminCustomer = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [customers, setCustomers] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const totalPages = Math.ceil(customers.length / itemsPerPage);

  const [searchTerm, setSearchTerm] = useState("");

  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [isAdding, setIsAdding] = useState(false); // State cho nút "Thêm"
  const [isEditing, setIsEditing] = useState(false); // State cho nút "Sửa"
  // const [editingCustomer, setEditingCustomer] = useState(null);

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

  // Edit
  const handleEditCustomer = (customer) => {
    setIsEditing(true);
    setSelectedCustomer(customer);
  };

  const handleCancleEdit = () => {
    setIsEditing(false);
    setSelectedCustomer(null);
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
        <div className="w-full space-y-3 sm:space-y-0 sm:flex sm:items-center sm:justify-between mb-4">
          <div>
            <Input
              placeholder="Tìm kiếm khách hàng..."
              className="w-full sm:w-auto"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Dialog open={isAdding} onOpenChange={setIsAdding}>
            <DialogTrigger asChild>
              <Button className="w-full sm:w-auto">
                <Plus className="hidden sm:block h-4 w-4" /> Thêm khách hàng
              </Button>
            </DialogTrigger>
            <DialogContent
              className="max-w-2xl"
              onPointerDownOutside={(e) => {
                e.preventDefault();
              }}
            >
              <DialogHeader>
                <DialogTitle>Thêm khách hàng</DialogTitle>
              </DialogHeader>
              <DialogDescription></DialogDescription>
              <CustomerForm1
                onSubmit={(data) => handleCreateCustomer(data)}
                mode="add"
              />
            </DialogContent>
          </Dialog>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="whitespace-nowrap">Mã KH</TableHead>
              <TableHead className="whitespace-nowrap">Tên</TableHead>
              <TableHead className="whitespace-nowrap">Số điện thoại</TableHead>
              <TableHead className="whitespace-nowrap">Giới tính</TableHead>
              <TableHead className="whitespace-nowrap">Ngày sinh</TableHead>
              <TableHead className="whitespace-nowrap">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCustomers.length > 0 ? (
              filteredCustomers.map((customer) => (
                <TableRow key={customer._id}>
                  <TableCell>{customer.id}</TableCell>
                  <TableCell className="whitespace-nowrap">
                    {customer.name || "..."}
                  </TableCell>
                  <TableCell className="whitespace-nowrap">
                    {customer.phone || "..."}
                  </TableCell>
                  <TableCell className="whitespace-nowrap">
                    {customer.gender || "..."}
                  </TableCell>
                  <TableCell className="whitespace-nowrap">
                    {customer.date ? formatDate(customer.date) : "..."}
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

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditCustomer(customer)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>

                      {/* <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleOpenConfirm(customer)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button> */}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center">
                  Không tìm thấy khách hàng nào
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

      {isEditing && (
        <EditCustomerDialog
          customer={selectedCustomer}
          isOpen={isEditing}
          onClose={handleCancleEdit}
          setCustomers={setCustomers}
        />
      )}
    </div>
  );
};

export default AdminCustomer;
