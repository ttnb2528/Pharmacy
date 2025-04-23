import { useContext, useEffect, useState } from "react";
import { Eye, RefreshCw } from "lucide-react";
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
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import { OrderContext } from "@/context/OrderContext.context.jsx";
import { convertVND } from "@/utils/convertVND.js";
import Loading from "../component/Loading.jsx";
import { apiClient } from "@/lib/api-admin.js";
import {
  GET_ORDER_DETAIL_ROUTE,
  UPDATE_ORDER_STATUS_ROUTE,
} from "@/API/index.api.js";
import { toast } from "sonner";
import Header from "../component/Header.jsx";
import CustomPagination from "../component/Pagination.jsx";

// Map trạng thái từ tiếng Anh sang tiếng Việt
const statusTranslations = {
  pending: "Chờ xử lý",
  processing: "Đang xử lý",
  packaged: "Đã đóng gói",
  shipping: "Đang giao hàng",
  completed: "Hoàn thành",
  cancelled: "Đã hủy",
};

// Define valid status transitions map
const validStatusTransitions = {
  pending: ["processing", "cancelled"],
  processing: ["packaged", "cancelled"],
  packaged: ["shipping", "cancelled"],
  shipping: ["completed", "cancelled"],
  completed: [], // No further transitions allowed
  cancelled: [], // No further transitions allowed
};

