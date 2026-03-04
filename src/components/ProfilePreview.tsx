"use client";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft } from "lucide-react";
import { useProfileStore } from "@/store/useProfileStore";
import { Link } from "@tanstack/react-router";

export function ProfilePreview() {
  const profiles = useProfileStore((s) => s.profiles);
  const activeProfileId = useProfileStore((s) => s.activeProfileId);

  const activeProfile = profiles.find((p) => p.id === activeProfileId);

  if (!activeProfile) {
    return (
      <div className="mt-2 text-sm text-muted-foreground">
        Belum ada profile aktif
      </div>
    );
  }

  return (
    <div className="mt-4 motion-rise">
      <Card className="rounded-lg border-zinc-300/70 bg-zinc-50/90 py-5 shadow-[0_10px_30px_-22px_rgba(0,0,0,0.7)]">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center justify-between text-lg font-semibold text-zinc-900">
            <span className="truncate">{activeProfile.alias}</span>
            <Badge
              variant="outline"
              className="border-zinc-400/70 bg-zinc-100/80 text-[11px] uppercase tracking-wide text-zinc-700"
            >
              Aktif
            </Badge>
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4 text-sm text-zinc-600">
          <div className="flex flex-col gap-3">
            <div>
              <span className="block text-xs font-semibold uppercase tracking-wide text-zinc-500">
                NPWP
              </span>
              <p className="whitespace-normal break-words">
                {activeProfile.npwp}
              </p>
            </div>

            <div>
              <span className="block text-xs font-semibold uppercase tracking-wide text-zinc-500">
                Cutoff Date
              </span>
              <p>{activeProfile.cutoffDate}</p>
            </div>

            <div>
              <span className="block text-xs font-semibold uppercase tracking-wide text-zinc-500">
                ID TKU
              </span>
              <p className="whitespace-normal break-words">
                {activeProfile.idTKU}
              </p>
            </div>
          </div>

          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-zinc-700 transition-colors hover:text-zinc-900"
          >
            <ArrowLeft className="w-4 h-4" />
            Kembali ke Profil
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}

