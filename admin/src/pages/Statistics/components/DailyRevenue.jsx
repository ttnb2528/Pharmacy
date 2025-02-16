import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useContext, useEffect, useState } from "react";
import { format, differenceInDays } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { BatchesContext } from "@/context/BatchesContext.context.jsx";

const DailyRevenue = () => {
  const { bills, orders } = useContext(BatchesContext); // Assuming you have both bills and orders in your context
  const [revenueData, setRevenueData] = useState([]);
  const [date, setDate] = useState({
    from: new Date(),
    to: new Date(),
  });
  const [isFiltering, setIsFiltering] = useState(false);

  const handleFilter = () => {
    setIsFiltering(true);
  };

  useEffect(() => {
    if (isFiltering) {
      const startDate = date.from.getDay();
      const endDate = date.to.getDay();

      const filteredBills = bills
        ? bills.filter((bill) => {
          console.log(bill);
          
            const billDate = new Date(bill.createdAt);
            console.log(billDate);
            
            return billDate >= startDate || billDate <= endDate;
          })
        : [];

      const filteredOrders = orders
        ? orders.filter((order) => {
            const orderDate = new Date(order.date).getDay();
            return orderDate >= startDate || orderDate <= endDate;
          })
        : [];

      console.log(filteredBills, filteredOrders);

      const dailyRevenue = {};

      [...filteredBills, ...filteredOrders].forEach((item) => {
        const itemDate = new Date(item.createdAt || item.date); // Use createdAt for bills, date for orders
        const formattedDate = format(itemDate, "yyyy-MM-dd");

        if (!dailyRevenue[formattedDate]) {
          dailyRevenue[formattedDate] = 0;
        }

        dailyRevenue[formattedDate] += item.total;
      });

      const revenueData = Object.entries(dailyRevenue).map(([date, total]) => ({
        date,
        total,
      }));
      setRevenueData(revenueData);
      setIsFiltering(false);
    }
  }, [bills, orders, isFiltering, date]);

  console.log(revenueData);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Doanh thu hàng ngày</CardTitle>
      </CardHeader>
      <CardContent>
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
          <Button onClick={handleFilter}>Lọc</Button>
        </div>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={revenueData}>
            <XAxis dataKey="date" />
            <YAxis />
            <CartesianGrid strokeDasharray="3 3" />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="total" stroke="#8884d8" />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default DailyRevenue;
