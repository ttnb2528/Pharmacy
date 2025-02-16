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
import { useContext, useEffect, useState } from "react";
import { BatchesContext } from "@/context/BatchesContext.context.jsx";
import { format, differenceInDays } from "date-fns";

const ExpiredMedicines = () => {
  const { batches } = useContext(BatchesContext);
  const [expiredData, setExpiredData] = useState([]);

  useEffect(() => {
    if (batches) {
      const today = new Date();
      const expired = batches
        .filter((batch) => {
          const expiryDate = new Date(batch.expiryDate);
          const daysLeft = differenceInDays(expiryDate, today);
          return daysLeft < 0;
        })
        .map((batch) => ({
          name: batch.MedicineId.name,
          batchNumber: batch.batchNumber,
          daysLeft: differenceInDays(new Date(batch.expiryDate), today),
          quantity: batch.quantity,
          expiryDate: format(new Date(batch.expiryDate), "PPP"),
        }));
      setExpiredData(expired);
    }
  }, [batches]);

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
