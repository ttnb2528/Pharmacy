import { createContext, useState } from "react";

export const HomeContext = createContext();

const HomeContextProvider = (props) => {
  const [showLogin, setShowLogin] = useState(false);

  const hasLogin = localStorage.getItem("token");

  const contextValue = {
    showLogin,
    setShowLogin,
    hasLogin,
  };
  return (
    <HomeContext.Provider value={contextValue}>
      {props.children}
    </HomeContext.Provider>
  );
};

export default HomeContextProvider;
