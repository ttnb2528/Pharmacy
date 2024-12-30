import express from "express";
import AuthRouter from "./Auth.route.js";
import CustomerRouter from "./Customer.route.js";
import StaffRouter from "./Staff.route.js";
import MedicineRouter from "./Medicine.route.js";
import BrandRouter from "./Brand.route.js";
import CategoryRouter from "./Category.route.js";
import SupplierRouter from "./Supplier.route.js";

const app = express();

app.use("/auth", AuthRouter);
app.use("/customer", CustomerRouter);
app.use("/staff", StaffRouter);
app.use("/medicine", MedicineRouter);
app.use("/brand", BrandRouter);
app.use("/category", CategoryRouter);
app.use("/supplier", SupplierRouter);

export default app;