export default function AdminOrders() {
  // const [orders, setOrders] = useState(mockOrders);
  const { orders, setOrders } = useContext(OrderContext);
  console.log(orders);

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [selectedOrderDetail, setSelectedOrderDetail] = useState(null);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [isStatusUpdateDialogOpen, setIsStatusUpdateDialogOpen] =
    useState(false);
  const [newStatus, setNewStatus] = useState("");

  const [isLoading, setIsLoading] = useState(false);

  // Filter orders based on search term
  const filteredOrders = orders.filter((order) =>
    // order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.nameCustomer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Update order status
  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      setIsLoading(true);
      const res = await apiClient.put(
        `${UPDATE_ORDER_STATUS_ROUTE}/${orderId}`,
        {
          status: newStatus,
        }
      );

      if (res.status === 200 && res.data.status === 200) {
        const updatedOrders = orders.map((order) =>
          order.id === orderId ? { ...order, status: newStatus } : order
        );

        setOrders(updatedOrders);
        setIsStatusUpdateDialogOpen(false);
        toast.success(res.data.message);
      } else if (res.status === 200 && res.data.status === 100) {
        const updatedOrders = orders.map((order) =>
          order.id === orderId ? { ...order, status: newStatus } : order
        );
        setOrders(updatedOrders);

        toast.warning(res.data.message);
        setIsStatusUpdateDialogOpen(false);
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  // Format date
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Get status badge variant
  const getStatusBadgeVariant = (status) => {
    switch (status) {
      case "pending":
        return "warning";
      case "processing":
        return "default";
      case "shipping":
        return "secondary";
      case "packaged":
        return "primary";
      case "completed":
        return "success";
      case "cancelled":
        return "destructive";
      default:
        return "default";
    }
  };

  // Hàm chuyển đổi trạng thái từ tiếng Anh sang tiếng Việt
  const translateStatus = (status) => {
    return statusTranslations[status] || status;
  };

  useEffect(() => {
    if (isDetailsDialogOpen && selectedOrder) {
      const fetchOrderDetails = async (orderId) => {
        try {
          const type = "store";
          const res = await apiClient.get(
            `${GET_ORDER_DETAIL_ROUTE}/${type}/${orderId}`
          );

          if (res.status === 200 && res.data.status === 200) {
            setSelectedOrderDetail(res.data.data);
          } else {
            console.log("Lỗi khi lấy thông tin đơn hàng");
          }
        } catch (error) {
          console.log("Lỗi khi lấy thông tin đơn hàng:", error);
        }
      };

      fetchOrderDetails(selectedOrder.id);
    }
  }, [isDetailsDialogOpen, selectedOrder]);

  useEffect(() => {
    if (selectedOrder) {
      const validNextStatuses =
        validStatusTransitions[selectedOrder.status] || [];
      setNewStatus(
        validNextStatuses.length > 0
          ? validNextStatuses[0]
          : selectedOrder.status
      );
    }
  }, [selectedOrder]);
  return (
    <div>
      {isLoading && <Loading />}
      <Header title={"Danh sách mã giảm giá"} />

      <main className="p-6">
        <div className="mb-4">
          <div>
            {/* <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" /> */}
            <Input
              placeholder="Tìm kiếm đơn hàng..."
              className="w-full sm:w-auto"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="w-full overflow-x-auto">
          <Table className="min-w-full">
            <TableHeader>
              <TableRow>
                <TableHead className="whitespace-nowrap">Mã đơn hàng</TableHead>
                <TableHead className="whitespace-nowrap">Khách hàng</TableHead>
                <TableHead className="whitespace-nowrap">Ngày đặt</TableHead>
                <TableHead className="whitespace-nowrap">Tổng tiền</TableHead>
                <TableHead className="whitespace-nowrap">Trạng thái</TableHead>
                <TableHead className="whitespace-nowrap">Hành động</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedOrders.length > 0 ? (
                paginatedOrders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium">{order.id}</TableCell>
                    <TableCell className="whitespace-nowrap">
                      {order.nameCustomer}
                    </TableCell>
                    <TableCell className="whitespace-nowrap">
                      {formatDate(order.date)}
                    </TableCell>
                    <TableCell>{convertVND(order.total)}</TableCell>
                    <TableCell>
                      <Badge variant={getStatusBadgeVariant(order.status)}>
                        {translateStatus(order.status)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedOrder(order);
                            setIsDetailsDialogOpen(true);
                          }}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          disabled={
                            order.status === "cancelled" ||
                            order.status === "completed"
                          }
                          onClick={() => {
                            setSelectedOrder(order);
                            setIsStatusUpdateDialogOpen(true);
                          }}
                        >
                          <RefreshCw className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center">
                    Không tìm thấy đơn hàng
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        <CustomPagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />

        {/* Order Details Dialog */}
        <Dialog
          open={isDetailsDialogOpen}
          onOpenChange={setIsDetailsDialogOpen}
        >
          <DialogContent className="sm:max-w-xl w-[calc(100vw-32px)]">
            <DialogHeader className="pb-2">
              <DialogTitle>Chi tiết đơn hàng</DialogTitle>
            </DialogHeader>

            {selectedOrder && (
              <div className="space-y-3 overflow-y-auto max-h-[calc(80vh-120px)]">
                {/* Customer and Order Info - More compact layout */}
                <div className="grid grid-cols-1 gap-2 text-sm">
                  <div className="grid grid-cols-2 gap-x-2 gap-y-1">
                    <div className="col-span-2 font-bold border-b pb-1">
                      Thông tin khách hàng
                    </div>
                    <div className="font-medium">Tên:</div>
                    <div>{selectedOrder.nameCustomer}</div>
                    <div className="font-medium">Số điện thoại:</div>
                    <div>{selectedOrder.phone}</div>
                    <div className="font-medium">Địa chỉ:</div>
                    <div className="break-words">{selectedOrder.address}</div>
                  </div>

                  <div className="grid grid-cols-2 gap-x-2 gap-y-1 mt-2">
                    <div className="col-span-2 font-bold border-b pb-1">
                      Thông tin đơn hàng
                    </div>
                    <div className="font-medium">Mã đơn hàng:</div>
                    <div>{selectedOrder.id}</div>
                    <div className="font-medium">Ngày đặt:</div>
                    <div className="whitespace-nowrap">
                      {formatDate(selectedOrder.date)}
                    </div>
                    <div className="font-medium">Trạng thái:</div>
                    <div>
                      <Badge
                        variant={getStatusBadgeVariant(selectedOrder.status)}
                        className="font-normal"
                      >
                        {translateStatus(selectedOrder.status)}
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* Product Details - Compact table */}
                <div>
                  <div className="font-bold border-b pb-1 mb-1">
                    Chi tiết sản phẩm
                  </div>
                  <div className="overflow-x-auto -mx-4 px-4">
                    <Table className="min-w-[500px] text-xs sm:text-sm">
                      <TableHeader>
                        <TableRow>
                          <TableHead className="py-1.5">Mã</TableHead>
                          <TableHead className="py-1.5">Tên</TableHead>
                          <TableHead className="py-1.5">ĐVT</TableHead>
                          <TableHead className="py-1.5">SL</TableHead>
                          <TableHead className="py-1.5">Đơn giá</TableHead>
                          <TableHead className="py-1.5">Thành tiền</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {selectedOrderDetail?.items.map((item) => (
                          <TableRow key={item._id}>
                            <TableCell className="py-1.5">
                              {item?.productId?.id || "1"}
                            </TableCell>
                            <TableCell className="py-1.5 max-w-[120px] line-clamp-1">
                              {item.name}
                            </TableCell>
                            <TableCell className="py-1.5">
                              {item.unit}
                            </TableCell>
                            <TableCell className="py-1.5">
                              {item.quantity}
                            </TableCell>
                            <TableCell className="py-1.5">
                              {convertVND(item.price)}
                            </TableCell>
                            <TableCell className="py-1.5">
                              {convertVND(
                                item.price - (item.price * item.discount) / 100
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>

                {/* Notes and Summary - Compact layout */}
                <div className="grid grid-cols-1 gap-2 text-sm">
                  <div className="grid grid-cols-1 gap-1">
                    <div className="font-bold border-b pb-1">Ghi chú</div>
                    <div>{selectedOrder.note || "Không có ghi chú"}</div>
                  </div>

                  <div className="grid grid-cols-1 gap-1 mt-1">
                    <div className="font-bold border-b pb-1">
                      Tổng kết đơn hàng
                    </div>
                    <div className="grid grid-cols-2 text-sm">
                      <span className="font-medium">Tiền hàng:</span>
                      <span className="text-right">
                        {convertVND(selectedOrder.totalTemp)}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 text-sm">
                      <span className="font-medium">Phí vận chuyển:</span>
                      <span className="text-right">
                        {convertVND(selectedOrder.shippingFee)}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 text-sm">
                      <span className="font-medium">Giảm giá ưu đãi:</span>
                      <span className="text-right">
                        {selectedOrder.discountValue <= 100
                          ? selectedOrder.discountValue + "%"
                          : convertVND(selectedOrder.discountValue)}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 text-sm">
                      <span className="font-medium">Giảm giá sản phẩm:</span>
                      <span className="text-right">
                        {convertVND(selectedOrder.discountProduct)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Total */}
                <div className="text-base font-bold text-right pt-2 border-t">
                  Tổng cộng:{" "}
                  <span className="text-red-500">
                    {convertVND(selectedOrder.total)}
                  </span>
                </div>
              </div>
            )}

            <DialogFooter className="mt-2">
              <Button
                onClick={() => setIsDetailsDialogOpen(false)}
                className="w-full"
                size="sm"
              >
                Đóng
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Status Update Dialog */}
        <Dialog
          open={isStatusUpdateDialogOpen}
          onOpenChange={setIsStatusUpdateDialogOpen}
        >
          <DialogContent
            className="sm:max-w-[425px]"
            onPointerDownOutside={(e) => {
              e.preventDefault();
            }}
          >
            <DialogHeader>
              <DialogTitle>Cập nhật trạng thái đơn hàng</DialogTitle>
              <DialogDescription>
                Chọn trạng thái mới cho đơn hàng {selectedOrder?.id}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="status" className="text-right">
                  Trạng thái
                </Label>
                <Select value={newStatus} onValueChange={setNewStatus}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Chọn trạng thái" />
                  </SelectTrigger>
                  <SelectContent>
                    {selectedOrder &&
                      validStatusTransitions[selectedOrder.status]?.map(
                        (status) => (
                          <SelectItem key={status} value={status}>
                            {translateStatus(status)}
                          </SelectItem>
                        )
                      )}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    type="submit"
                    disabled={
                      validStatusTransitions[selectedOrder?.status]?.length ===
                      0
                    }
                  >
                    Cập nhật trạng thái
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Xác nhận cập nhật trạng thái
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      Bạn có chắc chắn muốn cập nhật trạng thái đơn hàng thành{" "}
                      {translateStatus(newStatus)} không?
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Hủy</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() =>
                        handleUpdateStatus(selectedOrder?.id, newStatus)
                      }
                    >
                      Xác nhận
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
}
