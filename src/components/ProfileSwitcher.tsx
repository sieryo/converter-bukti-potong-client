"use client";

import { useProfileStore } from "@/store/useProfileStore";
import { Link, useNavigate } from "@tanstack/react-router";
import { Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
    <div className="app-page flex items-center">
      <div className="page-shell max-w-5xl space-y-6">
        <header className="panel motion-rise px-6 py-8 md:px-8">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-zinc-500">
            Converter Bukti Potong
          </p>
          <h1 className="mt-2 font-tiempos text-3xl text-zinc-900 md:text-4xl">
            Pilih Profil Kerja
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-zinc-600">
            Setiap profile menyimpan konfigurasi NPWP, cutoff date, dan ID TKU.
            Pilih profile aktif untuk mulai proses konversi.
          </p>
        </header>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {profiles.map((p, idx) => (
            <button
              key={p.id}
              type="button"
              className={`panel soft-hover motion-rise flex min-h-[146px] flex-col items-start justify-between p-4 text-left ${idx % 2 === 0 ? "motion-rise-delay-1" : "motion-rise-delay-2"} ${
                active === p.id
                  ? "border-zinc-800 bg-zinc-900 text-zinc-50"
                  : "text-zinc-800"
              }`}
              onClick={() => setSelected(p.id)}
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-lg border border-current/40 text-sm font-semibold">
                {p.alias.slice(0, 2).toUpperCase()}
              </div>
              <div>
                <p className="text-sm font-semibold">{p.alias}</p>
                <p
                  className={`text-xs ${
                    active === p.id ? "text-zinc-300" : "text-zinc-500"
                  }`}
                >
                  {active === p.id ? "Sedang aktif" : "Klik untuk detail"}
                </p>
              </div>
            </button>
          ))}

          <Link
            to="/profile/new"
            className="panel motion-rise soft-hover flex min-h-[146px] flex-col items-center justify-center gap-2 border-dashed text-zinc-700"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-lg border border-zinc-400/70 bg-zinc-100/60">
              <Plus className="h-6 w-6" />
            </div>
            <span className="text-sm font-semibold">Tambah Profil</span>
          </Link>
        </div>

        {profiles.length === 0 && (
          <div className="panel p-5 text-sm text-zinc-600">
            Belum ada profil tersimpan. Klik kartu "Tambah Profil" untuk mulai.
          </div>
        )}
      </div>

      <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
        <DialogContent className="max-w-xl border-zinc-300 bg-zinc-50 p-0">
          {selectedProfile && (
            <div className="mx-auto w-full px-5 pb-5 pt-4">
              <DialogHeader>
                <DialogTitle className="font-tiempos text-2xl font-medium text-zinc-900">
                  {selectedProfile.alias}
                </DialogTitle>
                <DialogDescription className="text-zinc-500">
                  Ringkasan data profile
                </DialogDescription>
              </DialogHeader>

              <div className="panel-soft space-y-3 px-5 py-4 text-sm text-zinc-700">
                <div className="flex justify-between gap-3">
                  <span className="text-zinc-500">Alias</span>
                  <span>{selectedProfile.alias}</span>
                </div>
                <div className="flex justify-between gap-3">
                  <span className="text-zinc-500">Cutoff Date</span>
                  <span>{selectedProfile.cutoffDate}</span>
                </div>
                <div className="flex justify-between gap-3">
                  <span className="text-zinc-500">NPWP</span>
                  <span>{selectedProfile.npwp}</span>
                </div>
                <div className="flex justify-between gap-3">
                  <span className="text-zinc-500">ID TKU</span>
                  <span>{selectedProfile.idTKU}</span>
                </div>
              </div>

              <DialogFooter className="mt-4 flex-row justify-between gap-3 sm:justify-between">
                <Button
                  variant="destructive"
                  className="rounded-md"
                  onClick={() => {
                    removeProfile(selectedProfile.id);
                    setSelected(null);
                  }}
                >
                  Hapus
                </Button>
                <Button
                  className="rounded-md bg-zinc-900 text-zinc-50 hover:bg-zinc-800"
                  onClick={() => {
                    setActive(selectedProfile.id);
                    setSelected(null);
                    navigate({ to: "/home" });
                  }}
                >
                  Pilih
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
