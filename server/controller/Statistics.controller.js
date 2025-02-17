import Batch from "../model/Batch.model.js";
import Order from "../model/Order.model.js";
import Bill from "../model/Bill.model.js";
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

export const getDailyRevenue = asyncHandler(async (req, res) => {
  const { startDate, endDate } = req.query;
  const start = new Date(startDate);
  const end = new Date(endDate);
  end.setHours(23, 59, 59, 999);

  // Tổng hợp doanh thu từ `Order`
  const orderRevenue = await Order.aggregate([
    {
      $match: {
        date: { $gte: start, $lte: end },
        status: "completed",
      },
    },
    {
      $group: {
        _id: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
        totalRevenue: { $sum: "$total" },
      },
    },
  ]);

  // Tổng hợp doanh thu từ `Bill`
  const billRevenue = await Bill.aggregate([
    {
      $match: {
        createdAt: { $gte: start, $lte: end },
        type: "sell",
      },
    },
    {
      $group: {
        _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
        totalRevenue: { $sum: "$total" },
      },
    },
  ]);

  // Map để gom dữ liệu theo ngày
  const revenueMap = new Map();

  orderRevenue.forEach(({ _id, totalRevenue }) => {
    if (!revenueMap.has(_id)) {
      revenueMap.set(_id, { date: _id, orders: 0, bills: 0, totalRevenue: 0 });
    }
    revenueMap.get(_id).orders += totalRevenue;
    revenueMap.get(_id).totalRevenue += totalRevenue;
  });

  billRevenue.forEach(({ _id, totalRevenue }) => {
    if (!revenueMap.has(_id)) {
      revenueMap.set(_id, { date: _id, orders: 0, bills: 0, totalRevenue: 0 });
    }
    revenueMap.get(_id).bills += totalRevenue;
    revenueMap.get(_id).totalRevenue += totalRevenue;
  });

  // Chuyển map thành array
  const revenueData = Array.from(revenueMap.values()).sort(
    (a, b) => new Date(a.date) - new Date(b.date)
  );

  res.json(
    jsonGenerate(
      StatusCode.OK,
      "Lấy doanh thu theo ngày thành công",
      revenueData
    )
  );
});
