import cron from "node-cron";
import { resetLoyaltyPrograms } from "../handlers/loyaltyProgramHandler.js";

export const setupLoyaltyProgramJobs = () => {
  // Cron job để reset LoyaltyProgram vào 0h ngày 1/1 hàng năm
  cron.schedule(
    "0 0 1 1 *",
    async () => {
      console.log("Bắt đầu reset Loyalty Program cho năm mới...");
      try {
        const result = await resetLoyaltyPrograms();
        console.log(
          `Loyalty Programs reset hoàn tất cho năm ${result.year}, đã xử lý ${result.processed} chương trình`
        );
      } catch (error) {
        console.error("Lỗi khi reset Loyalty Programs:", error);
      }
    },
    {
      scheduled: true,
      timezone: "Asia/Ho_Chi_Minh",
    }
  );

  // Bạn có thể thêm các cron jobs liên quan đến loyalty ở đây
};
