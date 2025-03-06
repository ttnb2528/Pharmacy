import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useContext, useEffect, useRef, useState } from "react";
import moment from "moment";
import Item from "@/pages/Client/Product/ProductItem/Item.jsx";
import Loading from "@/pages/component/Loading.jsx";
import { GET_ALL_PRODUCTS_DISCOUNT_ROUTE } from "@/API/index.api.js";
import { apiClient } from "@/lib/api-client.js";
import { HomeContext } from "@/context/HomeContext.context.jsx";

const HomeDeal = () => {
  const { hasLogin, setShowLogin } = useContext(HomeContext);
  const [remainingTime, setRemainingTime] = useState(moment.duration(0));
  const [all_products, setAllProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const animationFrameRef = useRef(null);
  const lastUpdateRef = useRef(null);

  useEffect(() => {
    const allProductsDiscount = async () => {
      try {
        const res = await apiClient.get(GET_ALL_PRODUCTS_DISCOUNT_ROUTE);

        if (res.status === 200 && res.data.status === 200) {
          setAllProducts(res.data.data);
        } else {
          setAllProducts([]);
        }
      } catch (error) {
        console.error(error);
      }
    };

    allProductsDiscount();
  }, []);

  useEffect(() => {
    const updateRemainingTime = () => {
      const now = moment();
      const midnight = moment().endOf("day");
      const diff = moment.duration(midnight.diff(now));

      // Chỉ cập nhật state nếu đã qua 1 giây kể từ lần cập nhật cuối
      const currentTime = Date.now();
      if (
        !lastUpdateRef.current ||
        currentTime - lastUpdateRef.current >= 1000
      ) {
        setRemainingTime(diff);
        lastUpdateRef.current = currentTime;
      }

      // Tiếp tục vòng lặp nếu còn thời gian
      if (diff.asSeconds() > 0) {
        animationFrameRef.current = requestAnimationFrame(updateRemainingTime);
      }
    };

    // Bắt đầu đếm ngược
    animationFrameRef.current = requestAnimationFrame(updateRemainingTime);

    // Cleanup khi component unmount
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

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
    const { className, onClick } = props;
    return (
      <div
        className={className}
        // style={{ ...style, display: "block", background: "green" }}
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
    className: all_products.length > 5 ? "" : "[&>div>div]:ml-0",
    infinite: all_products.length > 5 ? true : false,
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

  // useEffect(() => {
  //   const intervalId = setInterval(() => {
  //     const now = moment();
  //     const midnight = moment().endOf("day");
  //     const diff = moment.duration(midnight.diff(now));

  //     setRemainingTime(diff);
  //   }, 1000);

  //   return () => clearInterval(intervalId);
  // }, []);

  return (
    <div className="my-10 rounded-lg overflow-hidden bg-[#fff8f9] px-3">
      {isLoading && <Loading />}
      <div className="px-6 pt-6 pb-9">
        <div className="flex justify-between items-center">
          <h1 className="text-4xl font-bold text-[#c31731]">
            Săn Deal Chớp Nhoáng
          </h1>
          <div className="flex justify-end items-center text-white">
            <h5 className="font-bold text-black text-2xl">Kết Thúc trong:</h5>
            <h5 className="font-bold mx-2 bg-red-300 p-2 rounded">
              {remainingTime.hours().toString().padStart(2, "0")}
            </h5>
            <span className="text-black text-lg">:</span>
            <h5 className="font-bold mx-2 bg-red-300 p-2 rounded">
              {remainingTime.minutes().toString().padStart(2, "0")}
            </h5>
            <span className="text-black text-lg">:</span>
            <h5 className="font-bold mx-2 bg-red-300 p-2 rounded">
              {remainingTime.seconds().toString().padStart(2, "0")}
            </h5>
          </div>
        </div>

        <div className="mt-8">
          <Slider {...settings}>
            {all_products.map((product) => (
              <Item
                key={product._id}
                product={product}
                setIsLoading={setIsLoading}
                hasLogin={hasLogin}
                setShowLogin={setShowLogin}
              />
            ))}
          </Slider>
        </div>
      </div>
    </div>
  );
};

export default HomeDeal;
