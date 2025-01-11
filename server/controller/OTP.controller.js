import otpGenerator from "otp-generator";
import { jsonGenerate } from "../utils/helpers.js";
import { StatusCode } from "../utils/constants.js";

export const createApplication = async (req, res) => {
  try {
    const response = await fetch(
      "https://nm1zz8.api.infobip.com/2fa/2/applications",
      {
        method: "POST",
        headers: {
          Authorization: `App ${process.env.API_KEY_INFO_BIP}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          name: "2fa test application",
          enabled: true,
          configuration: {
            pinAttempts: 3,
            allowMultiplePinVerifications: true,
            pinTimeToLive: "5m",
            verifyPinLimit: "1/3s",
            sendPinPerApplicationLimit: "5/1d",
            sendPinPerPhoneNumberLimit: "5/1d",
          },
        }),
      }
    );

    const data = await response.json(); // Lấy dữ liệu phản hồi

    // console.log(data); // Log phản hồi từ Infobip
    return res.json(jsonGenerate(StatusCode.OK, "success", data));
  } catch (error) {
    console.error(error);
    return res.json(jsonGenerate(StatusCode.INTERNAL_SERVER_ERROR, "failed"));
  }
};

export const setUpMessageTemplate = async (req, res) => {
  const { appId } = req.body;

  try {
    const response = await fetch(
      `https://nm1zz8.api.infobip.com/2fa/2/applications/${appId}/messages`,
      {
        method: "POST",
        headers: {
          Authorization: `App ${process.env.API_KEY_INFO_BIP}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          pinType: "NUMERIC",
          messageText: "Your pin is {{pin}}",
          pinLength: 6,
          senderId: "ServiceSMS",
        }),
      }
    );

    const data = await response.json(); // Lấy dữ liệu phản hồi

    // console.log(data); // Log phản hồi từ Infobip
    return res.json(jsonGenerate(StatusCode.OK, "success", data));
  } catch (error) {
    console.error(error);
    return res.json(jsonGenerate(StatusCode.INTERNAL_SERVER_ERROR, "failed"));
  }
};

export const deliveryPassCode = async (req, res) => {
  const { applicationId, messageId, phone } = req.body;
  try {
    const response = await fetch(`https://nm1zz8.api.infobip.com/2fa/2/pin`, {
      method: "POST",
      headers: {
        Authorization: `App ${process.env.API_KEY_INFO_BIP}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        applicationId: applicationId,
        messageId: messageId,
        from: "ServiceSMS",
        to: phone,
      }),
    });

    const data = await response.json(); // Lấy dữ liệu phản hồi

    // console.log(data); // Log phản hồi từ Infobip
    return res.json(jsonGenerate(StatusCode.OK, "success", data));
  } catch (error) {
    console.error(error);
    return res.json(jsonGenerate(StatusCode.INTERNAL_SERVER_ERROR, "failed"));
  }
};

export const verifyPassCode = async (req, res) => {
  const { pinId, pinCode } = req.body;

  try {
    const response = await fetch(
      `https://nm1zz8.api.infobip.com/2fa/2/pin/${pinId}/verify`,
      {
        method: "POST",
        headers: {
          Authorization: `App ${process.env.API_KEY_INFO_BIP}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          pin: pinCode,
        }),
      }
    );

    const data = await response.json(); // Lấy dữ liệu phản hồi

    // console.log(data); // Log phản hồi từ Infobip
    return res.json(jsonGenerate(StatusCode.OK, "success", data));
  } catch (error) {
    console.error(error);
    return res.json(jsonGenerate(StatusCode.INTERNAL_SERVER_ERROR, "failed"));
  }
};
