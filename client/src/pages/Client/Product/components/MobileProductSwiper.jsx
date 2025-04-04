import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const MobileProductSwiper = ({ productImage = [] }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePrevious = () => {
    setCurrentIndex((prev) =>
      prev === 0 ? productImage.length - 1 : prev - 1
    );
  };

  const handleNext = () => {
    setCurrentIndex((prev) =>
      prev === productImage.length - 1 ? 0 : prev + 1
    );
  };

  if (!productImage || productImage.length === 0) {
    return (
      <div className="w-full aspect-square flex items-center justify-center bg-gray-100 rounded-lg">
        <p className="text-gray-500">No image available</p>
      </div>
    );
  }

  return (
    <div className="relative w-full">
      <div className="w-full aspect-square overflow-hidden relative">
        <div
          className="flex transition-transform duration-300 h-full"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {productImage.map((image, index) => (
            <img
              key={index}
              src={image || "/placeholder.svg"}
              alt={`Product image ${index + 1}`}
              className="w-full h-full object-contain flex-shrink-0"
            />
          ))}
        </div>

        {/* Navigation buttons */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute left-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-white/80 shadow-sm"
          onClick={handlePrevious}
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-white/80 shadow-sm"
          onClick={handleNext}
        >
          <ChevronRight className="h-5 w-5" />
        </Button>
      </div>

      {/* Pagination dots */}
      <div className="flex justify-center mt-2 gap-1">
        {productImage.map((_, index) => (
          <button
            key={index}
            className={`h-2 rounded-full transition-all ${
              index === currentIndex ? "w-4 bg-green-500" : "w-2 bg-gray-300"
            }`}
            onClick={() => setCurrentIndex(index)}
          />
        ))}
      </div>
    </div>
  );
};

export default MobileProductSwiper;
