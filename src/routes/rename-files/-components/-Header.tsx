import { ArrowLeft } from "lucide-react";
import { Link } from "@tanstack/react-router";


export function Header() {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white px-5 py-6 md:px-7 md:py-7 shadow-sm">

      <div className="flex items-start gap-4">
        <Link
          to="/home"
          className="mt-1.5 p-2 -ml-2 rounded-xl text-gray-500 hover:text-gray-900 hover:bg-white transition-all duration-200"
          aria-label="Kembali"
        >
          <ArrowLeft className="w-6 h-6" />
        </Link>

        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">
            Batch Rename Files
          </h1>
          <p className="text-gray-600 mt-1.5 text-sm md:text-base leading-relaxed max-w-2xl">
            pilih jenis dokumen, upload PDF, monitor progress real-time, dan
            download hasil zip.
          </p>
        </div>
      </div>
    </div>
  );
}
