import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Item from "@/pages/Client/Product/ProductItem/Item.jsx";
import { Button } from "@/components/ui/button.jsx";
import { useContext, useEffect, useState } from "react";
import { apiClient } from "@/lib/api-client.js";
import { GET_ALL_PRODUCT_BY_CATEGORY_NAME_ROUTE } from "@/API/index.api.js";
import Loading from "@/pages/component/Loading.jsx";
import { HomeContext } from "@/context/HomeContext.context.jsx";
import { useTranslation } from "react-i18next";

const HomeProductForGroup = () => {
  const { t } = useTranslation();
  const { hasLogin, setShowLogin } = useContext(HomeContext);
  const [activeTab, setActiveTab] = useState("Sản phẩm tiện lợi");
  const [productForGroups, setProductForGroups] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const getProductForGroups = async () => {
      try {
        setIsLoading(true);
        const response = await apiClient.get(
          `${GET_ALL_PRODUCT_BY_CATEGORY_NAME_ROUTE}/${activeTab}`
        );

        if (response.status === 200 && response.data.status === 200) {
          setProductForGroups(response.data.data);
        } else {
          setProductForGroups([]);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    getProductForGroups();
  }, [activeTab]);

  var settings = {
    dots: false,
    infinite: false,
    lazyLoad: true,
    slidesToShow: 5,
    className: productForGroups.length > 5 ? "" : "[&>div>div]:ml-0",
    rows: productForGroups.length > 5 ? 2 : 1,

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
          slidesToShow: 2,
          lazyLoad: true,

          dots: true,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          lazyLoad: true,
        },
      },
    ],
  };
  return (
    <div>
      {isLoading && <Loading />}
      <div className="product_carousel bg-white rounded-lg px-2 md:px-3 mb-10">
        <div className="px-3 md:px-6 pt-4 md:pt-6 pb-6 md:pb-9">
          <div className="product_carousel-header mb-3 md:mb-5">
            <span className="product_carousel-title text-xl md:text-3xl font-bold">
              {t("productForGroup.title")}
            </span>
          </div>

          <div className="flex gap-2 md:gap-3 overflow-x-auto pb-2 -mx-1 px-1 snap-x">
            <Button
              className={`bg-transparent text-black border border-[#0e562e] hover:bg-[#0e562e] hover:text-white font-normal hover:font-medium text-xs md:text-sm py-1 md:py-2 px-2 md:px-4 whitespace-nowrap flex-shrink-0 snap-start ${
                activeTab === "Sản phẩm tiện lợi"
                  ? "bg-[#0e562e] text-white font-medium"
                  : ""
              }`}
              onClick={() => setActiveTab("Sản phẩm tiện lợi")}
            >
              {t("categories.Sản phẩm tiện lợi")}
            </Button>
            <Button
              className={`bg-transparent text-black border border-[#0e562e] hover:bg-[#0e562e] hover:text-white font-normal hover:font-medium text-xs md:text-sm py-1 md:py-2 px-2 md:px-4 whitespace-nowrap flex-shrink-0 snap-start ${
                activeTab === "Mẹ và Bé"
                  ? "bg-[#0e562e] text-white font-medium"
                  : ""
              }`}
              onClick={() => setActiveTab("Mẹ và Bé")}
            >
             {t("categories.Mẹ và Bé")}
            </Button>
            <Button
              className={`bg-transparent text-black border border-[#0e562e] hover:bg-[#0e562e] hover:text-white font-normal hover:font-medium text-xs md:text-sm py-1 md:py-2 px-2 md:px-4 whitespace-nowrap flex-shrink-0 snap-start ${
                activeTab === "Chăm sóc cá nhân"
                  ? "bg-[#0e562e] text-white font-medium"
                  : ""
              }`}
              onClick={() => setActiveTab("Chăm sóc cá nhân")}
            >
              {t("categories.Chăm sóc cá nhân")}
            </Button>
            <Button
              className={`bg-transparent text-black border border-[#0e562e] hover:bg-[#0e562e] hover:text-white font-normal hover:font-medium text-xs md:text-sm py-1 md:py-2 px-2 md:px-4 whitespace-nowrap flex-shrink-0 snap-start ${
                activeTab === "Thiết bị y tế"
                  ? "bg-[#0e562e] text-white font-medium"
                  : ""
              }`}
              onClick={() => setActiveTab("Thiết bị y tế")}
            >
              {t("categories.Thiết bị y tế")}
            </Button>
          </div>

          <div className="slider-container mt-3 md:mt-5">
            <Slider {...settings}>
              {productForGroups.map((product, i) => {
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

export default HomeProductForGroup;
