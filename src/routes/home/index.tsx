import { Link } from "@tanstack/react-router";
import { createFileRoute } from "@tanstack/react-router";
import { FileCode2, FileText } from "lucide-react";

export const Route = createFileRoute("/home/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="grid h-screen grid-cols-2 p-12">
      <Link
        to="/convert"
        className="group flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 transition"
      >
        <FileCode2 className="mb-4 h-16 w-16 text-blue-600 transition-transform group-hover:scale-110" />
        <h2 className="text-2xl font-semibold text-blue-700 group-hover:text-blue-800">
          Convert Bukpot
        </h2>
        <p className="mt-2 text-sm text-blue-500 opacity-80 group-hover:opacity-100">
          Konversi data bukti potong agar sesuai dengan sistem Coretax
        </p>
      </Link>

      <Link
        to="/bppu-convert"
        className="group flex flex-col items-center justify-center bg-gradient-to-br from-red-50 to-red-100 transition"
      >
        <FileText className="mb-4 h-16 w-16 text-red-600 transition-transform group-hover:scale-110" />

        <h2 className="text-2xl font-semibold text-red-700 group-hover:text-red-800">
          Convert BPPU Coretax
        </h2>
        <p className="mt-2 text-sm text-red-500 opacity-80 group-hover:opacity-100">
          Konversi file(s) PDF BPPU Coretax menjadi Rekap
        </p>
      </Link>
    </div>
  );
}
