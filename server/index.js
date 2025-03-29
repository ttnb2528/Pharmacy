import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import router from "./routes/index.js";
import LoyaltyProgram from "./model/LoyaltyProgram.model.js";
import PointHistory from "./model/PointHistory.model.js";
import cron from "node-cron";

dotenv.config();

connectDB();

const app = express();
const port = process.env.PORT || 8888;
const databaseURL = process.env.DATABASE_URL;

app.use(
  cors({
    origin: [
      process.env.CLIENT,
      process.env.ADMIN,
      process.env.CLOUDINARY,
      // test phone
      "http://10.2.9.205:5174",
    ],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// app.use(cors());

app.use("/api/v1", router);

// Cron job để reset LoyaltyProgram vào 0h ngày 1/1 hàng năm
cron.schedule("0 0 1 1 *", async () => {
  // Test 30s
  // cron.schedule("*/30 * * * * *", async () => {
  try {
    console.log("Starting Loyalty Program reset for new year...");
    const programs = await LoyaltyProgram.find();
    const lastYear = new Date().getFullYear() - 1;

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
    }
    console.log(`Loyalty Programs reset completed for year ${lastYear + 1}`);
  } catch (error) {
    console.error("Error resetting Loyalty Programs:", error);
  }
});

app.get("/", (req, res) => {
  res.send(`
    <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <title>Duong Thien Tan</title>
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css" integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossorigin="anonymous">
    <style>
    body{
      background:#eee;
  }
  
  .card{
      border:none;
  
      position:relative;
      overflow:hidden;
      border-radius:8px;
      cursor:pointer;
  }
  
  .card:before{
      
      content:"";
      position:absolute;
      left:0;
      top:0;
      width:4px;
      height:100%;
      background-color:#E1BEE7;
      transform:scaleY(1);
      transition:all 0.5s;
      transform-origin: bottom
  }
  
  .card:after{
      
      content:"";
      position:absolute;
      left:0;
      top:0;
      width:4px;
      height:100%;
      background-color:#8E24AA;
      transform:scaleY(0);
      transition:all 0.5s;
      transform-origin: bottom
  }
  
  .card:hover::after{
      transform:scaleY(1);
  }
  
  
  .fonts{
      font-size:11px;
  }
  
  .social-list{
      display:flex;
      list-style:none;
      justify-content:center;
      padding:0;
  }
  
  .social-list li{
      padding:10px;
      color:#8E24AA;
      font-size:19px;
  }
  
  
  .buttons button:nth-child(1){
         border:1px solid #8E24AA !important;
         color:#8E24AA;
         height:40px;
  }
  
  .buttons button:nth-child(1):hover{
         border:1px solid #8E24AA !important;
         color:#fff;
         height:40px;
         background-color:#8E24AA;
  }
  
  .buttons button:nth-child(2){
         border:1px solid #8E24AA !important;
         background-color:#8E24AA;
         color:#fff;
          height:40px;
  }
    </style>
  </head>
  <body>
  <div class="container mt-5">
      
      <div class="row d-flex justify-content-center">
          
          <div class="col-md-7">
              
              <div class="card p-3 py-4">
              SERVER RUNING
              </div>
              
          </div>
          
      </div>
      
  </div>
  </body>
  </html>
  
    `);
});

app.listen(port, () => {
  console.log(`
        \x1b[46m******************************************************* \x1b[0;30m
        \x1b[46m******************** SERVER RUNING ******************** \x1b[0;30m
        \x1b[46m**********************\x1b[0;32m PORT ${port} \x1b[46m********************** \x1b[0;30m
        \x1b[46m******************************************************* \x1b[0;30m
        \x1b[0;30m
        `);
});
