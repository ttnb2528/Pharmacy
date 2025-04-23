import Comment from "../model/Comment.model.js";
import { jsonGenerate } from "../utils/helpers.js";
import { StatusCode } from "../utils/constants.js";
import Joi from "joi";
import asyncHandler from "../middleware/asyncHandler.js";
import axios from "axios";
import cloudinary from "../config/cloudinary.js";
import OrderDetail from "../model/OrderDetail.model.js";
import Order from "../model/Order.model.js";

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

// const hasPurchasedProduct = async (userId, productId) => {
//   console.log(userId, productId);

//   try {
//     const orders = await Order.find({
//       AccountId: userId,
//       status: "completed", // Chỉ tính đơn đã hoàn thành
//     });

//     for (const order of orders) {
//       const orderDetail = await OrderDetail.findOne({ orderId: order._id });
//       if (
//         orderDetail &&
//         orderDetail.items.some(
//           (item) => item.productId.toString() === productId
//         )
//       ) {
//         return true;
//       }
//     }
//     return false;
//   } catch (error) {
//     console.error("Error checking purchase:", error);
//     return false;
//   }
// };

// Hàm xóa ảnh cũ trên Cloudinary
const deleteOldImages = async (imageUrls) => {
  if (!imageUrls || imageUrls.length === 0) return;
  for (const imageUrl of imageUrls) {
    let parts = imageUrl.split("/");
    let fileName = parts[parts.length - 1].split(".")[0]; // Loại bỏ phần mở rộng .jpg
    let folder = parts[parts.length - 2];
    let publicId = folder + "/" + fileName;
    try {
      await cloudinary.uploader.destroy(publicId);
      console.log(`Deleted image ${publicId} from Cloudinary`);
    } catch (error) {
      console.error(`Error deleting image ${publicId}:`, error);
      // Tiếp tục xử lý dù có lỗi xóa ảnh cũ
    }
  }
};

export const createComment = asyncHandler(async (req, res) => {
  const { text, userId, productId, rating, images } = req.body;

  const { error } = validate({ text, rating });

  if (error) {
    return res.json(
      jsonGenerate(StatusCode.BAD_REQUEST, error.details[0].message)
    );
  }

  if (!userId) {
    return res.json(
      jsonGenerate(StatusCode.UNAUTHORIZED, "Bạn cần đăng nhập để đánh giá!")
    );
  }

  try {
    const isToxic = await checkToxicity(text);

    const newComment = new Comment({
      productId,
      images,
      rating,
      userId,
      text,
      isToxic,
      warning: isToxic ? "Bình luận chứa nội dung không phù hợp" : null,
      isApproved: !isToxic,
    });

    await newComment.save();

    const comments = await Comment.findById(newComment._id).populate(
      "userId",
      "name avatar"
    );

    return res.json(
      jsonGenerate(StatusCode.CREATED, "Bình luận đã được gửi", comments)
    );
  } catch (error) {
    console.error(error);
    if (error.code === 11000) {
      return res.json(
        jsonGenerate(
          StatusCode.BAD_REQUEST,
          "Bạn đã đánh giá sản phẩm này rồi!"
        )
      );
    }
    return res.json(
      jsonGenerate(StatusCode.INTERNAL_SERVER_ERROR, error.message)
    );
  }
});

export const getCommentByProductId = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  console.log(productId);

  try {
    const comments = await Comment.find({
      productId,
    }).populate("userId", "name avatar");

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
  const { userId, text, rating, images } = req.body;

  const { error } = validate({ text, rating });

  if (error) {
    return res.json(
      jsonGenerate(StatusCode.BAD_REQUEST, error.details[0].message)
    );
  }

  if (!userId) {
    return res.json(
      jsonGenerate(StatusCode.UNAUTHORIZED, "Bạn cần đăng nhập để chỉnh sửa!")
    );
  }

  try {
    const comment = await Comment.findOne({ _id: commentId, userId });

    if (!comment) {
      return res.json(
        jsonGenerate(StatusCode.NOT_FOUND, "Không tìm thấy bình luận")
      );
    }

    if (comment.editCount >= 1) {
      return res.json(
        jsonGenerate(
          StatusCode.BAD_REQUEST,
          "Số lần chỉnh sửa đã vượt quá giới hạn"
        )
      );
    }

    // Xử lý hình ảnh
    if (comment.images && comment.images.length > 0) {
      // Xóa ảnh cũ trong mọi trường hợp
      await deleteOldImages(comment.images);
    }

    // Cập nhật danh sách ảnh mới
    comment.images = images && images.length > 0 ? images : [];

    const isToxic = await checkToxicity(text);
    comment.text = text;
    comment.isToxic = isToxic;
    comment.warning = isToxic ? "Bình luận chứa nội dung không phù hợp" : null;
    comment.isApproved = !isToxic;
    comment.rating = rating;
    comment.editCount += 1;

    const newComment = await comment.save();

    const populatedComment = await Comment.findById(newComment._id).populate(
      "userId",
      "name avatar"
    );

    return res.json(
      jsonGenerate(
        StatusCode.OK,
        "Bình luận đã được chỉnh sửa",
        populatedComment
      )
    );
  } catch (error) {
    console.error(error);
    return res.json(
      jsonGenerate(StatusCode.INTERNAL_SERVER_ERROR, error.message)
    );
  }
});

export const deleteComment = asyncHandler(async (req, res) => {
  const { commentId } = req.params;
  const { userId } = req.body;
  console.log(userId);

  if (!userId) {
    return res.json(
      jsonGenerate(StatusCode.UNAUTHORIZED, "Bạn cần đăng nhập để xóa!")
    );
  }

  try {
    const comment = await Comment.findOne({ _id: commentId, userId });

    if (!comment) {
      return res.json(
        jsonGenerate(StatusCode.NOT_FOUND, "Không tìm thấy bình luận")
      );
    }

    // Xóa ảnh cũ trong mọi trường hợp
    await deleteOldImages(comment.images);

    await Comment.deleteOne({ _id: commentId });

    return res.json(jsonGenerate(StatusCode.OK, "Xóa bình luận thành công"));
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
    rating: Joi.number().min(1).max(5).required().label("Điểm đánh giá"),
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
