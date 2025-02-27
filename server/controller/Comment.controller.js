import Comment from "../model/Comment.model.js";
import { jsonGenerate } from "../utils/helpers.js";
import { StatusCode } from "../utils/constants.js";
import Joi from "joi";
import asyncHandler from "../middleware/asyncHandler.js";
import axios from "axios";

const checkToxicity = async (text) => {
  try {
    const response = await axios.post("http://localhost:5000/predict", {
      sentence: text,
    });
    return response.data.prediction === 1;
  } catch (error) {
    console.error("Error checking toxicity:", error);
    return false;
  }
};

export const createComment = asyncHandler(async (req, res) => {
  console.log(req.body);

  const { text } = req.body;

  const { error } = validate({ text });

  if (error) {
    return res.json(
      jsonGenerate(StatusCode.BAD_REQUEST, error.details[0].message)
    );
  }

  try {
    const isToxic = await checkToxicity(text);

    // if (isToxic) {
    //   return res.json(
    //     jsonGenerate(StatusCode.BAD_REQUEST, "Bình luận chứa nội dung tiêu cực")
    //   );
    // }

    const newComment = new Comment({
      ...req.body,
      warning: isToxic ? "Bình luận chứa nội dung không phù hợp" : null,
      isApproved: !isToxic,
    });

    await newComment.save();

    return res.json(
      jsonGenerate(StatusCode.CREATED, "Bình luận đã được gửi", newComment)
    );
  } catch (error) {
    console.error(error);
    return res.json(
      jsonGenerate(StatusCode.INTERNAL_SERVER_ERROR, error.message)
    );
  }
});

export const getCommentByProductId = asyncHandler(async (req, res) => {
  const { productId } = req.params;

  try {
    const comments = await Comment.find({
      id: productId,
      isApproved: true,
    }).populate("userId", "name");

    return res.json(jsonGenerate(StatusCode.OK, "Thành công", comments));
  } catch (error) {
    console.error(error);
    return res.json(
      jsonGenerate(StatusCode.INTERNAL_SERVER_ERROR, error.message)
    );
  }
});

export const EditComment = asyncHandler(async (req, res) => {
  const { commentId } = req.params;
  const { userId, text } = req.body;

  const { error } = validate({ text });

  if (error) {
    return res.json(
      jsonGenerate(StatusCode.BAD_REQUEST, error.details[0].message)
    );
  }

  try {
    const comment = await Comment.findOne({ _id: commentId, userId });

    if (!comment) {
      return res.json(
        jsonGenerate(StatusCode.NOT_FOUND, "Không tìm thấy bình luận")
      );
    }

    if (comment.editCount >= 3) {
      return res.json(
        jsonGenerate(
          StatusCode.BAD_REQUEST,
          "Số lần chỉnh sửa đã vượt quá giới hạn"
        )
      );
    }

    const isToxic = await checkToxicity(text);
    comment.text = text;
    comment.isToxic = isToxic;
    comment.warning = isToxic ? "Bình luận chứa nội dung không phù hợp" : null;
    comment.isApproved = !isToxic;
    comment.editCount += 1;

    const newComment = await comment.save();

    return res.json(
      jsonGenerate(StatusCode.OK, "Bình luận đã được chỉnh sửa", newComment)
    );
  } catch (error) {
    console.error(error);
    return res.json(
      jsonGenerate(StatusCode.INTERNAL_SERVER_ERROR, error.message)
    );
  }
});

const validate = (data) => {
  const schema = Joi.object({
    text: Joi.string().required().label("Nội dung bình luận"),
    // productId: Joi.string().required().label("ID sản phẩm"),
    // userId: Joi.string().required().label("ID người dùng"),
  })
    .messages({
      "string.empty": "{#label} không được để trống",
      "any.required": "{#label} là bắt buộc",
      "string.base": "{#label} phải là chuỗi ký tự",
    })
    .unknown(true);

  return schema.validate(data);
};
