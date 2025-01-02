import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Item from "@/pages/component/ProductItem/Item.jsx";
import { Button } from "@/components/ui/button.jsx";
import { useState } from "react";

const HomeProductForGroup = () => {
  const [activeTab, setActiveTab] = useState("Mỹ Phẩm");
  const productForGroups = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  var settings = {
    dots: false,
    infinite: false,
    lazyLoad: true,
    slidesToShow: 5,
    rows: 2,

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
                activeTab === "Mỹ Phẩm"
                  ? "bg-[#0e562e] text-white font-medium"
                  : ""
              }`}
              onClick={() => setActiveTab("Mỹ Phẩm")}
            >
              Mỹ Phẩm
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
                return <Item key={i} />;
              })}
            </Slider>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeProductForGroup;
