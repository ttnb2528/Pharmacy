import { GET_ALL_SLIDER_BANNERS_ROUTE } from "@/API/index.api.js";
import { apiClient } from "@/lib/api-admin.js";
import { createContext, useEffect, useState } from "react";

export const SliderBannerContext = createContext();

const SliderBannerContextProvider = (props) => {
  const [sliders, setSliders] = useState([]);

  useEffect(() => {
    const getSliders = async () => {
      const res = await apiClient.get(GET_ALL_SLIDER_BANNERS_ROUTE);

      if (res.status === 200 && res.data.status === 200) {
        setSliders(res.data.data);
      }
    };

    getSliders();
  }, []);

  const contextValue = {
    sliders,
    setSliders,
  };
  return (
    <SliderBannerContext.Provider value={contextValue}>
      {props.children}
    </SliderBannerContext.Provider>
  );
};

export default SliderBannerContextProvider;
