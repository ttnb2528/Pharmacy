import axios from "axios";
import asyncHandler from "../middleware/asyncHandler.js";
import { jsonGenerate } from "../utils/helpers.js";
import { StatusCode } from "../utils/constants.js";

export const getProvinces = asyncHandler(async (req, res) => {
  try {
    const response = await axios.get(
      "https://vapi.vnappmob.com/api/v2/province"
    );
    if (response.status === 200) {
      return res.json(
        jsonGenerate(
          StatusCode.OK,
          "Lấy dữ liệu thành công",
          response.data.results
        )
      );
    } else {
      return res.json(jsonGenerate(StatusCode.SERVER_ERROR, "Lỗi server"));
    }
  } catch (error) {
    return res.json(jsonGenerate(StatusCode.SERVER_ERROR, error.message));
  }
});

export const getDistricts = asyncHandler(async (req, res) => {
  try {
    const { provinceId } = req.params;
    const response = await axios.get(
      `https://vapi.vnappmob.com/api/v2/province/district/${provinceId}`
    );
    if (response.status === 200) {
      return res.json(
        jsonGenerate(
          StatusCode.OK,
          "Lấy dữ liệu thành công",
          response.data.results
        )
      );
    } else {
      return res.json(jsonGenerate(StatusCode.SERVER_ERROR, "Lỗi server"));
    }
  } catch (error) {
    return res.json(jsonGenerate(StatusCode.SERVER_ERROR, error.message));
  }
});

export const getWards = asyncHandler(async (req, res) => {
  try {
    const { districtId } = req.params;
    const response = await axios.get(
      `https://vapi.vnappmob.com/api/v2/province/ward/${districtId}`
    );
    if (response.status === 200) {
      return res.json(
        jsonGenerate(
          StatusCode.OK,
          "Lấy dữ liệu thành công",
          response.data.results
        )
      );
    } else {
      return res.json(jsonGenerate(StatusCode.SERVER_ERROR, "Lỗi server"));
    }
  } catch (error) {
    return res.json(jsonGenerate(StatusCode.SERVER_ERROR, error.message));
  }
});
