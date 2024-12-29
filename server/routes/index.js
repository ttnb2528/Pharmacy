import express from "express";
import AuthRouter from "./Auth.route.js";
import CustomerRouter from "./Customer.route.js";
import StaffRouter from "./Staff.route.js";

const app = express();

app.use("/auth", AuthRouter);
app.use("/customer", CustomerRouter);
app.use("/staff", StaffRouter);

export default app;
