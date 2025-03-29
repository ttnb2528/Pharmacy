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

const PrintInvoice = forwardRef(function PrintInvoice(
  { invoice, cart, customerType },
  ref
) {
  const { userInfo } = useAppStore();
  // const calculateTotal = () => {
  //   const subtotal = invoice?.total || 0;
  //   const vat = subtotal * 0.05; // 5% VAT
  //   return subtotal + vat;
  // };

  return (
    <Card
      ref={ref}
      className="w-full max-w-4xl mx-auto bg-white border-none shadow-none"
    >
      {invoice && cart?.length > 0 ? (
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
                  <span className="font-semibold text-black">Mã hóa đơn:</span>{" "}
                  {invoice?.id}
                </p>

                <p className="text-sm text-muted-foreground">
                  <span className="font-semibold text-black">
                    Loại hóa đơn:
                  </span>{" "}
                  {invoice?.billIsRx
                    ? "Hóa đơn kê đơn"
                    : "Hóa đơn không kê đơn"}
                </p>
                <p className="text-sm text-muted-foreground">
                  <span className="font-semibold text-black">Ngày tạo:</span>{" "}
                  {format(
                    new Date(invoice?.createdAt || new Date()),
                    "dd/MM/yyyy HH:mm"
                  )}
                </p>
              </div>
            </div>
            <CardTitle className="text-xl font-bold">
              {invoice?.billIsRx
                ? "HÓA ĐƠN BÁN THUỐC KÊ ĐƠN"
                : "HÓA ĐƠN BÁN THUỐC"}
            </CardTitle>
          </CardHeader>
          <CardContent className="mt-4">
            {invoice?.billIsRx ? (
              // Prescription order layout
              <div className="grid grid-cols-2 gap-6 mb-6">
                <div className="space-y-2">
                  <h3 className="font-semibold text-lg mb-2">
                    Thông tin khách hàng
                  </h3>
                  <p>
                    <span className="font-semibold">Tên khách hàng:</span>{" "}
                    {invoice?.customer?.name || "Khách lẻ"}
                  </p>
                  <p>
                    <span className="font-semibold">Số điện thoại:</span>{" "}
                    {invoice?.customer?.phone || "..."}
                  </p>
                  <p>
                    <span className="font-semibold">Nhân viên:</span>{" "}
                    {userInfo?.name || "..."}
                  </p>
                </div>
                {invoice?.prescription && (
                  <div className="space-y-2">
                    <h3 className="font-semibold text-lg mb-2">
                      Thông tin phiếu khám
                    </h3>
                    <p>
                      <span className="font-semibold">Nơi khám:</span>{" "}
                      {invoice.prescription.source}
                    </p>
                    <p>
                      <span className="font-semibold">Số phiếu khám:</span>{" "}
                      {invoice.prescription.number}
                    </p>
                  </div>
                )}
              </div>
            ) : (
              // Non-prescription order layout
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="grid gap-1">
                  <p className="font-semibold">Tên khách hàng:</p>
                  <p className="font-semibold">Số điện thoại:</p>
                  <p className="font-semibold">Nhân viên:</p>
                </div>
                <div className="grid gap-1">
                  <p>{invoice?.customer?.name || "Khách lẻ"}</p>
                  <p>{invoice?.customer?.phone || "..."}</p>
                  <p>{userInfo?.name || "..."}</p>
                </div>
              </div>
            )}

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]">STT</TableHead>
                  <TableHead>Tên thuốc</TableHead>
                  <TableHead className="text-center">Kê đơn</TableHead>
                  <TableHead>Đơn vị</TableHead>
                  <TableHead className="text-right">Số lượng</TableHead>
                  <TableHead className="text-right">Đơn giá</TableHead>
                  <TableHead className="text-right">Thành tiền</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {cart.map((item, index) => (
                  <TableRow key={item.id}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{item.name}</TableCell>
                    <TableCell className="text-center">
                      {item.isRx ? "Có" : "Không"}
                    </TableCell>
                    <TableCell>{item.unit}</TableCell>
                    <TableCell className="text-right">
                      {item.quantity}
                    </TableCell>
                    <TableCell className="text-right">
                      {customerType === "business"
                        ? convertVND(item?.batches[0]?.price)
                        : convertVND(item?.batches[0]?.retailPrice)}
                    </TableCell>
                    <TableCell className="text-right">
                      {customerType === "business"
                        ? convertVND(item?.batches[0]?.price * item.quantity)
                        : convertVND(
                            item?.batches[0]?.retailPrice * item.quantity
                          )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            <div className="mt-6 text-right grid gap-1">
              <p className="font-semibold">
                Tổng cộng: {convertVND(invoice?.total / 1.05)}
              </p>
              <p className="font-semibold">
                VAT (5%): {convertVND(invoice?.total - invoice?.total / 1.05)}
              </p>
              <p className="text-lg font-bold mt-2">
                Tổng thanh toán: {convertVND(invoice?.total)}
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

export default PrintInvoice;
