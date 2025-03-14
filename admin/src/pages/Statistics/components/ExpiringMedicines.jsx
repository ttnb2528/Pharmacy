import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";
import { useEffect, useState } from "react";
import { format, differenceInDays } from "date-fns";
import { apiClient } from "@/lib/api-admin.js";
import { GET_EXPIRING_MEDICINES_ROUTE } from "@/API/index.api.js";
import Loading from "@/pages/component/Loading.jsx";
import useExportChart from "@/hooks/useExportChart"; // Import hook
import { Button } from "@/components/ui/button.jsx";

const ExpiringMedicines = () => {
  const [expiringData, setExpiringData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { chartRef, exportChartToPNG } = useExportChart(
    "expiring_medicines_chart"
  ); // Sử dụng hook

  useEffect(() => {
    const fetchExpiringMedicines = async () => {
      try {
        setIsLoading(true);
        const res = await apiClient.get(GET_EXPIRING_MEDICINES_ROUTE);
        if (res.status === 200 && res.data.status === 200) {
          const data = res.data.data.map((batch) => {
            const today = new Date();
            const expiryDate = new Date(batch.expiryDate);
            let daysLeft = differenceInDays(expiryDate, today);
            daysLeft = daysLeft >= 0 ? daysLeft + 1 : daysLeft;
            return {
              name: batch.MedicineId.name,
              batchNumber: batch.batchNumber,
              daysLeft,
              quantity: batch.quantity,
              expiryDate: format(expiryDate, "PPP"),
            };
          });
          setExpiringData(data);
        }
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchExpiringMedicines();
  }, []);

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white border p-2 rounded">
          <p className="font-semibold text-gray-500">{`${data.name}, lô ${data.batchNumber}, ngày hết hạn ${data.expiryDate}`}</p>
          <p className="text-gray-500">Ngày còn lại: {data.daysLeft}</p>
          <p className="text-gray-500">Số lượng: {data.quantity}</p>
        </div>
      );
    }
    return null;
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle>Thuốc sắp hết hạn (Trong vòng 30 ngày)</CardTitle>
      </CardHeader>
      <CardContent>
        {expiringData.length > 0 ? (
          <>
            <div ref={chartRef}>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={expiringData}>
                  <XAxis
                    dataKey="name"
                    interval={0}
                    angle={-45}
                    textAnchor="end"
                    height={100}
                  />
                  <YAxis
                    yAxisId="left"
                    orientation="left"
                    stroke="black"
                    label={{
                      value: "Ngày còn lại",
                      angle: -90,
                      position: "insideLeft",
                    }}
                  />
                  <YAxis
                    yAxisId="right"
                    orientation="right"
                    stroke="black"
                    label={{
                      value: "Số lượng",
                      angle: -90,
                      position: "insideRight",
                    }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Bar
                    yAxisId="left"
                    dataKey="daysLeft"
                    fill="#ff7474"
                    name="Ngày còn lại"
                  />
                  <Bar
                    yAxisId="right"
                    dataKey="quantity"
                    fill="#e9d700"
                    name="Số lượng"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <Button
              className="mt-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
              onClick={exportChartToPNG}
            >
              Xuất biểu đồ
            </Button>
          </>
        ) : (
          <p className="text-center">Chưa có thuốc sắp hết hạn.</p>
        )}
      </CardContent>
    </Card>
  );
};

export default ExpiringMedicines;
