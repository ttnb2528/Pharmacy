import { Separator } from "@/components/ui/separator.jsx";
import Breadcrumbs from "./components/Breadcumbs.jsx";
import SwiperProduct from "./components/SwiperProduct.jsx";
import ProductDetailInfo from "./components/ProductDetailInfo.jsx";
import ProductDescription from "./components/ProductDescription.jsx";
import ProductDetailRight from "./components/ProductDetailRight.jsx";
import { useLocation } from "react-router-dom";
import ProductComments from "./components/ProductComments.jsx";

const ProductDisplay = () => {
  const { state } = useLocation();
  const product = state.product;
  return (
    <>
      <div>
        <Breadcrumbs
          category={product?.categoryId?.name}
          product={product?.name}
        />

        <div className="relative grid grid-cols-1 gap-6 md:container md:grid-cols-[min(60%,calc(555rem/16)),1fr] md:pt-6 lg:grid-cols-[min(72%,calc(970rem/16)),1fr] mb-10 bg-white p-5">
          <div className="grid md:gap-3">
            <div className="grid grid-cols-1 items-start md:gap-6 lg:grid-cols-2 xl:grid-cols-2">
              {/* image */}
              <div className="md:sticky md:top-0">
                <SwiperProduct productImage={product?.images} />
              </div>
              {/* info */}
              <ProductDetailInfo product={product} />
            </div>

            <Separator />

            <ProductDescription product={product} />
          </div>

          <ProductDetailRight product={product} />

          {/* Thêm phần bình luận */}
          <Separator />
          <ProductComments productId={product?._id} />
        </div>

        {/* <div className="flex flex-col md:flex-row gap-8">
        <div className="w-2/5">
          <div className="mb-4 relative overflow-hidden">
            <div className="flex transition-transform duration-300 ease-out cursor-grab active:cursor-grabbing w-[424px]">
              {productImage.map((item) => (
                <img
                  key={item}
                  src="https://via.placeholder.com/150"
                  alt="product"
                  className="w-full h-auto object-cover rounded-lg shadow-lg flex-shrink-0"
                />
              ))}
            </div>
          </div>
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
            image secondary
          </div>
        </div>
        <div className="w-2/5">abc</div>
        <div className="w-1/5">abc</div>
      </div> */}
      </div>
    </>
  );
};

export default ProductDisplay;
