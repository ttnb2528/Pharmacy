import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useEffect, useState } from "react";
import { apiClient } from "@/lib/api-client.js";
import { GET_ALL_SLIDER_BANNER_ROUTE } from "@/API/index.api.js";

const HomeCarousel = () => {
  const [banners, setBanners] = useState([]);
  // const banners = [banner1, banner2, banner3, banner4];
  useEffect(() => {
    const getBanners = async () => {
      try {
        const res = await apiClient.get(GET_ALL_SLIDER_BANNER_ROUTE);
        if (res.status === 200 && res.data.status === 200) {
          setBanners(
            res.data.data.filter(
              (banner) => banner.deleted === false && banner.position === "left"
            )
          );
        }
      } catch (error) {
        console.log(error);
      }
    };
    getBanners();
  }, []);
  const settings = {
    dots: true,
    infinity: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
    autoplay: true,
    autoplaySpeed: 2500,
  };
  return (
    <div>
      <Slider {...settings}>
        {banners.map((banner, index) => (
          <div key={index}>
            <img
              src={banner.image}
              alt="banner"
              className="w-full rounded-lg"
            />
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default HomeCarousel;
