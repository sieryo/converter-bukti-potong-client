import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import {
  handleErrorResponse,
  renameFiles,
  getRenameProgress,
  downloadRenameResult,
} from "@/utils/api";
import { toast } from "sonner";
import { FullscreenLoader } from "@/components/FullScreenLoader";
import { errorMessage } from "@/utils/message";
import { type FileItem } from "@/components/FilesUploader";
import { FileText, TimerReset } from "lucide-react";
import { Header } from "./-components/-Header";
import { TypeSelector, type EndpointOption } from "./-components/-TypeSelector";
import { FileSection } from "./-components/-FileSection";
import { ActionButtons } from "./-components/-ActionButtons";
import { ProgressStats } from "./-components/-ProgressStats";
import { ProcessedResult } from "./-components/-ProcessedResult";
import { Bp21ModePanel } from "./-components/-Bp21ModePanel";
import type { RenameJobStatus } from "@/types/job";
import * as XLSX from "xlsx";

export const Route = createFileRoute("/rename-files/")({
  component: RouteComponent,
});

const ENDPOINTS: EndpointOption[] = [
  {
    id: "bppu",
    name: "Bukti Potong BPPU",
    description: "[nomor dokumen] - [nama] - [masa pajak].pdf",
    icon: FileText,
    endpoint: "rename_bppu",
  },
  {
    id: "bp21",
    name: "Bukti Potong BP21",
    description: "[nomor dokumen] - [nama] - [masa pajak].pdf",
    icon: FileText,
    endpoint: "rename_bp21",
  },
  {
    id: "bpa1",
    name: "Bukti Potong BPA1",
    description: "BPA1 - [nama] - [posisi].pdf",
    icon: FileText,
    endpoint: "rename_bpa1",
  },
];

