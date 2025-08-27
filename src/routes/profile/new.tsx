"use client";

import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useForm } from "@tanstack/react-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useProfileStore } from "@/store/useProfileStore";

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
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader>
          <CardTitle className="text-center text-xl">
            Buat Profile Baru
          </CardTitle>
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
                <div>
                  <Input
                    placeholder="Alias (contoh: GST)"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                  />
                  {field.state.meta.errors?.length ? (
                    <p className="text-sm text-red-500">
                      {field.state.meta.errors.join(", ")}
                    </p>
                  ) : null}
                </div>
              )}
            />

            {/* Cutoff Date */}
            <form.Field
              name="cutoffDate"
              validators={{
                onChange: ({ value }) =>
                  !value ? "Cutoff date wajib diisi" : undefined,
              }}
              children={(field) => (
                <div>
                  <Input
                    type="number"
                    placeholder="Cutoff Date (contoh: 15)"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                  />
                  {field.state.meta.errors?.length ? (
                    <p className="text-sm text-red-500">
                      {field.state.meta.errors.join(", ")}
                    </p>
                  ) : null}
                </div>
              )}
            />

            {/* NPWP */}
            <form.Field
              name="npwp"
              children={(field) => (
                <div>
                  <Input
                    placeholder="NPWP"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                  />
                </div>
              )}
            />
            <form.Field
              name="idTKU"
              children={(field) => (
                <div>
                  <Input
                    placeholder="ID TKU"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                  />
                </div>
              )}
            />

            <Button type="submit">Simpan</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
