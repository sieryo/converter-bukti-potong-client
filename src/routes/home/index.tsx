import { ProfilePreview } from "@/components/ProfilePreview";
import { BASE_API_PATH } from "@/lib/constants";
import { Link } from "@tanstack/react-router";
import { createFileRoute } from "@tanstack/react-router";
import { FileCode2, FileText, Home } from "lucide-react";
// import ProfilePreview from "@/components/ProfilePreview"; // asumsi ada

export const Route = createFileRoute("/home/")({
  component: RouteComponent,
});

function RouteComponent() {
  console.log(BASE_API_PATH);
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <div className="flex-1/3 p-10 bg-white shadow-sm">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Home</h1>

        <div className="max-w-md">
          <ProfilePreview />
        </div>
      </div>

      <div className="flex-2/3 p-10">
        <h2 className="text-xl font-semibold text-gray-800 mb-6">Features</h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <Link
            to="/convert"
            className="group flex flex-col items-center justify-center rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition hover:shadow-md hover:-translate-y-1"
          >
            <FileCode2 className="mb-3 h-12 w-12 text-gray-600 transition-transform group-hover:scale-110" />
            <h3 className="text-lg font-semibold text-gray-800 group-hover:text-gray-900">
              Convert Bukpot
            </h3>
            <p className="mt-1 text-sm text-gray-500 text-center">
              Konversi data bukti potong agar sesuai dengan sistem Coretax
            </p>
          </Link>

          <Link
            to="/bppu-convert"
            className="group flex flex-col items-center justify-center rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition hover:shadow-md hover:-translate-y-1"
          >
            <FileText className="mb-3 h-12 w-12 text-gray-600 transition-transform group-hover:scale-110" />
            <h3 className="text-lg font-semibold text-gray-800 group-hover:text-gray-900">
              Convert BPPU Coretax
            </h3>
            <p className="mt-1 text-sm text-gray-500 text-center">
              Konversi file(s) PDF BPPU Coretax menjadi Rekap
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
}
