import { GET_ALL_STAFF_ROUTE } from "@/API/index.api.js";
import { apiClient } from "@/lib/api-admin.js";
import { createContext, useEffect, useState } from "react";

export const StaffContext = createContext();

const StaffContextProvider = (props) => {
  const [staffs, setStaffs] = useState([]);

  useEffect(() => {
    const getStaffs = async () => {
      const res = await apiClient.get(GET_ALL_STAFF_ROUTE);

      if (res.status === 200 && res.data.status === 200) {
        setStaffs(res.data.data);
      }
    };

    getStaffs();
  }, []);

  const contextValue = {
    staffs,
    setStaffs,
  };
  return (
    <StaffContext.Provider value={contextValue}>
      {props.children}
    </StaffContext.Provider>
  );
};

export default StaffContextProvider;
