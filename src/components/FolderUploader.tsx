import { MAX_SIZE } from "@/constants/pdf";
import type { BppuCoretax } from "@/types/bppu";
import { errorMessage, successMessage } from "@/utils/message";
import { generateUUID } from "@/utils/uuid";
import { Upload } from "lucide-react";

export default function FolderUploader({
  title,
  description,
  onSuccessUpload,
}: {
  title: string;
  description: string;
  onSuccessUpload: (bppu: BppuCoretax[]) => void;
}) {
  const handleFolderUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const files = e.target.files;
      if (!files || files.length === 0) return;

      let arrayFiles = Array.from(files);

      arrayFiles = arrayFiles.filter((file) => file.type === "application/pdf");

      if (arrayFiles.length === 0) {
        errorMessage("Tidak ada file PDF pada folder yang dipilih");
        return;
      }

      const oversizedFiles = arrayFiles.filter((file) => file.size > MAX_SIZE);
      if (oversizedFiles.length > 0) {
        const oversizedNames = oversizedFiles.map((f) => f.name).join(", ");
        errorMessage(`File terlalu besar (maks 300 KB): ${oversizedNames}`);
        arrayFiles = arrayFiles.filter((file) => file.size <= MAX_SIZE);
      }

      if (arrayFiles.length === 0) {
        return;
      }

      const results: BppuCoretax[] = arrayFiles.map((f) => {
        const name = f.name;
        return {
          id: generateUUID(),
          name,
          status: "pending",
          file: f,
        };
      });

      successMessage("File PDF berhasil diupload");

      if (onSuccessUpload) onSuccessUpload(results);
      e.target.value = "";
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="h-screen flex flex-col items-center justify-center text-center p-6">
      <Upload className="w-12 h-12 text-gray-400 mb-4" />
      <h2 className="text-lg font-semibold mb-2">{title}</h2>
      <p className="text-sm text-gray-500 mb-4">{description}</p>
      <input
        id="folders"
        type="file"
        accept="application/pdf"
        multiple
        //@ts-expect-error
        webkitdirectory="true"
        directory="true"
        className="block text-sm text-gray-600 file:mr-4 file:py-2 file:px-4
                     file:rounded-full file:border-0
                     file:text-sm file:font-semibold
                     file:bg-blue-50 file:text-blue-700
                     hover:file:bg-blue-100"
        onChange={handleFolderUpload}
      />
    </div>
  );
}
