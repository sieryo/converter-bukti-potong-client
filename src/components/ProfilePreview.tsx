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
      <div className="text-sm text-muted-foreground mt-2">
        Belum ada profile aktif
      </div>
    );
  }

  return (
    <div className="mt-4">
      <Card className="rounded-xl border border-gray-200 bg-white shadow-sm hover:shadow-md transition-shadow">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center justify-between text-lg font-semibold text-gray-800">
            <span className="truncate">{activeProfile.alias}</span>
            <Badge variant="outline" className="text-xs">
              Aktif
            </Badge>
          </CardTitle>
        </CardHeader>

        <CardContent className="text-sm text-gray-600 space-y-4">
          <div className="flex flex-col gap-2">
            <div>
              <span className="block font-medium text-gray-700">NPWP</span>
              <p className="whitespace-normal break-words">
                {activeProfile.npwp}
              </p>
            </div>

            <div>
              <span className="block font-medium text-gray-700">
                Cutoff Date
              </span>
              <p>{activeProfile.cutoffDate}</p>
            </div>

            <div>
              <span className="block font-medium text-gray-700">ID TKU</span>
              <p className="whitespace-normal break-words">
                {activeProfile.idTKU}
              </p>
            </div>
          </div>

          {/* Link kembali */}
          <Link
            to="/"
            className="flex items-center gap-2 text-sm font-medium text-primary hover:underline transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Kembali ke Profil
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
