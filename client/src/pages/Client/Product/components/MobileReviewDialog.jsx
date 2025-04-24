import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

// Thêm các hằng số giới hạn
const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB
const MAX_FILES = 5;

const MobileReviewDialog = ({
  isOpen,
  onClose,
  onSubmit,
  initialText = "",
  initialRating = 0,
  isEditing = false,
  isLoading = false,
}) => {
  const [rating, setRating] = useState(initialRating);
  const [text, setText] = useState(initialText);
  const [images, setImages] = useState([]);
  const [localError, setLocalError] = useState("");
  const [localText, setLocalText] = useState(initialText);

  // Cập nhật state khi có thay đổi từ prop
  useEffect(() => {
    if (isOpen) {
      setRating(initialRating);
      setText(initialText);
      setImages([]);
      setLocalText(initialText);
      setLocalError("");
    }
  }, [isOpen, initialRating, initialText]);

  // Hàm đếm từ
  const countWords = (text) => {
    return text.trim().split(/\s+/).length;
  };

  // Hàm xử lý thay đổi nội dung đánh giá
  const handleTextChange = (text) => {
    const wordCount = countWords(text);

    if (wordCount > 150) {
      setLocalError("Đánh giá không được vượt quá 150 từ");
      return;
    }

    setLocalError("");
    setLocalText(text);
  };

  // Cập nhật hàm handleImageChange để kiểm tra kích thước và số lượng file
  const handleImageChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    
    // Kiểm tra số lượng file
    if (images.length + selectedFiles.length > MAX_FILES) {
      toast.error(`Chỉ được chọn tối đa ${MAX_FILES} ảnh`);
      return;
    }

    // Kiểm tra kích thước file
    let validFiles = [];
    let hasInvalidSize = false;
    
    selectedFiles.forEach(file => {
      if (file.size > MAX_FILE_SIZE) {
        hasInvalidSize = true;
      } else {
        validFiles.push(file);
      }
    });

    if (hasInvalidSize) {
      toast.error(`Một số ảnh có dung lượng trên 2MB và sẽ không được tải lên`);
    }

    // Cập nhật state với các file hợp lệ
    setImages(prevImages => [...prevImages, ...validFiles]);
  };

  // Thêm hàm xóa ảnh
  const removeImage = (index) => {
    setImages(prevImages => prevImages.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    if (rating < 1) {
      toast.error("Vui lòng chọn số sao đánh giá");
      return;
    }

    if (!localText.trim()) {
      toast.error("Vui lòng nhập nội dung đánh giá");
      return;
    }

    // Thêm kiểm tra kích thước ảnh trước khi submit
    const hasLargeImage = images.some(img => img.size > MAX_FILE_SIZE);
    if (hasLargeImage) {
      toast.error("Vui lòng đảm bảo mỗi ảnh có kích thước nhỏ hơn 2MB");
      return;
    }

    onSubmit({
      rating,
      text: localText,
      images,
    });
  };

  const renderStars = () => {
    return [1, 2, 3, 4, 5].map((star) => (
      <button
        key={star}
        type="button"
        onClick={() => setRating(star)}
        className={`text-2xl ${
          star <= rating ? "text-yellow-400" : "text-gray-300"
        }`}
      >
        ★
      </button>
    ));
  };

  const wordCount = countWords(localText);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Chỉnh sửa đánh giá" : "Viết đánh giá sản phẩm"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="flex justify-center">
            <div className="flex gap-2">{renderStars()}</div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Nội dung đánh giá
            </label>
            <div className="text-xs text-right mb-1">
              <span className={wordCount > 150 ? "text-red-500" : "text-gray-500"}>
                {wordCount}/150 từ
              </span>
            </div>
            <Textarea
              value={localText}
              onChange={(e) => handleTextChange(e.target.value)}
              placeholder="Chia sẻ trải nghiệm của bạn về sản phẩm..."
              className="min-h-[100px]"
            />
            {localError && (
              <p className="text-red-500 text-sm mt-1">{localError}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Hình ảnh (tối đa {MAX_FILES} ảnh, mỗi ảnh ≤ 2MB)
            </label>
            
            {/* Hiển thị nút upload chỉ khi chưa đạt tối đa */}
            {images.length < MAX_FILES && (
              <Input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageChange}
                className="cursor-pointer"
                disabled={isLoading}
              />
            )}

            {/* Hiển thị thông báo khi đã đạt giới hạn */}
            {images.length >= MAX_FILES && (
              <p className="text-orange-500 text-sm mt-1">
                Đã đạt tối đa số lượng ảnh cho phép
              </p>
            )}

            {/* Hiển thị preview ảnh với khả năng xóa */}
            {images.length > 0 && (
              <div className="flex gap-2 mt-2 flex-wrap">
                {images.map((img, idx) => (
                  <div key={idx} className="relative group">
                    <img
                      src={URL.createObjectURL(img) || "/placeholder.svg"}
                      alt="Preview"
                      className="w-16 h-16 object-cover rounded-md"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(idx)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center"
                    >
                      ×
                    </button>
                    <p className="text-xs text-gray-500 mt-1 text-center">
                      {(img.size / 1024 / 1024).toFixed(1)}MB
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <DialogFooter className="flex justify-between">
          <Button variant="outline" onClick={onClose}>
            Hủy
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isLoading}
            className="bg-green-500 hover:bg-green-600"
          >
            {isLoading
              ? "Đang gửi..."
              : isEditing
              ? "Cập nhật"
              : "Gửi đánh giá"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default MobileReviewDialog;
