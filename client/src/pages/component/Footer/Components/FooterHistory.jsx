import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Item from "@/pages/Client/Product/ProductItem/Item.jsx";

const FooterHistory = () => {
  const suggestProducts = [1, 2, 3, 4, 5];

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
      <div className="product_carousel bg-white rounded-lg px-3 mb-10 w-[80vw] mx-auto">
        <div className="px-6 pt-6 pb-9 ">
          <div className="product_carousel-header mb-5">
            <span className="product_carousel-title text-3xl font-bold">
              Sản phẩm vừa xem
            </span>
          </div>

          <div className="slider-container">
            <Slider {...settings}>
              {suggestProducts.map((product, i) => {
                return <Item key={i} />;
              })}
            </Slider>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FooterHistory;
