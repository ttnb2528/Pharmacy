import { GET_ALL_SHIFT_WORK_ROUTE } from "@/API/index.api.js";
import { apiClient } from "@/lib/api-admin.js";
import { createContext, useEffect, useState } from "react";

export const ShiftWorkContext = createContext();

const ShiftWorkContextProvider = (props) => {
  const [shiftWorks, setShiftWorks] = useState([]);

  useEffect(() => {
    const getShiftWorks = async () => {
      const res = await apiClient.get(GET_ALL_SHIFT_WORK_ROUTE);

      if (res.status === 200 && res.data.status === 200) {
        setShiftWorks(res.data.data);
      }
    };

    getShiftWorks();
  }, []);

  const contextValue = {
    shiftWorks,
    setShiftWorks,
  };
  return (
    <ShiftWorkContext.Provider value={contextValue}>
      {props.children}
    </ShiftWorkContext.Provider>
  );
};

export default ShiftWorkContextProvider;
