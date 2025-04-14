import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { apiClient } from "@/lib/api-admin.js";
import {
  GET_BILL_BY_ID_ROUTE,
  CREATE_RETURN_BILL_ROUTE,
} from "@/API/index.api.js";
import { convertVND } from "@/utils/convertVND.js";
import { useReactToPrint } from "react-to-print";
// import PrintInvoice from "./PrintInvoice.jsx";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import ReturnInvoice from "./ReturnInvoice.jsx";

const ReturnProducts = ({ setIsLoading }) => {
  const [billId, setBillId] = useState("");
  const [billData, setBillData] = useState(null);
  const [returnItems, setReturnItems] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [returnCompleted, setReturnCompleted] = useState(false);
  const [returnBill, setReturnBill] = useState(null);
  const [returnReason, setReturnReason] = useState("");

  const componentRef = useRef(null);

  // Tìm kiếm hóa đơn
  const searchBill = async () => {
    if (!billId) {
      toast.error("Vui lòng nhập mã hóa đơn");
      return;
    }

    setIsLoading(true);
    try {
      const res = await apiClient.get(`${GET_BILL_BY_ID_ROUTE}/${billId}`);
      console.log(res);
      if (res.status === 200 && res.data.status === 200) {
        // Kiểm tra nếu là hóa đơn bán hàng (không phải hoàn trả) và trong thời gian cho phép
        if (res.data.data.type === "return") {
          toast.error("Đây đã là hóa đơn hoàn trả, không thể hoàn trả lại");
          setBillData(null);
          return;
        }

        // Kiểm tra thời gian hoàn trả (ví dụ: 7 ngày)
        const billDate = new Date(res.data.data.createdAt);
        const currentDate = new Date();
        const daysDiff = Math.floor(
          (currentDate - billDate) / (1000 * 60 * 60 * 24)
        );

        if (daysDiff > 7) {
          toast.error("Hóa đơn đã quá 7 ngày, không thể hoàn trả");
          setBillData(null);
          return;
        }

        // Khởi tạo danh sách các mặt hàng sẽ hoàn trả với số lượng mặc định = 0
        const items = res.data.data.medicines.map((med) => ({
          ...med,
          returnQuantity: 0,
          selected: false,
        }));

        setBillData(res.data.data);
        setReturnItems(items);
        setReturnCompleted(false);
        setReturnBill(null);
        setSelectAll(false);
      } else {
        toast.error("Không tìm thấy hóa đơn");
        setBillData(null);
        setReturnItems([]);
      }
    } catch (error) {
      console.error(error);
      toast.error("Có lỗi xảy ra khi tìm hóa đơn");
    } finally {
      setIsLoading(false);
    }
  };

  // Xử lý chọn tất cả sản phẩm để hoàn trả
  const handleSelectAll = () => {
    const newSelectAll = !selectAll;
    setSelectAll(newSelectAll);

    setReturnItems(
      returnItems.map((item) => ({
        ...item,
        selected: newSelectAll,
        returnQuantity: newSelectAll ? item.quantity : 0,
      }))
    );
  };

  // Xử lý chọn từng sản phẩm
  const handleSelectItem = (medicineId, selected) => {
    setReturnItems(
      returnItems.map((item) => {
        if (item.medicineId === medicineId) {
          return {
            ...item,
            selected,
            returnQuantity: selected ? item.quantity : 0,
          };
        }
        return item;
      })
    );

    // Cập nhật trạng thái chọn tất cả
    const allSelected = returnItems.every((item) =>
      item.medicineId === medicineId ? selected : item.selected
    );
    setSelectAll(allSelected);
  };

  // Cập nhật số lượng hoàn trả
  const updateReturnQuantity = (medicineId, quantity) => {
    const parsedQuantity = parseInt(quantity);

    setReturnItems(
      returnItems.map((item) => {
        if (item.medicineId === medicineId) {
          // Kiểm tra số lượng hợp lệ
          const validQuantity = Math.max(
            0,
            Math.min(parsedQuantity, item.quantity)
          );
          return {
            ...item,
            returnQuantity: validQuantity,
            selected: validQuantity > 0,
          };
        }
        return item;
      })
    );
  };

  // Tính tổng tiền hoàn trả
  const calculateReturnTotal = () => {
    return returnItems.reduce((sum, item) => {
      if (item.selected) {
        return sum + item.price * item.returnQuantity;
      }
      return sum;
    }, 0);
  };

  // Xử lý hoàn trả sản phẩm
  const handleReturnProducts = async () => {
    const itemsToReturn = returnItems.filter(
      (item) => item.selected && item.returnQuantity > 0
    );

    if (itemsToReturn.length === 0) {
      toast.error("Vui lòng chọn ít nhất một sản phẩm để hoàn trả");
      return;
    }

    if (!returnReason.trim()) {
      toast.error("Vui lòng nhập lý do hoàn trả");
      return;
    }

    setIsLoading(true);
    try {
      // Chuẩn bị dữ liệu cho hóa đơn hoàn trả
      const returnData = {
        originalBillId: billData._id,
        billIsRx: billData.billIsRx,
        customer: billData.customer,
        medicines: itemsToReturn.map((item) => ({
          id: item.id,
          medicineId: item.medicineId,
          isRx: item.isRx,
          name: item.name,
          image: item.image,
          unit: item.unit,
          quantity: item.returnQuantity,
          price: item.price,
        })),
        total: calculateReturnTotal() + calculateReturnTotal() * 0.05, // Tính cả VAT 5%
        type: "return",
        reason: returnReason,
      };

      const res = await apiClient.post(CREATE_RETURN_BILL_ROUTE, returnData);

      if (res.status === 200 && res.data.status === 201) {
        toast.success("Hoàn trả sản phẩm thành công");
        setReturnCompleted(true);
        setReturnBill(res.data.data);
      } else {
        toast.error(res.data.message || "Có lỗi xảy ra khi hoàn trả");
      }
    } catch (error) {
      console.error(error);
      toast.error("Có lỗi xảy ra khi hoàn trả sản phẩm");
    } finally {
      setIsLoading(false);
    }
  };

  // In hóa đơn hoàn trả
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: `Hóa đơn hoàn trả ${returnBill?.id || ""}`,
    removeAfterPrint: true,
    onBeforePrint: () => {
      if (!returnBill) {
        toast.error("Không có dữ liệu để in");
        return false;
      }
      return Promise.resolve();
    },
  });

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Tìm kiếm hóa đơn</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Input
              placeholder="Nhập mã hóa đơn..."
              value={billId}
              onChange={(e) => setBillId(e.target.value)}
            />
            <Button onClick={searchBill}>Tìm kiếm</Button>
          </div>
        </CardContent>
      </Card>

      {billData && (
        <Card>
          <CardHeader>
            <CardTitle className="flex justify-between items-center">
              <span>Thông tin hóa đơn #{billData.id}</span>
              <span className="text-sm font-normal">
                Ngày tạo: {new Date(billData.createdAt).toLocaleDateString()}
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <h3 className="font-medium">Thông tin khách hàng</h3>
                <p>Tên: {billData.customer?.name || "Khách lẻ"}</p>
                <p>Số điện thoại: {billData.customer?.phone || "N/A"}</p>
                <p>
                  Loại khách hàng:{" "}
                  {billData.customer?.type === "walkin"
                    ? "Khách vãng lai"
                    : billData.customer?.type === "loyalty"
                    ? "Khách tích điểm"
                    : "Khách doanh nghiệp"}
                </p>
              </div>
              <div>
                <h3 className="font-medium">Thông tin hóa đơn</h3>
                <p>
                  Loại hóa đơn: {billData.billIsRx ? "Kê đơn" : "Không kê đơn"}
                </p>
                <p>Tổng tiền: {convertVND(billData.total)}</p>
              </div>
            </div>

            {!returnCompleted ? (
              <>
                <div className="mb-4">
                  <Label htmlFor="returnReason" className="block mb-2">
                    Lý do hoàn trả:
                  </Label>
                  <Input
                    id="returnReason"
                    value={returnReason}
                    onChange={(e) => setReturnReason(e.target.value)}
                    placeholder="Nhập lý do hoàn trả..."
                  />
                </div>

                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-medium">Chọn sản phẩm hoàn trả</h3>
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="selectAll"
                      checked={selectAll}
                      onCheckedChange={handleSelectAll}
                    />
                    <Label htmlFor="selectAll">Chọn tất cả</Label>
                  </div>
                </div>

                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead width={50}></TableHead>
                      <TableHead>Tên sản phẩm</TableHead>
                      <TableHead>Đơn vị</TableHead>
                      <TableHead className="text-right">
                        Số lượng đã mua
                      </TableHead>
                      <TableHead className="text-right">
                        Số lượng hoàn trả
                      </TableHead>
                      <TableHead className="text-right">Đơn giá</TableHead>
                      <TableHead className="text-right">Thành tiền</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {returnItems.map((item) => (
                      <TableRow key={item.medicineId}>
                        <TableCell>
                          <Checkbox
                            checked={item.selected}
                            onCheckedChange={(checked) =>
                              handleSelectItem(item.medicineId, checked)
                            }
                          />
                        </TableCell>
                        <TableCell>{item.name}</TableCell>
                        <TableCell>{item.unit}</TableCell>
                        <TableCell className="text-right">
                          {item.quantity}
                        </TableCell>
                        <TableCell className="text-right">
                          <Input
                            type="number"
                            value={item.returnQuantity}
                            onChange={(e) =>
                              updateReturnQuantity(
                                item.medicineId,
                                e.target.value
                              )
                            }
                            className="w-20 text-right"
                            min="0"
                            max={item.quantity}
                            disabled={!item.selected}
                          />
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

                <div className="mt-6 text-right">
                  <p>
                    Tổng tiền hoàn trả (trước VAT):{" "}
                    {convertVND(calculateReturnTotal())}
                  </p>
                  <p>VAT (5%): {convertVND(calculateReturnTotal() * 0.05)}</p>
                  <p className="text-lg font-bold mt-2">
                    Tổng cộng:{" "}
                    {convertVND(
                      calculateReturnTotal() + calculateReturnTotal() * 0.05
                    )}
                  </p>
                </div>

                <div className="mt-6">
                  <Button onClick={handleReturnProducts}>
                    Hoàn trả sản phẩm
                  </Button>
                </div>
              </>
            ) : (
              <div className="space-y-4">
                <div className="bg-green-50 border border-green-200 rounded-md p-4">
                  <p className="text-green-600">
                    Hoàn trả thành công! Mã hóa đơn hoàn trả: #{returnBill?.id}
                  </p>
                </div>
                <Button onClick={handlePrint}>In hóa đơn hoàn trả</Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setBillData(null);
                    setReturnItems([]);
                    setBillId("");
                    setReturnCompleted(false);
                    setReturnBill(null);
                    setReturnReason("");
                  }}
                >
                  Hoàn trả sản phẩm khác
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Print template */}
      <div style={{ position: "absolute", top: "-9999px", left: "-9999px" }}>
        <ReturnInvoice
          ref={componentRef}
          returnBill={returnBill}
          originalBillId={billData?.id}
          returnedItems={returnItems.filter(
            (i) => i.selected && i.returnQuantity > 0
          )}
        />
      </div>
    </div>
  );
};

export default ReturnProducts;
