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
import { Check, Search, X } from "lucide-react";
import Header from "../component/Header";
import BillDetails from "./components/BillDetais.jsx";
import { BillContext } from "@/context/BillContext.context.jsx";
import { Input } from "@/components/ui/input.jsx";

const AdminBill = () => {
  const { bills } = useContext(BillContext);

  const [selectedBill, setSelectedBill] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  // In a real application, you would fetch bills from an API here
  useEffect(() => {
    // Fetch bills from API
    // setBills(fetchedBills)
  }, []);

  const filteredBills = bills.filter((bill) => {
    const customerName = bill.customer.name ?? "Khách vãng lai";
    return customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bill.id.toString().includes(searchTerm) ||
      bill.prescription.number.toLowerCase().includes(searchTerm)
      ? true
      : false;
  });

  return (
    <div>
      <Header title="Quản lý hóa đơn" />
      <main className="p-6">
        <div className="flex justify-between items-center mb-4">
          <div className="relative w-64">
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              type="text"
              placeholder="Tìm kiếm hóa đơn..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
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
            {filteredBills.map((bill) => (
              <TableRow key={bill.id}>
                <TableCell>{bill.id}</TableCell>
                <TableCell>{bill.customer.name ?? "Khách vãng lai"}</TableCell>
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
