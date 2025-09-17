import { create } from "zustand";

interface ApiLoadingState {
  isLoading: boolean;
  setIsLoading: (value: boolean) => void;
}

export const useApiLoadingStore = create<ApiLoadingState>((set) => ({
  isLoading: false,
  setIsLoading: (value) => set({ isLoading: value }),
}));
