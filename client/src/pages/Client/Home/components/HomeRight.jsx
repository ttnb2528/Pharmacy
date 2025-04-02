import { GET_ALL_SLIDER_BANNER_ROUTE } from "@/API/index.api.js";
// import right1 from "@/assets/banner/right1.jpg";
// import right2 from "@/assets/banner/right2.jpg";
import { apiClient } from "@/lib/api-client.js";
import { useEffect, useState } from "react";

const HomeRight = () => {
  const [bannerRight, setBannerRight] = useState([]);
  useEffect(() => {
    const getBannerRight = async () => {
      try {
        const res = await apiClient.get(GET_ALL_SLIDER_BANNER_ROUTE);
        if (res.status === 200 && res.data.status === 200) {
          setBannerRight(
            res.data.data.filter(
              (banner) =>
                banner.deleted === false && banner.position === "right"
            )
          );
        }
      } catch (error) {
        console.log(error);
      }
    };
    getBannerRight();
  }, []);
  return (
    <div>
      {/* <img src={right1} alt="" className="w-full h-auto rounded mb-4" />
      <img src={right2} alt="" className="w-full h-auto rounded" /> */}
      {bannerRight.map((banner, index) => (
        <img
          src={banner.image}
          alt="banner"
          key={index}
          className={`w-full h-auto rounded ${index === 0 ? "mb-4" : ""}`}
        />
      ))}
    </div>
  );
};

export default HomeRight;
