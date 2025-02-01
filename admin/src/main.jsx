import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { Toaster } from "./components/ui/sonner.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
    <Toaster
      closeButton
      position="top-right"
      toastOptions={{
        classNames: {
          error: "bg-red-400",
          success: "bg-green-400",
          warning: "bg-yellow-400",
          info: "bg-blue-400",
          closeButton: "text-black",
        },
      }}
    />
  </StrictMode>
);
