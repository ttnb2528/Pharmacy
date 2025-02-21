import { useContext, useEffect, useState } from "react";
import { Eye, Search, RefreshCw } from "lucide-react";
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

export default function AdminOrders() {
  // const [orders, setOrders] = useState(mockOrders);
  const { orders, setOrders } = useContext(OrderContext);
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
  const filteredOrders = orders.filter(
    (order) =>
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.nameCustomer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentOrders = filteredOrders.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

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

  useEffect(() => {
    if (isDetailsDialogOpen && selectedOrder) {
      const fetchOrderDetails = async (orderId) => {
        try {
          const res = await apiClient.get(
            `${GET_ORDER_DETAIL_ROUTE}/${orderId}`
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
      setNewStatus(selectedOrder.status);
    }
  }, [selectedOrder]);
  return (
    <div>
      {isLoading && <Loading />}
      <Header title={"Danh sách mã giảm giá"} />

      <main className="p-6">
        <div className="flex justify-between items-center mb-4">
          <div className="relative w-64">
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              type="text"
              placeholder="Tìm kiếm đơn hàng..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Mã đơn hàng</TableHead>
              <TableHead>Khách hàng</TableHead>
              <TableHead>Ngày đặt</TableHead>
              <TableHead>Tổng tiền</TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead>Hành động</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentOrders.map((order) => (
              <TableRow key={order.id}>
                <TableCell className="font-medium">{order.id}</TableCell>
                <TableCell>{order.nameCustomer}</TableCell>
                <TableCell>{formatDate(order.date)}</TableCell>
                <TableCell>{convertVND(order.total)}</TableCell>
                <TableCell>
                  <Badge variant={getStatusBadgeVariant(order.status)}>
                    {order.status}
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
                      disabled={order.status === "cancelled"}
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
            ))}
          </TableBody>
        </Table>

        <div className="flex justify-center mt-4">
          {Array.from({
            length: Math.ceil(filteredOrders.length / itemsPerPage),
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

        {/* Order Details Dialog */}
        <Dialog
          open={isDetailsDialogOpen}
          onOpenChange={setIsDetailsDialogOpen}
        >
          <DialogContent className="sm:max-w-3xl">
            <DialogHeader>
              <DialogTitle>Chi tiết đơn hàng</DialogTitle>
              <DialogDescription></DialogDescription>
            </DialogHeader>
            {selectedOrder && (
              <div className="grid gap-6">
                <div className="grid grid-cols-2 gap-20">
                  <div>
                    <Label className="font-bold">Thông tin khách hàng</Label>
                    <div className="mt-2 space-y-1">
                      <div>
                        <span className="font-medium">Tên:</span>{" "}
                        {selectedOrder.nameCustomer}
                      </div>
                      <div>
                        <span className="font-medium">Số điện thoại:</span>{" "}
                        {selectedOrder.phone}
                      </div>
                      <div>
                        <span className="font-medium">Địa chỉ:</span>{" "}
                        {selectedOrder.address}
                      </div>
                    </div>
                  </div>
                  <div>
                    <Label className="font-bold">Thông tin đơn hàng</Label>
                    <div className="mt-2 space-y-1">
                      <div>
                        <span className="font-medium">Mã đơn hàng:</span>{" "}
                        {selectedOrder.id}
                      </div>
                      <div>
                        <span className="font-medium">Ngày đặt:</span>{" "}
                        {formatDate(selectedOrder.date)}
                      </div>
                      <div>
                        <span className="font-medium">Trạng thái:</span>{" "}
                        <Badge
                          variant={getStatusBadgeVariant(selectedOrder.status)}
                        >
                          {selectedOrder.status}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
                <div>
                  <Label className="font-bold">Chi tiết sản phẩm</Label>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Mã thuốc</TableHead>
                        <TableHead>Tên</TableHead>
                        <TableHead>Đơn vị tính</TableHead>
                        <TableHead>Số lượng</TableHead>
                        <TableHead>Đơn giá</TableHead>
                        <TableHead>Thành tiền</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {selectedOrderDetail?.items.map((item) => (
                        <TableRow key={item._id}>
                          <TableCell>{item.productId.id}</TableCell>
                          <TableCell>{item.name}</TableCell>
                          <TableCell>{item.unit}</TableCell>
                          <TableCell>{item.quantity}</TableCell>
                          <TableCell>{convertVND(item.price)}</TableCell>
                          <TableCell>
                            {convertVND(
                              item.price * item.quantity - item.discount
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Ghi chú</Label>
                    <div className="font-medium">
                      {selectedOrder.note || "Không có ghi chú"}
                    </div>
                  </div>
                  <div className="text-right space-y-1">
                    <div className="grid grid-cols-2">
                      <span className="font-medium text-left">Tiền hàng:</span>{" "}
                      <span>- {convertVND(selectedOrder.totalTemp)}</span>
                    </div>
                    <div className="grid grid-cols-2">
                      <span className="font-medium text-left">
                        Phí vận chuyển:
                      </span>{" "}
                      <span>- {convertVND(selectedOrder.shippingFee)}</span>
                    </div>
                    <div className="grid grid-cols-2">
                      <span className="font-medium text-left">
                        Giảm giá ưu đãi:
                      </span>{" "}
                      <span>
                        -{" "}
                        {selectedOrder.discountValue <= 100
                          ? selectedOrder.discountValue + "%"
                          : convertVND(selectedOrder.discountValue)}
                      </span>
                    </div>
                    <div className="grid grid-cols-2">
                      <span className="font-medium text-left">
                        Giảm giá sản phẩm:
                      </span>{" "}
                      <span>- {convertVND(selectedOrder.discountProduct)}</span>
                    </div>
                  </div>
                </div>
                <div className="text-lg font-bold text-right">
                  Tổng cộng:{" "}
                  <span className="text-red-500">
                    {convertVND(selectedOrder.total)}
                  </span>
                </div>
              </div>
            )}
            <DialogFooter>
              <Button onClick={() => setIsDetailsDialogOpen(false)}>
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
          <DialogContent className="sm:max-w-[425px]">
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
                    <SelectItem value="pending">Chờ xử lý</SelectItem>
                    <SelectItem value="processing">Đang xử lý</SelectItem>
                    <SelectItem value="packaged">Đã đóng gói</SelectItem>
                    <SelectItem value="shipping">Đang giao hàng</SelectItem>
                    <SelectItem value="completed">Hoàn thành</SelectItem>
                    <SelectItem value="cancelled">Đã hủy</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button type="submit">Cập nhật trạng thái</Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Xác nhận cập nhật trạng thái
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      Bạn có chắc chắn muốn cập nhật trạng thái đơn hàng thành{" "}
                      {newStatus} không?
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
