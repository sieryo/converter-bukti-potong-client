"use client";

import { Link, createFileRoute, useRouter } from "@tanstack/react-router";
import { useForm } from "@tanstack/react-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useProfileStore } from "@/store/useProfileStore";
import { ArrowLeft } from "lucide-react";

export const Route = createFileRoute("/profile/new")({
  component: ProfileNewPage,
});

function ProfileNewPage() {
  const addProfile = useProfileStore((s) => s.addProfile);
  const router = useRouter();

  const form = useForm({
    defaultValues: {
      alias: "",
      cutoffDate: "",
      npwp: "",
      idTKU: "",
    },
    onSubmit: ({ value }) => {
      addProfile({
        alias: value.alias,
        cutoffDate: Number(value.cutoffDate),
        npwp: value.npwp,
        idTKU: value.idTKU
      });
      router.navigate({ to: "/" });
    },
  });

  return (
    <div className="app-page flex items-center justify-center">
      <Card className="panel w-full max-w-lg py-5 motion-rise">
        <CardHeader>
          <div className="mb-2">
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-zinc-500 transition-colors hover:text-zinc-800"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Kembali
            </Link>
          </div>
          <CardTitle className="font-tiempos text-center text-2xl text-zinc-900">
            Buat Profile Baru
          </CardTitle>
          <p className="text-center text-sm text-zinc-500">
            Isi data profile untuk dipakai di proses konversi.
          </p>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              form.handleSubmit();
            }}
            className="flex flex-col gap-4"
          >
            <form.Field
              name="alias"
              validators={{
                onChange: ({ value }) =>
                  !value ? "Alias wajib diisi" : undefined,
              }}
              children={(field) => (
                <div className="space-y-1.5">
                  <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
                    Alias
                  </p>
                  <Input
                    placeholder="Alias (contoh: GST)"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    className="border-zinc-300 bg-zinc-50/75"
                  />
                  {field.state.meta.errors?.length ? (
                    <p className="text-sm text-red-600">
                      {field.state.meta.errors.join(", ")}
                    </p>
                  ) : null}
                </div>
              )}
            />

            <form.Field
              name="cutoffDate"
              validators={{
                onChange: ({ value }) =>
                  !value ? "Cutoff date wajib diisi" : undefined,
              }}
              children={(field) => (
                <div className="space-y-1.5">
                  <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
                    Cutoff Date
                  </p>
                  <Input
                    type="number"
                    placeholder="Cutoff Date (contoh: 15)"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    className="border-zinc-300 bg-zinc-50/75"
                  />
                  {field.state.meta.errors?.length ? (
                    <p className="text-sm text-red-600">
                      {field.state.meta.errors.join(", ")}
                    </p>
                  ) : null}
                </div>
              )}
            />

            <form.Field
              name="npwp"
              children={(field) => (
                <div className="space-y-1.5">
                  <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
                    NPWP
                  </p>
                  <Input
                    placeholder="NPWP"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    className="border-zinc-300 bg-zinc-50/75"
                  />
                </div>
              )}
            />
            <form.Field
              name="idTKU"
              children={(field) => (
                <div className="space-y-1.5">
                  <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
                    ID TKU
                  </p>
                  <Input
                    placeholder="ID TKU"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    className="border-zinc-300 bg-zinc-50/75"
                  />
                </div>
              )}
            />

            <Button type="submit" className="mt-2 bg-zinc-900 text-zinc-50 hover:bg-zinc-800">
              Simpan
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
