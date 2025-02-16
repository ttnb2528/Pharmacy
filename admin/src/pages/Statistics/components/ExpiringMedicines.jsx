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
import { useContext, useEffect, useState } from "react";
import { BatchesContext } from "@/context/BatchesContext.context.jsx";
import { format, differenceInDays } from "date-fns";

const ExpiringMedicines = () => {
  const { batches } = useContext(BatchesContext);
  const [expiringData, setExpiringData] = useState([]);

  useEffect(() => {
    if (batches) {
      const today = new Date();
      const expiring = batches
        .filter((batch) => {
          const expiryDate = new Date(batch.expiryDate);
          let daysLeft = differenceInDays(expiryDate, today);
          daysLeft = daysLeft >= 0 ? daysLeft + 1 : daysLeft;
          return daysLeft <= 30 && daysLeft >= 0; // Lọc trong vòng 30 ngày và không âm
        })
        .map((batch) => ({
          name: batch.MedicineId.name, // Format name
          batchNumber: batch.batchNumber,
          daysLeft: differenceInDays(new Date(batch.expiryDate), today) + 1,
          quantity: batch.quantity,
          expiryDate: format(new Date(batch.expiryDate), "PPP"), // Format expiry date
        }));
      setExpiringData(expiring);
    }
  }, [batches]);

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

  return (
    <Card>
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
              height={80}
            />{" "}
            {/* X-axis with rotation */}
            <YAxis
              yAxisId="left"
              orientation="left"
              stroke="#8884d8"
              label={{ value: "Days Left", angle: -90, position: "insideLeft" }}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              stroke="#82ca9d"
              label={{ value: "Quantity", angle: -90, position: "insideRight" }}
            />
            <Tooltip content={<CustomTooltip />} /> {/* Add tooltip */}
            <Legend /> {/* Add legend */}
            <Bar
              yAxisId="left"
              dataKey="daysLeft"
              fill="#8884d8"
              name="Ngày còn lại"
            />
            <Bar
              yAxisId="right"
              dataKey="quantity"
              fill="#82ca9d"
              name="Số lượng"
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default ExpiringMedicines;
