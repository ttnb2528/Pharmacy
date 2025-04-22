import { createContext, useState, useContext } from "react";
import NotificationPartial from "@/pages/component/NotificationPartial.jsx";

// Create context
const NotificationContext = createContext();

// Provider component
export const NotificationProvider = ({ children }) => {
  const [notification, setNotification] = useState({
    isOpen: false,
    type: "success",
    title: "",
    message: "",
  });

  const closeNotification = () => {
    setNotification((prev) => ({ ...prev, isOpen: false }));
  };

  const showNotification = (type, title, message) => {
    setNotification({
      isOpen: true,
      type,
      title,
      message,
    });
  };

  return (
    <NotificationContext.Provider
      value={{ notification, showNotification }}
    >
      {children}
      <NotificationPartial
        isOpen={notification.isOpen}
        type={notification.type}
        title={notification.title}
        message={notification.message}
        onClose={closeNotification}
        duration={1500}
        showOverlay={false}
      />
    </NotificationContext.Provider>
  );
};

// Custom hook
export const useNotification = () => useContext(NotificationContext);