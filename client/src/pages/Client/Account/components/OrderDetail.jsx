import { useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const mockOrderDetails = {
  id: "ORD001",
  date: "2023-05-15T10:30:00",
  status: "completed",
  recipient: {
    name: "Nguyễn Văn A",
    address: "123 Đường ABC, Quận 1, TP.HCM",
  },
  items: [
    { id: 1, name: "Thuốc A", type: "Hộp", quantity: 2, price: 100000 },
    { id: 2, name: "Thuốc B", type: "Vỉ", quantity: 1, price: 50000 },
  ],
  subtotal: 250000,
  shippingFee: 30000,
  discount: 30000,
  total: 250000,
  paymentMethod: "COD",
};

const OrderDetail = () => {
  const { orderId } = useParams();
  const order = mockOrderDetails; // In a real app, fetch the order details using the orderId

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-semibold mb-6">Chi tiết đơn hàng</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Thông tin người nhận</CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              <strong>Tên:</strong> {order.recipient.name}
            </p>
            {order.recipient.address && (
              <p>
                <strong>Địa chỉ:</strong> {order.recipient.address}
              </p>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Thông tin đơn hàng</CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              <strong>Mã đơn hàng:</strong> {order.id}
            </p>
            <p>
              <strong>Ngày đặt:</strong>{" "}
              {new Date(order.date).toLocaleString("vi-VN")}
            </p>
            <p>
              <strong>Trạng thái:</strong> {order.status}
            </p>
          </CardContent>
        </Card>
      </div>
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Sản phẩm</CardTitle>
        </CardHeader>
        <CardContent>
          <table className="w-full">
            <thead>
              <tr>
                <th className="text-left">Sản phẩm</th>
                <th className="text-right">Số lượng</th>
                <th className="text-right">Giá</th>
              </tr>
            </thead>
            <tbody>
              {order.items.map((item) => (
                <tr key={item.id}>
                  <td>
                    {item.name} ({item.type})
                  </td>
                  <td className="text-right">{item.quantity}</td>
                  <td className="text-right">
                    {item.price.toLocaleString("vi-VN")}đ
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Chi tiết thanh toán</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between mb-2">
            <span>Tiền hàng</span>
            <span>{order.subtotal.toLocaleString("vi-VN")}đ</span>
          </div>
          <div className="flex justify-between mb-2">
            <span>Phí vận chuyển</span>
            <span>{order.shippingFee.toLocaleString("vi-VN")}đ</span>
          </div>
          <div className="flex justify-between mb-2">
            <span>Giảm giá sản phẩm</span>
            <span>-{order.discount.toLocaleString("vi-VN")}đ</span>
          </div>
          <div className="flex justify-between font-bold text-lg">
            <span>Tổng tiền</span>
            <span>{order.total.toLocaleString("vi-VN")}đ</span>
          </div>
          <div className="mt-4">
            <strong>Phương thức thanh toán:</strong> {order.paymentMethod}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OrderDetail;
