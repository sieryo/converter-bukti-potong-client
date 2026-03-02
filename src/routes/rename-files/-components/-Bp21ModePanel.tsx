import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { FileSpreadsheet, UserRound, FolderTree, X } from "lucide-react";

interface Bp21ModePanelProps {
  visible: boolean;
  mode: "by_category" | "by_nama_pegawai";
  onModeChange: (mode: "by_category" | "by_nama_pegawai") => void;
  mappingFile: File | null;
  sheetName: string;
  sheetOptions: string[];
  sheetOptionsLoading?: boolean;
  onMappingFileChange: (file: File | null) => void;
  onSheetNameChange: (value: string) => void;
  disabled?: boolean;
  selectedDocumentLabel?: string;
}

export function Bp21ModePanel({
  visible,
  mode,
  onModeChange,
  mappingFile,
  sheetName,
  sheetOptions,
  sheetOptionsLoading = false,
  onMappingFileChange,
  onSheetNameChange,
  disabled = false,
  selectedDocumentLabel,
}: Bp21ModePanelProps) {
  if (!visible) return null;

  const isByPegawai = mode === "by_nama_pegawai";

  return (
    <div className="rounded-2xl border border-emerald-200/80 bg-white p-5 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-semibold text-gray-900 flex items-center gap-2">
          <span className="flex items-center justify-center w-7 h-7 rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold">
            2
          </span>
          Mode Rename
        </h3>
        <Badge
          variant="outline"
          className="border-emerald-200 text-emerald-700 bg-white"
        >
          {selectedDocumentLabel ?? "Pilih Dokumen"}
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <button
          type="button"
          disabled={disabled}
          onClick={() => onModeChange("by_category")}
          className={cn(
            "text-left rounded-xl border p-4 transition-all",
            "disabled:opacity-60 disabled:cursor-not-allowed",
            mode === "by_category"
              ? "border-emerald-400 bg-emerald-100/60 ring-1 ring-emerald-400/40"
              : "border-gray-200 bg-white hover:border-emerald-300"
          )}
        >
          <div className="flex items-center gap-2 text-sm font-semibold text-gray-900">
            <FolderTree className="w-4 h-4 text-emerald-700" />
            By Category
          </div>
          <p className="mt-1 text-xs text-gray-600">
            Simpan output per kategori dokumen referensi.
          </p>
        </button>

        <button
          type="button"
          disabled={disabled}
          onClick={() => onModeChange("by_nama_pegawai")}
          className={cn(
            "text-left rounded-xl border p-4 transition-all",
            "disabled:opacity-60 disabled:cursor-not-allowed",
            mode === "by_nama_pegawai"
              ? "border-emerald-400 bg-emerald-100/60 ring-1 ring-emerald-400/40"
              : "border-gray-200 bg-white hover:border-emerald-300"
          )}
        >
          <div className="flex items-center gap-2 text-sm font-semibold text-gray-900">
            <UserRound className="w-4 h-4 text-emerald-700" />
            By Nama Pegawai
          </div>
          <p className="mt-1 text-xs text-gray-600">
            Pakai lookup NIP - Nama dari file mapping Excel.
          </p>
        </button>
      </div>

      {isByPegawai && (
        <div className="space-y-3 rounded-xl border border-emerald-200 bg-white/90 p-4">
          <div className="space-y-2">
            <Label htmlFor="rename-mapping-file" className="text-gray-800">
              Mapping File (.xlsx/.xlsm)
            </Label>
            <Input
              id="rename-mapping-file"
              type="file"
              accept=".xlsx,.xlsm,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel.sheet.macroEnabled.12"
              disabled={disabled}
              onChange={(event) => {
                onMappingFileChange(event.target.files?.[0] ?? null);
                // Reset native file input value so selecting the same file triggers onChange.
                event.currentTarget.value = "";
              }}
              className="bg-white"
            />
            {mappingFile && (
              <div className="flex items-center justify-between rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2">
                <div className="flex items-center gap-2 min-w-0">
                  <FileSpreadsheet className="w-4 h-4 text-emerald-700 shrink-0" />
                  <p className="text-xs text-emerald-900 truncate">{mappingFile.name}</p>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-7 px-2 text-gray-600 hover:text-red-600 hover:bg-red-50"
                  onClick={() => onMappingFileChange(null)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="rename-sheet-name" className="text-gray-800">
              Sheet Name
            </Label>
            <Select
              value={sheetName}
              onValueChange={onSheetNameChange}
              disabled={
                disabled ||
                !mappingFile ||
                sheetOptionsLoading ||
                sheetOptions.length === 0
              }
            >
              <SelectTrigger id="rename-sheet-name" className="w-full bg-white">
                <SelectValue
                  placeholder={
                    sheetOptionsLoading
                      ? "Membaca daftar sheet..."
                      : "Pilih sheet"
                  }
                />
              </SelectTrigger>
              <SelectContent className="">
                {sheetOptions.map((sheet) => (
                  <SelectItem key={sheet} value={sheet}>
                    {sheet}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-gray-500">
              {mappingFile
                ? "Pilih sheet dari file mapping yang diupload."
                : "Upload file mapping terlebih dahulu."}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
