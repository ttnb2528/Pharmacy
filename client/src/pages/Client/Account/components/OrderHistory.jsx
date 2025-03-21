import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { apiClient } from "@/lib/api-client.js";
import { GET_CURRENT_USER_ORDER_ROUTE } from "@/API/index.api.js";

const orderStatuses = [
  { value: "completed", label: "Hoàn thành" },
  { value: "processing", label: "Đang xử lý" },
  { value: "packaged", label: "Đã đóng gói" },
  { value: "shipping", label: "Đang giao" },
  { value: "cancelled", label: "Đã hủy" },
  { value: "pending", label: "Chờ xử lý" },
];

const OrderCard = ({ order, onViewDetails }) => (
  <Card className="mb-4">
    <CardContent className="pt-6">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm text-gray-500">
          {order.date
            ? new Date(order.date).toLocaleString("vi-VN")
            : new Date(order.createdAt).toLocaleString("vi-VN")}
        </span>
        <span className="text-sm font-medium">
          {order.type === "store" ? "Mua online" : "Mua tại nhà thuốc"}
        </span>
      </div>
      <div className="font-semibold">Mã đơn: {order.id}</div>
      <div className="text-lg font-bold text-green-600">
        {order.total.toLocaleString("vi-VN")}đ
      </div>
    </CardContent>
    <CardFooter>
      <Button onClick={() => onViewDetails(order.id, order.type || "store")}>
        Xem chi tiết
      </Button>
    </CardFooter>
  </Card>
);

const OrderHistory = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const resOrders = async () => {
      try {
        const res = await apiClient.get(GET_CURRENT_USER_ORDER_ROUTE);
        console.log(res);

        if (res.status === 200 && res.data.status === 200) {
          setOrders(res.data.data);
        } else {
          console.log("Lỗi khi lấy thông tin đơn hàng");
        }
      } catch (error) {
        console.log("Lỗi khi lấy thông tin đơn hàng:", error);
      }
    };

    resOrders();
  }, []);

  const filteredOrders =
    activeTab === "all"
      ? orders
      : orders.filter((order) => order.status === activeTab);

  const handleViewDetails = (orderId, type) => {
    navigate(`/account/history/${type}/${orderId}`);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-semibold mb-6">Lịch sử đơn hàng</h2>
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-4 lg:grid-cols-7 gap-2">
          <TabsTrigger value="all">Tất cả</TabsTrigger>
          {orderStatuses.map((status) => (
            <TabsTrigger key={status.value} value={status.value}>
              {status.label}
            </TabsTrigger>
          ))}
        </TabsList>
        <TabsContent value={activeTab} className="mt-6">
          {filteredOrders.map((order) => (
            <OrderCard
              key={order.id}
              order={order}
              onViewDetails={handleViewDetails}
            />
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default OrderHistory;
