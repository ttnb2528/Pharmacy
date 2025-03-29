import Batch from "../../model/Batch.model.js";
import Medicine from "../../model/Medicine.model.js";

export const updateExpiredBatchesStock = async () => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Tìm các lô hàng đã hết hạn nhưng chưa được xử lý
    const expiredBatches = await Batch.find({
      expiryDate: { $lt: today },
      isExpiredHandled: { $ne: true },
    }).populate("MedicineId");

    console.log(
      `Đã tìm thấy ${expiredBatches.length} lô hàng hết hạn cần xử lý`
    );

    let updatedCount = 0;
    for (const batch of expiredBatches) {
      // Giảm số lượng tồn kho của thuốc
      await Medicine.findByIdAndUpdate(
        batch.MedicineId._id,
        { $inc: { quantityStock: -batch.quantity } },
        { new: true }
      );

      // Đánh dấu lô hàng đã được xử lý
      await Batch.findByIdAndUpdate(
        batch._id,
        { isExpiredHandled: true },
        { new: true }
      );

      updatedCount++;
      console.log(
        `Đã xử lý lô hàng hết hạn: ${batch._id}, thuốc: ${batch.MedicineId.name}, số lượng: ${batch.quantity}`
      );
    }

    return {
      processed: updatedCount,
      batches: expiredBatches,
    };
  } catch (error) {
    console.error(`Lỗi khi xử lý lô hàng hết hạn: ${error.message}`);
    throw error;
  }
};
