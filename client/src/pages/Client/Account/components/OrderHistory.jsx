import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { apiClient } from "@/lib/api-client.js";
import { GET_CURRENT_USER_ORDER_ROUTE } from "@/API/index.api.js";
import { useMediaQuery } from "@/hook/use-media-query.js";
import MobileAccountHeaderChild from "./MobileAccountHeaderChild.jsx";
import { Search, ShoppingBag } from "lucide-react";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area.jsx";
import { Input } from "@/components/ui/input.jsx";

const orderStatuses = [
  { value: "completed", label: "Hoàn thành" },
  { value: "processing", label: "Đang xử lý" },
  { value: "packaged", label: "Đã đóng gói" },
  { value: "shipping", label: "Đang giao" },
  { value: "cancelled", label: "Đã hủy" },
  { value: "pending", label: "Chờ xử lý" },
];

const OrderCard = ({ order, onViewDetails }) => (
  <Card className="mb-4 overflow-hidden">
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
    <CardFooter className="bg-gray-50 py-3">
      <Button
        variant="outline"
        className="w-full border-green-500 text-green-600 hover:bg-green-50 hover:text-green-700"
        onClick={() => onViewDetails(order.id, order.type || "store")}
      >
        Xem chi tiết
      </Button>
    </CardFooter>
  </Card>
);

const EmptyOrderState = () => {
  const navigate = useNavigate();

  return (
    <div className="text-center py-12">
      <div className="flex justify-center mb-4">
        <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center">
          <ShoppingBag className="h-10 w-10 text-gray-400" />
        </div>
      </div>
      <h3 className="text-lg font-medium mb-2">Bạn chưa có đơn hàng nào</h3>
      <p className="text-gray-500 mb-6">
        Hãy mua sắm để có thể theo dõi đơn hàng tại đây
      </p>
      <Button
        className="bg-green-500 hover:bg-green-600"
        onClick={() => navigate("/")}
      >
        Mua sắm ngay
      </Button>
    </div>
  );
};

const OrderHistory = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [orders, setOrders] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const isMobile = useMediaQuery("(max-width: 640px)");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setIsLoading(true);
        const res = await apiClient.get(GET_CURRENT_USER_ORDER_ROUTE);

        if (res.status === 200 && res.data.status === 200) {
          setOrders(res.data.data);
        } else {
          console.log("Lỗi khi lấy thông tin đơn hàng");
        }
      } catch (error) {
        console.log("Lỗi khi lấy thông tin đơn hàng:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const filteredOrders = orders
    .filter((order) =>
      searchQuery
        ? String(order.id).toLowerCase().includes(searchQuery.toLowerCase())
        : true
    )
    .filter((order) =>
      activeTab === "all" ? true : order.status === activeTab
    );

  const handleViewDetails = (orderId, type) => {
    navigate(`/account/history/${type}/${orderId}`);
  };

  return (
    <>
      {isMobile && <MobileAccountHeaderChild title="Lịch sử mua hàng" />}

      <div
        className={`${isMobile ? "px-4 py-4" : "container mx-auto px-4 py-8"}`}
      >
        {!isMobile && (
          <h2 className="text-2xl font-semibold mb-6">Lịch sử đơn hàng</h2>
        )}

        {/* Search input */}
        <div className="relative mb-4">
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={18}
          />
          <Input
            placeholder="Tìm kiếm theo mã đơn hàng"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          {/* Horizontal scrollable tabs for mobile */}
          <div className="relative">
            <ScrollArea className="w-full whitespace-nowrap">
              <TabsList className="inline-flex w-max border-b border-b-transparent p-0">
                <TabsTrigger value="all">Tất cả</TabsTrigger>
                {orderStatuses.map((status) => (
                  <TabsTrigger
                    key={status.value}
                    value={status.value}
                    className="flex-shrink-0"
                  >
                    {status.label}
                  </TabsTrigger>
                ))}
              </TabsList>
              <ScrollBar orientation="horizontal" className="h-2" />
            </ScrollArea>
          </div>

          <TabsContent value={activeTab} className="mt-6">
            {isLoading ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
              </div>
            ) : filteredOrders.length > 0 ? (
              filteredOrders.map((order) => (
                <OrderCard
                  key={order.id}
                  order={order}
                  onViewDetails={handleViewDetails}
                />
              ))
            ) : (
              <EmptyOrderState />
            )}
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
};

export default OrderHistory;
