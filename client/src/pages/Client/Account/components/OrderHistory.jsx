import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

const orderStatuses = [
  { value: "completed", label: "Hoàn thành" },
  { value: "processing", label: "Đang xử lý" },
  { value: "packed", label: "Đã đóng gói" },
  { value: "shipping", label: "Đang giao" },
  { value: "cancelled", label: "Đã hủy" },
  { value: "pending", label: "Chờ xử lý" },
  { value: "awaiting_payment", label: "Chờ thanh toán" },
];

const mockOrders = [
  {
    id: "ORD001",
    date: "2023-05-15T10:30:00",
    type: "online",
    status: "completed",
    total: 250000,
  },
  {
    id: "ORD002",
    date: "2023-05-16T14:45:00",
    type: "store",
    status: "processing",
    total: 180000,
  },
  // Add more mock orders as needed
];

const OrderCard = ({ order, onViewDetails }) => (
  <Card className="mb-4">
    <CardContent className="pt-6">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm text-gray-500">
          {new Date(order.date).toLocaleString("vi-VN")}
        </span>
        <span className="text-sm font-medium">
          {order.type === "online" ? "Mua online" : "Mua tại nhà thuốc"}
        </span>
      </div>
      <div className="font-semibold">Mã đơn: {order.id}</div>
      <div className="text-lg font-bold text-green-600">
        {order.total.toLocaleString("vi-VN")}đ
      </div>
    </CardContent>
    <CardFooter>
      <Button onClick={() => onViewDetails(order.id)}>Xem chi tiết</Button>
    </CardFooter>
  </Card>
);

const OrderHistory = () => {
  const [activeTab, setActiveTab] = useState("all");
  const navigate = useNavigate();

  const filteredOrders =
    activeTab === "all"
      ? mockOrders
      : mockOrders.filter((order) => order.status === activeTab);

  const handleViewDetails = (orderId) => {
    navigate(`/account/history/${orderId}`);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-semibold mb-6">Lịch sử đơn hàng</h2>
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-4 lg:grid-cols-8 gap-2">
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
