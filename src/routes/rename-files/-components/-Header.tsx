import { ArrowLeft } from "lucide-react";
import { Link } from "@tanstack/react-router";

export function Header() {
    return (
        <div className="flex items-start gap-4 mb-2">
            <Link
                to="/home"
                className="mt-1.5 p-2 -ml-2 rounded-xl text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-all duration-200"
                aria-label="Kembali"
            >
                <ArrowLeft className="w-6 h-6" />
            </Link>

            <div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">
                    Batch Rename Files
                </h1>
                <p className="text-gray-500 mt-1.5 text-sm md:text-base leading-relaxed">
                    Otomatis rename file bukti potong dengan format yang sudah ditentukan.
                </p>
            </div>
        </div>
    );
}
