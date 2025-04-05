import { useState } from "react";
import { StickyNote, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";

const MobileCheckoutNote = ({ note, setNote }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [tempNote, setTempNote] = useState("");

  const handleOpen = () => {
    setTempNote(note);
    setIsOpen(true);
  };

  const handleSave = () => {
    setNote(tempNote);
    setIsOpen(false);
  };

  return (
    <div className="bg-white p-4 rounded-md">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <StickyNote className="h-5 w-5 text-green-600" />
          <h2 className="font-semibold">Ghi chú</h2>
        </div>

        <Button
          variant="ghost"
          size="sm"
          className="text-green-600 p-0 h-auto flex items-center"
          onClick={handleOpen}
        >
          {note ? "Chỉnh sửa" : "Thêm ghi chú"}
          <ChevronRight className="h-4 w-4 ml-1" />
        </Button>
      </div>

      {note ? (
        <p className="text-sm text-gray-600 line-clamp-2 mt-1">{note}</p>
      ) : (
        <p className="text-sm text-gray-500 mt-1">Thêm ghi chú cho đơn hàng</p>
      )}

      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetContent side="bottom" className="h-[50vh]">
          <SheetHeader>
            <SheetTitle>Ghi chú đơn hàng</SheetTitle>
          </SheetHeader>

          <div className="py-4">
            <Textarea
              placeholder="Nhập ghi chú cho đơn hàng của bạn..."
              className="min-h-[150px]"
              value={tempNote}
              onChange={(e) => setTempNote(e.target.value)}
            />
          </div>

          <SheetFooter>
            <Button
              className="w-full bg-green-500 hover:bg-green-600"
              onClick={handleSave}
            >
              Lưu ghi chú
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default MobileCheckoutNote;
