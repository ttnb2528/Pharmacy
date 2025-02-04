"use client";

import { useContext, useState } from "react";
import {
  Plus,
  Search,
  Eye,
  Edit,
  Trash2,
  Calendar,
  Percent,
  DollarSign,
  ShoppingBag,
  Users,
} from "lucide-react";
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
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SidebarTrigger } from "@/components/ui/sidebar";

import { CouponContext } from "@/context/CouponContext.context.jsx";
import { convertVND } from "@/utils/convertVND.js";
import { apiClient } from "@/lib/api-admin.js";
import {
  ADD_COUPON_ROUTE,
  DELETE_COUPON_ROUTE,
  UPDATE_COUPON_ROUTE,
} from "@/API/index.api.js";
import { toast } from "sonner";
import Loading from "../component/Loading.jsx";

const AdminCoupon = () => {
  const { coupons, setCoupons } = useContext(CouponContext);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [selectedCoupon, setSelectedCoupon] = useState(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [newCoupon, setNewCoupon] = useState({
    coupon_code: "",
    description: "",
    discount_type: "percentage",
    discount_value: "",
    minimum_order_value: "",
    quantity: "",
    maximum_uses: "",
    start_date: "",
    end_date: "",
  });

  // Filter coupons based on search term
  const filteredCoupons = coupons.filter(
    (coupon) =>
      coupon.coupon_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      coupon.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentCoupons = filteredCoupons.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Add new coupon
  const handleAddCoupon = async () => {
    try {
      setIsLoading(true);
      const upcasedCouponCode = newCoupon.coupon_code.toUpperCase();

      // Thay newCoupon2 bằng newCoupon
      const data = {
        ...newCoupon,
        coupon_code: upcasedCouponCode,
      };

      const res = await apiClient.post(ADD_COUPON_ROUTE, data);
      if (res.status === 200 && res.data.status === 201) {
        setCoupons([...coupons, res.data.data]);
        setIsAddDialogOpen(false);
        setNewCoupon({
          coupon_code: "",
          description: "",
          discount_type: "percentage",
          discount_value: "",
          minimum_order_value: "",
          quantity: "",
          maximum_uses: "",
          start_date: "",
          end_date: "",
        });
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
  const handleEditCoupon = async () => {
    try {
      setIsLoading(true);
      const res = await apiClient.put(
        `${UPDATE_COUPON_ROUTE}/${selectedCoupon._id}`,
        selectedCoupon
      );

      if (res.status === 200 && res.data.status === 200) {
        setCoupons(
          coupons.map((c) =>
            c._id === selectedCoupon._id ? selectedCoupon : c
          )
        );
        setIsEditDialogOpen(false);
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

  // Delete coupon
  const handleDeleteCoupon = async () => {
    try {
      setIsLoading(true);
      const res = await apiClient.delete(
        `${DELETE_COUPON_ROUTE}/${selectedCoupon._id}`
      );

      if (res.status === 200 && res.data.status === 200) {
        setCoupons(coupons.filter((c) => c._id !== selectedCoupon._id));
        setIsDeleteDialogOpen(false);
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

  // Format date
  const formatDate = (date) => {
    return date ? new Date(date).toLocaleDateString("vi-VN") : "N/A";
  };

  return (
    <div>
      {isLoading && <Loading />}
      <header className="flex items-center justify-between p-4 border-b">
        <SidebarTrigger />
        <h1 className="text-2xl font-bold">Danh sách Mã giảm giá</h1>
        <Button>Đăng xuất</Button>
      </header>
      <main className="p-6">
        <div className="flex justify-between items-center mb-4">
          <div className="relative w-64">
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              type="text"
              placeholder="Tìm kiếm mã giảm giá..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" /> Thêm mã giảm giá
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-3xl">
              <DialogHeader>
                <DialogTitle>Thêm mã giảm giá mới</DialogTitle>
                <DialogDescription>
                  Nhập thông tin cho mã giảm giá mới.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="coupon_code" className="text-right">
                    Mã giảm giá
                  </Label>
                  <Input
                    id="coupon_code"
                    value={newCoupon.coupon_code}
                    onChange={(e) =>
                      setNewCoupon({
                        ...newCoupon,
                        coupon_code: e.target.value,
                      })
                    }
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="description" className="text-right">
                    Mô tả
                  </Label>
                  <Input
                    id="description"
                    value={newCoupon.description}
                    onChange={(e) =>
                      setNewCoupon({
                        ...newCoupon,
                        description: e.target.value,
                      })
                    }
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="discount_type" className="text-right">
                    Loại giảm giá
                  </Label>
                  <Select
                    value={newCoupon.discount_type}
                    onValueChange={(value) =>
                      setNewCoupon({ ...newCoupon, discount_type: value })
                    }
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Chọn loại giảm giá" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="percentage">Phần trăm</SelectItem>
                      <SelectItem value="fixed_amount">
                        Số tiền cố định
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="discount_value" className="text-right">
                    Giá trị giảm
                  </Label>
                  <Input
                    id="discount_value"
                    type="number"
                    value={newCoupon.discount_value}
                    onChange={(e) =>
                      setNewCoupon({
                        ...newCoupon,
                        discount_value: Number.parseFloat(e.target.value),
                      })
                    }
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="minimum_order_value" className="text-right">
                    Giá trị đơn hàng tối thiểu
                  </Label>
                  <Input
                    id="minimum_order_value"
                    type="number"
                    value={newCoupon.minimum_order_value}
                    onChange={(e) =>
                      setNewCoupon({
                        ...newCoupon,
                        minimum_order_value: Number.parseFloat(e.target.value),
                      })
                    }
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="quantity" className="text-right">
                    Số lượng
                  </Label>
                  <Input
                    id="quantity"
                    type="number"
                    value={newCoupon.quantity}
                    onChange={(e) =>
                      setNewCoupon({
                        ...newCoupon,
                        quantity: Number.parseInt(e.target.value),
                      })
                    }
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="maximum_uses" className="text-right">
                    Số lần sử dụng tối đa
                  </Label>
                  <Input
                    id="maximum_uses"
                    type="number"
                    value={newCoupon.maximum_uses}
                    onChange={(e) =>
                      setNewCoupon({
                        ...newCoupon,
                        maximum_uses: Number.parseInt(e.target.value),
                      })
                    }
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="start_date" className="text-right">
                    Ngày bắt đầu
                  </Label>
                  <Input
                    id="start_date"
                    type="date"
                    value={newCoupon.start_date}
                    onChange={(e) =>
                      setNewCoupon({ ...newCoupon, start_date: e.target.value })
                    }
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="end_date" className="text-right">
                    Ngày kết thúc
                  </Label>
                  <Input
                    id="end_date"
                    type="date"
                    value={newCoupon.end_date}
                    onChange={(e) =>
                      setNewCoupon({ ...newCoupon, end_date: e.target.value })
                    }
                    className="col-span-3"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" onClick={handleAddCoupon}>
                  Thêm mã giảm giá
                </Button>
              </DialogFooter>
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
            {currentCoupons.map((coupon) => (
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
                          onClick={() => setSelectedCoupon(coupon)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                          <DialogTitle className="text-2xl font-bold">
                            Chi tiết mã giảm giá
                          </DialogTitle>
                        </DialogHeader>
                        <div className="mt-4">
                          <Card>
                            <CardHeader className="bg-primary/5">
                              <CardTitle className="text-lg font-semibold flex items-center justify-between">
                                {selectedCoupon?.coupon_code}
                                <Badge variant="outline">
                                  ID: {selectedCoupon?.id}
                                </Badge>
                              </CardTitle>
                            </CardHeader>
                            <CardContent className="pt-4">
                              <div className="space-y-4">
                                <div className="flex items-center">
                                  <Percent className="h-4 w-4 mr-2 text-muted-foreground" />
                                  <div>
                                    <h4 className="text-sm font-medium text-muted-foreground">
                                      Loại giảm giá
                                    </h4>
                                    <p className="text-sm mt-1">
                                      {selectedCoupon?.discount_type ===
                                      "percentage"
                                        ? "Phần trăm"
                                        : "Số tiền cố định"}
                                    </p>
                                  </div>
                                </div>
                                <div className="flex items-center">
                                  <DollarSign className="h-4 w-4 mr-2 text-muted-foreground" />
                                  <div>
                                    <h4 className="text-sm font-medium text-muted-foreground">
                                      Giá trị giảm
                                    </h4>
                                    <p className="text-sm mt-1">
                                      {coupon.discount_type === "percentage"
                                        ? coupon.discount_value + "%"
                                        : convertVND(coupon.discount_value)}
                                    </p>
                                  </div>
                                </div>
                                <div className="flex items-center">
                                  <ShoppingBag className="h-4 w-4 mr-2 text-muted-foreground" />
                                  <div>
                                    <h4 className="text-sm font-medium text-muted-foreground">
                                      Giá trị đơn hàng tối thiểu
                                    </h4>
                                    <p className="text-sm mt-1">
                                      {convertVND(
                                        selectedCoupon?.minimum_order_value
                                      )}
                                    </p>
                                  </div>
                                </div>
                                <div className="flex items-center">
                                  <Users className="h-4 w-4 mr-2 text-muted-foreground" />
                                  <div>
                                    <h4 className="text-sm font-medium text-muted-foreground">
                                      Số lượng / Số lần sử dụng tối đa
                                    </h4>
                                    <p className="text-sm mt-1">
                                      {selectedCoupon?.quantity ||
                                        "Không giới hạn"}{" "}
                                      /{" "}
                                      {selectedCoupon?.maximum_uses ||
                                        "Không giới hạn"}
                                    </p>
                                  </div>
                                </div>
                                <div className="flex items-center">
                                  <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                                  <div>
                                    <h4 className="text-sm font-medium text-muted-foreground">
                                      Thời gian hiệu lực
                                    </h4>
                                    <p className="text-sm mt-1">
                                      {formatDate(selectedCoupon?.start_date)} -{" "}
                                      {formatDate(selectedCoupon?.end_date)}
                                    </p>
                                  </div>
                                </div>
                                <div>
                                  <h4 className="text-sm font-medium text-muted-foreground">
                                    Trạng thái
                                  </h4>
                                  <Badge
                                    variant={
                                      selectedCoupon?.status === "active"
                                        ? "success"
                                        : selectedCoupon?.status === "inactive"
                                        ? "secondary"
                                        : "destructive"
                                    }
                                    className="mt-1"
                                  >
                                    {selectedCoupon?.status === "active"
                                      ? "Hoạt động"
                                      : selectedCoupon?.status === "inactive"
                                      ? "Không hoạt động"
                                      : "Hết hạn"}
                                  </Badge>
                                </div>
                                <div>
                                  <h4 className="text-sm font-medium text-muted-foreground">
                                    Mô tả
                                  </h4>
                                  <p className="text-sm mt-1">
                                    {selectedCoupon?.description}
                                  </p>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </div>
                      </DialogContent>
                    </Dialog>

                    <Dialog
                      open={isEditDialogOpen}
                      onOpenChange={setIsEditDialogOpen}
                    >
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedCoupon(coupon);
                            setIsEditDialogOpen(true);
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>Sửa thông tin mã giảm giá</DialogTitle>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label
                              htmlFor="edit-coupon_code"
                              className="text-right"
                            >
                              Mã giảm giá
                            </Label>
                            <Input
                              id="edit-coupon_code"
                              value={selectedCoupon?.coupon_code || ""}
                              onChange={(e) =>
                                setSelectedCoupon({
                                  ...selectedCoupon,
                                  coupon_code: e.target.value,
                                })
                              }
                              className="col-span-3"
                            />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label
                              htmlFor="edit-description"
                              className="text-right"
                            >
                              Mô tả
                            </Label>
                            <Input
                              id="edit-description"
                              value={selectedCoupon?.description || ""}
                              onChange={(e) =>
                                setSelectedCoupon({
                                  ...selectedCoupon,
                                  description: e.target.value,
                                })
                              }
                              className="col-span-3"
                            />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label
                              htmlFor="edit-discount_type"
                              className="text-right"
                            >
                              Loại giảm giá
                            </Label>
                            <Select
                              value={selectedCoupon?.discount_type}
                              onValueChange={(value) =>
                                setSelectedCoupon({
                                  ...selectedCoupon,
                                  discount_type: value,
                                })
                              }
                            >
                              <SelectTrigger className="col-span-3">
                                <SelectValue placeholder="Chọn loại giảm giá" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="percentage">
                                  Phần trăm
                                </SelectItem>
                                <SelectItem value="fixed_amount">
                                  Số tiền cố định
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label
                              htmlFor="edit-discount_value"
                              className="text-right"
                            >
                              Giá trị giảm
                            </Label>
                            <Input
                              id="edit-discount_value"
                              type="number"
                              value={selectedCoupon?.discount_value || 0}
                              onChange={(e) =>
                                setSelectedCoupon({
                                  ...selectedCoupon,
                                  discount_value: Number.parseFloat(
                                    e.target.value
                                  ),
                                })
                              }
                              className="col-span-3"
                            />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label
                              htmlFor="edit-minimum_order_value"
                              className="text-right"
                            >
                              Giá trị đơn hàng tối thiểu
                            </Label>
                            <Input
                              id="edit-minimum_order_value"
                              type="number"
                              value={selectedCoupon?.minimum_order_value || 0}
                              onChange={(e) =>
                                setSelectedCoupon({
                                  ...selectedCoupon,
                                  minimum_order_value: Number.parseFloat(
                                    e.target.value
                                  ),
                                })
                              }
                              className="col-span-3"
                            />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label
                              htmlFor="edit-quantity"
                              className="text-right"
                            >
                              Số lượng
                            </Label>
                            <Input
                              id="edit-quantity"
                              type="number"
                              value={selectedCoupon?.quantity || ""}
                              onChange={(e) =>
                                setSelectedCoupon({
                                  ...selectedCoupon,
                                  quantity: Number.parseInt(e.target.value),
                                })
                              }
                              className="col-span-3"
                            />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label
                              htmlFor="edit-maximum_uses"
                              className="text-right"
                            >
                              Số lần sử dụng tối đa
                            </Label>
                            <Input
                              id="edit-maximum_uses"
                              type="number"
                              value={selectedCoupon?.maximum_uses || ""}
                              onChange={(e) =>
                                setSelectedCoupon({
                                  ...selectedCoupon,
                                  maximum_uses: Number.parseInt(e.target.value),
                                })
                              }
                              className="col-span-3"
                            />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label
                              htmlFor="edit-start_date"
                              className="text-right"
                            >
                              Ngày bắt đầu
                            </Label>
                            <Input
                              id="edit-start_date"
                              type="date"
                              value={
                                selectedCoupon?.start_date
                                  ? new Date(selectedCoupon.start_date)
                                      .toISOString()
                                      .split("T")[0]
                                  : ""
                              }
                              onChange={(e) =>
                                setSelectedCoupon({
                                  ...selectedCoupon,
                                  start_date: e.target.value,
                                })
                              }
                              className="col-span-3"
                            />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label
                              htmlFor="edit-end_date"
                              className="text-right"
                            >
                              Ngày kết thúc
                            </Label>
                            <Input
                              id="edit-end_date"
                              type="date"
                              value={
                                selectedCoupon?.end_date
                                  ? new Date(selectedCoupon.end_date)
                                      .toISOString()
                                      .split("T")[0]
                                  : ""
                              }
                              onChange={(e) =>
                                setSelectedCoupon({
                                  ...selectedCoupon,
                                  end_date: e.target.value,
                                })
                              }
                              className="col-span-3"
                            />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="edit-status" className="text-right">
                              Trạng thái
                            </Label>
                            <Select
                              value={selectedCoupon?.status}
                              onValueChange={(value) =>
                                setSelectedCoupon({
                                  ...selectedCoupon,
                                  status: value,
                                })
                              }
                            >
                              <SelectTrigger className="col-span-3">
                                <SelectValue placeholder="Chọn trạng thái" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="active">
                                  Hoạt động
                                </SelectItem>
                                <SelectItem value="inactive">
                                  Không hoạt động
                                </SelectItem>
                                <SelectItem value="expired">Hết hạn</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        <DialogFooter>
                          <Button type="submit" onClick={handleEditCoupon}>
                            Lưu thay đổi
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedCoupon(coupon);
                        setIsDeleteDialogOpen(true);
                      }}
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
            length: Math.ceil(filteredCoupons.length / itemsPerPage),
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

        {/* Delete Dialog */}
        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Xóa mã giảm giá</DialogTitle>
              <DialogDescription>
                Bạn có chắc chắn muốn xóa mã giảm giá này không?
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="destructive" onClick={handleDeleteCoupon}>
                Xóa
              </Button>
              <Button
                variant="outline"
                onClick={() => setIsDeleteDialogOpen(false)}
              >
                Hủy
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
};

export default AdminCoupon;
