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
import { useEffect, useState } from "react";
import Loading from "@/pages/component/Loading.jsx";
import { apiClient } from "@/lib/api-admin.js";
import { GET_MONTHLY_REVENUE_ROUTE } from "@/API/index.api.js";
import { convertVND } from "@/utils/convertVND.js";
import { Label } from "@/components/ui/label.jsx";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select.jsx";
import useExportChart from "@/hooks/useExportChart.jsx";
import { Button } from "@/components/ui/button.jsx";

const MonthlyRevenue = () => {
  const [monthlyRevenue, setMonthlyRevenue] = useState([]);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [filterType, setFilterType] = useState("all");
  const [isLoading, setIsLoading] = useState(false);
  const { chartRef, exportChartToPNG } = useExportChart(
    "monthly_revenue_chart"
  );

  useEffect(() => {
    const fetchMonthlyRevenue = async () => {
      try {
        setIsLoading(true);
        const res = await apiClient.get(
          `${GET_MONTHLY_REVENUE_ROUTE}?year=${selectedYear}&type=${filterType}`
        );

        if (res.status === 200 && res.data.status === 200) {
          setMonthlyRevenue(res.data.data);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMonthlyRevenue();
  }, [filterType, selectedYear]);

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white border p-2 rounded">
          <p className="font-semibold text-gray-500">Tháng: {data.month}</p>
          <p className="text-gray-500">
            Tổng doanh thu: {convertVND(data.total)}
          </p>
        </div>
      );
    }
    return null;
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Doanh thu theo tháng</CardTitle>
      </CardHeader>
      <CardContent>
        {/* Chọn năm và loại doanh thu */}
        <div className="mb-4">
          <div className="flex justify-between">
            <div className="flex items-center space-x-4">
              <Label htmlFor="year">Chọn năm:</Label>
              <Select value={selectedYear} onValueChange={setSelectedYear}>
                <SelectTrigger className="w-[100px]">
                  {selectedYear}
                </SelectTrigger>
                <SelectContent>
                  {[
                    new Date().getFullYear() - 2,
                    new Date().getFullYear() - 1,
                    new Date().getFullYear(),
                  ].map((year) => (
                    <div
                      key={year}
                      onClick={() => setSelectedYear(year)}
                      className="hover:bg-gray-100 cursor-pointer p-2"
                    >
                      {year}
                    </div>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {monthlyRevenue.length > 0 && (
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Chọn loại doanh thu" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả</SelectItem>
                  <SelectItem value="bills">Chỉ hóa đơn</SelectItem>
                  <SelectItem value="orders">Chỉ đơn hàng</SelectItem>
                </SelectContent>
              </Select>
            )}
          </div>
        </div>

        {/* Kiểm tra dữ liệu và hiển thị */}
        {monthlyRevenue.length > 0 ? (
          <div>
            <div ref={chartRef}>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={monthlyRevenue} margin={{ left: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="month"
                    tickFormatter={(month) => `Tháng ${month}`}
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis
                    tickFormatter={(value) => convertVND(value)}
                    tick={{ fontSize: 12 }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Bar dataKey="total" name="Tổng doanh thu" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <Button
              className="mt-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
              onClick={exportChartToPNG}
            >
              Xuất biểu đồ
            </Button>
          </div>
        ) : (
          <p className="text-center text-lg text-muted-foreground">
            Chưa có dữ liệu doanh thu cho năm {selectedYear}.
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default MonthlyRevenue;
