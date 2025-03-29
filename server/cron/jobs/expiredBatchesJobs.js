import cron from "node-cron";
import { updateExpiredBatchesStock } from "../handlers/expiredBatchesHandler.js";

export const setupExpiredBatchesJobs = () => {
  // Chạy hàng ngày lúc 0:01 sáng
  cron.schedule(
    "1 0 * * *",
    async () => {
      console.log("Bắt đầu kiểm tra lô hàng hết hạn...");
      try {
        const result = await updateExpiredBatchesStock();
        console.log(`Đã xử lý ${result.processed} lô hàng hết hạn`);
      } catch (error) {
        console.error(
          `Lỗi khi chạy tác vụ kiểm tra lô hàng hết hạn: ${error.message}`
        );
      }
    },
    {
      scheduled: true,
      timezone: "Asia/Ho_Chi_Minh", // Đặt múi giờ Việt Nam
    }
  );
};
