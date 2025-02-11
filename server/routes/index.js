import express from "express";
import AuthRouter from "./Auth.route.js";
import CustomerRouter from "./Customer.route.js";
import StaffRouter from "./Staff.route.js";
import MedicineRouter from "./Medicine.route.js";
import BrandRouter from "./Brand.route.js";
import CategoryRouter from "./Category.route.js";
import SupplierRouter from "./Supplier.route.js";
import ManufactureRouter from "./Manufacture.route.js";
import ShiftWorkRouter from "./ShiftWork.route.js";
import AddressRouter from "./Address.route.js";
import LocationRouter from "./Location.route.js";
import CouponRouter from "./Coupon.route.js";
import BatchRouter from "./Batch.route.js";
import OrderRouter from "./Order.route.js";
import PointHistoryRouter from "./PointHistory.route.js";
import BillRouter from "./Bill.route.js";
import OTPRouter from "./OTP.route.js";
import CloudinaryRouter from "./Cloudinary.route.js";

const app = express();

app.use("/auth", AuthRouter);
app.use("/customer", CustomerRouter);
app.use("/staff", StaffRouter);
app.use("/medicine", MedicineRouter);
app.use("/brand", BrandRouter);
app.use("/category", CategoryRouter);
app.use("/supplier", SupplierRouter);
app.use("/manufacture", ManufactureRouter);
app.use("/shiftWork", ShiftWorkRouter);
app.use("/address", AddressRouter);
app.use("/location", LocationRouter);
app.use("/coupon", CouponRouter);
app.use("/batch", BatchRouter);
app.use("/order", OrderRouter);
app.use("/pointHistory", PointHistoryRouter);
app.use("/bill", BillRouter);

app.use("/otp", OTPRouter);
app.use("/cloudinary", CloudinaryRouter);

export default app;
