import { useNavigate, useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useEffect, useState } from "react";
import { apiClient } from "@/lib/api-client.js";
import {
  GET_ORDER_DETAIL_ROUTE,
  REFUND_ROUTE,
  UPDATE_STATUS_ORDER_ROUTE,
} from "@/API/index.api.js";
import { convertVND } from "@/utils/ConvertVND.js";
import { IoIosArrowBack } from "react-icons/io";
import { Button } from "@/components/ui/button.jsx";
import { toast } from "sonner";
import axios from "axios";
import Loading from "@/pages/component/Loading.jsx";
import { ArrowDownLeft, ShoppingBag } from "lucide-react";
import { useMediaQuery } from "@/hook/use-media-query.js";

const orderStatuses = [
  { value: import.meta.env.VITE_STATUS_ORDER_COMPLETED, vi: "Hoàn thành" },
  { value: import.meta.env.VITE_STATUS_ORDER_PROCESSING, vi: "Đang xử lý" },
  { value: import.meta.env.VITE_STATUS_ORDER_PACKED, vi: "Đã đóng gói" },
  { value: import.meta.env.VITE_STATUS_ORDER_SHIPPING, vi: "Đang giao" },
  { value: import.meta.env.VITE_STATUS_ORDER_CANCELED, vi: "Đã hủy" },
  { value: import.meta.env.VITE_STATUS_ORDER_PENDING, vi: "Chờ xử lý" },
  { value: import.meta.env.VITE_STATUS_ORDER_REFUNDED, vi: "Đã hoàn tiền" },
];

