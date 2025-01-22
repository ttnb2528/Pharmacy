import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Item from "@/pages/Client/Product/ProductItem/Item.jsx";
import { useContext, useState } from "react";
import { PharmacyContext } from "@/context/Pharmacy.context.jsx";
import Loading from "@/pages/component/Loading.jsx";

const HomeBestSelling = () => {
  const { productsBestSelling } = useContext(PharmacyContext);
  const [isLoading, setIsLoading] = useState(false);
  function SampleNextArrow(props) {
    const { className, onClick } = props;

    return (
      <div
        className={className}
        // style={{ ...style, display: "block", background: "red" }}
        onClick={onClick}
      >
        <svg
          width="24"
          height="24"
          xmlns="http://www.w3.org/2000/svg"
          fillRule="evenodd"
          clipRule="evenodd"
        >
          <path d="M12 0c6.623 0 12 5.377 12 12s-5.377 12-12 12-12-5.377-12-12 5.377-12 12-12zm0 1c6.071 0 11 4.929 11 11s-4.929 11-11 11-11-4.929-11-11 4.929-11 11-11zm-3 5.753l6.44 5.247-6.44 5.263.678.737 7.322-6-7.335-6-.665.753z" />
        </svg>
      </div>
    );
  }

  function SamplePrevArrow(props) {
    const { className, style, onClick } = props;
    return (
      <div
        className={className}
        style={{ ...style, display: "block" }}
        onClick={onClick}
      >
        <svg
          width="24"
          height="24"
          xmlns="http://www.w3.org/2000/svg"
          fillRule="evenodd"
          clipRule="evenodd"
        >
          <path d="M12 0c6.623 0 12 5.377 12 12s-5.377 12-12 12-12-5.377-12-12 5.377-12 12-12zm0 1c6.071 0 11 4.929 11 11s-4.929 11-11 11-11-4.929-11-11 4.929-11 11-11zm3 5.753l-6.44 5.247 6.44 5.263-.678.737-7.322-6 7.335-6 .665.753z" />
        </svg>
      </div>
    );
  }

  var settings = {
    dots: false,
    infinite: true,
    speed: 1250,
    lazyLoad: true,
    slidesToShow: 5,
    slidesToScroll: 5,
    arrows: true,
    autoplay: false,
    autoplaySpeed: 2000,
    pauseOnHover: true,
    nextArrow: <SampleNextArrow />,
    prevArrow: <SamplePrevArrow />,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
          lazyLoad: true,
          infinite: true,
          dots: false,
          arrows: true,
          autoplay: true,
          autoplaySpeed: 2000,
          pauseOnHover: true,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          lazyLoad: true,
          initialSlide: 2,
          arrows: true,
          autoplay: true,
          autoplaySpeed: 2000,
          pauseOnHover: true,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          lazyLoad: true,
          arrows: true,
          autoplay: true,
          autoplaySpeed: 2000,
          pauseOnHover: true,
        },
      },
    ],
  };
  return (
    <div>
      {isLoading && <Loading />}
      <div className="product_carousel bg-white rounded-lg px-3 mb-10">
        <div className="px-6 pt-6 pb-9 ">
          <div className="product_carousel-header mb-5">
            <span className="product_carousel-title text-3xl font-bold">
              Sản phẩm bán chạy
            </span>
          </div>

          <div className="slider-container">
            <Slider {...settings}>
              {productsBestSelling?.map((product, i) => {
                return (
                  <Item key={i} product={product} setIsLoading={setIsLoading} />
                );
              })}
            </Slider>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeBestSelling;
