import { create } from "zustand";

interface HighlightedFileState {
  highlightedId?: string;
  setHighlighted: (id?: string) => void;
}

export const useHighlightedFile = create<HighlightedFileState>((set) => ({
  highlightedId: undefined,
  setHighlighted: (id) => set({ highlightedId: id }),
}));
