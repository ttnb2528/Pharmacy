import axios from "axios";
import { HOST } from "@/API/index.api.js";

export const apiClient = axios.create({
  baseURL: HOST,
  withCredentials: true,
});
