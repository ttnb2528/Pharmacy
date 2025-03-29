import LoyaltyProgram from "../../model/LoyaltyProgram.model.js";
import PointHistory from "../../model/PointHistory.model.js";

export const resetLoyaltyPrograms = async () => {
  try {
    const programs = await LoyaltyProgram.find();
    const lastYear = new Date().getFullYear() - 1;
    let updatedCount = 0;

    for (const program of programs) {
      // Tính tổng chi tiêu của năm trước
      const pointHistories = await PointHistory.find({
        AccountId: program.AccountId,
        createdAt: {
          $gte: new Date(lastYear, 0, 1), // 1/1 năm trước
          $lt: new Date(lastYear + 1, 0, 1), // 1/1 năm hiện tại
        },
      }).populate("orderId");

      const totalSpendingLastYear = pointHistories.reduce((sum, history) => {
        return sum + (history.orderId ? history.orderId.total : 0);
      }, 0);

      // Quyết định hạng mới dựa trên tổng chi tiêu năm trước
      let newRank = "Bạc";
      if (totalSpendingLastYear >= 8000000) newRank = "Kim cương";
      else if (totalSpendingLastYear >= 4000000) newRank = "Vàng";

      // Reset totalSpending và cập nhật rank, lastResetDate
      await LoyaltyProgram.updateOne(
        { _id: program._id },
        {
          totalSpending: 0,
          rank: newRank,
          lastResetDate: new Date(lastYear + 1, 0, 1),
        }
      );

      updatedCount++;
      console.log(
        `Đã cập nhật chương trình khách hàng thân thiết: ${program._id}, hạng mới: ${newRank}, tổng chi tiêu năm trước: ${totalSpendingLastYear}`
      );
    }

    return {
      processed: updatedCount,
      year: lastYear + 1,
    };
  } catch (error) {
    console.error("Lỗi khi reset Loyalty Programs:", error);
    throw error;
  }
};
