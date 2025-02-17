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

const ExpiringMedicines = () => {
  const [expiringData, setExpiringData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchExpiringMedicines = async () => {
      try {
        setIsLoading(true);
        const res = await apiClient.get(GET_EXPIRING_MEDICINES_ROUTE);
        if (res.status === 200 && res.data.status === 200) {
          console.log(res);

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
      const data = payload[0].payload; // Get the data for the current bar
      return (
        <div className="bg-white border p-2 rounded">
          {/* Style the tooltip */}
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
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={expiringData}>
            <XAxis
              dataKey="name"
              interval={0}
              angle={-45}
              textAnchor="end"
              height={100}
            />{" "}
            {/* X-axis with rotation */}
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
              label={{ value: "Số lượng", angle: -90, position: "insideRight" }}
            />
            <Tooltip content={<CustomTooltip />} /> {/* Add tooltip */}
            <Legend /> {/* Add legend */}
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
      </CardContent>
    </Card>
  );
};

export default ExpiringMedicines;
