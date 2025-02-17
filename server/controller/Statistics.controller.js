import Batch from "../model/Batch.model.js";
import asyncHandler from "../middleware/asyncHandler.js";
import { StatusCode } from "../utils/constants.js";
import { jsonGenerate } from "../utils/helpers.js";

export const getExpiringMedicines = asyncHandler(async (req, res) => {
  try {
    const today = new Date();
    const nextMonth = new Date();
    nextMonth.setDate(today.getDate() + 30);

    const medicines = await Batch.find({
      expiryDate: { $gte: today, $lte: nextMonth },
    }).populate("MedicineId");

    res.json(
      jsonGenerate(StatusCode.OK, "Lấy thuốc sắp hết hạn thành công", medicines)
    );
  } catch (error) {
    res.json(jsonGenerate(StatusCode.SERVER_ERROR, error.message));
  }
});

export const getExpiredMedicines = asyncHandler(async (req, res) => {
  try {
    const today = new Date();

    const medicines = await Batch.find({
      expiryDate: { $lt: today },
    }).populate("MedicineId");

    res.json(
      jsonGenerate(StatusCode.OK, "Lấy thuốc đã hết hạn thành công", medicines)
    );
  } catch (error) {
    res.json(jsonGenerate(StatusCode.SERVER_ERROR, error.message));
  }
});
