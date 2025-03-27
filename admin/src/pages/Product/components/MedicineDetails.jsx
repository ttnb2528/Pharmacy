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
      <Label className="font-semibold text-gray-700">{label}:</Label>
      <div className="text-gray-600">{value}</div>
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
        <TabsContent value="info" className="p-6">
          <div className="space-y-4">
            <div className="grid grid-cols-2">
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

            <div className="grid grid-cols-2">
              {renderField("Tên thuốc", medicine.name)}
              {batches.length > 0
                ? renderField("Giá bán sỉ", convertVND(batches[0]?.price))
                : renderField("Giá bán sỉ", "Chưa nhập hàng")}
            </div>

            <div className="grid grid-cols-2">
              {renderField("Loại thuốc", medicine.categoryId.name)}
              {batches.length > 0
                ? renderField("Giá bán lẻ", convertVND(batches[0]?.retailPrice))
                : renderField("Giá bán lẻ", "Chưa nhập hàng")}
            </div>

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
            <div className="grid md:grid-cols-[200px_1fr] items-start gap-4 py-2">
              <Label className="font-medium text-gray-700">Hình ảnh:</Label>
              <div className="flex flex-wrap gap-10 md:gap-2">
                {medicine.images.map((image, index) => (
                  <div
                    key={index}
                    className="cursor-pointer"
                    onClick={() => handleImageClick(image)}
                  >
                    <img
                      src={image}
                      alt={"Hình ảnh thuốc"}
                      className="md:w-24 md:h-24 object-cover rounded-md border border-gray-200"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </TabsContent>
        <TabsContent value="history" className="p-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Số lô</TableHead>
                <TableHead>Ngày nhập</TableHead>
                <TableHead>Ngày sản xuất</TableHead>
                <TableHead>Hạn sử dụng</TableHead>
                <TableHead>Số lượng</TableHead>
                <TableHead>Giá nhập</TableHead>
                <TableHead>Giá bán</TableHead>
                <TableHead>Nhà cung cấp</TableHead>
                <TableHead>Nhà sản xuất</TableHead>
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
                  <TableCell>{batch.batchNumber}</TableCell>
                  <TableCell>{formatDate(batch.dateOfEntry)}</TableCell>
                  <TableCell>{formatDate(batch.dateOfManufacture)}</TableCell>
                  <TableCell>{formatDate(batch.expiryDate)}</TableCell>
                  <TableCell>{batch.quantity}</TableCell>
                  <TableCell>{convertVND(batch.price)}</TableCell>
                  <TableCell>{convertVND(batch.retailPrice)}</TableCell>
                  <TableCell>{batch.SupplierId.name}</TableCell>
                  <TableCell>{batch.ManufactureId.name}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
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
