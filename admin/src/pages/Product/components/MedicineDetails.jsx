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
import { GET_ALL_BATCHES_FOR_MEDICINE_ROUTE } from "@/API/index.api.js";
import { apiClient } from "@/lib/api-admin.js";
import { convertVND } from "@/utils/convertVND.js";
import { formatDate } from "@/utils/formatDate.js";
import { Check, X } from "lucide-react";
import ImagePreview from "./ImageReview.jsx";

const MedicineDetails = ({ medicine }) => {
  const [activeTab, setActiveTab] = useState("info");
  const [batches, setBatches] = useState([]);
  const [previewImage, setPreviewImage] = useState(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  useEffect(() => {
    const renderBatchesHistory = async (medicine) => {
      try {
        const res = await apiClient.get(
          `${GET_ALL_BATCHES_FOR_MEDICINE_ROUTE}/${medicine._id}`
        );

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
    }, 200); // Đợi animation đóng dialog kết thúc
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
            {/* Responsive grid - 1 column on mobile, 2 on tablet/desktop */}
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

            {/* Single column fields */}
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

            {/* Responsive image gallery */}
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
                </TableRow>
              </TableHeader>
              <TableBody>
                {batches.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center">
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
                      {batch.quantity}
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
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Mobile-friendly batch summary for quick reference */}
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
                    <div className="flex justify-between">
                      <span className="font-medium">Số lô:</span>
                      <span>{batch.batchNumber}</span>
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
                      <span>{batch.quantity}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Giá bán sỉ:</span>
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

      <ImagePreview
        imageUrl={previewImage}
        isOpen={isPreviewOpen}
        onClose={handleClosePreview}
      />
    </>
  );
};

export default MedicineDetails;
