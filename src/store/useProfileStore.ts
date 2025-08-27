import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Profile = {
  id: string;
  alias: string;
  cutoffDate: number;
  npwp: string;
  idTKU: string
};

type ProfileState = {
  profiles: Profile[];
  activeProfileId: string | null;
  addProfile: (profile: Omit<Profile, "id">) => void;
  updateProfile: (id: string, updates: Partial<Omit<Profile, "id">>) => void;
  removeProfile: (id: string) => void;
  setActiveProfile: (id: string | null) => void;
  getActiveProfile: () => Profile | null;
};

export const useProfileStore = create<ProfileState>()(
  persist(
    (set, get) => ({
      profiles: [],
      activeProfileId: null,

      addProfile: (profile) => {
        const newProfile: Profile = {
          id: crypto.randomUUID(),
          ...profile,
        };
        set((state) => ({
          profiles: [...state.profiles, newProfile],
        }));
      },

      updateProfile: (id, updates) => {
        set((state) => ({
          profiles: state.profiles.map((p) =>
            p.id === id ? { ...p, ...updates } : p
          ),
        }));
      },

      removeProfile: (id) => {
        set((state) => {
          const updatedProfiles = state.profiles.filter((p) => p.id !== id);
          const isActiveRemoved = state.activeProfileId === id;
          return {
            profiles: updatedProfiles,
            activeProfileId: isActiveRemoved ? null : state.activeProfileId,
          };
        });
      },

      setActiveProfile: (id) => {
        set(() => ({ activeProfileId: id }));
      },

      getActiveProfile: () => {
        const { profiles, activeProfileId } = get();
        return profiles.find((p) => p.id === activeProfileId) || null;
      },
    }),
    {
      name: "profile-store",
    }
  )
);
