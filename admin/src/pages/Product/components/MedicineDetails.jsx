import { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  GET_ALL_BATCHES_FOR_MEDICINE_ROUTE,
  UPDATE_BATCH_PARTIAL_ROUTE,
} from "@/API/index.api.js";
import { apiClient } from "@/lib/api-admin.js";
import { convertVND } from "@/utils/convertVND.js";
import { formatDate } from "@/utils/formatDate.js";
import { Check, X, Edit2, AlertCircle } from "lucide-react";
import ImagePreview from "./ImageReview.jsx";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useAppStore } from "@/store";

const MedicineDetails = ({ medicine }) => {
  const [activeTab, setActiveTab] = useState("info");
  const [batches, setBatches] = useState([]);
  const [previewImage, setPreviewImage] = useState(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [editingBatch, setEditingBatch] = useState(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const { userInfo } = useAppStore();
  const [formData, setFormData] = useState({
    quantity: 0,
    price: 0,
    retailPrice: 0,
  });

  useEffect(() => {
    const renderBatchesHistory = async (medicine) => {
      try {
        const res = await apiClient.get(
          `${GET_ALL_BATCHES_FOR_MEDICINE_ROUTE}/${medicine._id}`
        );
        console.log(res);

        if (res.status === 200 && res.data.status === 200) {
          setBatches(res.data.data);
        } else {
          console.log(res.data.message);
        }
      } catch (error) {
        console.log(error);
      }
    };

    renderBatchesHistory(medicine);
  }, [medicine]);

  const renderField = (label, value) => (
    <div className="grid grid-cols-[auto_1fr] items-center gap-2">
      <Label className="font-semibold text-gray-700 whitespace-nowrap">
        {label}:
      </Label>
      <div className="text-gray-600 break-words">{value}</div>
    </div>
  );

  const handleImageClick = (image) => {
    setPreviewImage(image);
    setIsPreviewOpen(true);
  };

  const handleClosePreview = () => {
    setIsPreviewOpen(false);
    setTimeout(() => {
      setPreviewImage(null);
    }, 200);
  };

  const handleEditBatch = (batch) => {
    setEditingBatch(batch);
    setFormData({
      quantity: batch.quantity,
      price: batch.price,
      retailPrice: batch.retailPrice,
    });
    setIsEditDialogOpen(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmitEdit = async (e) => {
    e.preventDefault();

    if (!editingBatch) return;

    if (
      formData.quantity <= 0 ||
      formData.price <= 0 ||
      formData.retailPrice <= 0
    ) {
      toast.error("Số lượng và giá phải lớn hơn 0");
      return;
    }

    setIsUpdating(true);

    try {
      const updateData = {
        quantity: Number(formData.quantity),
        price: Number(formData.price),
        retailPrice: Number(formData.retailPrice),
        updatedBy: {
          userId: userInfo._id,
          name: userInfo.name,
          timestamp: new Date(),
        },
      };

      const res = await apiClient.put(
        `${UPDATE_BATCH_PARTIAL_ROUTE}/${editingBatch._id}`,
        updateData
      );

      if (res.status === 200 && res.data.status === 200) {
        toast.success("Cập nhật lô thuốc thành công");

        setBatches((prev) =>
          prev.map((batch) =>
            batch._id === editingBatch._id ? res.data.data : batch
          )
        );

        setIsEditDialogOpen(false);
      } else {
        toast.error(res.data.message || "Có lỗi xảy ra");
      }
    } catch (error) {
      console.error("Error updating batch:", error);
      toast.error("Có lỗi xảy ra khi cập nhật lô thuốc");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <>
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="w-full max-h-[calc(100vh-120px)] h-fit overflow-y-auto bg-white rounded-lg shadow-sm"
      >
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="info">Thông tin thuốc</TabsTrigger>
          <TabsTrigger value="history">Lịch sử nhập</TabsTrigger>
        </TabsList>
        <TabsContent value="info" className="p-4 sm:p-6">
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {renderField("Mã thuốc", medicine.id)}
              {renderField(
                "Kê đơn",
                medicine.isRx ? (
                  <Check className="text-green-500" />
                ) : (
                  <X className="text-red-500" />
                )
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {renderField("Tên thuốc", medicine.name)}
              {batches.length > 0
                ? renderField("Giá bán sỉ", convertVND(batches[0]?.price))
                : renderField("Giá bán sỉ", "Chưa nhập hàng")}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {renderField("Loại thuốc", medicine.categoryId.name)}
              {batches.length > 0
                ? renderField("Giá bán lẻ", convertVND(batches[0]?.retailPrice))
                : renderField("Giá bán lẻ", "Chưa nhập hàng")}
            </div>

            <div className="space-y-4">
              {renderField(
                "Liều lượng",
                `${medicine.dosage} ${medicine.unit}/lần uống`
              )}
              {renderField("Công dụng", medicine.uses)}
              {renderField("Đơn vị tính", medicine.unit)}
              {renderField("Quy cách đóng gói", medicine.packaging)}
              {renderField("Tác dụng phụ", medicine.effect)}
              {renderField("Hướng dẫn sử dụng", medicine.instruction)}
              {renderField("Mô tả", medicine.description)}
              {renderField(
                "Giảm giá",
                medicine.isDiscount ? (
                  <Check className="text-green-500" />
                ) : (
                  <X className="text-red-500" />
                )
              )}
              {medicine.isDiscount &&
                renderField(
                  "Phần trăm giảm giá",
                  `${medicine.discountPercentage}%`
                )}
              {renderField("Thương hiệu", medicine.brandId.name)}
            </div>

            <div className="grid grid-cols-1 items-start gap-2 py-2">
              <Label className="font-medium text-gray-700 mb-2">
                Hình ảnh:
              </Label>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {medicine.images.map((image, index) => (
                  <div
                    key={index}
                    className="cursor-pointer aspect-square"
                    onClick={() => handleImageClick(image)}
                  >
                    <img
                      src={image || "/placeholder.svg"}
                      alt={"Hình ảnh thuốc"}
                      className="w-full h-full object-cover rounded-md border border-gray-200"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </TabsContent>
        <TabsContent value="history" className="p-2 sm:p-6">
          <div className="overflow-x-auto -mx-2 px-2">
            <Table className="min-w-[800px]">
              <TableHeader>
                <TableRow>
                  <TableHead className="whitespace-nowrap">Số lô</TableHead>
                  <TableHead className="whitespace-nowrap">Ngày nhập</TableHead>
                  <TableHead className="whitespace-nowrap">Ngày SX</TableHead>
                  <TableHead className="whitespace-nowrap">Hạn SD</TableHead>
                  <TableHead className="whitespace-nowrap">SL</TableHead>
                  <TableHead className="whitespace-nowrap">Giá nhập</TableHead>
                  <TableHead className="whitespace-nowrap">Giá bán</TableHead>
                  <TableHead className="whitespace-nowrap">
                    Nhà cung cấp
                  </TableHead>
                  <TableHead className="whitespace-nowrap">Nhà SX</TableHead>
                  <TableHead className="whitespace-nowrap text-right">
                    Thao tác
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {batches.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={10} className="text-center">
                      Chưa có lịch sử nhập hàng cho thuốc này
                    </TableCell>
                  </TableRow>
                )}
                {batches.map((batch) => (
                  <TableRow key={batch._id}>
                    <TableCell className="whitespace-nowrap">
                      {batch.batchNumber}
                    </TableCell>
                    <TableCell className="whitespace-nowrap">
                      {formatDate(batch.dateOfEntry)}
                    </TableCell>
                    <TableCell className="whitespace-nowrap">
                      {formatDate(batch.dateOfManufacture)}
                    </TableCell>
                    <TableCell className="whitespace-nowrap">
                      {formatDate(batch.expiryDate)}
                    </TableCell>
                    <TableCell className="whitespace-nowrap">
                      <div className="flex items-center">
                        {batch.quantity}
                        {batch.updatedBy && (
                          <Tooltip>
                            <TooltipTrigger>
                              <AlertCircle className="h-3 w-3 text-yellow-500 ml-1 cursor-help" />
                            </TooltipTrigger>
                            <TooltipContent>
                              Đã chỉnh sửa bởi {batch.updatedBy.name} lúc{" "}
                              {new Date(
                                batch.updatedBy.timestamp
                              ).toLocaleString()}
                            </TooltipContent>
                          </Tooltip>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="whitespace-nowrap">
                      {convertVND(batch.price)}
                    </TableCell>
                    <TableCell className="whitespace-nowrap">
                      {convertVND(batch.retailPrice)}
                    </TableCell>
                    <TableCell className="whitespace-nowrap">
                      {batch.SupplierId.name}
                    </TableCell>
                    <TableCell className="whitespace-nowrap">
                      {batch.ManufactureId.name}
                    </TableCell>
                    <TableCell className="whitespace-nowrap text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEditBatch(batch)}
                      >
                        <Edit2 className="h-4 w-4" />
                        <span className="sr-only">Sửa</span>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="mt-6 block sm:hidden">
            <h3 className="font-medium text-gray-800 mb-3">Tóm tắt lô hàng:</h3>
            <div className="space-y-4">
              {batches.length === 0 ? (
                <p className="text-gray-500">Chưa có lịch sử nhập hàng</p>
              ) : (
                batches.map((batch) => (
                  <div
                    key={batch._id}
                    className="border rounded-md p-3 space-y-2"
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Số lô:</span>
                      <div className="flex items-center gap-2">
                        <span>{batch.batchNumber}</span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() => handleEditBatch(batch)}
                        >
                          <Edit2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Ngày nhập:</span>
                      <span>{formatDate(batch.dateOfEntry)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Hạn SD:</span>
                      <span>{formatDate(batch.expiryDate)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Số lượng:</span>
                      <div className="flex items-center">
                        <span>{batch.quantity}</span>
                        {batch.updatedBy && (
                          <AlertCircle className="h-3 w-3 text-yellow-500 ml-1" />
                        )}
                      </div>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Giá nhập:</span>
                      <span>{convertVND(batch.price)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Giá bán lẻ:</span>
                      <span>{convertVND(batch.retailPrice)}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </TabsContent>
      </Tabs>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Chỉnh sửa thông tin lô thuốc</DialogTitle>
            <DialogDescription>
              Chỉ có thể chỉnh sửa số lượng và giá. Các thông tin như số lô,
              ngày sản xuất, hạn sử dụng không được phép thay đổi.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmitEdit} className="space-y-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="quantity">Số lượng</Label>
                <Input
                  id="quantity"
                  name="quantity"
                  type="number"
                  value={formData.quantity}
                  onChange={handleInputChange}
                  min="0"
                  required
                />
                {editingBatch && editingBatch.initialQuantity && (
                  <p className="text-sm text-muted-foreground">
                    Số lượng ban đầu: {editingBatch.initialQuantity}, Số lượng
                    đã bán:{" "}
                    {editingBatch.initialQuantity - editingBatch.quantity}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="price">Giá nhập</Label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  value={formData.price}
                  onChange={handleInputChange}
                  min="0"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="retailPrice">Giá bán lẻ</Label>
                <Input
                  id="retailPrice"
                  name="retailPrice"
                  type="number"
                  value={formData.retailPrice}
                  onChange={handleInputChange}
                  min="0"
                  required
                />
              </div>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsEditDialogOpen(false)}
                disabled={isUpdating}
              >
                Hủy
              </Button>
              <Button type="submit" disabled={isUpdating}>
                {isUpdating ? "Đang cập nhật..." : "Cập nhật"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <ImagePreview
        imageUrl={previewImage}
        isOpen={isPreviewOpen}
        onClose={handleClosePreview}
      />
    </>
  );
};

export default MedicineDetails;
