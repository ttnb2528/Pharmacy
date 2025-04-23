import { useEffect, useState } from "react";
import { apiClient } from "@/lib/api-admin";
import Loading from "@/pages/component/Loading.jsx";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { GET_BEST_SELLING_MEDICINES_ROUTE } from "@/API/index.api.js";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const BestSellingMedicines = () => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const res = await apiClient.get(GET_BEST_SELLING_MEDICINES_ROUTE);
        if (res.status === 200) {
          setData(res.data.data);
        }
      } catch (error) {
        console.error("Error fetching best-selling medicines:", error);
        setError("Không thể tải dữ liệu thuốc bán chạy. Vui lòng thử lại sau.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) return <Loading />;

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Lỗi</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  // Sort data by sold quantity (descending) and limit to top 10 if needed
  const chartData = [...data]
    .sort((a, b) => b.sold - a.sold)
    .slice(0, 10)
    .map((item) => ({
      name:
        item.name.length > 20 ? item.name.substring(0, 20) + "..." : item.name,
      sold: item.sold,
      fullName: item.name, // Keep full name for tooltip
    }));

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border rounded-md shadow-md">
          <p className="font-medium">{payload[0].payload.fullName}</p>
          <p className="text-sm">
            Số lượng bán:{" "}
            <span className="font-medium">{payload[0].value}</span>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Thuốc bán chạy nhất</CardTitle>
        <CardDescription>
          Biểu đồ hiển thị các loại thuốc có số lượng bán cao nhất
        </CardDescription>
      </CardHeader>
      <CardContent>
        {data.length === 0 ? (
          <div className="flex justify-center items-center h-64 text-muted-foreground">
            Không có dữ liệu
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={400}>
            <BarChart
              data={chartData}
              layout="vertical"
              margin={{ top: 20, right: 30, left: 40, bottom: 5 }}
            >
              <XAxis type="number" />
              <YAxis
                dataKey="name"
                type="category"
                width={150}
                tick={{ fontSize: 12 }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar
                dataKey="sold"
                fill="#4ade80"
                radius={[0, 4, 4, 0]}
                barSize={20}
              />
            </BarChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
};

export default BestSellingMedicines;
