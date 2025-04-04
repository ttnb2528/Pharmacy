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

  // Cập nhật state khi có thay đổi từ prop
  useEffect(() => {
    if (isOpen) {
      setRating(initialRating);
      setText(initialText);
      setImages([]);
    }
  }, [isOpen, initialRating, initialText]);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 5) {
      toast.error("Chỉ được chọn tối đa 5 ảnh");
      return;
    }
    setImages(files);
  };

  const handleSubmit = () => {
    if (rating < 1) {
      toast.error("Vui lòng chọn số sao đánh giá");
      return;
    }

    if (!text.trim()) {
      toast.error("Vui lòng nhập nội dung đánh giá");
      return;
    }

    onSubmit({
      rating,
      text,
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
            <Textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Chia sẻ trải nghiệm của bạn về sản phẩm..."
              className="min-h-[100px]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Hình ảnh (tối đa 5 ảnh)
            </label>
            <Input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageChange}
              className="cursor-pointer"
            />

            {images.length > 0 && (
              <div className="flex gap-2 mt-2 flex-wrap">
                {images.map((img, idx) => (
                  <img
                    key={idx}
                    src={URL.createObjectURL(img) || "/placeholder.svg"}
                    alt="Preview"
                    className="w-16 h-16 object-cover rounded-md"
                  />
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
