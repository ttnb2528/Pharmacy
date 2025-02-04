import { GET_ALL_CATEGORIES_ROUTE } from "@/API/index.api.js";
import { apiClient } from "@/lib/api-admin.js";
import { createContext, useEffect, useState } from "react";

export const CategoryContext = createContext();

const CategoryContextProvider = (props) => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const getCategories = async () => {
      const res = await apiClient.get(GET_ALL_CATEGORIES_ROUTE);

      if (res.status === 200 && res.data.status === 200) {
        setCategories(res.data.data);
      }
    };

    getCategories();
  }, []);

  const contextValue = {
    categories,
    setCategories,
  };
  return (
    <CategoryContext.Provider value={contextValue}>
      {props.children}
    </CategoryContext.Provider>
  );
};

export default CategoryContextProvider;