const OrderDetail = () => {
  const { type = "store", orderId } = useParams();
  const [orderDetail, setOrderDetail] = useState(null);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const isMobile = useMediaQuery("(max-width: 640px)");

  // Xác định xem đơn hàng có phải là đơn hoàn tiền không
  const isRefundOrder = orderDetail?.type === "return";

  // Tạo badge hiển thị loại đơn hàng
  const getOrderTypeBadge = () => {
    if (isRefundOrder) {
      return (
        <Badge variant="destructive" className="flex items-center gap-1 ml-2">
          <ArrowDownLeft className="h-3 w-3" />
          Hoàn tiền
        </Badge>
      );
    }
    return (
      <Badge
        variant="default"
        className="bg-green-500 flex items-center gap-1 ml-2"
      >
        <ShoppingBag className="h-3 w-3" />
        Mua hàng
      </Badge>
    );
  };

  useEffect(() => {
    const resOrderDetail = async () => {
      try {
        const res = await apiClient.get(
          `${GET_ORDER_DETAIL_ROUTE}/${type}/${orderId}`,
          {
            type: "order",
          }
        );

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

  // Hàm lấy access token PayPal
  const getPayPalAccessToken = async () => {
    const authResponse = await axios.post(
      "https://api-m.sandbox.paypal.com/v1/oauth2/token",
      "grant_type=client_credentials",
      {
        headers: {
          Authorization: `Basic ${btoa(
            `${import.meta.env.VITE_PAYPAL_CLIENT_ID}:${
              import.meta.env.VITE_PAYPAL_SECRET
            }`
          )}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );
    return authResponse.data.access_token;
  };

  // Hàm refund PayPal
  const refundPayPalPayment = async (paypalCaptureId, amount) => {
    try {
      setIsLoading(true);
      const accessToken = await getPayPalAccessToken();
      const exchangeRateResponse = await axios.get(
        "https://api.exchangerate-api.com/v4/latest/VND"
      );
      const exchangeRate = exchangeRateResponse.data.rates.USD;
      const usdAmount = (amount * exchangeRate).toFixed(2);

      const refundResponse = await axios.post(
        `https://api-m.sandbox.paypal.com/v2/payments/captures/${paypalCaptureId}/refund`,
        {
          amount: {
            value: usdAmount,
            currency_code: "USD",
          },
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log(refundResponse);

      if (refundResponse.status === 201) {
        toast.success("Hoàn tiền qua PayPal thành công!");
        return refundResponse.data;
      }
    } catch (error) {
      console.error("Lỗi khi hoàn tiền qua PayPal:", error);
      throw new Error("Không thể hoàn tiền qua PayPal");
    } finally {
      setIsLoading(false);
    }
  };

  const refundVNPayPayment = async (vnpTxnRef, vnpTransactionDate, amount) => {
    try {
      setIsLoading(true);

      // Kiểm tra và log dữ liệu đầu vào
      if (!vnpTxnRef || !vnpTransactionDate || !amount) {
        throw new Error(
          "Thiếu thông tin cần thiết: vnpTxnRef, vnpTransaction [vnpTxnRef: " +
            vnpTxnRef +
            ", vnpTransactionDate: " +
            vnpTransactionDate +
            ", amount: " +
            amount +
            "]"
        );
      }

      console.log("Refund VNPay Data:", {
        vnpTxnRef,
        vnpTransactionDate,
        amount,
      });

      const refundData = {
        orderId: vnpTxnRef,
        transDate: vnpTransactionDate,
        amount: amount,
        transType: "02",
        user: "admin",
      };

      const res = await apiClient.post(REFUND_ROUTE, refundData);

      if (res.status === 200 && res.data.vnp_ResponseCode === "00") {
        // toast.success("Hoàn tiền qua VNPay thành công!");
        return res.data;
      } else {
        // console.error("Refund VNPay Response:", res.data);
        throw new Error(
          `Hoàn tiền thất bại (Code: ${res.data.data.vnp_ResponseCode})`
        );
      }
    } catch (error) {
      console.error("Lỗi khi hoàn tiền qua VNPay:", error);
      throw new Error("Không thể hoàn tiền qua VNPay");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelOrder = async () => {
    try {
      setIsLoading(true);
      const paymentMethod = orderDetail?.orderId?.paymentMethod;

      console.log("Order Detail for Refund:", {
        paymentMethod,
        paypalCaptureId: orderDetail?.orderId?.paypalCaptureId,
        vnpTxnRef: orderDetail?.orderId?.vnpTxnRef,
        vnpTransactionDate: orderDetail?.orderId?.vnpTransactionDate,
        total: orderDetail?.orderId?.total,
      });

      if (paymentMethod === "PAYPAL" && orderDetail?.orderId?.paypalCaptureId) {
        await refundPayPalPayment(
          orderDetail.orderId.paypalCaptureId,
          orderDetail.orderId.total
        );
      } else if (
        paymentMethod === "VNPAY" &&
        orderDetail?.orderId?.vnpTxnRef &&
        orderDetail?.orderId?.vnpTransactionDate
      ) {
        await refundVNPayPayment(
          orderDetail.orderId.vnpTxnRef,
          orderDetail.orderId.vnpTransactionDate,
          orderDetail.orderId.total
        );
      }

      const res = await apiClient.put(
        `${UPDATE_STATUS_ORDER_ROUTE}/${orderId}`,
        { status: import.meta.env.VITE_STATUS_ORDER_CANCELED }
      );

      if (res.status === 200 && res.data.status === 200) {
        toast.success("Đơn hàng đã được hủy thành công!");
        navigate("/account/history");
      } else {
        toast.error("Lỗi khi cập nhật trạng thái đơn hàng");
      }
    } catch (error) {
      toast.error(error.message || "Lỗi khi hủy đơn hàng");
      console.error("Lỗi khi hủy đơn hàng:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {isLoading && <Loading />}
      <div className="container mx-auto px-4 py-8">
        <h2 className="text-2xl font-semibold mb-6 flex items-center">
          <IoIosArrowBack
            className={`${isMobile ? "" : "px-4"} w-auto cursor-pointer"`}
            onClick={() => navigate(-1)}
          />
          Chi tiết đơn hàng
          {getOrderTypeBadge()}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <Card>
            <CardHeader className={`${type === "store" ? "" : "pb-3"}`}>
              <CardTitle>Thông tin người nhận</CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                <strong>Tên:</strong>{" "}
                {type === "store"
                  ? orderDetail?.orderId.nameCustomer
                  : orderDetail?.customer.name}
              </p>
              {type === "store" && (
                <p>
                  <strong>Địa chỉ:</strong> {orderDetail?.orderId.address}
                </p>
              )}
              {isRefundOrder && orderDetail?.orderId?.reason && (
                <p className="mt-2">
                  <strong>Lý do hoàn tiền:</strong>{" "}
                  <span className="text-red-500">
                    {orderDetail.orderId.reason}
                  </span>
                </p>
              )}
              {isRefundOrder && orderDetail?.orderId?.originalBillId && (
                <p>
                  <strong>Mã đơn hàng gốc:</strong> #
                  {orderDetail.orderId.originalBillId}
                </p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className={`${type === "store" ? "" : "pb-2"}`}>
              <CardTitle>Thông tin đơn hàng</CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                <strong>Mã đơn hàng:</strong>{" "}
                {type === "store" ? orderDetail?.orderId.id : orderDetail?.id}
              </p>
              <p>
                <strong>Ngày đặt:</strong>{" "}
                {type === "store"
                  ? new Date(orderDetail?.orderId.date).toLocaleString("vi-VN")
                  : new Date(orderDetail?.createdAt).toLocaleString("vi-VN")}
              </p>
              {type === "store" && (
                <p>
                  <strong>Trạng thái:</strong>{" "}
                  <span className={isRefundOrder ? "text-red-500" : ""}>
                    {orderDetail?.orderId.status &&
                      orderStatuses.find(
                        (status) => status.value === orderDetail?.orderId.status
                      )?.vi}
                  </span>
                </p>
              )}

              {isRefundOrder && orderDetail?.orderId?.refundDate && (
                <p>
                  <strong>Ngày hoàn tiền:</strong>{" "}
                  {new Date(orderDetail.orderId.refundDate).toLocaleString(
                    "vi-VN"
                  )}
                </p>
              )}

              {type === "store" &&
                orderDetail?.orderId?.status === "pending" &&
                !isRefundOrder && (
                  <div className="flex justify-end">
                    <Button
                      className="mt-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                      onClick={handleCancelOrder}
                      disabled={isLoading}
                    >
                      {isLoading ? "Đang xử lý..." : "Hủy đơn hàng"}
                    </Button>
                  </div>
                )}
            </CardContent>
          </Card>
        </div>
        {type !== "store" && (
          <Card className="mb-6">
            <CardHeader className="pb-2">
              <CardTitle>Địa chỉ nhà thuốc</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Ký túc xá A, Đại học Cần Thơ</p>
            </CardContent>
          </Card>
        )}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Sản phẩm</CardTitle>
          </CardHeader>
          <CardContent>
            <div>
              {(type === "store"
                ? orderDetail?.items
                : orderDetail?.medicines
              )?.map((item, index) => (
                <div key={index}>
                  {/* Thay đổi cấu trúc grid cho responsive tốt hơn */}
                  <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-3 py-2">
                    {/* Thông tin sản phẩm */}
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <img
                          src={
                            type === "store"
                              ? item?.productId?.images[0]
                              : item?.image
                          }
                          alt=""
                          className="w-10 h-10 object-cover border mr-4"
                        />
                      </div>
                      <div className="min-w-0 flex-grow">
                        <div className="line-clamp-1 font-medium">{item.name}</div>
                        <div className="text-sm text-gray-500">{item.unit}</div>
                      </div>
                    </div>
                    
                    {/* Giá và số lượng */}
                    <div className="flex justify-between gap-2 items-center sm:ml-auto sm:w-[140px] sm:flex-shrink-0 flex-row-reverse sm:flex-row">
                      <div className="text-sm">{item.quantity}x</div>
                      <div className="text-right">
                        {item.discount > 0 ? (
                          <div className="flex gap-2 items-center">
                            <div className="line-through text-xs text-gray-500">
                              {convertVND(item.price)}
                            </div>
                            <div className="font-semibold">
                              {convertVND(
                                item.price * (1 - item.discount / 100)
                              )}
                            </div>
                          </div>
                        ) : (
                          <span className="font-semibold">
                            {convertVND(item.price)}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  {index <
                    (type === "store"
                      ? orderDetail?.items
                      : orderDetail?.medicines
                    )?.length -
                      1 && <div className="border-b my-2"></div>}
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
              <span>
                {type === "store"
                  ? convertVND(orderDetail?.orderId?.totalTemp)
                  : convertVND(orderDetail?.total)}
              </span>
            </div>
            <div className="flex justify-between mb-2">
              <span>Phí vận chuyển</span>
              <span>
                {type === "store"
                  ? convertVND(orderDetail?.orderId?.shippingFee)
                  : convertVND(0)}
              </span>
            </div>
            {type === "store" && orderDetail?.orderId?.discountValue > 0 && (
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
            {type === "store" && (
              <div className="flex justify-between mb-2">
                <span>Giảm giá sản phẩm</span>
                <span>
                  -{convertVND(orderDetail?.orderId?.discountProduct)}
                </span>
              </div>
            )}
            <div className="border-t mt-2 pt-2">
              <div className="flex justify-between font-bold text-lg">
                <span>
                  {isRefundOrder ? "Tổng hoàn tiền" : "Tổng tiền"} (
                  {(type === "store"
                    ? orderDetail?.items
                    : orderDetail?.medicines
                  )?.reduce((sum, item) => sum + item.quantity, 0)}{" "}
                  sản phẩm)
                </span>
                <span
                  className={isRefundOrder ? "text-red-600" : "text-red-600"}
                >
                  {isRefundOrder ? "-" : ""}
                  {type === "store"
                    ? convertVND(orderDetail?.orderId?.total)
                    : convertVND(orderDetail?.total)}
                </span>
              </div>
            </div>
            <div className="mt-4">
              <strong>Phương thức thanh toán:</strong>{" "}
              {type == "store" ? orderDetail?.orderId?.paymentMethod : "COD"}
              {isRefundOrder && (
                <span className="ml-2 text-red-500">(Đã hoàn tiền)</span>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default OrderDetail;
