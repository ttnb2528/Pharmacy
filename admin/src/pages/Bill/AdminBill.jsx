import { useState, useEffect, useContext } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Check, X } from "lucide-react";
import Header from "../component/Header";
import BillDetails from "./components/BillDetais.jsx";
import { BillContext } from "@/context/BillContext.context.jsx";

const AdminBill = () => {
  //   const [bills, setBills] = useState(mockBills);
  const { bills } = useContext(BillContext);
  const [selectedBill, setSelectedBill] = useState(null);

  // In a real application, you would fetch bills from an API here
  useEffect(() => {
    // Fetch bills from API
    // setBills(fetchedBills)
  }, []);

  return (
    <div>
      <Header title="Quản lý hóa đơn" />
      <main className="p-6">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Mã hóa đơn</TableHead>
              <TableHead>Tên khách hàng</TableHead>
              <TableHead>Ngày tạo</TableHead>
              <TableHead>Mã phiếu khám</TableHead>
              <TableHead>Nơi khám</TableHead>
              <TableHead>Hóa đơn kê đơn</TableHead>
              <TableHead>Chi tiết</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {bills.map((bill) => (
              <TableRow key={bill.id}>
                <TableCell>{bill.id}</TableCell>
                <TableCell>{bill.customer.name}</TableCell>
                <TableCell>
                  {new Date(bill.createdAt).toLocaleDateString("vi")}
                </TableCell>
                <TableCell>{bill.prescription.number || "..."}</TableCell>
                <TableCell>{bill.prescription.source || "..."}</TableCell>
                <TableCell>
                  {bill.billIsRx ? (
                    <Check className="text-green-500" />
                  ) : (
                    <X className="text-red-500" />
                  )}
                </TableCell>
                <TableCell>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        onClick={() => setSelectedBill(bill)}
                      >
                        Xem chi tiết
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-3xl">
                      <DialogHeader>
                        <DialogTitle>Chi tiết hóa đơn</DialogTitle>
                      </DialogHeader>
                      <DialogDescription></DialogDescription>
                      {selectedBill && <BillDetails bill={selectedBill} />}
                    </DialogContent>
                  </Dialog>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </main>
    </div>
  );
};

export default AdminBill;
