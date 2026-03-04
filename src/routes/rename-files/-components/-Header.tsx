import { ArrowLeft } from "lucide-react";
import { Link } from "@tanstack/react-router";


export function Header() {
  return (
    <div className="panel px-5 py-6 md:px-7 md:py-7 motion-rise">
      <div className="flex items-start gap-4">
        <Link
          to="/home"
          className="-ml-2 mt-1.5 rounded-md p-2 text-zinc-500 transition-all duration-200 hover:bg-zinc-100 hover:text-zinc-900"
          aria-label="Kembali"
        >
          <ArrowLeft className="w-6 h-6" />
        </Link>

        <div>
          <h1 className="font-tiempos text-3xl text-zinc-900 md:text-4xl">
            Batch Rename Files
          </h1>
          <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-zinc-600 md:text-base">
            Pilih jenis dokumen, upload PDF, monitor progress real-time, lalu
            download hasil zip.
          </p>
        </div>
      </div>
    </div>
  );
}

