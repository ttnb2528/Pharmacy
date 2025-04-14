import { convertVND } from "@/utils/convertVND.js";
import { format } from "date-fns";
import { forwardRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useAppStore } from "@/store/index.js";

const ReturnInvoice = forwardRef(function ReturnInvoice(
  { returnBill, originalBillId, returnedItems },
  ref
) {
  const { userInfo } = useAppStore();

  return (
    <Card
      ref={ref}
      className="w-full max-w-4xl mx-auto bg-white border-none shadow-none"
    >
      {returnBill ? (
        <>
          <CardHeader className="text-center border-b">
            <div className="flex justify-between items-center mb-4">
              <div className="w-24 h-24 p-2 border rounded-full flex items-center justify-center">
                <img
                  src="https://res.cloudinary.com/thientan/image/upload/v1740325236/pharmacy-nb-logo_htjdoy.webp"
                  alt=""
                />
              </div>

              <div className="text-left">
                <p className="text-sm text-muted-foreground">
                  <span className="font-semibold text-black">Mã hóa đơn hoàn trả:</span>{" "}
                  {returnBill?.id}
                </p>
                <p className="text-sm text-muted-foreground">
                  <span className="font-semibold text-black">Mã hóa đơn gốc:</span>{" "}
                  {originalBillId}
                </p>
                <p className="text-sm text-muted-foreground">
                  <span className="font-semibold text-black">Ngày tạo:</span>{" "}
                  {format(
                    new Date(returnBill?.createdAt || new Date()),
                    "dd/MM/yyyy HH:mm"
                  )}
                </p>
              </div>
            </div>
            <CardTitle className="text-xl font-bold">
              HÓA ĐƠN HOÀN TRẢ SẢN PHẨM
            </CardTitle>
          </CardHeader>
          <CardContent className="mt-4">
            <div className="grid grid-cols-2 gap-6 mb-6">
              <div className="space-y-2">
                <h3 className="font-semibold text-lg mb-2">
                  Thông tin khách hàng
                </h3>
                <p>
                  <span className="font-semibold">Tên khách hàng:</span>{" "}
                  {returnBill?.customer?.name || "Khách lẻ"}
                </p>
                <p>
                  <span className="font-semibold">Số điện thoại:</span>{" "}
                  {returnBill?.customer?.phone || "..."}
                </p>
                <p>
                  <span className="font-semibold">Nhân viên:</span>{" "}
                  {userInfo?.name || "..."}
                </p>
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold text-lg mb-2">
                  Lý do hoàn trả
                </h3>
                <p>{returnBill?.reason || "Không có lý do"}</p>
              </div>
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]">STT</TableHead>
                  <TableHead>Tên thuốc</TableHead>
                  <TableHead>Đơn vị</TableHead>
                  <TableHead className="text-right">Số lượng</TableHead>
                  <TableHead className="text-right">Đơn giá</TableHead>
                  <TableHead className="text-right">Thành tiền</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {returnedItems.map((item, index) => (
                  <TableRow key={item.medicineId}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{item.name}</TableCell>
                    <TableCell>{item.unit}</TableCell>
                    <TableCell className="text-right">
                      {item.returnQuantity}
                    </TableCell>
                    <TableCell className="text-right">
                      {convertVND(item.price)}
                    </TableCell>
                    <TableCell className="text-right">
                      {convertVND(item.price * item.returnQuantity)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            <div className="mt-6 text-right grid gap-1">
              <p className="font-semibold">
                Tổng cộng: {convertVND(returnBill?.total / 1.05)}
              </p>
              <p className="font-semibold">
                VAT (5%): {convertVND(returnBill?.total - returnBill?.total / 1.05)}
              </p>
              <p className="text-lg font-bold mt-2">
                Tổng hoàn trả: {convertVND(returnBill?.total)}
              </p>
            </div>

            <div className="text-center mt-8">
              <p>Cảm ơn quý khách đã sử dụng dịch vụ!</p>
            </div>
          </CardContent>
        </>
      ) : (
        <CardContent>
          <p>Không có dữ liệu để in</p>
        </CardContent>
      )}
    </Card>
  );
});

export default ReturnInvoice;