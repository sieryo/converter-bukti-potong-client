import { create } from "zustand";

interface ValidateStore {
  processingFiles: string[];
  addFile: (id: string) => void;
  addFiles: (ids: string[]) => void;
  removeFile: (id: string) => void;
  clear: () => void;
}

export const useValidateStore = create<ValidateStore>((set) => ({
  processingFiles: [],
  addFile: (id) =>
    set((state) => ({ processingFiles: [...state.processingFiles, id] })),
  addFiles: (ids: string[]) =>
    set((state) => ({ processingFiles: [...state.processingFiles, ...ids] })),
  removeFile: (id) =>
    set((state) => ({
      processingFiles: state.processingFiles.filter((fid) => fid !== id),
    })),
  clear: () => set({ processingFiles: [] }),
}));
