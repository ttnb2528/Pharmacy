"use client";

import { useState } from "react";
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

const Cart = ({
  cart,
  setCart,
  customerType,
  selectedCustomer,
  prescriptionInfo,
}) => {
  const [invoiceCreated, setInvoiceCreated] = useState(false);

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

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleCreateInvoice = () => {
    console.log("Creating invoice:", {
      customerType,
      customer: selectedCustomer,
      prescriptionSource: prescriptionInfo.source,
      prescriptionNumber: prescriptionInfo.number,
      cart,
      total,
    });
    setInvoiceCreated(true);
  };

  const handlePrintInvoice = () => {
    console.log("Printing invoice");
  };

  const getPrice = (basePrice) => {
    if (customerType === "business") {
      return basePrice * 0.9; // 10% discount for business customers
    }
    return basePrice;
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
              <TableCell>{medicine.isPrescription ? "Có" : "Không"}</TableCell>
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
                    max={medicine.stock}
                  />
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() =>
                      updateQuantity(medicine.id, medicine.quantity + 1)
                    }
                    disabled={medicine.quantity >= medicine.stock}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
              <TableCell>
                {getPrice(medicine.price).toLocaleString()} VND
              </TableCell>
              <TableCell>
                {(
                  getPrice(medicine.price) * medicine.quantity
                ).toLocaleString()}{" "}
                VND
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
            (selectedCustomer &&
              prescriptionInfo.source &&
              prescriptionInfo.number)) && (
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
