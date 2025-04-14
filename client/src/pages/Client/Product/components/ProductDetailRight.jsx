import refundProduct from "@/assets/refundProduct.png";
import { FaShippingFast } from "react-icons/fa";
import { IoIosPricetags } from "react-icons/io";
import { FaUserNurse } from "react-icons/fa";
import { apiClient } from "@/lib/api-client.js";
import { GET_ALL_PRODUCT_BY_CATEGORY_ROUTE } from "@/API/index.api.js";
import { useEffect, useState } from "react";
import Fuse from "fuse.js";
import { convertVND } from "@/utils/ConvertVND.js";

const ProductDetailRight = ({ product }) => {
  const category = product?.categoryId?._id;
  const [productSimilar, setProductSimilar] = useState([]);

  useEffect(() => {
    const getSimilarProduct = async () => {
      try {
        const res = await apiClient.get(
          `${GET_ALL_PRODUCT_BY_CATEGORY_ROUTE}/${category}`
        );

        const allProducts = res.data.data;

        const fuse = new Fuse(allProducts, {
          keys: ["name"], // Tìm kiếm theo trường name
          threshold: 0.7, // Mức độ tương đồng (0.0 là chính xác, 1.0 là khớp mờ)
        });

        const result = fuse.search(product.name);

        const similarProducts = result.filter(
          (item) => item.item._id !== product._id
        );

        setProductSimilar(similarProducts);
      } catch (error) {
        console.log(error);
      }
    };
    getSimilarProduct();
  }, [category]);

  // console.log(productSimilar);

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
                <span className="text-neutral-500">Cho mọi đơn hàng từ 0đ</span>
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

          {productSimilar.map((product) => (
            <div key={product.item._id} className="flex gap-4 items-center">
              <img
                // src={product?.product?.images[0] || refundProduct}
                src={product?.item?.images[0] || refundProduct}
                alt=""
                className="w-20 h-20 object-cover border p-1 rounded-lg"
              />
              <div>
                <h1 className="text-base font-medium line-clamp-2">
                  {product?.item?.name}
                </h1>
                <span className="text-orange-400">
                  {product?.item?.batches[0]?.retailPrice
                    ? convertVND(product?.item?.batches[0]?.retailPrice)
                    : "Đang cập nhật"}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductDetailRight;
