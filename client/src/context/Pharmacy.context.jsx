import { GET_USER_INFO } from "@/API/index.api.js";
import { apiClient } from "@/lib/api-client.js";
import { createContext, useEffect, useState } from "react";

export const PharmacyContext = createContext(null);

// const getDefaultCart = () => {
//   let cart = {};
//   for (let index = 0; index < 300 + 1; index++) {
//     cart[index] = 0;
//   }

//   return cart;
// };

const PharmacyContextProvider = (props) => {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const resUser = await apiClient.get(GET_USER_INFO);
        if (resUser.status === 200) {
          setUserData(resUser.data.data);
        } else if (resUser.status === 500) {
          setUserData(null);
        }
      } catch (error) {
        console.error("Lỗi khi lấy thông tin người dùng:", error);
      }
    };

    fetchUserData();
  }, []);

  const updateUserData = (newUserData) => {
    setUserData(newUserData);
  };

  const contextValue = {
    userData,
    updateUserData,
  };

  return (
    <PharmacyContext.Provider value={contextValue}>
      {props.children}
    </PharmacyContext.Provider>
  );
};

export default PharmacyContextProvider;
