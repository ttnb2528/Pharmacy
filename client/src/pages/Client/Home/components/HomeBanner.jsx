import HomeCarousel from "./HomeCarousel.jsx";
import HomeRight from "./HomeRight.jsx";

const HomeBanner = () => {
  return (
    <div className="flex justify-around">
      <HomeCarousel />
      <div className="xl:block lg:hidden md:hidden sm:hidden">
        <div className="grid grid-cols-2">
          <HomeRight />
        </div>
      </div>
    </div>
  );
};

export default HomeBanner;
