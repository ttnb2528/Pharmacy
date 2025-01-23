import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Item from "@/pages/Client/Product/ProductItem/Item.jsx";
import { Button } from "@/components/ui/button.jsx";
import { useEffect, useState } from "react";
import { apiClient } from "@/lib/api-client.js";
import { GET_ALL_PRODUCT_BY_CATEGORY_NAME_ROUTE } from "@/API/index.api.js";
import Loading from "@/pages/component/Loading.jsx";

const HomeProductForGroup = () => {
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
          rows: 4,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          lazyLoad: true,
          rows: 5,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 2,
          lazyLoad: true,
          rows: 5,
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
              Sản phẩm theo nhóm
            </span>
          </div>

          <div className="flex gap-3 overflow-auto">
            <Button
              className={`bg-transparent text-black border border-[#0e562e] hover:bg-[#0e562e] hover:text-white font-normal hover:font-medium ${
                activeTab === "Sản phẩm tiện lợi"
                  ? "bg-[#0e562e] text-white font-medium"
                  : ""
              }`}
              onClick={() => setActiveTab("Sản phẩm tiện lợi")}
            >
              Sản phẩm tiện lợi
            </Button>
            <Button
              className={`bg-transparent text-black border border-[#0e562e] hover:bg-[#0e562e] hover:text-white font-normal hover:font-medium ${
                activeTab === "Mẹ & Bé"
                  ? "bg-[#0e562e] text-white font-medium"
                  : ""
              }`}
              onClick={() => setActiveTab("Mẹ & Bé")}
            >
              Mẹ & Bé
            </Button>
            <Button
              className={`bg-transparent text-black border border-[#0e562e] hover:bg-[#0e562e] hover:text-white font-normal hover:font-medium ${
                activeTab === "Chăm sóc cá nhân"
                  ? "bg-[#0e562e] text-white font-medium"
                  : ""
              }`}
              onClick={() => setActiveTab("Chăm sóc cá nhân")}
            >
              Chăm sóc cá nhân
            </Button>
            <Button
              className={`bg-transparent text-black border border-[#0e562e] hover:bg-[#0e562e] hover:text-white font-normal hover:font-medium ${
                activeTab === "Thiết bị y tế"
                  ? "bg-[#0e562e] text-white font-medium"
                  : ""
              }`}
              onClick={() => setActiveTab("Thiết bị y tế")}
            >
              Thiết bị y tế
            </Button>
          </div>

          <div className="slider-container mt-5">
            <Slider {...settings}>
              {productForGroups.map((product, i) => {
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

export default HomeProductForGroup;
