import { StrictMode, Suspense } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import "./i18n/i18n.js";
import Loading from "@/pages/component/Loading";
import { Toaster } from "./components/ui/sonner.jsx";
import PharmacyContextProvider from "./context/Pharmacy.context.jsx";
import { NotificationProvider } from "./context/NotificationContext.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Suspense fallback={<Loading />}>
      <NotificationProvider>
        <PharmacyContextProvider>
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
        </PharmacyContextProvider>
      </NotificationProvider>
    </Suspense>
  </StrictMode>
);
