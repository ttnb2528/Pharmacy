import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Item from "@/pages/Client/Product/ProductItem/Item.jsx";
import { PharmacyContext } from "@/context/Pharmacy.context.jsx";
import { useContext, useState } from "react";
import Loading from "@/pages/component/Loading.jsx";
import { HomeContext } from "@/context/HomeContext.context.jsx";
const HomeSuggest = () => {
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
        breakpoint: 600,
        settings: {
          dots: false,
          lazyLoad: true,
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 480,
        settings: {
          dots: false,
          lazyLoad: true,
          slidesToShow: 1,
        },
      },
    ],
  };
  return (
    <div>
      {isLoading && <Loading />}
      <div className="product_carousel bg-[#dcefe3] rounded-lg px-3 mb-10">
        <div className="px-6 pt-6 pb-9 ">
          <div className="product_carousel-header mb-5">
            <span className="product_carousel-title text-3xl font-bold">
              Gợi ý hôm nay
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
