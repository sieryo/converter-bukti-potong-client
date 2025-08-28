"use client";

import { useProfileStore } from "@/store/useProfileStore";
import { Link, useNavigate } from "@tanstack/react-router";
import { Plus } from "lucide-react";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerFooter,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function ProfileSwitcher() {
  const profiles = useProfileStore((s) => s.profiles);
  const setActive = useProfileStore((s) => s.setActiveProfile);
  const removeProfile = useProfileStore((s) => s.removeProfile);
  const active = useProfileStore((s) => s.activeProfileId);

  const navigate = useNavigate();

  const [selected, setSelected] = useState<string | null>(null);

  const selectedProfile = profiles.find((p) => p.id === selected) || null;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <h1 className="mb-10 text-3xl font-bold text-gray-800">Pilih Profil</h1>
      <div className="grid grid-cols-2 gap-8 md:grid-cols-3">
        {profiles.map((p) => (
          <div
            key={p.id}
            className="flex flex-col items-center gap-2 cursor-pointer group"
            onClick={() => setSelected(p.id)}
          >
            <div
              className={`flex h-28 w-28 items-center justify-center rounded-lg border-2 text-lg font-semibold transition ${
                active === p.id
                  ? "border-blue-500 bg-blue-50 text-blue-600"
                  : "border-gray-300 bg-white group-hover:bg-gray-100"
              }`}
            >
              {p.alias}
            </div>
            <span className="text-sm text-gray-700">{p.alias}</span>
          </div>
        ))}

        {/* Tambah Profile */}
        <Link
          to="/profile/new"
          className="flex flex-col items-center gap-2 group"
        >
          <div className="flex h-28 w-28 items-center justify-center rounded-lg border-2 border-dashed border-gray-400 group-hover:bg-gray-100 transition">
            <Plus className="h-8 w-8 text-gray-600" />
          </div>
          <span className="text-sm text-gray-700">Tambah</span>
        </Link>
      </div>

      <Drawer open={!!selected} onOpenChange={() => setSelected(null)}>
        <DrawerContent>
          {selectedProfile && (
            <div className="w-full max-w-lg mx-auto">
              <DrawerHeader>
                <DrawerTitle className="text-xl font-bold">
                  {selectedProfile.alias}
                </DrawerTitle>
                <DrawerDescription className="text-gray-600">
                  Detail profil lengkap
                </DrawerDescription>
              </DrawerHeader>

              <div className="px-6 py-4 space-y-3 text-gray-800">
                <div className="flex justify-between">
                  <span className="font-medium">Alias</span>
                  <span>{selectedProfile.alias}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Cutoff Date</span>
                  <span>{selectedProfile.cutoffDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">NPWP</span>
                  <span>{selectedProfile.npwp}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">ID TKU</span>
                  <span>{selectedProfile.idTKU}</span>
                </div>
              </div>

              <DrawerFooter className="flex flex-row justify-between gap-4">
                <Button
                  variant="destructive"
                  onClick={() => {
                    removeProfile(selectedProfile.id);
                    setSelected(null);
                  }}
                >
                  Hapus
                </Button>
                <Button
                  onClick={() => {
                    setActive(selectedProfile.id);
                    setSelected(null);
                    navigate({ to: "/convert" });
                  }}
                >
                  Pilih
                </Button>
              </DrawerFooter>
            </div>
          )}
        </DrawerContent>
      </Drawer>
    </div>
  );
}
