import Bill from "../model/Bill.model.js";
import Medicine from "../model/Medicine.model.js";
import LoyaltyProgram from "../model/LoyaltyProgram.model.js";
import PointHistory from "../model/PointHistory.model.js";
import { jsonGenerate } from "../utils/helpers.js";
import { StatusCode } from "../utils/constants.js";
import asyncHandler from "../middleware/asyncHandler.js";
import { generateID } from "../utils/generateID.js";

export const createBill = asyncHandler(async (req, res) => {
  try {
    const { customer, prescription, medicines, total, billIsRx, type } =
      req.body;

    // Kiểm tra số lượng tồn kho
    for (const medicine of medicines) {
      const medicineInfo = await Medicine.findOne({
        _id: medicine.medicineId,
      });

      if (!medicineInfo || medicineInfo.quantityStock < medicine.quantity) {
        return res.json(
          jsonGenerate(
            StatusCode.BAD_REQUEST,
            `Thuốc ${medicine.name} không đủ số lượng trong kho`
          )
        );
      }
    }

    // Tạo bill
    let id = await generateID(Bill);
    let staffId = req.user._id;
    let name = req.user.isAdmin ? "Admin" : req.user.name;
    const staff = {
      staffId,
      name,
    };
    const newBill = new Bill({
      id: id,
      billIsRx,
      customer,
      prescription,
      medicines,
      total,
      type,
      staff,
    });

    const bill = await newBill.save();

    // Cập nhật số lượng tồn kho
    const bulkOps = medicines.map((medicine) => ({
      updateOne: {
        filter: { _id: medicine.medicineId },
        update: {
          $inc: {
            quantityStock: -medicine.quantity,
            sold: medicine.quantity,
          },
        },
      },
    }));

    await Medicine.bulkWrite(bulkOps);

    // Cộng điểm tích lũy (nếu có)
    if (customer.type === "loyalty") {
      const loyaltyProgram = await LoyaltyProgram.findOne({
        AccountId: customer.customerId,
      });

      if (loyaltyProgram) {
        let points = 0;
        switch (loyaltyProgram.rank) {
          case "Bạc":
            points = total * 0.01;
            break;
          case "Vàng":
            points = total * 0.015;
            break;
          case "Kim cương":
            points = total * 0.02;
            break;
          default:
            break;
        }

        await LoyaltyProgram.findOneAndUpdate(
          { AccountId: customer.customerId },
          {
            $inc: {
              points,
              totalSpending: total,
            },
          }
        );

        if (points > 0) {
          await PointHistory.create({
            AccountId: customer.customerId,
            billId: bill._id,
            change: points,
            createdAt: new Date(),
            description: `Tích điểm từ hóa đơn ${bill.id}`,
          });
        }

        res.json(
          jsonGenerate(
            StatusCode.CREATED,
            "Tạo hóa đơn và cộng điểm tích lũy thành công",
            bill
          )
        );
      }
    } else {
      res.json(
        jsonGenerate(StatusCode.CREATED, "Tạo hóa đơn thành công", bill)
      );
    }
  } catch (error) {
    res.json(jsonGenerate(StatusCode.SERVER_ERROR, error.message));
  }
});

export const getBills = asyncHandler(async (req, res) => {
  try {
    const bills = await Bill.find().sort();

    res.json(
      jsonGenerate(StatusCode.OK, "Lấy danh sách hóa đơn thành công", bills)
    );
  } catch (error) {
    res.json(jsonGenerate(StatusCode.SERVER_ERROR, error.message));
  }
});

// Thêm hàm lấy bill theo ID
export const getBillById = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    
    const bill = await Bill.findOne({ id: parseInt(id) });
    
    if (!bill) {
      return res.json(
        jsonGenerate(StatusCode.NOT_FOUND, "Không tìm thấy hóa đơn")
      );
    }
    
    res.json(
      jsonGenerate(StatusCode.OK, "Lấy thông tin hóa đơn thành công", bill)
    );
  } catch (error) {
    res.json(jsonGenerate(StatusCode.SERVER_ERROR, error.message));
  }
});

// Thêm hàm tạo hóa đơn hoàn trả
export const createReturnBill = asyncHandler(async (req, res) => {
  try {
    const { originalBillId, billIsRx, customer, medicines, total, reason } = req.body;
    
    // Kiểm tra hóa đơn gốc
    const originalBill = await Bill.findById(originalBillId);
    if (!originalBill) {
      return res.json(
        jsonGenerate(StatusCode.NOT_FOUND, "Không tìm thấy hóa đơn gốc")
      );
    }
    
    // Tạo hóa đơn hoàn trả
    let id = await generateID(Bill);
    let staffId = req.user._id;
    let name = req.user.isAdmin ? "Admin" : req.user.name;
    const staff = {
      staffId,
      name,
    };
    
    const newBill = new Bill({
      id,
      billIsRx,
      customer,
      medicines,
      total,
      type: "return", // Đánh dấu là hóa đơn hoàn trả
      reason,
      staff,
      originalBillId, // Lưu ID của hóa đơn gốc
    });
    
    const returnBill = await newBill.save();
    
    // Cập nhật số lượng tồn kho (tăng số lượng)
    const bulkOps = medicines.map((medicine) => ({
      updateOne: {
        filter: { _id: medicine.medicineId },
        update: {
          $inc: {
            quantityStock: medicine.quantity,
            sold: -medicine.quantity,
          },
        },
      },
    }));
    
    await Medicine.bulkWrite(bulkOps);
    
    // Xử lý điểm tích lũy nếu là khách hàng loyalty
    if (customer.type === "loyalty" && customer.customerId) {
      const loyaltyProgram = await LoyaltyProgram.findOne({
        AccountId: customer.customerId,
      });
      
      if (loyaltyProgram) {
        // Tính số điểm cần trừ
        let pointsToDeduct = 0;
        switch (loyaltyProgram.rank) {
          case "Bạc":
            pointsToDeduct = total * 0.01;
            break;
          case "Vàng":
            pointsToDeduct = total * 0.015;
            break;
          case "Kim cương":
            pointsToDeduct = total * 0.02;
            break;
          default:
            break;
        }
        
        // Trừ điểm và tổng chi tiêu
        await LoyaltyProgram.findOneAndUpdate(
          { AccountId: customer.customerId },
          {
            $inc: {
              points: -pointsToDeduct,
              totalSpending: -total,
            },
          }
        );
        
        // Ghi lại lịch sử điểm
        if (pointsToDeduct > 0) {
          await PointHistory.create({
            AccountId: customer.customerId,
            billId: returnBill._id,
            change: -pointsToDeduct,
            createdAt: new Date(),
            description: `Trừ điểm do hoàn trả hóa đơn ${returnBill.id}`,
          });
        }
      }
    }
    
    res.json(
      jsonGenerate(StatusCode.CREATED, "Hoàn trả sản phẩm thành công", returnBill)
    );
  } catch (error) {
    res.json(jsonGenerate(StatusCode.SERVER_ERROR, error.message));
  }
});
