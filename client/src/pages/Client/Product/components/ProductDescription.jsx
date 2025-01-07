import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

import { useEffect, useRef, useState } from "react";

const ProductDescription = () => {
  const [isOpen, setIsOpen] = useState(false);
  const contentRef = useRef(null);

  useEffect(() => {
    if (contentRef.current) {
      // Đặt chiều cao ban đầu
      contentRef.current.style.height = "480px";
    }
  }, []);

  // Cập nhật chiều cao khi Collapsible thay đổi trạng thái
  useEffect(() => {
    if (contentRef.current) {
      if (isOpen) {
        // Cho phép nội dung mở rộng tự nhiên
        contentRef.current.style.height = "auto";
      } else {
        // Đặt lại chiều cao ban đầu
        contentRef.current.style.height = "480px";
      }
    }
  }, [isOpen]);
  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <div className="grid">
        <div className="md:h-auto md:max-h-[inherit]">
          <div>
            <CollapsibleContent
              ref={contentRef}
              className={`CollapsibleContent overflow-hidden transition-all`}
              // className="overflow-hidden transition-all data-[state=closed]:block data-[state=closed]:max-h-[140px] md:data-[state=closed]:max-h-[480px]"
              style={{
                "--radix-collapsible-content-height": "auto", // Cho phép nội dung mở rộng tự nhiên
              }}
            >
              <div className="grid px-4 md:px-0 md:pb-2">
                <div className="max-w-[calc(100vw-32px)] overflow-auto md:w-[calc(var(--width-container)-312px-48px)] md:max-w-none">
                  <p>
                    <strong>
                      Thành phần
                      <br />
                    </strong>
                    Dầu thực vật, Soy Protein Isolated, Maltodextrin, Sucrose,
                    Chất xơ hòa tan Synergy 1, Palatinose (Isomaltulose), Khoáng
                    chất (Canxi, Kali, Magie, Sắt, Kẽm, Đồng, Iod, Mangan,
                    Selen), Vitamin( Vitamin a, Vitamin D3, Vitamin E, Vitamin
                    K1, Vitamin C, Vitamin B1, Vitamin B2, VitaminB6,
                    VitaminB12, Axit Pantothenic, Axit Folic, Biotin), CaHMB,
                    Glucosamine Sulface, Taurine, Gamma aminobutyric acid
                    (GABA), Hương sữa và hương vani tổng hợp dùng cho thực phẩm.
                  </p>
                  <p>
                    <strong>
                      Đối tượng sử dụng
                      <br />
                    </strong>
                    Người trung niên, lớn tuổi có vấn đề về tiêu hóa, tim mạch
                    và xương khớp.
                  </p>
                  <p>
                    <strong>
                      Cách sử dụng
                      <br />
                    </strong>
                    Pha 6 muỗng gạt Calosure Gold (khoảng 50g) với 220ml nước
                    chín ấm (50 độ c) , khuấy đều để được 1 ly khoảng 225ml cung
                    cấp 225kcal (Đậm độ năng lượng đạt 1kcal/ml). Uống 2-3 ly
                    mỗi ngày hoặc theo hướng dẫn của cán bộ y tế . Hỗn hợp sau
                    khi pha nên sử dụng hết trong vòng 1 giờ.
                  </p>
                  <p>
                    <strong>Bảo quản:&nbsp;</strong>Bảo quản nơi khô ráo, sạch
                    sẽ, thoáng mát, tránh ánh nắng trực tiếp. Lon đã mở phải
                    được đóng kín và sử dụng hết trong vòng 3 tuần.
                  </p>
                  <p>
                    <strong>Thương hiệu:&nbsp;</strong>Calosure Gold
                  </p>
                  <p>
                    <strong>Nơi sản xuất:</strong>&nbsp;Calosure Gold (Việt Nam)
                  </p>
                </div>
              </div>
            </CollapsibleContent>
            <div className="relative flex items-center justify-center">
              {/* <div className="absolute inset-x-0 bottom-full h-16 bg-gradient-to-b from-black/0 to-[#FFF_78.91%]"></div> */}
              <CollapsibleTrigger asChild>
                <button className="relative justify-center border-0 bg-transparent text-sm font-normal outline-none md:hover:text-green-600 md:text-base hidden md:block">
                  {isOpen ? "Thu gọn" : "Xem thêm"}
                </button>
              </CollapsibleTrigger>
            </div>
          </div>
        </div>
      </div>
    </Collapsible>
  );
};

export default ProductDescription;
