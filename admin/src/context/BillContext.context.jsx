import { GET_ALL_BILLS_ROUTE } from "@/API/index.api.js";
import { apiClient } from "@/lib/api-admin.js";
import { createContext, useEffect, useState } from "react";

export const BillContext = createContext();

const BillContextProvider = (props) => {
  const [bills, setBills] = useState([]);

  useEffect(() => {
    const getBills = async () => {
      const res = await apiClient.get(GET_ALL_BILLS_ROUTE);

      if (res.status === 200 && res.data.status === 200) {
        setBills(res.data.data);
      }
    };

    getBills();
  }, []);

  const contextValue = {
    bills,
    setBills,
  };
  return (
    <BillContext.Provider value={contextValue}>
      {props.children}
    </BillContext.Provider>
  );
};

export default BillContextProvider;
