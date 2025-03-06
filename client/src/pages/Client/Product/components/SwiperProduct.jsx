import { Swiper, SwiperSlide } from "swiper/react";
import { Thumbs } from "swiper/modules";
import "swiper/css";
import "swiper/css/thumbs";
import { useState } from "react";

// import test_product_image from "@/assets/test_product_image1.jpg";

const SwiperProduct = (props) => {
  const { productImage } = props;

  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  const [currentThumbIndex, setCurrentThumbIndex] = useState(0);
  return (
    <div>
      {/* swiper */}
      <div className="flex h-full w-full items-center">
        <Swiper
          className="border rounded-lg border-gray-300 w-full h-full max-h-96"
          spaceBetween={0}
          slidesPerView={1}
          modules={[Thumbs]}
          thumbs={{ swiper: thumbsSwiper }}
          onSlideChange={(swiper) => setCurrentThumbIndex(swiper.activeIndex)}
          // onSwiper={(swiper) => console.log(swiper)}
        >
          {productImage?.map((item) => (
            <SwiperSlide key={item}>
              <img
                src={item}
                alt="product"
                className="h-full w-full max-h-96 object-contain"
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* secondary image */}
      <div className="mt-3 hidden md:block">
        <div className="relative flex h-full w-full items-center">
          <Swiper
            spaceBetween={10}
            slidesPerView={productImage?.length > 4 ? 4 : productImage?.length}
            modules={[Thumbs]}
            watchSlidesProgress
            // onSlideChange={() => console.log("slide change")}
            onSwiper={setThumbsSwiper}
            className="!ml-0"
          >
            {productImage?.map((item, index) => (
              <SwiperSlide key={item} className="!w-20">
                <img
                  key={index}
                  src={item}
                  alt="product"
                  className={`h-20 w-20 object-container border-2 rounded-lg ${
                    index === currentThumbIndex ? "border-green-400" : "" // Sử dụng currentThumbIndex để kiểm tra
                  }`}
                />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </div>
  );
};

export default SwiperProduct;
