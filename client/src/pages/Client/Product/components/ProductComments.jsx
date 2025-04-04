import { useState, useContext, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button.jsx";
import { Input } from "@/components/ui/input.jsx";
import { HomeContext } from "@/context/HomeContext.context.jsx";
import { toast } from "sonner";
import { apiClient } from "@/lib/api-client.js";
import {
  CHECK_PURCHASE_ROUTE,
  CREATE_COMMENT_ROUTE,
  EDIT_COMMENT_ROUTE,
  GET_COMMENTS_ROUTE,
  GET_USER_INFO,
  // DELETE_COMMENT_ROUTE,
} from "@/API/index.api.js";
import axios from "axios";
import { useAppStore } from "@/store/index.js";
import { useMediaQuery } from "@/hook/use-media-query.js";
// import MobileProductReview from "./MobileProductReview.jsx";
import MobileReviewDialog from "./MobileReviewDialog.jsx";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreVertical, Edit, Trash } from "lucide-react";

const ProductComments = ({ productId }) => {
  const { userInfo } = useAppStore();
  const { setShowLogin } = useContext(HomeContext);
  const [userData, setUserData] = useState({});
  const [text, setText] = useState("");
  const [comments, setComments] = useState([]);
  const [rating, setRating] = useState(0);
  const [images, setImages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [editCommentId, setEditCommentId] = useState(null);
  const [warning, setWarning] = useState(null);
  const [hasPurchased, setHasPurchased] = useState(false);
  const [userComment, setUserComment] = useState(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const isMobile = useMediaQuery("(max-width: 640px)");
  const [commentToDelete, setCommentToDelete] = useState(null);

  const fetchComments = async () => {
    try {
      const response = await apiClient.get(
        `${GET_COMMENTS_ROUTE}/${productId}`
      );

      if (response.status === 200 && response.data.status === 200) {
        let allComments = response.data.data;
        setComments(allComments);

        if (userData._id) {
          const userCmt = allComments.find(
            (cmt) => cmt.userId?._id === userData._id
          );
          setUserComment(userCmt || null);
        }
      } else {
        console.error("Error fetching comments:", response.data.message);
      }
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await apiClient.get(GET_USER_INFO);

        if (res.status === 200 && res.data.status === 200) {
          setUserData(res.data.data);

          const purchaseCheck = await apiClient.get(
            `${CHECK_PURCHASE_ROUTE}/${res.data.data.accountId._id}/${productId}`
          );

          setHasPurchased(purchaseCheck.data.hasPurchased || false);
          fetchComments();
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchComments();
    if (userInfo) fetchUserData();
  }, [productId, userInfo, userData._id]);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages(files);
  };

  const uploadToCloudinary = async (files) => {
    const urls = [];
    const uploadPreset = import.meta.env.VITE_COMMENT_PRESET;

    for (const file of files) {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", uploadPreset);

      try {
        const response = await axios.post(
          import.meta.env.VITE_CLOUDINARY_IMAGE_URL,
          formData
        );
        urls.push(response.data.secure_url);
      } catch (error) {
        console.error("Error uploading to Cloudinary:", error);
        throw new Error("Không thể upload ảnh!");
      }
    }
    return urls;
  };

  const handleSubmitComment = async (mobileReviewData) => {
    if (!userInfo) {
      setShowLogin(true);
      return;
    }

    const reviewText = mobileReviewData?.text || text;
    const reviewRating = mobileReviewData?.rating || rating;
    const reviewImages = mobileReviewData?.images || images;

    if (!reviewText.trim()) {
      toast.error("Vui lòng nhập bình luận!");
      return;
    }

    if (reviewRating < 1 || reviewRating > 5) {
      toast.error("Vui lòng chọn số sao từ 1 đến 5!");
      return;
    }

    setIsLoading(true);
    let imageUrls = [];
    if (reviewImages.length > 0) {
      try {
        imageUrls = await uploadToCloudinary(reviewImages);
      } catch (error) {
        console.error("Error uploading images:", error);
        toast.error("Không thể upload ảnh, vui lòng thử lại!");
        setIsLoading(false);
        return;
      }
    }

    const payload = {
      productId,
      userId: userData._id,
      text: reviewText,
      rating: reviewRating,
      images: imageUrls,
    };

    try {
      let res;
      if (editCommentId) {
        res = await apiClient.put(
          `${EDIT_COMMENT_ROUTE}/${editCommentId}`,
          payload
        );
      } else {
        res = await apiClient.post(`${CREATE_COMMENT_ROUTE}`, payload);
      }

      if (!res.data.data.isToxic) {
        setComments((prev) =>
          editCommentId
            ? prev.map((c) => (c._id === editCommentId ? res.data.data : c))
            : [...prev, res.data.data]
        );
      } else if (res.data.data.isToxic) {
        setComments((prev) => prev.filter((c) => c._id !== editCommentId));
        setWarning(res.data.data.warning);
        setEditCommentId(res.data.data._id);
      }
      setUserComment(res.data.data);
      setText("");
      setRating(0);
      setImages([]);
      setEditCommentId(null);
      setWarning(null);

      toast.success(
        editCommentId ? "Đánh giá đã được cập nhật!" : "Đánh giá đã được gửi!"
      );
    } catch (error) {
      console.error("Error submitting comment:", error.response?.data || error);
      toast.error(
        error.response?.data?.message || "Đã xảy ra lỗi khi gửi bình luận."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditComment = (cmt) => {
    setText(cmt.text);
    setRating(cmt.rating);
    setImages([]);
    setEditCommentId(cmt._id);
    setWarning(cmt.warning);
  };

  const handleDeleteComment = async () => {
    if (!commentToDelete) return;

    // try {
    //   const response = await apiClient.delete(
    //     `${DELETE_COMMENT_ROUTE}/${commentToDelete._id}`
    //   );
    //   if (response.status === 200) {
    //     setComments(comments.filter((c) => c._id !== commentToDelete._id));
    //     if (userComment && userComment._id === commentToDelete._id) {
    //       setUserComment(null);
    //     }
    //     toast.success("Đã xóa đánh giá thành công");
    //   }
    // } catch (error) {
    //   console.error("Error deleting comment:", error);
    //   toast.error("Không thể xóa đánh giá");
    // } finally {
    //   setIsDeleteDialogOpen(false);
    //   setCommentToDelete(null);
    // }
  };

  const confirmDeleteComment = (comment) => {
    setCommentToDelete(comment);
    setIsDeleteDialogOpen(true);
  };

  const openEditDialog = (comment) => {
    setEditCommentId(comment._id);
    setText(comment.text);
    setRating(comment.rating);
    setImages([]);
    setWarning(comment.warning);
    setIsEditDialogOpen(true);
  };

  const closeEditDialog = () => {
    setIsEditDialogOpen(false);

    if (!editCommentId) {
      setText("");
      setRating(0);
      setImages([]);
      setWarning(null);
    }
  };

  const handleSubmitFromDialog = async (data) => {
    await handleSubmitComment(data);
    setIsEditDialogOpen(false);
  };

  const handleCancelEdit = () => {
    setEditCommentId(null);
    setText("");
    setRating(0);
    setImages([]);
    setWarning(null);
  };

  const renderStars = (ratingValue) => {
    return [1, 2, 3, 4, 5].map((star) => (
      <span
        key={star}
        className={`cursor-pointer text-2xl ${
          star <= ratingValue ? "text-yellow-400" : "text-gray-300"
        }`}
        onClick={() => !isLoading && setRating(star)}
      >
        ★
      </span>
    ));
  };

  const sortedComments = useMemo(() => {
    if (!comments || !userComment) return comments;

    return [
      ...comments.filter((c) => c._id === userComment._id),
      ...comments.filter((c) => c._id !== userComment._id),
    ].filter((cmt) => !cmt.isToxic);
  }, [comments, userComment]);

  const hasVisibleComments = sortedComments.length > 0;

  return (
    <div className="mt-6 bg-white p-5">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold">Đánh giá sản phẩm</h2>

        {isMobile && !userComment && (
          <div>
            {!userInfo ? (
              <Button
                variant="outline"
                size="sm"
                className="text-blue-600 border-blue-600 flex items-center gap-1"
                onClick={() => setShowLogin(true)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4M10 17l5-5-5-5M13.8 12H3" />
                </svg>
                <span>Đăng nhập</span>
              </Button>
            ) : !hasPurchased ? (
              <div className="bg-orange-50 border border-orange-200 text-orange-600 text-xs px-3 py-1.5 rounded-full flex items-center gap-1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                  <line x1="12" y1="9" x2="12" y2="13" />
                  <line x1="12" y1="17" x2="12.01" y2="17" />
                </svg>
                <span>Cần mua sản phẩm</span>
              </div>
            ) : (
              <Button
                variant="default"
                size="sm"
                className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-1.5 rounded-full px-4"
                onClick={() => setIsEditDialogOpen(true)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                </svg>
                <span>Viết đánh giá</span>
              </Button>
            )}
          </div>
        )}
      </div>

      <div
        className={`${isMobile ? "block" : "grid grid-cols-[60%,40%]"} gap-6`}
      >
        <div className="space-y-4">
          {hasVisibleComments ? (
            sortedComments.map((cmt) => (
              <div key={cmt?._id} className="border-b pb-2">
                <div className="flex items-center gap-2">
                  {cmt.userId?.avatar ? (
                    <img
                      src={cmt.userId.avatar || "/placeholder.svg"}
                      alt="avatar user"
                      className="h-8 w-8 rounded-full object-cover"
                    />
                  ) : (
                    <svg
                      width={20}
                      height={20}
                      fill="green"
                      version="1.1"
                      id="Layer_1"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="796 796 200 200"
                      enableBackground="new 796 796 200 200"
                      xmlSpace="preserve"
                      stroke="green"
                    >
                      <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                      <g
                        id="SVGRepo_tracerCarrier"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      ></g>
                      <g id="SVGRepo_iconCarrier">
                        {" "}
                        <path d="M896,796c-55.14,0-99.999,44.86-99.999,100c0,55.141,44.859,100,99.999,100c55.141,0,99.999-44.859,99.999-100 C995.999,840.86,951.141,796,896,796z M896.639,827.425c20.538,0,37.189,19.66,37.189,43.921c0,24.257-16.651,43.924-37.189,43.924 s-37.187-19.667-37.187-43.924C859.452,847.085,876.101,827.425,896.639,827.425z M896,983.86 c-24.692,0-47.038-10.239-63.016-26.695c-2.266-2.335-2.984-5.775-1.84-8.82c5.47-14.556,15.718-26.762,28.817-34.761 c2.828-1.728,6.449-1.393,8.91,0.828c7.706,6.958,17.316,11.114,27.767,11.114c10.249,0,19.69-4.001,27.318-10.719 c2.488-2.191,6.128-2.479,8.932-0.711c12.697,8.004,22.618,20.005,27.967,34.253c1.144,3.047,0.425,6.482-1.842,8.817 C943.037,973.621,920.691,983.86,896,983.86z"></path>{" "}
                      </g>
                    </svg>
                  )}
                  <p
                    className={`font-semibold ${
                      cmt.userId?._id === userData._id ? "text-green-600" : ""
                    }`}
                  >
                    {cmt.userId?._id === userData._id
                      ? "Bạn"
                      : cmt?.userId?.name ||
                        `User ${cmt?.userId?._id || "Anonymous"}`}
                  </p>

                  {cmt.userId?._id === userData._id && isMobile && (
                    <div className="ml-auto">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          {cmt.editCount < 1 && (
                            <DropdownMenuItem
                              onClick={() => {
                                if (isMobile) {
                                  openEditDialog(cmt);
                                } else {
                                  handleEditComment(cmt);
                                }
                              }}
                            >
                              <Edit className="mr-2 h-4 w-4" /> Chỉnh sửa
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem
                            onClick={() => confirmDeleteComment(cmt)}
                            className="text-red-500"
                          >
                            <Trash className="mr-2 h-4 w-4" /> Xóa
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  )}
                </div>

                <div className="flex gap-1 mb-1">
                  {renderStars(cmt?.rating)}
                </div>

                <p className="text-gray-700">{cmt?.text}</p>

                {cmt?.images && cmt?.images.length > 0 && (
                  <div className="flex gap-2 mt-2 flex-wrap">
                    {cmt?.images.map((img, idx) => (
                      <img
                        key={idx}
                        src={img || "/placeholder.svg"}
                        alt="Comment"
                        className="w-20 h-20 object-cover rounded-md"
                      />
                    ))}
                  </div>
                )}
                <span className="text-sm text-gray-500">
                  {new Date(cmt?.createdAt).toLocaleString()}
                </span>
              </div>
            ))
          ) : (
            <p className="text-gray-500">Chưa có đánh giá nào.</p>
          )}
        </div>

        {!isMobile && (
          <div className="flex flex-col gap-4">
            {userInfo && hasPurchased ? (
              userComment && !editCommentId ? (
                <div
                  className={`border p-4 rounded-lg bg-gray-50 ${
                    userComment.isToxic ? "opacity-80" : ""
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <p className="font-semibold text-green-600">Bạn</p>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        {userComment.editCount < 1 && (
                          <DropdownMenuItem
                            onClick={() => handleEditComment(userComment)}
                          >
                            <Edit className="mr-2 h-4 w-4" /> Chỉnh sửa
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem
                          onClick={() => confirmDeleteComment(userComment)}
                          className="text-red-500"
                        >
                          <Trash className="mr-2 h-4 w-4" /> Xóa
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  <div className="flex gap-1 mb-1">
                    {renderStars(userComment.rating)}
                  </div>
                  <p className="text-gray-700">{userComment.text}</p>
                  {userComment.images && userComment.images.length > 0 && (
                    <div className="flex gap-2 mt-2 flex-wrap">
                      {userComment.images.map((img, idx) => (
                        <img
                          key={idx}
                          src={img || "/placeholder.svg"}
                          alt="Comment"
                          className="w-16 h-16 object-cover rounded-md"
                        />
                      ))}
                    </div>
                  )}
                  <span className="text-sm text-gray-500">
                    {new Date(userComment.createdAt).toLocaleString()}
                  </span>
                  {!userComment.isApproved && userComment.isToxic && (
                    <p className="text-red-500 italic text-sm">
                      Đánh giá của bạn chứa nội dung không phù hợp
                    </p>
                  )}
                </div>
              ) : (
                <>
                  <div className="flex gap-1">{renderStars(rating)}</div>
                  <Input
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Viết đánh giá của bạn..."
                    className="w-full border-gray-300 focus:border-green-500"
                    disabled={isLoading}
                  />
                  <label className="flex items-center justify-center bg-gray-100 border border-dashed border-gray-300 rounded-lg p-2 cursor-pointer hover:bg-gray-200 transition">
                    <span className="text-sm text-gray-600">
                      Chọn ảnh (tối đa 5)
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleImageChange}
                      className="hidden"
                      disabled={isLoading}
                    />
                  </label>
                  {images.length > 0 && (
                    <div className="flex gap-2 flex-wrap">
                      {images.map((img, idx) => (
                        <img
                          key={idx}
                          src={URL.createObjectURL(img) || "/placeholder.svg"}
                          alt="Preview"
                          className="w-16 h-16 object-cover rounded-md border"
                        />
                      ))}
                    </div>
                  )}
                  {warning && (
                    <p className="text-red-500 text-sm">
                      {warning} (Chỉ được sửa 1 lần)
                    </p>
                  )}
                  <div className="flex justify-end gap-2 mt-2">
                    {editCommentId && (
                      <Button
                        variant="outline"
                        onClick={handleCancelEdit}
                        className="border-gray-300"
                      >
                        Hủy
                      </Button>
                    )}
                    <Button
                      onClick={() => handleSubmitComment()}
                      className="bg-green-500 hover:bg-green-600"
                      disabled={isLoading}
                    >
                      {isLoading
                        ? "Đang gửi..."
                        : editCommentId
                        ? "Cập nhật"
                        : "Gửi đánh giá"}
                    </Button>
                  </div>
                </>
              )
            ) : userInfo && !hasPurchased ? (
              <div className="p-4 border border-orange-200 bg-orange-50 rounded-md">
                <p className="text-orange-600">
                  <strong>Lưu ý:</strong> Bạn cần mua sản phẩm này trước khi
                  đánh giá.
                </p>
                <p className="text-gray-500 text-sm mt-1">
                  Đánh giá chỉ dành cho khách hàng đã trải nghiệm sản phẩm thực
                  tế.
                </p>
              </div>
            ) : (
              <div className="p-4 border border-blue-200 bg-blue-50 rounded-md">
                <p className="text-blue-600">
                  <strong>Thông báo:</strong> Vui lòng đăng nhập để đánh giá sản
                  phẩm.
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xóa đánh giá?</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa đánh giá này? Hành động này không thể
              hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteComment}
              className="bg-red-500 hover:bg-red-600"
            >
              Xóa
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <MobileReviewDialog
        isOpen={isEditDialogOpen}
        onClose={closeEditDialog}
        onSubmit={handleSubmitFromDialog}
        initialText={text}
        initialRating={rating}
        isEditing={!!editCommentId}
        isLoading={isLoading}
      />
    </div>
  );
};

export default ProductComments;
