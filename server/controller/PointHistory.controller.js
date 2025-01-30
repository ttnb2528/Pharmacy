import { jsonGenerate } from "../utils/helpers.js";
import { StatusCode } from "../utils/constants.js";
import asyncHandler from "../middleware/asyncHandler.js";
import PointHistory from "../model/PointHistory.model.js";

export const getPointHistories = asyncHandler(async (req, res) => {
  const pointHistories = await PointHistory.find().populate("orderId");

  return res.json(
    jsonGenerate(StatusCode.OK, "Lấy danh sách thành công", pointHistories)
  );
});
