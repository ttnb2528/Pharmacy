"use client";

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
import { Badge } from "@/components/ui/badge";
import { CouponContext } from "@/context/CouponContext.context.jsx";
import { convertVND } from "@/utils/convertVND.js";
import { apiClient } from "@/lib/api-admin.js";
import { ADD_COUPON_ROUTE, DELETE_COUPON_ROUTE } from "@/API/index.api.js";
import { toast } from "sonner";
import Loading from "../component/Loading.jsx";
import Header from "../component/Header.jsx";
import AdminCouponForm from "./components/AdminCouponForm.jsx";
import AdminCouponDetail from "./components/AdminCouponDetail.jsx";
import EditCouponDialog from "./components/EditCouponDialog.jsx";
import { formatDate } from "@/utils/formatDate.js";
import ConfirmForm from "../component/ConfirmForm.jsx";

const AdminCoupon = () => {
  const { coupons, setCoupons } = useContext(CouponContext);
  const [isLoading, setIsLoading] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [selectedCoupon, setSelectedCoupon] = useState(null);

  // Filter coupons based on search term
  const filteredCoupons = coupons.filter(
    (coupon) =>
      coupon.coupon_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      coupon.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination
  const totalPages = Math.ceil(filteredCoupons.length / itemsPerPage);
  const paginatedCoupons = filteredCoupons.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // view coupon
  const handleView = (coupon) => {
    setSelectedCoupon(coupon);
  };

  // Add new coupon
  const handleAddCoupon = async (data) => {
    try {
      setIsLoading(true);
      const upcasedCouponCode = data.coupon_code.toUpperCase();
      // Thay newCoupon2 bằng newCoupon
      const form = {
        ...data,
        coupon_code: upcasedCouponCode,
      };
      const res = await apiClient.post(ADD_COUPON_ROUTE, form);
      if (res.status === 200 && res.data.status === 201) {
        setCoupons([...coupons, res.data.data]);
        setIsAddDialogOpen(false);
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

  // Edit coupon
  const handleEditCoupon = (coupon) => {
    setSelectedCoupon(coupon);
    setIsEditDialogOpen(true);
  };

  const handleCancelEdit = () => {
    setIsEditDialogOpen(false);
    setSelectedCoupon(null);
  };

  // Delete coupon
  const handleDeleteCoupon = async (coupon) => {
    try {
      setIsLoading(true);
      const res = await apiClient.delete(
        `${DELETE_COUPON_ROUTE}/${coupon._id}`
      );

      if (res.status === 200 && res.data.status === 200) {
        setCoupons((prevCoupons) =>
          prevCoupons.filter((item) => item._id !== coupon._id)
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

  const handleOpenConfirm = (coupon) => {
    setSelectedCoupon(coupon);
    setConfirmDelete(true);
  };

  return (
    <div>
      {isLoading && <Loading />}
      <Header title={"Danh sách mã giảm giá"} />
      <main className="p-6">
        <div className="w-full space-y-3 sm:space-y-0 sm:flex sm:justify-between sm:items-center mb-4">
          <div>
            {/* <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" /> */}
            <Input
              placeholder="Tìm kiếm mã giảm giá..."
              className="w-full sm:w-auto"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="w-full sm:w-auto">
                <Plus className="hidden sm:block h-4 w-4" /> Thêm mã giảm giá
              </Button>
            </DialogTrigger>
            <DialogContent
              className="sm:max-w-3xl"
              onPointerDownOutside={(e) => {
                e.preventDefault();
              }}
            >
              <DialogHeader>
                <DialogTitle>Thêm mã giảm giá mới</DialogTitle>
                <DialogDescription>
                  Nhập thông tin cho mã giảm giá mới.
                </DialogDescription>
              </DialogHeader>
              <AdminCouponForm onSubmit={(data) => handleAddCoupon(data)} />
            </DialogContent>
          </Dialog>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Mã giảm giá</TableHead>
              <TableHead>Loại</TableHead>
              <TableHead>Giá trị</TableHead>
              <TableHead>Ngày bắt đầu</TableHead>
              <TableHead>Ngày kết thúc</TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead>Hành động</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedCoupons.length > 0 ? (
              paginatedCoupons.map((coupon) => (
                <TableRow key={coupon.id}>
                  <TableCell className="font-medium">
                    {coupon.coupon_code}
                  </TableCell>
                  <TableCell>
                    {coupon.discount_type === "percentage"
                      ? "Phần trăm"
                      : "Số tiền cố định"}
                  </TableCell>
                  <TableCell>
                    {coupon.discount_type === "percentage"
                      ? coupon.discount_value + "%"
                      : convertVND(coupon.discount_value)}
                  </TableCell>
                  <TableCell>{formatDate(coupon.start_date)}</TableCell>
                  <TableCell>{formatDate(coupon.end_date)}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        coupon.status === "active"
                          ? "success"
                          : coupon.status === "inactive"
                          ? "secondary"
                          : "destructive"
                      }
                    >
                      {coupon.status === "active"
                        ? "Hoạt động"
                        : coupon.status === "inactive"
                        ? "Hết mã"
                        : "Hết hạn"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleView(coupon)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                          <DialogHeader>
                            <DialogTitle className="text-2xl font-bold">
                              Chi tiết mã giảm giá
                            </DialogTitle>
                            <DialogDescription></DialogDescription>
                          </DialogHeader>
                          <AdminCouponDetail coupon={selectedCoupon} />
                        </DialogContent>
                      </Dialog>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditCoupon(coupon)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleOpenConfirm(coupon)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center">
                  Không tìm thấy mã giảm giá
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        {/* Delete Dialog */}
        {confirmDelete && (
          <ConfirmForm
            info={selectedCoupon}
            open={confirmDelete}
            onClose={() => {
              setConfirmDelete(false);
              setSelectedCoupon(null);
            }}
            handleConfirm={() => handleDeleteCoupon(selectedCoupon)}
            type="coupon"
          />
        )}

        {/* Edit Dialog */}
        {isEditDialogOpen && (
          <EditCouponDialog
            coupon={selectedCoupon}
            isOpen={isEditDialogOpen}
            onClose={handleCancelEdit}
            setCoupons={setCoupons}
          />
        )}
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
    </div>
  );
};

export default AdminCoupon;
