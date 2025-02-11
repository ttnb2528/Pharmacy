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
import { Separator } from "@/components/ui/separator";
import { Plus, Minus, Trash2, Printer } from "lucide-react";
import { convertVND } from "@/utils/convertVND.js";
import { apiClient } from "@/lib/api-admin.js";
import { CREATE_BILL_ROUTE } from "@/API/index.api.js";

const Cart = ({
  cart,
  setCart,
  activeTab,
  customerType,
  selectedCustomer,
  prescriptionInfo,
  invoiceCreated,
  setInvoiceCreated,
}) => {
  const updateQuantity = (id, quantity) => {
    setCart(
      cart.map((item) =>
        item.id === id ? { ...item, quantity: Number.parseInt(quantity) } : item
      )
    );
  };

  const removeFromCart = (id) => {
    setCart(cart.filter((item) => item.id !== id));
  };

  const total = cart.reduce((sum, item) => {
    return (
      sum +
      item.quantity *
        (customerType === "business"
          ? item?.batches[0]?.price
          : item?.batches[0]?.retailPrice)
    );
  }, 0);

  const handleCreateInvoice = async () => {
    try {
      const billData = {
        billIsRx: activeTab === "prescription" ? true : false,
        customer: {
          customerId: selectedCustomer
            ? selectedCustomer?.accountId?._id
            : null,
          name: selectedCustomer ? selectedCustomer.name : null,
          phone: selectedCustomer ? selectedCustomer.phone : null,
          type: customerType,
        },
        prescription: {
          source: prescriptionInfo.source,
          number: prescriptionInfo.number,
        },
        medicines: cart.map((medicine) => ({
          medicineId: medicine._id,
          isRx: medicine.isRx,
          name: medicine.name,
          unit: medicine.unit,
          quantity: medicine.quantity,
          price:
            customerType === "business"
              ? medicine?.batches[0]?.price
              : medicine?.batches[0]?.retailPrice,
        })),
        total,
        type: "sell",
      };

      const res = await apiClient.post(CREATE_BILL_ROUTE, billData);
      console.log(billData);

      console.log(res);
    } catch (error) {
      console.error(error);
    }
    // setInvoiceCreated(true);
  };

  const handlePrintInvoice = () => {
    console.log("Printing invoice");
  };

  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Mã</TableHead>
            <TableHead>Tên thuốc</TableHead>
            <TableHead>Thuốc kê đơn?</TableHead>
            <TableHead>Đơn vị tính</TableHead>
            <TableHead>Số lượng</TableHead>
            <TableHead>Đơn giá</TableHead>
            <TableHead>Thành tiền</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {cart.map((medicine) => (
            <TableRow key={medicine.id}>
              <TableCell>{medicine.id}</TableCell>
              <TableCell>{medicine.name}</TableCell>
              <TableCell>{medicine.isRx ? "Có" : "Không"}</TableCell>
              <TableCell>{medicine.unit}</TableCell>
              <TableCell>
                <div className="flex items-center">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() =>
                      updateQuantity(medicine.id, medicine.quantity - 1)
                    }
                    disabled={medicine.quantity <= 1}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <Input
                    type="number"
                    value={medicine.quantity}
                    onChange={(e) =>
                      updateQuantity(medicine.id, e.target.value)
                    }
                    className="w-16 mx-2 text-center"
                    min="1"
                    max={medicine.quantityStock}
                  />
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() =>
                      updateQuantity(medicine.id, medicine.quantity + 1)
                    }
                    disabled={medicine.quantity >= medicine.quantityStock}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
              <TableCell>
                {/* {getPrice(medicine.price).toLocaleString()} VND */}
                {customerType === "business"
                  ? convertVND(medicine?.batches[0]?.price)
                  : convertVND(medicine?.batches[0]?.retailPrice)}
              </TableCell>
              <TableCell>
                {/* {(
                  getPrice(medicine.price) * medicine.quantity
                ).toLocaleString()}{" "}
                VND */}

                {customerType === "business"
                  ? convertVND(medicine?.batches[0]?.price * medicine.quantity)
                  : convertVND(
                      medicine?.batches[0]?.retailPrice * medicine.quantity
                    )}
              </TableCell>
              <TableCell>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => removeFromCart(medicine.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Separator className="my-4" />
      <div className="flex items-center justify-between mb-4">
        <span className="font-semibold">Tổng cộng</span>
        {cart && cart.length > 0 && (
          <p className="text-2xl font-bold text-red-500">
            {total.toLocaleString()} VND
          </p>
        )}
      </div>
      <div className="flex gap-2">
        {cart &&
          cart.length > 0 &&
          (customerType === "walkin" ||
            customerType === "business" ||
            (selectedCustomer &&
              (activeTab === "otc" ||
                (prescriptionInfo.source && prescriptionInfo.number)))) && (
            <Button onClick={handleCreateInvoice} disabled={invoiceCreated}>
              Tạo hóa đơn
            </Button>
          )}
        {invoiceCreated && (
          <Button onClick={handlePrintInvoice}>
            <Printer className="mr-2 h-4 w-4" /> In hóa đơn
          </Button>
        )}
      </div>
    </div>
  );
};

export default Cart;
