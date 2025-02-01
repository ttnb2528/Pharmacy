import { create } from "zustand";
import { createAuthSlice } from "./auth-slice.js";

export const useAppStore = create()((...a) => ({
  ...createAuthSlice(...a),
}));
