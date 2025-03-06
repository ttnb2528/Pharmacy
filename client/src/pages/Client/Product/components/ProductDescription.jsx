import { useEffect, useRef, useState } from "react";

const ProductDescription = ({ product }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("ingredients");
  const contentRef = useRef(null);
  const [shouldShowButton, setShouldShowButton] = useState(false);

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

  const scrollToTab = (tabId) => {
    const element = document.getElementById(tabId);
    if (element) {
      if (!isOpen && shouldShowButton) {
        const elementPosition = element.offsetTop;
        if (elementPosition > 300) {
          setIsOpen(true);
        }
      }
      setTimeout(() => {
        element.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }
  };

  // Kiểm tra xem nội dung có vượt quá 300px không
  useEffect(() => {
    if (contentRef.current) {
      const contentHeight = contentRef.current.scrollHeight;
      setShouldShowButton(contentHeight > 300);
    }
  }, [product]);

  return (
    <div className="mt-6">
      {/* Navigation Tabs */}
      <div className="flex gap-4 overflow-x-auto pb-2 border-b sticky top-0 bg-white z-50">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              setActiveTab(tab.id);
              scrollToTab(tab.id);
            }}
            className={`whitespace-nowrap px-4 py-2 ${
              activeTab === tab.id
                ? "text-green-600 border-b-2 border-green-600"
                : "text-gray-600 hover:text-green-600"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="relative">
        <div
          ref={contentRef}
          className={`space-y-6 py-4 transition-all duration-300 ${
            !isOpen && shouldShowButton ? "max-h-[300px] overflow-hidden" : ""
          }`}
        >
          {tabs.map((tab) => (
            <div key={tab.id} id={tab.id} className="scroll-mt-20">
              <h3 className="font-semibold text-lg mb-2">{tab.label}</h3>
              <p className="text-gray-700">{tab.content}</p>
            </div>
          ))}
        </div>

        {shouldShowButton && (
          <div className="relative flex items-center justify-center py-4">
            {!isOpen && (
              <div className="absolute inset-x-0 bottom-12 h-24 bg-gradient-to-t from-white to-transparent" />
            )}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="px-6 py-2 text-green-600 border border-green-600 rounded-full hover:bg-green-50"
            >
              {isOpen ? "Thu gọn" : "Xem thêm"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDescription;
