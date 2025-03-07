import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  // Legend,
} from "recharts";
import { useEffect, useState } from "react";
import { format, differenceInDays } from "date-fns";
import { apiClient } from "@/lib/api-admin.js";
import { GET_EXPIRED_MEDICINES_ROUTE } from "@/API/index.api.js";
import Loading from "@/pages/component/Loading.jsx";

const ExpiredMedicines = () => {
  const [expiredData, setExpiredData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchExpiredMedicines = async () => {
      try {
        setIsLoading(true);
        const res = await apiClient.get(GET_EXPIRED_MEDICINES_ROUTE);
        console.log(res);
        
        if (res.status === 200 && res.data.status === 200) {
          const expired = res.data.data.map((batch) => ({
            name: batch.MedicineId.name,
            batchNumber: batch.batchNumber,
            daysLeft: differenceInDays(new Date(batch.expiryDate), new Date()),
            quantity: batch.quantity,
            expiryDate: format(new Date(batch.expiryDate), "PPP"),
          }));
          setExpiredData(expired);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchExpiredMedicines();
  }, []);
  if (isLoading) {
    return <Loading />;
  }

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white border p-2 rounded">
          <p className="font-semibold text-gray-500">{`${data.name}, lô ${data.batchNumber}, ngày hết hạn ${data.expiryDate}`}</p>
          <p className="text-gray-500">
            Ngày hết hạn cách đây: {-data.daysLeft} ngày
          </p>
          <p className="text-gray-500">Số lượng: {data.quantity}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Thuốc đã hết hạn</CardTitle>
      </CardHeader>
      <CardContent>
        {expiredData.length > 0 ? ( // Kiểm tra nếu có dữ liệu
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={expiredData}>
              <XAxis
                dataKey="name"
                interval={0}
                angle={-45}
                textAnchor="end"
                height={150}
              />
              <YAxis
                yAxisId="left"
                orientation="left"
                stroke="black"
                label={{
                  value: "Số lượng",
                  angle: -90,
                  position: "insideLeft",
                }}
              />
              <Tooltip content={<CustomTooltip />} />
              {/* <Legend /> */}
              <Bar
                yAxisId="left"
                dataKey="quantity"
                fill="red"
                name="Ngày đã hết hạn"
              />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-center text-gray-500">Chưa có thuốc hết hạn.</p> // Hiển thị thông báo
        )}
      </CardContent>
    </Card>
  );
};

export default ExpiredMedicines;
