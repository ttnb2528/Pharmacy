import refundProduct from "@/assets/refundProduct.png";
import testProductImage from "@/assets/test_product_image1.jpg";
import { FaShippingFast } from "react-icons/fa";
import { IoIosPricetags } from "react-icons/io";
import { FaUserNurse } from "react-icons/fa";

const ProductDetailRight = () => {
  const productSimilar = [1, 2, 3, 4];
  return (
    <div className="hidden md:block">
      <div
        className="sticky top-0 mb-4 grid h-fit content-between gap-2 rounded p-4 md:mb-6"
        style={{ "--header-position-start-sticky": "0px" }}
      >
        <div className="box border flex flex-col justify-center rounded-lg overflow-hidden border-green-400">
          <h1 className="text-center bg-green-700 py-3 text-white uppercase text-xl font-bold">
            Ưu đãi đặc biệt
          </h1>
          <div className="space-y-5 my-4">
            <div className="flex gap-2 items-center px-4">
              <div className="border rounded-full bg-neutral-100">
                <img src={refundProduct} alt="" className="w-14 h-15" />
              </div>
              <div className="flex flex-col">
                <h1 className="text-lg font-medium">Đổi trả miễn phí</h1>
                <span className="text-neutral-500">
                  Theo chính sách đổi trả
                </span>
              </div>
            </div>
            <div className="flex gap-2 items-center px-4">
              {/* <img src={refundProduct} alt="" className="w-16 h-16" /> */}
              <FaShippingFast className="w-14 h-14 border rounded-full bg-neutral-100 p-2 text-green-600 mx-1" />
              <div className="flex flex-col">
                <h1 className="text-lg font-medium">Miễn phí vận chuyển</h1>
                <span className="text-neutral-500">
                  Cho mọi đơn hàng từ 0đ
                </span>
              </div>
            </div>
            <div className="flex gap-2 items-center px-4">
              {/* <img src={refundProduct} alt="" className="w-16 h-16" /> */}
              <IoIosPricetags className="w-14 h-14 border rounded-full bg-neutral-100 p-2 text-green-600 mx-1" />
              <div className="flex flex-col">
                <h1 className="text-lg font-medium">Giá cả hợp lý </h1>
                <span className="text-neutral-500">
                  Giá cạnh tranh tốt nhất
                </span>
              </div>
            </div>
            <div className="flex gap-2 items-center px-4">
              {/* <img src={refundProduct} alt="" className="w-16 h-16" /> */}
              <FaUserNurse className="w-14 h-14 border rounded-full bg-neutral-100 p-2 text-green-600 mx-1" />
              <div className="flex flex-col">
                <h1 className="text-lg font-medium">Dược sĩ tư vấn tại chỗ</h1>
                <span className="text-neutral-500">
                  Thân thiện & nhiệt tình
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="my-5 space-y-4">
          <h1 className="text-xl font-bold">Sản phẩm tương tự</h1>

          {productSimilar.map((item) => (
            <div key={item} className="flex gap-4 items-center">
              <img
                src={testProductImage}
                alt=""
                className="w-20 h-20 object-cover border rounded-lg"
              />
              <div>
                <h1 className="text-base font-medium line-clamp-2">
                  Sữa bột Ensure Gold StrengthPro Abbott hương vani tăng cường
                  sức khỏe khối cơ, tăng miễn dịch (800g)
                </h1>
                <span className="text-orange-400">519.800&nbsp;₫</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductDetailRight;
