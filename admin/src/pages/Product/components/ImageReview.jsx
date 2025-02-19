import { X } from "lucide-react";
import { createPortal } from "react-dom";

const ImagePreview = ({ imageUrl, onClose }) => {
  if (!imageUrl) return null;

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="relative max-w-[90vw] max-h-[90vh]">
        <img
          src={imageUrl}
          alt="Preview"
          className="max-w-full max-h-[90vh] object-contain"
        />
        <button
          className="absolute top-4 right-4 bg-black/20 p-3 rounded-full hover:bg-black/50 transition-all duration-300 text-white"
          onClick={onClose}
        >
          <X />
        </button>
      </div>
    </div>,
    document.body
  );
};

export default ImagePreview;
