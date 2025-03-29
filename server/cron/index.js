import { setupExpiredBatchesJobs } from "./jobs/expiredBatchesJobs.js";
import { setupLoyaltyProgramJobs } from "./jobs/loyaltyProgramJobs.js";

export const setupAllCronJobs = () => {
  console.log("Thiết lập tất cả cron jobs...");

  // Thiết lập các loại cron jobs
  setupExpiredBatchesJobs();
  setupLoyaltyProgramJobs();

  // Thêm các loại cron jobs khác ở đây

  console.log("Đã thiết lập tất cả cron jobs thành công");
};
