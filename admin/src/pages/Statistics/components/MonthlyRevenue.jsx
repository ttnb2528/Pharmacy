import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useContext, useEffect, useState } from "react";
import { BatchesContext } from "@/context/BatchesContext.context.jsx";
import { format } from "date-fns";

const MonthlyRevenue = () => {
  const { bills, orders } = useContext(BatchesContext);
  const [monthlyRevenue, setMonthlyRevenue] = useState([]);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  useEffect(() => {
    if (bills && orders) {
      const filteredBills = bills.filter(
        (bill) => new Date(bill.createdAt).getFullYear() === selectedYear
      );
      const filteredOrders = orders.filter(
        (order) => new Date(order.date).getFullYear() === selectedYear
      );

      const revenueByMonth = {};

      [...filteredBills, ...filteredOrders].forEach((item) => {
        const itemDate = new Date(item.createdAt || item.date);
        const month = format(itemDate, "MMMM"); // Get month name

        if (!revenueByMonth[month]) {
          revenueByMonth[month] = 0;
        }

        revenueByMonth[month] += item.total;
      });

      const monthlyRevenueData = Object.entries(revenueByMonth).map(
        ([month, total]) => ({
          month,
          total,
        })
      );

      setMonthlyRevenue(monthlyRevenueData);
    }
  }, [bills, orders, selectedYear]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Doanh thu theo tháng</CardTitle>
      </CardHeader>
      <CardContent>
        {/* Chọn năm */}
        <div className="mb-4">
          <label htmlFor="year">Chọn năm:</label>
          <select
            id="year"
            value={selectedYear}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
          >
            {/* Generate options for the last 5 years */}
            {Array.from({ length: 5 }, (_, i) => {
              const year = new Date().getFullYear() - i;
              return (
                <option key={year} value={year}>
                  {year}
                </option>
              );
            })}
          </select>
        </div>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={monthlyRevenue}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="total" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>{" "}
    </Card>
  );
};

export default MonthlyRevenue;
