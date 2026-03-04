import { ProfilePreview } from "@/components/ProfilePreview";
import { Link } from "@tanstack/react-router";
import { createFileRoute } from "@tanstack/react-router";
import { ChevronRight, FileCode2, FileText, Files } from "lucide-react";

export const Route = createFileRoute("/home/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="app-page">
      <div className="page-shell space-y-6">
        <header className="panel motion-rise grid gap-6 p-6 md:grid-cols-[1.3fr_0.7fr] md:p-8">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-zinc-500">
              Workspace
            </p>
            <h1 className="mt-2 font-tiempos text-3xl text-zinc-900 md:text-4xl">
              Converter Bukti Potong
            </h1>
            <p className="mt-3 max-w-2xl text-sm text-zinc-600 md:text-base">
              Pilih fitur sesuai pekerjaanmu: konversi bukpot, rekap BPPU, atau
              batch rename dokumen PDF.
            </p>
          </div>

          <div className="panel-soft p-4">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-zinc-500">
              Profile Aktif
            </p>
            <ProfilePreview />
          </div>
        </header>

        <section className="panel p-6 md:p-8">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="font-tiempos text-2xl text-zinc-900">Features</h2>
            <span className="text-xs font-medium uppercase tracking-wide text-zinc-500">
              Pilih workflow
            </span>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <FeatureCard
              to="/convert"
              icon={FileCode2}
              title="Convert Bukpot"
              description="Konversi data bukti potong agar sesuai format Coretax."
            />
            <FeatureCard
              to="/bppu-convert"
              icon={FileText}
              title="Convert BPPU Coretax"
              description="Konversi file PDF BPPU Coretax menjadi rekap excel."
            />
            <FeatureCard
              to="/rename-files"
              icon={Files}
              title="Rename Files"
              description="Rename file bukti potong hasil tarikan Coretax secara massal."
            />
          </div>
        </section>
      </div>
    </div>
  );
}

function FeatureCard({
  to,
  icon: Icon,
  title,
  description,
}: {
  to: "/convert" | "/bppu-convert" | "/rename-files";
  icon: typeof FileText;
  title: string;
  description: string;
}) {
  return (
    <Link
      to={to}
      className="panel soft-hover group motion-rise flex flex-col gap-4 p-5"
    >
      <div className="flex items-center justify-between">
        <div className="flex h-11 w-11 items-center justify-center rounded-lg border border-zinc-300/80 bg-zinc-100/80 text-zinc-700">
          <Icon className="h-5 w-5" />
        </div>
        <ChevronRight className="h-4 w-4 text-zinc-500 transition-transform duration-200 group-hover:translate-x-0.5" />
      </div>
      <div>
        <h3 className="text-lg font-semibold text-zinc-900">{title}</h3>
        <p className="mt-1 text-sm text-zinc-600">{description}</p>
      </div>
    </Link>
  );
}
