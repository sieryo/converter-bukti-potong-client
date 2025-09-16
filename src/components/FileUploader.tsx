import { Upload } from "lucide-react";

export default function FileUploader({
  title,
  description,
  onUpload,
}: {
  title: string;
  description: string;
  onUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <div className="h-screen flex flex-col items-center justify-center text-center p-6">
      <Upload className="w-12 h-12 text-gray-400 mb-4" />
      <h2 className="text-lg font-semibold mb-2">{title}</h2>
      <p className="text-sm text-gray-500 mb-4">{description}</p>
      <input
        type="file"
        accept=".xlsx,.xls"
        onChange={onUpload}
        className="block text-sm text-gray-600 file:mr-4 file:py-2 file:px-4
                     file:rounded-full file:border-0
                     file:text-sm file:font-semibold
                     file:bg-blue-50 file:text-blue-700
                     hover:file:bg-blue-100"
      />
    </div>
  );
}
