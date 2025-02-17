import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // eslint-disable-next-line no-undef
      "@": path.resolve(__dirname, "./src"),
    },
  },
  base: "/",
  server: {
    host: "0.0.0.0", // Cho phép lắng nghe trên tất cả các địa chỉ IP
    port: 5174, // Cổng mà bạn muốn Vite lắng nghe
  },
});
