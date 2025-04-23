import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { DollarSign, Package, ShoppingCart, Users } from "lucide-react";
import Header from "./component/Header.jsx";
import { useEffect, useState } from "react";
import { apiClient } from "@/lib/api-admin.js";
import { GET_DASHBOARD_OVERVIEW_ROUTE } from "@/API/index.api.js";
import Loading from "./component/Loading.jsx";
import { convertVND } from "@/utils/convertVND.js";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { formatDate } from "@/utils/formatDate.js";
import { useMediaQuery } from "@/hooks/use-media-query";

const Overview = () => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const isMobile = useMediaQuery("(max-width: 640px)");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const res = await apiClient.get(GET_DASHBOARD_OVERVIEW_ROUTE);

        if (res.status === 200 && res.data.status === 200) {
          setData(res.data.data);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active) {
      return (
        <div className="bg-white p-2 shadow-md rounded-md">
          <p className="text-sm text-gray-500">{formatDate(label)}</p>
          <p className="text-sm font-semibold">
            Doanh số: {convertVND(payload[0].value)}
          </p>
        </div>
      );
    }

    return null;
  };

  const formatXAxis = (value) => {
    if (isMobile) {
      // On mobile, show shorter date format
      const date = new Date(value);
      return `${date.getDate()}/${date.getMonth() + 1}`;
    }
    return formatDate(value);
  };

  if (isLoading) {
    return <Loading />;
  }
  return (
    <div>
      <Header title={"Tổng quan"} />
      <main className="p-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Tổng doanh thu
              </CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {convertVND(data.totalRevenue)}
              </div>
              <p className="text-xs text-muted-foreground">
                {data.revenueChange > 0
                  ? `${data.revenueChange}%`
                  : `${data.revenueChange}%`}{" "}
                so với tháng trước
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Đơn hàng</CardTitle>
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">+{data.totalOrders}</div>
              <p className="text-xs text-muted-foreground">
                {data.ordersChange}% so với tháng trước
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Khách hàng mới
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">+{data.newCustomers}</div>
              <p className="text-xs text-muted-foreground">
                {data.customersChange > 0
                  ? `${data.customersChange}%`
                  : `${data.customersChange}%`}{" "}
                so với tháng trước
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Sản phẩm bán chạy
              </CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="font-bold line-clamp-1">
                {data?.bestSellingProduct?.name || "Không có dữ liệu"}
              </div>
              <p className="text-xs text-muted-foreground">
                {data.bestSellingProduct?.sold} đơn vị đã bán
              </p>
            </CardContent>
          </Card>
        </div>
        <div className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Thống kê doanh số</CardTitle>
              <CardDescription>
                Biểu đồ doanh số bán hàng trong 30 ngày qua
              </CardDescription>
            </CardHeader>
            <CardContent className="px-2 sm:px-6">
              <div className="h-[250px] sm:h-[300px] md:h-[400px]">
                {data.dailyRevenue && data.dailyRevenue.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={data.dailyRevenue}
                      margin={{
                        top: 5,
                        right: isMobile ? 10 : 30,
                        left: isMobile ? 0 : 20,
                        bottom: 5,
                      }}
                    >
                      <XAxis
                        dataKey="date"
                        tick={{ fontSize: isMobile ? 10 : 14 }}
                        tickFormatter={formatXAxis}
                        interval={isMobile ? "preserveStartEnd" : 0}
                        angle={isMobile ? -45 : 0}
                        textAnchor={isMobile ? "end" : "middle"}
                        height={isMobile ? 50 : 30}
                      />
                      <YAxis
                        tickFormatter={(value) =>
                          isMobile
                            ? `${(value / 1000000).toFixed(2)}M`
                            : convertVND(value)
                        }
                        tick={{ fontSize: isMobile ? 10 : 12 }}
                        width={isMobile ? 40 : 80}
                      />
                      <CartesianGrid strokeDasharray="3 3" />
                      <Tooltip content={CustomTooltip} />
                      <Legend wrapperStyle={{ fontSize: isMobile ? 10 : 14 }} />
                      <Line
                        type="monotone"
                        name="Doanh số"
                        dataKey="totalRevenue"
                        stroke="#8884d8"
                        strokeWidth={isMobile ? 1.5 : 2}
                        dot={{ r: isMobile ? 2 : 4 }}
                        activeDot={{ r: isMobile ? 4 : 6 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex h-full items-center justify-center text-center text-lg text-muted-foreground">
                    Không có dữ liệu
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Overview;
