import { useNavigate, useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { apiClient } from "@/lib/api-client.js";
import {
  GET_ORDER_DETAIL_ROUTE,
  UPDATE_STATUS_ORDER_ROUTE,
} from "@/API/index.api.js";
import { convertVND } from "@/utils/ConvertVND.js";
import { IoIosArrowBack } from "react-icons/io";
import { Button } from "@/components/ui/button.jsx";

const orderStatuses = [
  { value: import.meta.env.VITE_STATUS_ORDER_COMPLETED, vi: "Hoàn thành" },
  { value: import.meta.env.VITE_STATUS_ORDER_PROCESSING, vi: "Đang xử lý" },
  { value: import.meta.env.VITE_STATUS_ORDER_PACKED, vi: "Đã đóng gói" },
  { value: import.meta.env.VITE_STATUS_ORDER_SHIPPING, vi: "Đang giao" },
  { value: import.meta.env.VITE_STATUS_ORDER_CANCELED, vi: "Đã hủy" },
  { value: import.meta.env.VITE_STATUS_ORDER_PENDING, vi: "Chờ xử lý" },
];

const OrderDetail = () => {
  const { orderId } = useParams();
  const [orderDetail, setOrderDetail] = useState(null);
  const navigate = useNavigate();
  useEffect(() => {
    const resOrderDetail = async () => {
      try {
        const res = await apiClient.get(`${GET_ORDER_DETAIL_ROUTE}/${orderId}`);
        if (res.status === 200 && res.data.status === 200) {
          setOrderDetail(res.data.data);
        } else {
          console.log("Lỗi khi lấy thông tin đơn hàng");
        }
      } catch (error) {
        console.log("Lỗi khi lấy thông tin đơn hàng:", error);
      }
    };

    resOrderDetail();
  }, [orderId]);

  const handleCancelOrder = async () => {
    try {
      const res = await apiClient.put(
        `${UPDATE_STATUS_ORDER_ROUTE}/${orderId}`,
        { status: import.meta.env.VITE_STATUS_ORDER_CANCELED }
      );
      // if (res.status === 200 && res.data.status === 200) {
      //   console.log(res);
      //   navigate("/account/orders");
      // } else {
      //   console.log("Lỗi khi hủy đơn hàng");
      // }

      console.log(res);
      navigate("/account/history");
    } catch (error) {
      console.log("Lỗi khi hủy đơn hàng:", error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-semibold mb-6 flex items-center">
        <IoIosArrowBack
          className="px-4 w-auto cursor-pointer"
          onClick={() => navigate(-1)}
        />
        Chi tiết đơn hàng
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Thông tin người nhận</CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              <strong>Tên:</strong> {orderDetail?.orderId.nameCustomer}
            </p>
            {orderDetail?.orderId.address && (
              <p>
                <strong>Địa chỉ:</strong> {orderDetail?.orderId.address}
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
              <strong>Mã đơn hàng:</strong> {orderDetail?.orderId.id}
            </p>
            <p>
              <strong>Ngày đặt:</strong>{" "}
              {new Date(orderDetail?.orderId.date).toLocaleString("vi-VN")}
            </p>
            <p>
              <strong>Trạng thái:</strong>{" "}
              {orderDetail?.orderId.status &&
                orderStatuses.find(
                  (status) => status.value === orderDetail?.orderId.status
                )?.vi}
            </p>
            {orderDetail?.orderId?.status === "pending" && (
              <div className="flex justify-end">
                <Button
                  className="mt-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                  onClick={handleCancelOrder}
                >
                  Hủy đơn hàng
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Sản phẩm</CardTitle>
        </CardHeader>
        <CardContent>
          <div>
            {orderDetail?.items.map((item, index) => (
              <div key={index}>
                <div className="grid grid-cols-[1fr_calc(26rem/2)] gap-10 py-2">
                  <div className="flex items-center">
                    <div>
                      <img
                        src={item?.productId?.images[0]}
                        alt=""
                        className="w-10 h-10 object-cover border mr-4"
                      />
                    </div>
                    <div>
                      <div className="line-clamp-1">{item.name}</div>
                      <div className="text-sm text-gray-500">{item.unit}</div>
                    </div>
                  </div>

                  <div className="flex-1 flex justify-between">
                    <div>{item.quantity}x</div>
                    <div>
                      {item.discount > 0 ? (
                        <>
                          <span className="line-through mr-2 text-gray-500">
                            {convertVND(item.price)}
                          </span>
                          <span className="font-semibold">
                            {convertVND(item.price * (1 - item.discount / 100))}
                          </span>
                        </>
                      ) : (
                        <span className="font-semibold">
                          {convertVND(item.price)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                {index < orderDetail.items.length - 1 && (
                  <div className="border-b my-2"></div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Chi tiết thanh toán</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between mb-2">
            <span>Tiền hàng</span>
            <span>{convertVND(orderDetail?.orderId?.totalTemp)}</span>
          </div>
          <div className="flex justify-between mb-2">
            <span>Phí vận chuyển</span>
            <span>{convertVND(orderDetail?.orderId?.shippingFee)}</span>
          </div>
          {orderDetail?.orderId?.discountValue > 0 && (
            <div className="flex justify-between mb-2">
              <span>Giảm giá ưu đãi</span>
              <span>
                -
                {orderDetail?.orderId?.discountValue <= 100
                  ? `${orderDetail?.orderId?.discountValue}%`
                  : convertVND(orderDetail?.orderId?.discountValue)}
              </span>
            </div>
          )}
          <div className="flex justify-between mb-2">
            <span>Giảm giá sản phẩm</span>
            <span>-{convertVND(orderDetail?.orderId?.discountProduct)}</span>
          </div>
          <div className="border-t mt-2 pt-2">
            <div className="flex justify-between font-bold text-lg">
              <span>
                Tổng tiền (
                {orderDetail?.items.reduce(
                  (sum, item) => sum + item.quantity,
                  0
                )}{" "}
                sản phẩm)
              </span>
              <span className="text-red-600">
                {convertVND(orderDetail?.orderId?.total)}
              </span>
            </div>
          </div>
          <div className="mt-4">
            <strong>Phương thức thanh toán:</strong>{" "}
            {orderDetail?.orderId?.paymentMethod}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OrderDetail;
