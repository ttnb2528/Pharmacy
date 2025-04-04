import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

const MobileProductReview = ({
  userInfo,
  hasPurchased,
  onSubmitReview,
  userComment,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [text, setText] = useState("");
  const [images, setImages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 5) {
      toast.error("Chỉ được chọn tối đa 5 ảnh");
      return;
    }
    setImages(files);
  };

  const handleSubmit = async () => {
    if (rating < 1) {
      toast.error("Vui lòng chọn số sao đánh giá");
      return;
    }

    if (!text.trim()) {
      toast.error("Vui lòng nhập nội dung đánh giá");
      return;
    }

    setIsLoading(true);

    try {
      await onSubmitReview({
        rating,
        text,
        images,
      });

      setIsOpen(false);
      setRating(0);
      setText("");
      setImages([]);
    } catch (error) {
      console.error("Error submitting review:", error);
    } finally {
      setIsLoading(false);
    }
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
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          className={`${
            userInfo && hasPurchased
              ? "text-green-600 border-green-600"
              : "text-gray-400 border-gray-300"
          }`}
          disabled={!userInfo || !hasPurchased || userComment}
        >
          {!userInfo
            ? "Đăng nhập để đánh giá"
            : !hasPurchased
            ? "Cần mua sản phẩm để đánh giá"
            : "Viết đánh giá"}
        </Button>
      </SheetTrigger>
      <SheetContent side="bottom" className="h-[90vh]">
        <SheetHeader>
          <SheetTitle>Đánh giá sản phẩm</SheetTitle>
        </SheetHeader>

        <div className="py-4 overflow-auto h-[calc(100%-120px)]">
          <div className="flex justify-center mb-6">
            <div className="flex gap-2">{renderStars()}</div>
          </div>

          <div className="space-y-4">
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
        </div>

        <SheetFooter className="border-t pt-4">
          <Button
            className="w-full bg-green-500 hover:bg-green-600"
            onClick={handleSubmit}
            disabled={isLoading}
          >
            {isLoading ? "Đang gửi..." : "Gửi đánh giá"}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export default MobileProductReview;
