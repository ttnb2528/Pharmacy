import { useContext, useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { CalendarIcon } from "lucide-react";
import { BatchesContext } from "@/context/BatchesContext.context.jsx";

const InventoryMovement = () => {
  const { batches } = useContext(BatchesContext);
  const [date, setDate] = useState({
    from: new Date(),
    to: new Date(),
  });
  const [groupedData, setGroupedData] = useState([]);

  useEffect(() => {
    if (batches) {
      const filtered = batches.filter((item) => {
        const entryDate = new Date(item.createdAt).getDay();
        const fromDate = date.from.getDay();
        const toDate = date.to.getDay();
        return entryDate >= fromDate && entryDate <= toDate;
      });

      // Group data by medicine name and calculate total quantity
      const grouped = filtered.reduce((acc, item) => {
        const medicineName = item?.MedicineId.name;
        if (!acc[medicineName]) {
          acc[medicineName] = {
            name: medicineName,
            quantity: 0,
            stock: 0, // Initialize stock
            dateOfEntry: item.createdAt, // Get the first date of entry for the medicine
          };
        }
        acc[medicineName].quantity += item.quantity;
        acc[medicineName].stock = item.MedicineId.quantityStock; //Sum of stock of each medicine
        return acc;
      }, {});
      setGroupedData(Object.values(grouped));
    }
  }, [batches, date]);

  return (
    <div className="container mx-auto p-4">
      <div className="flex flex-col justify-between gap-5 mb-4">
        <h2 className="text-2xl font-bold">Thống kê xuất nhập tồn</h2>

        <div className="flex items-center space-x-4">
          {/* Date Picker From */}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-[150px] justify-start text-left font-normal",
                  !date.from && "text-muted-foreground"
                )}
              >
                {date.from ? format(date.from, "PPP") : "Chọn ngày bắt đầu"}
                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="p-0 flex w-auto">
              <Calendar
                mode="single"
                selected={date.from}
                onSelect={(selectedDate) =>
                  setDate({ ...date, from: selectedDate || new Date() })
                }
              />
            </PopoverContent>
          </Popover>

          {/* Date Picker To */}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-[150px] justify-start text-left font-normal",
                  !date.to && "text-muted-foreground"
                )}
              >
                {date.to ? format(date.to, "PPP") : "Chọn ngày kết thúc"}
                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="p-0 flex w-auto">
              <Calendar
                mode="single"
                selected={date.to}
                onSelect={(selectedDate) =>
                  setDate({ ...date, to: selectedDate || new Date() })
                }
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Tên thuốc</TableHead>
            <TableHead>Ngày nhập</TableHead>
            <TableHead>Số lượng</TableHead>
            <TableHead>Tồn kho</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {groupedData.map((item, index) => (
            <TableRow key={index}>
              <TableCell>{item.name}</TableCell>
              <TableCell>{format(item.dateOfEntry, "PPP")}</TableCell>
              <TableCell>{item.quantity}</TableCell>
              <TableCell>{item.stock}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default InventoryMovement;
