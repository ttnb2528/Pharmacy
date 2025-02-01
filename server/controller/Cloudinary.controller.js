import cloudinary from "../config/cloudinary.js";
import { jsonGenerate } from "../utils/helpers.js";
import { StatusCode } from "../utils/constants.js";

export const removeImage = async (req, res, next) => {
  try {
    const { publicId } = req.body;

    const response = await cloudinary.uploader.destroy(publicId);

    console.log("Delete result:", response);

    return res.json(jsonGenerate(StatusCode.OK, "Xoá ảnh thành công"));
  } catch (error) {
    console.log(error);
    res.json(jsonGenerate(StatusCode.SERVER_ERROR, error.message));
  }
};
