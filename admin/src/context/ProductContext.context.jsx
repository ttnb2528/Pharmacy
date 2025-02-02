import {
  GET_ALL_BRANDS_ROUTE,
  GET_ALL_CATEGORIES_ROUTE,
  GET_ALL_PRODUCTS_ROUTE,
} from "@/API/index.api.js";
import { apiClient } from "@/lib/api-admin.js";
import { createContext, useEffect, useState } from "react";

export const MedicineContext = createContext();

const MedicineContextProvider = (props) => {
  const [medicines, setMedicines] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);

  useEffect(() => {
    const getMedicines = async () => {
      const res = await apiClient.get(GET_ALL_PRODUCTS_ROUTE);

      if (res.status === 200 && res.data.status === 200) {
        setMedicines(res.data.data);
      }
    };

    const getCategories = async () => {
      const res = await apiClient.get(GET_ALL_CATEGORIES_ROUTE);

      if (res.status === 200 && res.data.status === 200) {
        setCategories(res.data.data);
      }
    };

    const getBrands = async () => {
      const res = await apiClient.get(GET_ALL_BRANDS_ROUTE);

      if (res.status === 200 && res.data.status === 200) {
        setBrands(res.data.data);
      }
    };

    getMedicines();
    getCategories();
    getBrands();
  }, []);

  const contextValue = {
    medicines,
    setMedicines,
    categories,
    brands,
  };
  return (
    <MedicineContext.Provider value={contextValue}>
      {props.children}
    </MedicineContext.Provider>
  );
};

export default MedicineContextProvider;
