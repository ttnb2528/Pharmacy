import { X } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";

const ImagePreview = ({ imageUrl, onClose, isOpen }) => {
  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <DialogContent
        onPointerDownOutside={(e) => {
          e.preventDefault();
        }}
        className="max-w-[90vw] max-h-[90vh] p-0 border-none bg-transparent shadow-none"
      >
        <div className="relative grid place-items-center">
          <img
            src={imageUrl}
            alt="Preview"
            className="max-w-full max-h-[80vh] object-contain"
          />
          <button
            className="absolute -top-14 bg-black/20 p-3 border border-white rounded-full hover:bg-black/50 transition-all duration-300 text-white md:block hidden"
            onClick={onClose}
          >
            <X />
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ImagePreview;
