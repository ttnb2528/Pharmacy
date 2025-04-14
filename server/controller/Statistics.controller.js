import Batch from "../model/Batch.model.js";
import Order from "../model/Order.model.js";
import Bill from "../model/Bill.model.js";
import asyncHandler from "../middleware/asyncHandler.js";
import { StatusCode } from "../utils/constants.js";
import { jsonGenerate } from "../utils/helpers.js";
import Customer from "../model/Customer.model.js";
import Medicine from "../model/Medicine.model.js";

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

  // Tổng hợp doanh thu từ `Bill` - hóa đơn bán hàng
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
  
  // Tổng hợp giá trị hoàn trả từ `Bill` - hóa đơn hoàn trả
  const returnRevenue = await Bill.aggregate([
    {
      $match: {
        createdAt: { $gte: start, $lte: end },
        type: "return",  // Lấy các hóa đơn hoàn trả
      },
    },
    {
      $group: {
        _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
        totalReturn: { $sum: "$total" },  // Tổng giá trị hoàn trả
      },
    },
  ]);

  // Map để gom dữ liệu theo ngày
  const revenueMap = new Map();

  // Xử lý doanh thu từ đơn hàng trực tuyến
  orderRevenue.forEach(({ _id, totalRevenue }) => {
    if (!revenueMap.has(_id)) {
      revenueMap.set(_id, { date: _id, orders: 0, bills: 0, returns: 0, totalRevenue: 0 });
    }
    revenueMap.get(_id).orders += totalRevenue;
    revenueMap.get(_id).totalRevenue += totalRevenue;
  });

  // Xử lý doanh thu từ hóa đơn bán tại quầy
  billRevenue.forEach(({ _id, totalRevenue }) => {
    if (!revenueMap.has(_id)) {
      revenueMap.set(_id, { date: _id, orders: 0, bills: 0, returns: 0, totalRevenue: 0 });
    }
    revenueMap.get(_id).bills += totalRevenue;
    revenueMap.get(_id).totalRevenue += totalRevenue;
  });
  
  // Xử lý giảm trừ từ hóa đơn hoàn trả
  returnRevenue.forEach(({ _id, totalReturn }) => {
    if (!revenueMap.has(_id)) {
      revenueMap.set(_id, { date: _id, orders: 0, bills: 0, returns: 0, totalRevenue: 0 });
    }
    revenueMap.get(_id).returns += totalReturn;
    revenueMap.get(_id).totalRevenue -= totalReturn;  // Trừ giá trị hoàn trả khỏi doanh thu
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

export const getMonthlyRevenue = asyncHandler(async (req, res) => {
  try {
    const { year, type = "all" } = req.query;
    const selectedYear = parseInt(year) || new Date().getFullYear();

    // Khởi tạo dữ liệu đủ 12 tháng
    const revenueByMonth = Array.from({ length: 12 }, (_, i) => ({
      month: i + 1,
      total: 0,
    }));

    // Truy vấn hóa đơn và đơn hàng theo năm
    const bills =
      type === "all" || type === "bills"
        ? await Bill.find({
            createdAt: {
              $gte: new Date(`${selectedYear}-01-01`),
              $lt: new Date(`${selectedYear + 1}-01-01`),
            },
            type: "sell", // Thêm điều kiện lọc chỉ lấy hóa đơn bán hàng
          })
        : [];

    // Trừ đi giá trị của hóa đơn hoàn trả nếu muốn tính chính xác hơn
    const returnBills =
      type === "all" || type === "bills"
        ? await Bill.find({
            createdAt: {
              $gte: new Date(`${selectedYear}-01-01`),
              $lt: new Date(`${selectedYear + 1}-01-01`),
            },
            type: "return", // Lấy hóa đơn hoàn trả
          })
        : [];

    const orders =
      type === "all" || type === "orders"
        ? await Order.find({
            date: {
              $gte: new Date(`${selectedYear}-01-01`),
              $lt: new Date(`${selectedYear + 1}-01-01`),
            },
            status: "completed",
          })
        : [];

    // Cộng tổng doanh thu theo tháng cho hóa đơn bán và đơn hàng
    [...bills, ...orders].forEach((item) => {
      const itemDate = new Date(item.createdAt || item.date);
      const monthIndex = itemDate.getMonth(); // Lấy chỉ số tháng (0-11)
      revenueByMonth[monthIndex].total += item.total;
    });

    // Trừ đi giá trị hoàn trả
    returnBills.forEach((item) => {
      const itemDate = new Date(item.createdAt);
      const monthIndex = itemDate.getMonth();
      revenueByMonth[monthIndex].total -= item.total; // Trừ giá trị hoàn trả
    });

    res.json(
      jsonGenerate(
        StatusCode.OK,
        "Lấy doanh thu theo tháng thành công",
        revenueByMonth
      )
    );
  } catch (error) {
    res.json(jsonGenerate(StatusCode.SERVER_ERROR, error.message));
  }
});

export const getDashboardOverview = asyncHandler(async (req, res) => {
  try {
    const today = new Date();

    // Khoảng thời gian tháng hiện tại
    const startOfThisMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const endOfThisMonth = new Date(
      today.getFullYear(),
      today.getMonth() + 1,
      0
    );

    // Khoảng thời gian tháng trước
    const startOfLastMonth = new Date(
      today.getFullYear(),
      today.getMonth() - 1,
      1
    );
    const endOfLastMonth = new Date(today.getFullYear(), today.getMonth(), 0);

    // 🔹 Lấy tổng doanh thu tháng này
    const billsThisMonth = await Bill.find({
      createdAt: { $gte: startOfThisMonth, $lte: endOfThisMonth },
      type: "sell", // Chỉ lấy hóa đơn bán hàng
    });

    // Lấy hóa đơn hoàn trả tháng này
    const returnBillsThisMonth = await Bill.find({
      createdAt: { $gte: startOfThisMonth, $lte: endOfThisMonth },
      type: "return",
    });

    const ordersThisMonth = await Order.find({
      date: { $gte: startOfThisMonth, $lte: endOfThisMonth },
      status: "completed",
    });

    // Cộng doanh thu bán hàng và trừ đi hoàn trả
    const totalRevenueThisMonth =
      [...billsThisMonth, ...ordersThisMonth].reduce(
        (total, item) => total + item.total,
        0
      ) - returnBillsThisMonth.reduce((total, item) => total + item.total, 0);

    // 🔹 Lấy tổng doanh thu tháng trước - ĐÃ SỬA
    const billsLastMonth = await Bill.find({
      createdAt: { $gte: startOfLastMonth, $lte: endOfLastMonth },
      type: "sell", // Chỉ lấy hóa đơn bán hàng
    });

    // Lấy hóa đơn hoàn trả tháng trước
    const returnBillsLastMonth = await Bill.find({
      createdAt: { $gte: startOfLastMonth, $lte: endOfLastMonth },
      type: "return",
    });

    const ordersLastMonth = await Order.find({
      date: { $gte: startOfLastMonth, $lte: endOfLastMonth },
      status: "completed",
    });

    // Cộng doanh thu bán hàng và trừ đi hoàn trả
    const totalRevenueLastMonth =
      [...billsLastMonth, ...ordersLastMonth].reduce(
        (total, item) => total + item.total,
        0
      ) - returnBillsLastMonth.reduce((total, item) => total + item.total, 0);

    // 🔥 Tính phần trăm thay đổi doanh thu
    const revenueChange =
      totalRevenueLastMonth === 0
        ? 100
        : ((totalRevenueThisMonth - totalRevenueLastMonth) /
            totalRevenueLastMonth) *
          100;

    // 🔹 Lấy số đơn hàng tháng này
    const totalOrdersThisMonth = await Order.countDocuments({
      date: { $gte: startOfThisMonth, $lte: endOfThisMonth },
      status: "completed",
    });

    // 🔹 Lấy số đơn hàng tháng trước
    const totalOrdersLastMonth = await Order.countDocuments({
      date: { $gte: startOfLastMonth, $lte: endOfLastMonth },
      status: "completed",
    });

    // 🔥 Tính phần trăm thay đổi số đơn hàng
    const ordersChange =
      totalOrdersLastMonth === 0
        ? 100
        : ((totalOrdersThisMonth - totalOrdersLastMonth) /
            totalOrdersLastMonth) *
          100;

    // 🔹 Lấy số khách hàng mới tháng này
    const newCustomersThisMonth = await Customer.countDocuments({
      createdAt: { $gte: startOfThisMonth, $lte: endOfThisMonth },
    });

    // 🔹 Lấy số khách hàng mới tháng trước
    const newCustomersLastMonth = await Customer.countDocuments({
      createdAt: { $gte: startOfLastMonth, $lte: endOfLastMonth },
    });

    // 🔥 Tính phần trăm thay đổi số khách hàng mới
    const customersChange =
      newCustomersLastMonth === 0
        ? 100
        : ((newCustomersThisMonth - newCustomersLastMonth) /
            newCustomersLastMonth) *
          100;

    // 🔹 Lấy sản phẩm bán chạy nhất
    const bestSellingProduct = await Medicine.findOne()
      .sort({ sold: -1 }) // Sắp xếp theo số lượng bán ra
      .select("_id name sold description images");

    // 🔹 Lấy doanh thu theo ngày trong 30 ngày
    const startOfLast30Days = new Date();
    startOfLast30Days.setDate(today.getDate() - 30);

    // Lấy doanh thu từ Order
    const orderRevenue = await Order.aggregate([
      {
        $match: {
          date: { $gte: startOfLast30Days, $lte: today },
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

    // Lấy doanh thu từ Bill
    const billRevenue = await Bill.aggregate([
      {
        $match: {
          createdAt: { $gte: startOfLast30Days, $lte: today },
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

    // Gộp dữ liệu Order và Bill
    const revenueMap = new Map();

    orderRevenue.forEach(({ _id, totalRevenue }) => {
      if (!revenueMap.has(_id)) {
        revenueMap.set(_id, {
          date: _id,
          orders: 0,
          bills: 0,
          totalRevenue: 0,
        });
      }
      revenueMap.get(_id).orders += totalRevenue;
      revenueMap.get(_id).totalRevenue += totalRevenue;
    });

    billRevenue.forEach(({ _id, totalRevenue }) => {
      if (!revenueMap.has(_id)) {
        revenueMap.set(_id, {
          date: _id,
          orders: 0,
          bills: 0,
          totalRevenue: 0,
        });
      }
      revenueMap.get(_id).bills += totalRevenue;
      revenueMap.get(_id).totalRevenue += totalRevenue;
    });

    // Chuyển map thành array và sắp xếp theo ngày
    const dailyRevenue = Array.from(revenueMap.values()).sort(
      (a, b) => new Date(a.date) - new Date(b.date)
    );

    res.json(
      jsonGenerate(StatusCode.OK, "Lấy dữ liệu dashboard thành công", {
        totalRevenue: totalRevenueThisMonth,
        revenueChange: revenueChange.toFixed(1), // Làm tròn 1 số thập phân
        totalOrders: totalOrdersThisMonth,
        ordersChange: ordersChange.toFixed(1),
        newCustomers: newCustomersThisMonth,
        customersChange: customersChange.toFixed(1),
        bestSellingProduct,
        dailyRevenue,
      })
    );
  } catch (error) {
    res.json(jsonGenerate(StatusCode.SERVER_ERROR, error.message));
  }
});
