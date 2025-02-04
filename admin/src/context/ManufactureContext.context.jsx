import { GET_ALL_MANUFACTURES_ROUTE } from "@/API/index.api.js";
import { apiClient } from "@/lib/api-admin.js";
import { createContext, useEffect, useState } from "react";

export const ManufactureContext = createContext();

const ManufactureContextProvider = (props) => {
  const [manufactures, setManufactures] = useState([]);

  useEffect(() => {
    const getCategories = async () => {
      const res = await apiClient.get(GET_ALL_MANUFACTURES_ROUTE);

      if (res.status === 200 && res.data.status === 200) {
        setManufactures(res.data.data);
      }
    };

    getCategories();
  }, []);

  const contextValue = {
    manufactures,
    setManufactures,
  };
  return (
    <ManufactureContext.Provider value={contextValue}>
      {props.children}
    </ManufactureContext.Provider>
  );
};

export default ManufactureContextProvider;
