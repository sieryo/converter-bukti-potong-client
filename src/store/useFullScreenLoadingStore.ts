import { create } from "zustand";

type FullScreenLoading = {
  isLoading: boolean;
  setIsLoading: (value: boolean) => void;
};

export const useFullScreenLoadingStore = create<FullScreenLoading>()((set) => ({
  isLoading: false,
  setIsLoading: (value) => set(() => ({ isLoading: value })),
}));
