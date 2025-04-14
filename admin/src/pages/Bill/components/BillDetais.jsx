import { Card, CardContent} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { convertVND } from "@/utils/convertVND.js";
import { Check, X, ArrowDownLeft, ShoppingBag } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const BillDetails = ({ bill }) => {
  const tax = bill.total * 0.05;
  const totalAfterTax = bill.total + tax;

  // Xác định loại hóa đơn và tạo hiển thị tương ứng
  const getBillTypeBadge = () => {
    if (bill.type === "return") {
      return (
        <Badge variant="destructive" className="flex items-center gap-1">
          <ArrowDownLeft className="h-3 w-3" />
          Hoàn trả
        </Badge>
      );
    }
    return (
      <Badge variant="default" className="bg-green-500 flex items-center gap-1">
        <ShoppingBag className="h-3 w-3" />
        Bán hàng
      </Badge>
    );
  };

  return (
    <div className="space-y-4">
      {/* Customer Information with Bill Type */}
      <div className="space-y-2">
        <span className="italic text-gray-500 text-sm">Thông tin cá nhân</span>
        <Card>
          <CardContent className="pt-6 relative">
            {/* Add bill type badge in top-right corner */}
            <div className="absolute top-2 right-2">{getBillTypeBadge()}</div>

            <p>
              <strong>Tên khách hàng:</strong>{" "}
              {bill.customer.name ?? "Khách vãng lai"}
            </p>
            <p>
              <strong>Số điện thoại:</strong>{" "}
              {bill.customer.phone ?? "Không có"}
            </p>
            {bill.type === "return" && bill.reason && (
              <p className="mt-2">
                <strong>Lý do hoàn trả:</strong>{" "}
                <span className="text-red-500">{bill.reason}</span>
              </p>
            )}
            {bill.type === "return" && bill.originalBillId && (
              <p>
                <strong>Hóa đơn gốc:</strong> #{bill.originalBillId}
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Product Details - Make table responsive */}
      <div className="space-y-2">
        <span className="italic text-gray-500 text-sm">Chi tiết sản phẩm</span>
        <Card>
          <CardContent className="p-0 sm:p-6">
            {/* Desktop Table - Hidden on mobile */}
            <div className="hidden sm:block">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Mã thuốc</TableHead>
                    <TableHead>Tên</TableHead>
                    <TableHead>Đơn vị</TableHead>
                    <TableHead>Thuốc kê đơn</TableHead>
                    <TableHead>Số lượng</TableHead>
                    <TableHead>Đơn giá</TableHead>
                    <TableHead>Thành tiền</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {bill.medicines.map((medicine) => (
                    <TableRow key={medicine.medicineId}>
                      <TableCell>{medicine.id}</TableCell>
                      <TableCell className="line-clamp-1">
                        {medicine.name}
                      </TableCell>
                      <TableCell>{medicine.unit}</TableCell>
                      <TableCell>
                        {medicine.isRx ? (
                          <Check className="text-green-500" />
                        ) : (
                          <X className="text-red-500" />
                        )}
                      </TableCell>
                      <TableCell>{medicine.quantity}</TableCell>
                      <TableCell>{convertVND(medicine.price)}</TableCell>
                      <TableCell>
                        {convertVND(medicine.quantity * medicine.price)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Mobile Card Layout - Visible only on mobile */}
            <div className="block sm:hidden">
              <div className="divide-y">
                {bill.medicines.map((medicine) => (
                  <div key={medicine.medicineId} className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div className="font-medium">{medicine.name}</div>
                      <div className="text-right text-sm text-gray-500">
                        Mã: {medicine.id}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-y-1 text-sm">
                      <div className="text-gray-500">Đơn vị:</div>
                      <div className="text-right">{medicine.unit}</div>

                      <div className="text-gray-500">Thuốc kê đơn:</div>
                      <div className="text-right">
                        {medicine.isRx ? (
                          <Check className="ml-auto text-green-500 h-4 w-4" />
                        ) : (
                          <X className="ml-auto text-red-500 h-4 w-4" />
                        )}
                      </div>

                      <div className="text-gray-500">Số lượng:</div>
                      <div className="text-right">{medicine.quantity}</div>

                      <div className="text-gray-500">Đơn giá:</div>
                      <div className="text-right">
                        {convertVND(medicine.price)}
                      </div>

                      <div className="text-gray-500 font-medium">
                        Thành tiền:
                      </div>
                      <div className="text-right font-medium">
                        {convertVND(medicine.quantity * medicine.price)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Summary Information - Make grid responsive */}
      <Card>
        <CardContent className="py-4">
          {/* Desktop Layout - Hidden on mobile */}
          <div className="hidden sm:grid sm:grid-cols-3 gap-2 my-2">
            {/* Add bill type in desktop layout */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500 font-semibold">
                Loại hóa đơn:
              </span>
              {getBillTypeBadge()}
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500 font-semibold">
                Tổng tiền trước thuế:
              </span>
              <span className="font-semibold text-blue-600">
                {convertVND(bill.total)}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500 font-semibold">
                Thuế (5%):
              </span>
              <span className="font-semibold text-green-600">
                {convertVND(tax)}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500 font-semibold">
                Tổng tiền sau thuế:
              </span>
              <span className="font-bold text-red-600">
                {convertVND(totalAfterTax)}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500 font-semibold">
                Nhân viên bán hàng:{" "}
              </span>
              <span className="font-semibold">{bill.staff.name}</span>
            </div>
            <div className="flex items-center col-span-2 gap-2">
              <p className="text-sm text-gray-500 font-semibold">
                Ngày lập hóa đơn:{" "}
              </p>
              <p className="font-semibold">
                {new Date(bill.createdAt).toLocaleString()}
              </p>
            </div>
          </div>

          {/* Mobile Layout - Visible only on mobile */}
          <div className="grid sm:hidden grid-cols-1 gap-2">
            {/* Add bill type in mobile layout */}
            <div className="grid grid-cols-2 items-center">
              <span className="text-sm text-gray-500 font-semibold">
                Loại hóa đơn:
              </span>
              <span className="text-right">{getBillTypeBadge()}</span>
            </div>
            <div className="grid grid-cols-2 items-center">
              <span className="text-sm text-gray-500 font-semibold">
                Tổng tiền trước thuế:
              </span>
              <span className="font-semibold text-blue-600 text-right">
                {convertVND(bill.total)}
              </span>
            </div>
            <div className="grid grid-cols-2 items-center">
              <span className="text-sm text-gray-500 font-semibold">
                Thuế (5%):
              </span>
              <span className="font-semibold text-green-600 text-right">
                {convertVND(tax)}
              </span>
            </div>
            <div className="grid grid-cols-2 items-center border-t border-gray-200 pt-1 mt-1">
              <span className="text-sm text-gray-500 font-semibold">
                Tổng tiền sau thuế:
              </span>
              <span className="font-bold text-red-600 text-right">
                {convertVND(totalAfterTax)}
              </span>
            </div>
            <div className="grid grid-cols-2 items-center mt-2">
              <span className="text-sm text-gray-500 font-semibold">
                Nhân viên bán hàng:{" "}
              </span>
              <span className="font-semibold text-right">
                {bill.staff.name}
              </span>
            </div>
            <div className="grid grid-cols-2 items-center">
              <p className="text-sm text-gray-500 font-semibold">
                Ngày lập hóa đơn:{" "}
              </p>
              <p className="font-semibold text-right">
                {new Date(bill.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BillDetails;
