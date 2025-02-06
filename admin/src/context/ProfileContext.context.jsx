import { GET_CURRENT_STAFF } from "@/API/index.api.js";
import { apiClient } from "@/lib/api-admin.js";
import { createContext, useEffect, useState } from "react";

export const ProfileContext = createContext();

const ProfileContextProvider = (props) => {
  const [userData, setUserData] = useState({});

  useEffect(() => {
    const getProfile = async () => {
      const res = await apiClient.get(GET_CURRENT_STAFF);
      if (res.status === 200 && res.data.status === 200) {
        setUserData(res.data.data);
      }
    };

    getProfile();
  }, []);

  const contextValue = {
    userData,
    setUserData,
  };
  return (
    <ProfileContext.Provider value={contextValue}>
      {props.children}
    </ProfileContext.Provider>
  );
};

export default ProfileContextProvider;
