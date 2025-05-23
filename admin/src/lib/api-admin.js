import axios from "axios";
import { HOST } from "@/API/index.api.js";

const getBaseURL = () => {
  // Nếu chạy trên localhost (máy tính), dùng HOST
  if (
    window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1"
  ) {
    return HOST; // Ví dụ: http://localhost:8888
  }
  // Nếu chạy trên điện thoại (hoặc mạng nội bộ), dùng IP
  return "http://10.2.8.140:8888"; // Thay bằng IP của máy tính chạy backend
};

export const apiClient = axios.create({
  // baseURL: HOST,
  // test
  baseURL: getBaseURL(),
  withCredentials: true,
  headers: { "X-Role": "admin" },
});
