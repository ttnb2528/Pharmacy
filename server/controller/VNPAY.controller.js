import moment from "moment";
import querystring from "qs";
import crypto from "crypto";
import axios from "axios";

// Hàm sắp xếp object
const sortObject = (obj) => {
  const sorted = {};
  const str = [];
  let key;
  for (key in obj) {
    if (obj.hasOwnProperty(key)) {
      str.push(encodeURIComponent(key));
    }
  }
  str.sort();
  for (key = 0; key < str.length; key++) {
    sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, "+");
  }
  return sorted;
};

// Controller: Tạo URL thanh toán
export const createPaymentUrl = (req, res, next) => {
  process.env.TZ = "Asia/Ho_Chi_Minh";

  const date = new Date();
  const createDate = moment(date).format("YYYYMMDDHHmmss");

  const ipAddr =
    req.headers["x-forwarded-for"] ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress ||
    req.connection.socket.remoteAddress;

  const tmnCode = process.env.VNPAY_TMN_CODE;
  const secretKey = process.env.VNPAY_HASH_SECRET;
  const vnpUrl = process.env.VNPAY_URL;
  const returnUrl = process.env.VNPAY_RETURN_URL;
  const orderId = req.body.orderId || moment(date).format("DDHHmmss");
  const amount = req.body.amount;
  const bankCode = req.body.bankCode;
  const locale = req.body.language || "vn";
  const currCode = "VND";

  let vnp_Params = {
    vnp_Version: "2.1.0",
    vnp_Command: "pay",
    vnp_TmnCode: tmnCode,
    vnp_Locale: locale,
    vnp_CurrCode: currCode,
    vnp_TxnRef: orderId,
    vnp_OrderInfo: `Thanh toan cho ma GD:${orderId}`,
    vnp_OrderType: "other",
    vnp_Amount: amount * 100,
    vnp_ReturnUrl: returnUrl,
    vnp_IpAddr: ipAddr,
    vnp_CreateDate: createDate,
  };

  if (bankCode) {
    vnp_Params["vnp_BankCode"] = bankCode;
  }

  vnp_Params = sortObject(vnp_Params);

  const signData = querystring.stringify(vnp_Params, { encode: false });
  const hmac = crypto.createHmac("sha512", secretKey);
  const signed = hmac.update(Buffer.from(signData, "utf-8")).digest("hex");
  vnp_Params["vnp_SecureHash"] = signed;

  console.log("VNPay Payment Params:", vnp_Params);
  console.log("Sign Data:", signData);
  console.log("Secret Key (masked):", secretKey.slice(0, 4) + "***");
  console.log("Secret Key (masked):", secretKey);

  const paymentUrl = `${vnpUrl}?${querystring.stringify(vnp_Params, {
    encode: false,
  })}`;

  res.json({ paymentUrl });
};

// Controller: Xử lý kết quả trả về từ VNPay
export const vnpayReturn = (req, res, next) => {
  let vnp_Params = req.query;
  const secureHash = vnp_Params["vnp_SecureHash"];

  delete vnp_Params["vnp_SecureHash"];
  delete vnp_Params["vnp_SecureHashType"];

  vnp_Params = sortObject(vnp_Params);

  const secretKey = process.env.VNPAY_HASH_SECRET;

  const signData = querystring.stringify(vnp_Params, { encode: false });
  const hmac = crypto.createHmac("sha512", secretKey);
  const signed = hmac.update(Buffer.from(signData, "utf-8")).digest("hex");

  if (secureHash === signed) {
    res.json({ code: vnp_Params["vnp_ResponseCode"], message: "Success" });
  } else {
    res.json({ code: "97", message: "Checksum failed" });
  }
};

// Controller: Hoàn tiền
export const refund = async (req, res, next) => {
  try {
    process.env.TZ = "Asia/Ho_Chi_Minh";

    const date = new Date();

    const vnp_TmnCode = process.env.VNPAY_TMN_CODE;
    const secretKey = process.env.VNPAY_HASH_SECRET;
    const vnpApi = process.env.VNPAY_API;

    const { orderId, transDate, amount, transType, user } = req.body;

    if (!orderId || !transDate || !amount) {
      return res.status(400).json({
        success: false,
        message: "Thiếu thông tin: orderId, transDate, hoặc amount",
      });
    }

    // Chuẩn bị các thông số
    const vnp_TxnRef = orderId;
    const vnp_TransactionDate = transDate;
    const vnp_Amount = amount * 100;
    const vnp_TransactionType = transType;
    const vnp_CreateBy = user;

    const currCode = "VND";

    const vnp_RequestId = moment(date).format("HHmmss");
    const vnp_Version = "2.1.0";
    const vnp_Command = "refund";
    const vnp_OrderInfo = `Hoan tien GD ma: ${vnp_TxnRef}`;

    // Lấy IP address
    const vnp_IpAddr =
      req.headers["x-forwarded-for"] ||
      req.connection.remoteAddress ||
      req.socket.remoteAddress ||
      req.connection.socket?.remoteAddress;

    const vnp_CreateDate = moment(date).format("YYYYMMDDHHmmss");

    const vnp_TransactionNo = "0";

    // Tạo chuỗi hash
    const data = [
      vnp_RequestId,
      vnp_Version,
      vnp_Command,
      vnp_TmnCode,
      vnp_TransactionType,
      vnp_TxnRef,
      vnp_Amount,
      vnp_TransactionNo,
      vnp_TransactionDate,
      vnp_CreateBy,
      vnp_CreateDate,
      vnp_IpAddr,
      vnp_OrderInfo,
    ].join("|");

    const hmac = crypto.createHmac("sha512", secretKey);
    const vnp_SecureHash = hmac
      .update(Buffer.from(data, "utf-8"))
      .digest("hex");

    // Tạo object dữ liệu gửi đi
    const dataObj = {
      vnp_RequestId,
      vnp_Version,
      vnp_Command,
      vnp_TmnCode,
      vnp_TransactionType,
      vnp_TxnRef,
      vnp_Amount,
      vnp_TransactionNo,
      vnp_CreateBy,
      vnp_OrderInfo,
      vnp_TransactionDate,
      vnp_CreateDate,
      vnp_IpAddr,
      vnp_SecureHash,
    };

    // Gửi request với axios
    const response = await axios.post(vnpApi, dataObj, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    console.log(response.data);
    res.json(response.data); // Trả về response cho client
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};
