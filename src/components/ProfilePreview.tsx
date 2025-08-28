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
      <Card className="border border-gray-300 bg-gray-50">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center justify-between text-base font-semibold">
            <span>{activeProfile.alias}</span>
            <Badge variant="outline">Aktif</Badge>
          </CardTitle>
        </CardHeader>

        <CardContent className="text-sm text-muted-foreground space-y-3">
          <div className="grid grid-cols-2 gap-y-1">
            <span className="font-medium">NPWP</span>
            <span className="truncate">{activeProfile.npwp}</span>

            <span className="font-medium">Cutoff Date</span>
            <span>{activeProfile.cutoffDate}</span>

            <span className="font-medium">ID TKU</span>
            <span>{activeProfile.idTKU}</span>
          </div>

          {/* Link kembali */}
          <Link
            to="/"
            className="flex items-center gap-2 text-sm font-medium text-primary hover:underline transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Kembali ke Beranda
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
