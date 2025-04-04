import { useState } from "react";
import { ChevronRight } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const MobileProductDescription = ({ product }) => {
  const [isOpen, setIsOpen] = useState(false);

  const tabs = [
    { id: "ingredients", label: "Thành phần", content: product?.ingredients },
    { id: "users", label: "Đối tượng sử dụng", content: product?.drugUser },
    { id: "usage", label: "Cách sử dụng", content: product?.instruction },
    {
      id: "storage",
      label: "Bảo quản",
      content:
        "Bảo quản nơi khô ráo, sạch sẽ, thoáng mát, tránh ánh nắng trực tiếp. Lon đã mở phải được đóng kín và sử dụng hết trong vòng 3 tuần.",
    },
    { id: "brand", label: "Thương hiệu", content: product?.brandId?.name },
    {
      id: "origin",
      label: "Nơi sản xuất",
      content:
        product?.batches[0]?.ManufactureId?.country ?? "Dữ liệu đang cập nhật",
    },
  ];

  return (
    <div className="mt-4">
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-semibold text-lg">Thông tin sản phẩm</h3>
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              className="flex items-center text-green-600 p-0 h-auto"
            >
              Xem chi tiết
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-full sm:max-w-md">
            <SheetHeader>
              <SheetTitle>Thông tin chi tiết</SheetTitle>
            </SheetHeader>
            <div className="mt-6 overflow-auto h-[calc(100vh-100px)]">
              <Tabs defaultValue="ingredients">
                <TabsList className="grid grid-cols-3 mb-4">
                  {tabs.slice(0, 3).map((tab) => (
                    <TabsTrigger key={tab.id} value={tab.id}>
                      {tab.label}
                    </TabsTrigger>
                  ))}
                </TabsList>
                <TabsList className="grid grid-cols-3 mb-6">
                  {tabs.slice(3, 6).map((tab) => (
                    <TabsTrigger key={tab.id} value={tab.id}>
                      {tab.label}
                    </TabsTrigger>
                  ))}
                </TabsList>

                {tabs.map((tab) => (
                  <TabsContent key={tab.id} value={tab.id} className="mt-0">
                    <div className="space-y-4">
                      <h4 className="font-medium text-lg">{tab.label}</h4>
                      <p className="text-gray-700">
                        {tab.content || "Đang cập nhật"}
                      </p>
                    </div>
                  </TabsContent>
                ))}
              </Tabs>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      <div className="text-gray-700 text-sm line-clamp-3">
        {product?.uses || "Đang cập nhật thông tin sản phẩm."}
      </div>
    </div>
  );
};

export default MobileProductDescription;
