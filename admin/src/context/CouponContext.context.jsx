import { GET_ALL_COUPONS_ROUTE } from "@/API/index.api.js";
import { apiClient } from "@/lib/api-admin.js";
import { createContext, useEffect, useState } from "react";

export const CouponContext = createContext();

const CouponContextProvider = (props) => {
  const [coupons, setCoupons] = useState([]);

  useEffect(() => {
    const getCoupons = async () => {
      const res = await apiClient.get(GET_ALL_COUPONS_ROUTE);

      if (res.status === 200 && res.data.status === 200) {
        setCoupons(res.data.data);
      }
    };

    getCoupons();
  }, []);

  const contextValue = {
    coupons,
    setCoupons,
  };
  return (
    <CouponContext.Provider value={contextValue}>
      {props.children}
    </CouponContext.Provider>
  );
};

export default CouponContextProvider;
