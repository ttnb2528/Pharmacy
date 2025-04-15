import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Item from "@/pages/Client/Product/ProductItem/Item.jsx";
import { PharmacyContext } from "@/context/Pharmacy.context.jsx";
import { useContext, useState } from "react";
import Loading from "@/pages/component/Loading.jsx";
import { HomeContext } from "@/context/HomeContext.context.jsx";
import { useTranslation } from "react-i18next";

const HomeSuggest = () => {
  const { t } = useTranslation();
  const { hasLogin, setShowLogin } = useContext(HomeContext);
  const { allProducts } = useContext(PharmacyContext);
  // get random 5 products
  const suggestProducts = allProducts
    .sort(() => 0.5 - Math.random())
    .slice(0, 5);
  const [isLoading, setIsLoading] = useState(false);

  var settings = {
    dots: false,
    lazyLoad: true,
    slidesToShow: 5,
    infinite: false,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          dots: false,
          lazyLoad: true,
          slidesToShow: 3,
        },
      },
      {
        breakpoint: 768,
        settings: {
          dots: true,
          lazyLoad: true,
          slidesToShow: 2,
          autoplay: true,
          autoplaySpeed: 3000,
        },
      },
      {
        breakpoint: 480,
        settings: {
          lazyLoad: true,
          slidesToShow: 1,
          autoplay: true,
          autoplaySpeed: 3000,
          arrows: false,
        },
      },
    ],
  };
  return (
    <div>
      {isLoading && <Loading />}
      <div className="product_carousel bg-[#dcefe3] rounded-lg px-2 md:px-3 mb-10">
        <div className="px-3 md:px-6 pt-4 md:pt-6 pb-6 md:pb-9">
          <div className="product_carousel-header mb-3 md:mb-5">
            <span className="product_carousel-title text-xl md:text-3xl font-bold">
              {t("suggestion.title")}
            </span>
          </div>

          <div className="slider-container">
            <Slider {...settings}>
              {suggestProducts.map((product, i) => {
                return (
                  <Item
                    key={i}
                    product={product}
                    setIsLoading={setIsLoading}
                    hasLogin={hasLogin}
                    setShowLogin={setShowLogin}
                  />
                );
              })}
            </Slider>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeSuggest;
