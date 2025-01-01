import { useEffect, useState } from "react";
import HomeCarousel from "./HomeCarousel.jsx";
import HomeRight from "./HomeRight.jsx";

const HomeBanner = () => {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  return (
    <div className="flex flex-row w-full">
      <div className="w-full lg:w-8/12">
        <HomeCarousel />
      </div>

      {windowWidth > 1000 && (
        <div className="w-full lg:w-4/12 lg:ml-6">
          <HomeRight />
        </div>
      )}
    </div>
  );
};

export default HomeBanner;
