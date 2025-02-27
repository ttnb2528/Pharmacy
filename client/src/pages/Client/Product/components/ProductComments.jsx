import { useState, useContext, useEffect } from "react";
import { Button } from "@/components/ui/button.jsx";
import { Input } from "@/components/ui/input.jsx";
import { HomeContext } from "@/context/HomeContext.context.jsx";
import { toast } from "sonner";
import { apiClient } from "@/lib/api-client.js";
import {
  CREATE_COMMENT_ROUTE,
  EDIT_COMMENT_ROUTE,
  GET_COMMENTS_ROUTE,
  GET_USER_INFO,
} from "@/API/index.api.js";

const ProductComments = ({ productId }) => {
  const { hasLogin, setShowLogin } = useContext(HomeContext);
  const [userData, setUserData] = useState({});
  const [text, setText] = useState("");
  const [comments, setComments] = useState([]);
  const [images, setImages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [editCommentId, setEditCommentId] = useState(null);
  const [warning, setWarning] = useState(null);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await apiClient.get(
          `${GET_COMMENTS_ROUTE}/${productId}`
        );

        console.log(response);

        if (response.status === 200 && response.data.status === 200) {
          setComments(response.data.data);
        } else {
          console.error("Error fetching comments:", response.data.message);
        }
      } catch (error) {
        console.error("Error fetching comments:", error);
      }
    };

    const fetchUserData = async () => {
      try {
        const res = await apiClient.get(GET_USER_INFO);

        if (res.status === 200 && res.data.status === 200) {
          setUserData(res.data.data);
        }
      } catch (error) {
        console.error("Error fetching comments:", error);
      }
    };

    fetchComments();
    fetchUserData();
  }, [productId]);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages(files);
  };

  // Hàm xử lý gửi bình luận
  const handleSubmitComment = async () => {
    if (!hasLogin) {
      setShowLogin(true);
      return;
    }

    if (!text.trim()) {
      toast.error("Vui lòng nhập bình luận!");
      return;
    }

    setIsLoading(true);
    // const formData = new FormData();
    // formData.append("productId", productId);
    // formData.append("userId", userData._id); // Thay bằng logic lấy userId từ auth
    // formData.append("text", text);
    // images.forEach((image) => formData.append("images", image));

    try {
      let res;
      if (editCommentId) {
        res = await apiClient.put(`${EDIT_COMMENT_ROUTE}/${editCommentId}`, {
          text,
          userId: userData._id,
          productId,
        });
      } else {
        res = await apiClient.post(`${CREATE_COMMENT_ROUTE}`, {
          text,
          userId: userData._id,
          productId,
        });
      }

      console.log("API response:", res.data);

      if (res.data.isToxic) {
        setWarning(res.data.warning);
        setEditCommentId(res.data.id); // Lưu ID để sửa nếu toxic
        toast.error("Bình luận chứa nội dung không phù hợp, hãy chỉnh sửa!");
      } else {
        setComments((prev) =>
          editCommentId
            ? prev.map((c) => (c.id === editCommentId ? res.data : c))
            : [...prev, res.data]
        );
        setText("");
        setImages([]);
        setEditCommentId(null);
        setWarning(null);
        toast.success(
          editCommentId
            ? "Bình luận đã được cập nhật!"
            : "Bình luận đã được gửi!"
        );
      }
    } catch (error) {
      console.error("Error submitting comment:", error.response?.data || error);
      toast.error(
        error.response?.data?.error || "Đã xảy ra lỗi khi gửi bình luận."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditComment = (cmt) => {
    setText(cmt.text);
    setImages([]); // Reset images, user sẽ upload lại nếu muốn
    setEditCommentId(cmt.id);
    setWarning(cmt.warning);
  };

  return (
    <div className="mt-6 bg-white p-5 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Bình luận sản phẩm</h2>
      <div className="flex flex-col gap-4 mb-6">
        <Input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Viết bình luận của bạn..."
          className="w-full"
          disabled={isLoading}
        />
        <Input
          type="file"
          accept="image/*"
          multiple
          onChange={handleImageChange}
          className="w-full"
          disabled={isLoading}
        />
        {images.length > 0 && (
          <div className="flex gap-2">
            {images.map((img, idx) => (
              <img
                key={idx}
                src={URL.createObjectURL(img)}
                alt="Preview"
                className="w-20 h-20 object-cover"
              />
            ))}
          </div>
        )}
        {warning && (
          <p className="text-red-500 text-sm">{warning} (Chỉ được sửa 1 lần)</p>
        )}
        <Button
          onClick={handleSubmitComment}
          className="bg-green-500 hover:bg-green-600 w-fit self-end"
          disabled={isLoading}
        >
          {isLoading
            ? "Đang gửi..."
            : editCommentId
            ? "Cập nhật"
            : "Gửi bình luận"}
        </Button>
      </div>
      <div className="space-y-4">
        {comments.length > 0 ? (
          comments.map((cmt) => (
            <div key={cmt?.id} className="border-b pb-2">
              <p className="font-semibold">
                {cmt?.userId?.name || `User ${cmt?.userId}`}
              </p>
              <p className="text-gray-700">{cmt?.text}</p>
              {cmt?.images && cmt?.images.length > 0 && (
                <div className="flex gap-2 mt-2">
                  {cmt?.images.map((img, idx) => (
                    <img
                      key={idx}
                      src={`http://localhost:5001${img}`}
                      alt="Comment"
                      className="w-20 h-20 object-cover"
                    />
                  ))}
                </div>
              )}
              <span className="text-sm text-gray-500">
                {new Date(cmt?.createdAt).toLocaleString()}
              </span>
              {cmt?.editCount < 1 && !editCommentId && (
                <Button
                  onClick={() => handleEditComment(cmt)}
                  className="text-blue-500 hover:underline text-sm mt-1"
                  variant="link"
                >
                  Sửa
                </Button>
              )}
            </div>
          ))
        ) : (
          <p className="text-gray-500">Chưa có bình luận nào.</p>
        )}
      </div>
    </div>
  );
};

export default ProductComments;
