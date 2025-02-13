import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { convertVND } from "@/utils/convertVND.js";
import { Check, X } from "lucide-react";

const BillDetails = ({ bill }) => {
  const tax = bill.total * 0.05;
  const totalAfterTax = bill.total + tax;

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <span className="italic text-gray-500 text-sm">Thông tin cá nhân</span>
        <Card>
          {/* <CardHeader>
          <CardTitle>Thông tin cá nhân</CardTitle>
        </CardHeader> */}
          <CardContent>
            <p>
              <strong>Tên khách hàng:</strong> {bill.customer.name}
            </p>
            <p>
              <strong>Số điện thoại:</strong> {bill.customer.phone}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-2">
        <span className="italic text-gray-500 text-sm">Chi tiết sản phẩm</span>
        <Card>
          {/* <CardHeader>
          <CardTitle>Chi tiết sản phẩm</CardTitle>
        </CardHeader> */}
          <CardContent>
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
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent>
          <div className="grid grid-cols-3 gap-2 my-2">
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
              <p className="text-sm text-gray-500 font-semibold">Ngày lập hóa đơn: </p>
              <p className="font-semibold">
                {new Date(bill.createdAt).toLocaleString()}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BillDetails;
