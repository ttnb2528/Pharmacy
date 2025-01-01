import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import banner1 from "@/assets/banner/banner1.jpg";
import banner2 from "@/assets/banner/banner2.png";
import banner3 from "@/assets/banner/banner3.jpg";
import banner4 from "@/assets/banner/banner4.jpg";

const HomeCarousel = () => {
  const banners = [banner1, banner2, banner3, banner4];
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
            <img src={banner} alt="banner" className="w-full rounded-lg" />
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default HomeCarousel;
