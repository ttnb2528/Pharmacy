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

const Overview = () => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const res = await apiClient.get(GET_DASHBOARD_OVERVIEW_ROUTE);
        console.log(res);

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
                  ? `+${data.revenueChange}%`
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
                +{data.ordersChange}% so với tháng trước
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
                  ? `+${data.customersChange}%`
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
              <div className="text-2xl font-bold">
                {data.bestSellingProduct.name}
              </div>
              <p className="text-xs text-muted-foreground">
                {data.bestSellingProduct.sold} đơn vị đã bán
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
            <CardContent>
              <div className="h-[400px]">
                {/* Biểu đồ */}
                {data.dailyRevenue.length > 0 ? (
                  <ResponsiveContainer
                    width="100%"
                    height={400}
                    className={"mt-5"}
                  >
                    <LineChart data={data.dailyRevenue}>
                      <XAxis dataKey="date" tick={{ fontSize: 14 }} />
                      <YAxis
                        tickFormatter={(value) => convertVND(value)}
                        tick={{ fontSize: 12 }}
                      />
                      <CartesianGrid strokeDasharray="3 3" />
                      <Tooltip content={CustomTooltip} />
                      {/* <Tooltip /> */}
                      <Legend />
                      <Line
                        type="monotone"
                        name="Doanh số"
                        dataKey="totalRevenue"
                        stroke="#8884d8"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="mt-5 text-center text-lg text-muted-foreground">
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
