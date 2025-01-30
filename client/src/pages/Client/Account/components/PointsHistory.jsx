import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowUpCircle, ArrowDownCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { apiClient } from "@/lib/api-client.js";
import { GET_POINT_HISTORIES_ROUTE } from "@/API/index.api.js";

const PointsHistory = () => {
  const [pointsHistory, setPointsHistory] = useState([]);

  useEffect(() => {
    const resPointsHistory = async () => {
      try {
        const res = await apiClient.get(GET_POINT_HISTORIES_ROUTE);
        if (res.status === 200 && res.data.status === 200) {
          setPointsHistory(res.data.data);
        } else {
          console.error("Lỗi khi lấy lịch sử điểm");
        }
      } catch (error) {
        console.error("Lỗi khi lấy lịch sử điểm:", error);
      }
    };

    resPointsHistory();
  }, []);

  console.log(pointsHistory);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-semibold mb-6">Lịch sử tích điểm</h1>
      {pointsHistory.map((entry) => (
        <Card key={entry._id} className="mb-4">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {entry.change > 0 ? "Tích điểm" : "Sử dụng điểm"}
            </CardTitle>
            <Badge variant={entry.change > 0 ? "success" : "destructive"}>
              {entry.change > 0 ? (
                <ArrowUpCircle className="mr-1 h-4 w-4" />
              ) : (
                <ArrowDownCircle className="mr-1 h-4 w-4" />
              )}
              {Math.abs(entry.change)} điểm
            </Badge>
          </CardHeader>
          <CardContent>
            <div className="text-xs text-muted-foreground">
              {new Date(entry.createdAt).toLocaleString("vi-VN")}
            </div>
            <p className="text-sm mt-1">{entry.description}</p>
            {entry.orderId && (
              <p className="text-xs text-muted-foreground mt-1">
                Mã đơn hàng: {entry.orderId.id}
              </p>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default PointsHistory;
