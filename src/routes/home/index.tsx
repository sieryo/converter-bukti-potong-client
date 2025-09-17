import { Link } from "@tanstack/react-router";
import { createFileRoute } from "@tanstack/react-router";
import { FileCode2, FileText } from "lucide-react";

export const Route = createFileRoute("/home/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="grid min-h-screen grid-cols-1 sm:grid-cols-2 gap-6 p-16 bg-gray-50">
      <Link
        to="/convert"
        className="group flex flex-col items-center justify-center rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition hover:shadow-md hover:-translate-y-1"
      >
        <FileCode2 className="mb-3 h-12 w-12 text-gray-600 transition-transform group-hover:scale-110" />
        <h2 className="text-lg font-semibold text-gray-800 group-hover:text-gray-900">
          Convert Bukpot
        </h2>
        <p className="mt-1 text-sm text-gray-500 text-center">
          Konversi data bukti potong agar sesuai dengan sistem Coretax
        </p>
      </Link>

      <Link
        to="/bppu-convert"
        className="group flex flex-col items-center justify-center rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition hover:shadow-md hover:-translate-y-1"
      >
        <FileText className="mb-3 h-12 w-12 text-gray-600 transition-transform group-hover:scale-110" />
        <h2 className="text-lg font-semibold text-gray-800 group-hover:text-gray-900">
          Convert BPPU Coretax
        </h2>
        <p className="mt-1 text-sm text-gray-500 text-center">
          Konversi file(s) PDF BPPU Coretax menjadi Rekap
        </p>
      </Link>
    </div>
  );
}
