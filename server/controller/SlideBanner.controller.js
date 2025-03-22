import SlideBanner from "../model/SlideBanner.model.js";
import { jsonGenerate } from "../utils/helpers.js";
import { StatusCode } from "../utils/constants.js";
import asyncHandler from "../middleware/asyncHandler.js";
import { generateID } from "../utils/generateID.js";
import Joi from "joi";

export const createSliderBanner = asyncHandler(async (req, res) => {
  const { error } = validate(req.body);

  if (error) {
    return res.json(
      jsonGenerate(StatusCode.BAD_REQUEST, error.details[0].message)
    );
  }

  let id = await generateID(SlideBanner);

  const newSlideBanner = new SlideBanner({ id, ...req.body });
  const slideBanner = await newSlideBanner.save();

  return res.json(
    jsonGenerate(
      StatusCode.CREATED,
      "Thêm slide banner thành công",
      slideBanner
    )
  );
});

export const updateImageSliderBanner = asyncHandler(async (req, res) => {
  const id = req.params.id;

  const slideBanner = await SlideBanner.findById(id);

  if (!slideBanner) {
    return res.json(
      jsonGenerate(StatusCode.NOT_FOUND, "Slide banner không tồn tại")
    );
  }

  const newSlideBanner = await SlideBanner.findByIdAndUpdate(
    id,
    { image: req.body.image },
    { new: true }
  );

  return res.json(
    jsonGenerate(
      StatusCode.OK,
      "Cập nhật hình ảnh slide banner thành công",
      newSlideBanner
    )
  );
});

export const getAllSliderBanner = asyncHandler(async (req, res) => {
  const slideBanner = await SlideBanner.find();

  return res.json(
    jsonGenerate(StatusCode.OK, "Lấy dữ liệu thành công", slideBanner)
  );
});

export const updateSliderBanner = asyncHandler(async (req, res) => {
  const id = req.params.id;

  const slideBanner = await SlideBanner.findById(id);

  if (!slideBanner) {
    return res.json(
      jsonGenerate(StatusCode.NOT_FOUND, "Slide banner không tồn tại")
    );
  }

  const newSlideBanner = await SlideBanner.findByIdAndUpdate(id, req.body, {
    new: true,
  });

  return res.json(
    jsonGenerate(
      StatusCode.OK,
      "Cập nhật slide banner thành công",
      newSlideBanner
    )
  );
});

export const deleteSliderBanner = asyncHandler(async (req, res) => {
  const id = req.params.id;

  const slideBanner = await SlideBanner.findById(id);

  if (!slideBanner) {
    return res.json(
      jsonGenerate(StatusCode.NOT_FOUND, "Slide banner không tồn tại")
    );
  }

  await SlideBanner.findByIdAndUpdate(id, {
    deleted: true,
  });

  return res.json(
    jsonGenerate(StatusCode.OK, "Xóa slide banner thành công", slideBanner)
  );
});

const validate = (data) => {
  const schema = Joi.object({
    // image: Joi.string().required().label("Hình ảnh"),
    position: Joi.string().required().label("Vị trí"),
  })
    .messages({
      "string.empty": "{#label} không được để trống",
      "any.required": "{#label} là bắt buộc",
      "string.base": "{#label} phải là chuỗi ký tự",
    })
    .unknown(true);

  return schema.validate(data);
};
