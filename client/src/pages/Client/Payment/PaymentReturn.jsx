import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { apiClient } from "@/lib/api-client.js";
import {
  GET_ORDER_BY_VNP_TXN_REF,
  UPDATE_STATUS_ORDER_ROUTE,
  VNPAY_RETURN_ROUTE,
} from "@/API/index.api.js";
import { toast } from "sonner";

const PaymentReturn = () => {
  const [searchParams] = useSearchParams();

  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  useEffect(() => {
    const handleVNPayResponse = async () => {
      const vnpTxnRef = searchParams.get("vnp_TxnRef");
      const vnpTransactionDate = searchParams.get("vnp_PayDate");

      console.log("VNPay Return Params:", Object.fromEntries(searchParams));

      const res = await apiClient.get(VNPAY_RETURN_ROUTE, {
        params: Object.fromEntries(searchParams),
      });

      console.log("VNPay Return Response:", res.data);

      if (res.data.code === "00") {
        try {
          const orderRes = await apiClient.get(GET_ORDER_BY_VNP_TXN_REF, {
            params: { vnpTxnRef },
          });
          const orderMongoId = orderRes.data.data.order.id;

          const updateRes = await apiClient.put(
            `${UPDATE_STATUS_ORDER_ROUTE}/${orderMongoId}`,
            {
              status: import.meta.env.VITE_STATUS_ORDER_PENDING,
              vnpTransactionDate,
            }
          );

          if (updateRes.status === 200 && updateRes.data.status === 200) {
            toast.success("Thanh toán VNPay thành công!");
            await delay(500);
            window.location.href = "/";
          } else {
            throw new Error("Cập nhật đơn hàng thất bại");
          }
        } catch (error) {
          toast.error("Lỗi khi cập nhật đơn hàng");
          console.error(error);
          await delay(500);
          window.location.href = "/checkout";
        }
      } else {
        toast.error(`Thanh toán VNPay thất bại (Code: ${res.data.code})`);
        await delay(500);
        window.location.href = "/checkout";
      }
    };

    handleVNPayResponse();
  }, [searchParams]);

  return <div>Đang xử lý thanh toán...</div>;
};

export default PaymentReturn;
