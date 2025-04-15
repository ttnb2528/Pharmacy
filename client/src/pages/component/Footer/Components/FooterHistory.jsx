import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Item from "@/pages/Client/Product/ProductItem/Item.jsx";
import { useContext, useEffect, useState } from "react";
import Loading from "../../Loading.jsx";
import { apiClient } from "@/lib/api-client.js";
import { GET_ALL_PRODUCTS_BY_HISTORY_ROUTE } from "@/API/index.api.js";
import { HomeContext } from "@/context/HomeContext.context.jsx";
import { useTranslation } from "react-i18next";

const FooterHistory = () => {
  const {t} = useTranslation();
  const { hasLogin, setShowLogin } = useContext(HomeContext);
  const [isLoading, setIsLoading] = useState(false);
  const [viewedProducts, setViewedProducts] = useState([]);

  const updateViewedProducts = async () => {
    const storedProducts = localStorage.getItem("viewedProducts");
    if (storedProducts) {
      try {
        setIsLoading(true);
        const productIds = JSON.parse(storedProducts).map(
          (product) => product._id
        );

        const res = await apiClient.post(GET_ALL_PRODUCTS_BY_HISTORY_ROUTE, {
          productIds,
        });

        if (res.status === 200 && res.data.status === 200) {
          setViewedProducts(res.data.data);
        } else {
          console.error(res);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  useEffect(() => {
    // Cập nhật lần đầu
    updateViewedProducts();

    // Lắng nghe custom event cho các thay đổi trong cùng tab
    window.addEventListener("viewedProductsUpdated", updateViewedProducts);
    // Lắng nghe storage event cho các thay đổi từ tab khác
    window.addEventListener("storage", updateViewedProducts);

    return () => {
      window.removeEventListener("viewedProductsUpdated", updateViewedProducts);
      window.removeEventListener("storage", updateViewedProducts);
    };
  }, []);

  var settings = {
    dots: false,
    className: viewedProducts.length > 5 ? "" : "[&>div>div]:ml-0",
    infinite: viewedProducts.length > 5 ? true : false,
    lazyLoad: true,
    swipeToSlide: true,
    slidesToShow: 5,
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
          dots: true,
          lazyLoad: true,
          slidesToShow: 1,
          autoplay: true,
          autoplaySpeed: 3000,
        },
      },
    ],
  };

  if (viewedProducts.length === 0) {
    return null;
  }

  return (
    <div>
      {isLoading && <Loading />}
      <div className="product_carousel bg-white rounded-lg px-2 md:px-3 mb-10 w-[95vw] md:w-[90vw] lg:w-[80vw] mx-auto">
        <div className="px-3 md:px-6 pt-4 md:pt-6 pb-6 md:pb-9">
          <div className="product_carousel-header mb-3 md:mb-5">
            <span className="product_carousel-title text-xl md:text-3xl font-bold">
              {t("RecentlyViewed.title")}
            </span>
          </div>

          <div className="slider-container">
            <Slider {...settings}>
              {viewedProducts.map((product, i) => {
                return (
                  <Item
                    key={i}
                    product={viewedProducts[i]}
                    setIsLoading={setIsLoading}
                    setViewedProducts={setViewedProducts}
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

export default FooterHistory;
