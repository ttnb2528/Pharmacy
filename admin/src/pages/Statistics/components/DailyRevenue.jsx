import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useEffect, useState } from "react";
import { format } from "date-fns";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { apiClient } from "@/lib/api-admin.js";
import { GET_DAILY_REVENUE_ROUTE } from "@/API/index.api.js";
import Loading from "@/pages/component/Loading.jsx";
import { Input } from "@/components/ui/input.jsx";
import { cn } from "@/lib/utils.js";
import { formatDate } from "@/utils/formatDate.js";

const DailyRevenue = () => {
  const [revenueData, setRevenueData] = useState([]);
  const [date, setDate] = useState({ from: new Date(), to: new Date() });
  const [isLoading, setIsLoading] = useState(false);
  const [filterType, setFilterType] = useState("all"); // "all", "bills", "orders"

  useEffect(() => {
    const fetchDailyRevenue = async () => {
      try {
        setIsLoading(true);
        const res = await apiClient.get(
          `${GET_DAILY_REVENUE_ROUTE}?startDate=${date.from.toISOString()}&endDate=${date.to.toISOString()}`
        );

        if (res.status === 200 && res.data.status === 200) {
          setRevenueData(res.data.data);
        }
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDailyRevenue();
  }, [date.from, date.to]);

  const displayedData = revenueData.map((item) => ({
    date: item.date,
    totalRevenue: filterType === "all" ? item.totalRevenue : 0,
    orders: filterType === "orders" ? item.orders : 0,
    bills: filterType === "bills" ? item.bills : 0,
  }));

  const hasData = displayedData.some(
    (item) =>
      (filterType === "all" && item.totalRevenue > 0) ||
      (filterType === "orders" && item.orders > 0) ||
      (filterType === "bills" && item.bills > 0)
  );

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white border p-2 rounded">
          <p className="font-semibold text-gray-500">{formatDate(data.date)}</p>
          <p
            className={cn(
              filterType === "all" && "text-[#8884d8]",
              filterType === "orders" && "text-[#4CAF50]",
              filterType === "bills" && "text-[#FF9800]"
            )}
          >
            tổng doanh thu: {data.totalRevenue}
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
        <CardTitle>Doanh thu theo ngày</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between">
          <div className="flex items-center space-x-4">
            {/* Bộ lọc ngày */}
            <span className="font-semibold">Chọn ngày bắt đầu</span>
            <Input
              type="date"
              className="w-auto"
              value={format(date.from, "yyyy-MM-dd")}
              onChange={(e) =>
                setDate({ ...date, from: new Date(e.target.value) })
              }
            />

            <span className="font-semibold">Chọn ngày kết thúc</span>
            <Input
              type="date"
              className="w-auto"
              value={format(date.to, "yyyy-MM-dd")}
              onChange={(e) =>
                setDate({ ...date, to: new Date(e.target.value) })
              }
            />
          </div>
          {/* Bộ lọc loại doanh thu */}
          {displayedData.length > 0 && (
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-[180px]">
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

        {/* Biểu đồ */}
        {hasData ? (
          displayedData.length > 5 ? (
            <ResponsiveContainer width="100%" height={400} className={"mt-5"}>
              <LineChart data={displayedData}>
                <XAxis dataKey="date" />
                <YAxis />
                <CartesianGrid strokeDasharray="3 3" />
                <Tooltip content={CustomTooltip} />
                <Legend />
                {filterType === "all" && (
                  <Line
                    type="monotone"
                    dataKey="totalRevenue"
                    stroke="#8884d8"
                  />
                )}
                {filterType === "orders" && (
                  <Line type="monotone" dataKey="orders" stroke="#4CAF50" />
                )}
                {filterType === "bills" && (
                  <Line type="monotone" dataKey="bills" stroke="#FF9800" />
                )}
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <ResponsiveContainer width="100%" height={400} className={"mt-5"}>
              <BarChart data={displayedData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip content={CustomTooltip} />
                <Legend />
                {filterType === "all" && (
                  <Bar
                    name="Tổng doanh thu"
                    dataKey="totalRevenue"
                    fill="#8884d8"
                  />
                )}
                {filterType === "orders" && (
                  <Bar
                    name="Doanh thu theo đơn hàng"
                    dataKey="orders"
                    fill="#4CAF50"
                  />
                )}
                {filterType === "bills" && (
                  <Bar
                    name="Doanh thu theo hóa đơn"
                    dataKey="bills"
                    fill="#FF9800"
                  />
                )}
              </BarChart>
            </ResponsiveContainer>
          )
        ) : (
          <div className="mt-5 text-center text-lg text-muted-foreground">
            Không có dữ liệu
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DailyRevenue;
