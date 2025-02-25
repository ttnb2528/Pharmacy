import asyncHandler from "../middleware/asyncHandler.js";
import paypal from "@paypal/checkout-server-sdk";
import axios from "axios";

// Kiểm tra environment variables
if (!process.env.PAYPAL_CLIENT_ID || !process.env.PAYPAL_CLIENT_SECRET) {
  throw new Error("Missing PayPal API credentials");
}

// Tạo PayPal environment
const environment = new paypal.core.SandboxEnvironment(
  process.env.PAYPAL_CLIENT_ID,
  process.env.PAYPAL_CLIENT_SECRET
);
const client = new paypal.core.PayPalHttpClient(environment);

export const createPayPalOrder = async (req, res) => {
  try {
    const { total } = req.body;

    if (!total) {
      return res.status(400).json({
        success: false,
        message: "Total amount is required",
      });
    }

    // Chuyển đổi VND sang USD
    // const usdAmount = (total / 23000).toFixed(2);
    // Lấy tỷ giá từ API (ví dụ Open Exchange Rates)
    const exchangeRateResponse = await axios.get(
      "https://api.exchangerate-api.com/v4/latest/VND"
    );
    const exchangeRate = exchangeRateResponse.data.rates.USD; // Tỷ giá USD so với VND
    const usdAmount = (total * exchangeRate).toFixed(2);

    const request = new paypal.orders.OrdersCreateRequest();
    request.prefer("return=representation");
    request.requestBody({
      intent: "CAPTURE",
      purchase_units: [
        {
          amount: {
            currency_code: "USD",
            value: usdAmount,
          },
          description: "Payment for pharmacy order",
        },
      ],
    });

    const order = await client.execute(request);

    return res.status(200).json({
      success: true,
      orderID: order.result.id,
    });
  } catch (error) {
    console.error("PayPal Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to create PayPal order",
      error: error.message,
    });
  }
};
