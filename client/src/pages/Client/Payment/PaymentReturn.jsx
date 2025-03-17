import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { apiClient } from "@/lib/api-client.js";
import {
  // UPDATE_STATUS_ORDER_ROUTE,
  VNPAY_RETURN_ROUTE,
  // GET_ORDER_BY_VNP_TXN_REF,
} from "@/API/index.api.js"; // Thêm route mới
import { toast } from "sonner";

const PaymentReturn = () => {
  const [searchParams] = useSearchParams();
  // const navigate = useNavigate();

  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  useEffect(() => {
    const handleVNPayResponse = async () => {
      // const vnpTxnRef = searchParams.get("vnp_TxnRef");

      // Kiểm tra chữ ký từ VNPay
      const res = await apiClient.get(VNPAY_RETURN_ROUTE, {
        params: Object.fromEntries(searchParams),
      });

      if (res.data.code === "00") {
        try {
          // Lấy orderMongoId từ vnp_TxnRef
          // const orderRes = await apiClient.get(GET_ORDER_BY_VNP_TXN_REF, {
          //   params: { vnpTxnRef },
          // });

          // const orderMongoId = orderRes.data.data.order.id;

          // const updateRes = await apiClient.put(
          //   `${UPDATE_STATUS_ORDER_ROUTE}/${orderMongoId}`,
          //   { status: import.meta.env.VITE_STATUS_ORDER_PROCESSING }
          // );

          // if (updateRes.status === 200 && updateRes.data.status === 200) {
          toast.success("Thanh toán VNPay thành công!");
          await delay(750);
          window.location.href = "/";
          // navigate("/");
          // }
        } catch (error) {
          toast.error("Lỗi khi cập nhật đơn hàng");
          console.error(error);
        }
      } else {
        toast.error(`Thanh toán VNPay thất bại (Code: ${res.data.code})`);
        await delay(750);
        window.location.href = "/checkout";
        // navigate("/checkout");
      }
    };

    handleVNPayResponse();
  }, [searchParams]);

  return <div>Đang xử lý thanh toán...</div>;
};

export default PaymentReturn;
