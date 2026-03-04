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
    <div className="panel space-y-4 p-5 motion-rise motion-rise-delay-1">
      <div className="flex items-center justify-between">
        <h3 className="flex items-center gap-2 text-base font-semibold text-zinc-900">
          <span className="step-chip">2</span>
          Mode Rename
        </h3>
        <Badge
          variant="outline"
          className="border-zinc-400/70 bg-zinc-100/70 text-zinc-700"
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
            "text-left rounded-md border p-4 transition-all",
            "disabled:opacity-60 disabled:cursor-not-allowed",
            mode === "by_category"
              ? "border-zinc-800 bg-zinc-900 text-zinc-100 ring-1 ring-zinc-500/35"
              : "border-zinc-300/70 bg-zinc-50/85 hover:border-zinc-400"
          )}
        >
          <div className={cn("flex items-center gap-2 text-sm font-semibold", mode === "by_category" ? "text-zinc-100" : "text-zinc-900")}>
            <FolderTree className="w-4 h-4" />
            By Category
          </div>
          <p className={cn("mt-1 text-xs", mode === "by_category" ? "text-zinc-300" : "text-zinc-600")}>
            Simpan output per kategori dokumen referensi.
          </p>
        </button>

        <button
          type="button"
          disabled={disabled}
          onClick={() => onModeChange("by_nama_pegawai")}
          className={cn(
            "text-left rounded-md border p-4 transition-all",
            "disabled:opacity-60 disabled:cursor-not-allowed",
            mode === "by_nama_pegawai"
              ? "border-zinc-800 bg-zinc-900 text-zinc-100 ring-1 ring-zinc-500/35"
              : "border-zinc-300/70 bg-zinc-50/85 hover:border-zinc-400"
          )}
        >
          <div className={cn("flex items-center gap-2 text-sm font-semibold", mode === "by_nama_pegawai" ? "text-zinc-100" : "text-zinc-900")}>
            <UserRound className="w-4 h-4" />
            By Nama Pegawai
          </div>
          <p className={cn("mt-1 text-xs", mode === "by_nama_pegawai" ? "text-zinc-300" : "text-zinc-600")}>
            Pakai lookup NIP - Nama dari file mapping Excel.
          </p>
        </button>
      </div>

      {isByPegawai && (
        <div className="space-y-3 rounded-md border border-zinc-300/70 bg-zinc-50/80 p-4">
          <div className="space-y-2">
            <Label htmlFor="rename-mapping-file" className="text-zinc-800">
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
              className="border-zinc-300 bg-zinc-50"
            />
            {mappingFile && (
              <div className="flex items-center justify-between rounded-lg border border-zinc-300 bg-zinc-100 px-3 py-2">
                <div className="flex items-center gap-2 min-w-0">
                  <FileSpreadsheet className="h-4 w-4 shrink-0 text-zinc-700" />
                  <p className="truncate text-xs text-zinc-800">{mappingFile.name}</p>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-7 px-2 text-zinc-600 hover:bg-zinc-200 hover:text-zinc-900"
                  onClick={() => onMappingFileChange(null)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="rename-sheet-name" className="text-zinc-800">
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
              <SelectTrigger id="rename-sheet-name" className="w-full border-zinc-300 bg-zinc-50">
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
            <p className="text-xs text-zinc-500">
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