function RouteComponent() {
  const [selectedEndpoint, setSelectedEndpoint] = useState<string | null>(null);
  const [files, setFiles] = useState<FileItem[]>([]);
  const [localLoading, setLocalLoading] = useState(false);
  const [renameMode, setRenameMode] = useState<
    "by_category" | "by_nama_pegawai"
  >("by_category");
  const [mappingFile, setMappingFile] = useState<File | null>(null);
  const [sheetName, setSheetName] = useState("");
  const [sheetOptions, setSheetOptions] = useState<string[]>([]);
  const [sheetOptionsLoading, setSheetOptionsLoading] = useState(false);

  const [jobId, setJobId] = useState<string | null>(null);
  const [jobStatus, setJobStatus] = useState<RenameJobStatus | null>(null);
  const selectedConfig = useMemo(
    () => ENDPOINTS.find((item) => item.id === selectedEndpoint) ?? null,
    [selectedEndpoint],
  );
  const byPegawaiMode = renameMode === "by_nama_pegawai";
  const missingPegawaiMapping =
    byPegawaiMode && (!mappingFile || !sheetName.trim());
  const isRenameDisabled =
    !selectedEndpoint ||
    files.length === 0 ||
    files.length >= 1000 ||
    missingPegawaiMapping;

  useEffect(() => {
    if (!jobId) {
      return;
    }

    let pollingStopped = false;
    let intervalId: ReturnType<typeof setInterval> | null = null;
    let doneNotified = false;
    let errorNotified = false;

    const poll = async () => {
      try {
        const status = await getRenameProgress(jobId);
        if (pollingStopped) return;

        setJobStatus(status);

        if (status.status === "done") {
          setLocalLoading(false);
          if (!doneNotified) {
            toast.success("Proses rename selesai. File siap di-download.");
          }
          doneNotified = true;
          if (intervalId) clearInterval(intervalId);
        }

        if (status.status === "error") {
          setLocalLoading(false);
          if (!errorNotified) {
            toast.error(status.error || "Processing failed");
          }
          errorNotified = true;
          if (intervalId) clearInterval(intervalId);
        }
      } catch (error) {
        console.error("Failed to poll status", error);
      }
    };

    poll();
    intervalId = setInterval(poll, 1500);

    return () => {
      pollingStopped = true;
      if (intervalId) clearInterval(intervalId);
    };
  }, [jobId]);

  const handleRename = async () => {
    if (!selectedEndpoint) {
      toast.error("Pilih jenis rename terlebih dahulu.");
      return;
    }
    if (files.length === 0) {
      toast.error("Upload minimal satu PDF.");
      return;
    }
    if (files.length >= 1000) {
      toast.error("Maksimal 1000 file per batch.");
      return;
    }
    if (byPegawaiMode && !mappingFile) {
      toast.error("Mode by_nama_pegawai butuh file mapping.");
      return;
    }
    if (byPegawaiMode && !sheetName.trim()) {
      toast.error("Isi sheet name untuk mode by_nama_pegawai.");
      return;
    }

    const endpointConfig = ENDPOINTS.find((e) => e.id === selectedEndpoint);
    if (!endpointConfig) return;

    try {
      setLocalLoading(true);
      setJobStatus(null);
      setJobId(null);

      const rawFiles = files.map((f) => f.file);
      const response = await renameFiles({
        endpoint: endpointConfig.endpoint,
        files: rawFiles,
        state: renameMode,
        mode: renameMode,
        mappingFile: byPegawaiMode ? mappingFile : undefined,
        sheetName: byPegawaiMode ? sheetName : undefined,
      });

      if (response.job_id) {
        setJobId(response.job_id);
        // Initialize status
        setJobStatus({
          job_id: response.job_id,
          status: "queued",
          total_files: rawFiles.length,
          processed_files: 0,
          skipped_files: 0,
        });
      } else {
        toast.error("No Job ID received");
        throw new Error("No Job ID received");
      }
    } catch (error) {
      setLocalLoading(false);
      const err = await handleErrorResponse(error);
      errorMessage(err.error || "Failed to initiate rename");
      console.log(err);
    }
  };

  const handleDownload = async () => {
    if (jobId) {
      try {
        await downloadRenameResult(jobId);
        toast.success("Download started");
        setJobId(null);
        setJobStatus(null);
      } catch (error) {
        const err = await handleErrorResponse(error);
        errorMessage(err.error || "Failed to download result");
      }
    }
  };

  const handleMappingFileChange = async (file: File | null) => {
    setMappingFile(file);
    setSheetName("");
    setSheetOptions([]);

    if (!file) {
      return;
    }

    try {
      setSheetOptionsLoading(true);
      const arrayBuffer = await file.arrayBuffer();
      const workbook = XLSX.read(arrayBuffer, { type: "array" });
      const nextSheets = (workbook.SheetNames || []).filter(Boolean);

      if (nextSheets.length === 0) {
        toast.error("File mapping tidak memiliki sheet.");
        return;
      }

      setSheetOptions(nextSheets);
      setSheetName(nextSheets[0]);
    } catch (error) {
      console.error("Failed to read mapping sheets", error);
      toast.error("Gagal membaca sheet dari file mapping.");
      setMappingFile(null);
    } finally {
      setSheetOptionsLoading(false);
    }
  };

  return (
    <div className="app-page">
      <FullscreenLoader />
      <div className="page-shell max-w-6xl space-y-6">
        <Header />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8 items-start">
          <div className="lg:col-span-7 space-y-6">
            <div className="panel p-6 motion-rise motion-rise-delay-1">
              <TypeSelector
                options={ENDPOINTS}
                selectedId={selectedEndpoint}
                onSelect={setSelectedEndpoint}
              />
            </div>

            <Bp21ModePanel
              visible={Boolean(selectedEndpoint)}
              mode={renameMode}
              onModeChange={setRenameMode}
              mappingFile={mappingFile}
              sheetName={sheetName}
              sheetOptions={sheetOptions}
              sheetOptionsLoading={sheetOptionsLoading}
              onMappingFileChange={handleMappingFileChange}
              onSheetNameChange={setSheetName}
              disabled={localLoading}
              selectedDocumentLabel={selectedConfig?.name}
            />

            {jobId && (
              <div className="panel mb-4 p-4">
                <div className="flex items-center justify-between gap-2 mb-2">
                  <p className="text-sm text-zinc-500 font-medium uppercase tracking-wider">
                    Job ID
                  </p>
                </div>
                <p className="select-all rounded-lg border border-zinc-300/80 bg-zinc-100 px-3 py-2 font-mono text-sm text-zinc-900">
                  {jobId}
                </p>
              </div>
            )}

            {jobStatus && <ProgressStats status={jobStatus} />}
          </div>

          <div className="lg:col-span-5 space-y-6">
            <div className="panel flex h-full flex-col p-6 motion-rise motion-rise-delay-2">
              <FileSection
                onFilesSelected={setFiles}
                hasFiles={files.length > 0}
                stepNumber={selectedEndpoint ? 3 : 2}
                title="Drop PDF Bukti Potong"
                description="Upload banyak file sekaligus. Maksimum 1000 file per batch."
                isBusy={localLoading}
              />

              <ActionButtons
                onRename={handleRename}
                onDownload={handleDownload}
                isLoading={localLoading}
                isDisabled={isRenameDisabled}
                canDownload={jobStatus?.status === "done"}
                renameLabel={localLoading ? "Processing..." : "Mulai Rename"}
              />
            </div>

            <div className="panel p-5">
              <div className="flex items-center gap-2 text-sm font-semibold text-zinc-800">
                <TimerReset className="h-4 w-4 text-zinc-600" />
                Workflow
              </div>
              <ol className="mt-3 list-decimal space-y-1.5 pl-4 text-sm text-zinc-600">
                <li>Pilih tipe dokumen target.</li>
                <li>Pilih mode rename (kategori atau nama pegawai).</li>
                <li>Untuk mode pegawai, isi mapping file + sheet.</li>
                <li>Upload PDF dan klik mulai rename.</li>
                <li>Tunggu sampai selesai, dan klik download kalau udah selesai.</li>
              </ol>
            </div>
            {jobStatus?.status === "done" && (
              <ProcessedResult
                processedCount={jobStatus.processed_files}
                skippedCount={jobStatus.skipped_files}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
