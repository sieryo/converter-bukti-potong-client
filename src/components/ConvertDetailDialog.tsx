import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { triggerDownload } from "@/utils/api";
import { DialogDescription } from "@radix-ui/react-dialog";
import type { AxiosResponse } from "axios";
import { AlertCircle, CheckCircle2 } from "lucide-react";

export const DialogDetailExport = ({
  isOpen,
  setIsOpen,
  response,
}: {
  isOpen: boolean;
  setIsOpen: (v: boolean) => void;
  response?: AxiosResponse<any, any>;
}) => {
  if (!response) return null;

  const status = response.status;
  let warnings: WarningItem[] = [];

  try {
    // @ts-expect-error
    const rawWarnings = response.headers.get("X-Warnings");
    if (rawWarnings) {
      warnings = JSON.parse(rawWarnings);
    }
  } catch (err) {
    console.error("Failed to parse warnings", err);
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen} modal>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Detail Convert</DialogTitle>
          <DialogDescription>Summary of data convert result</DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4">
          <StatusDetail status={status} />
          <WarningDetails warnings={warnings} />
          <DownloadFileButton response={response} />
        </div>
      </DialogContent>
    </Dialog>
  );
};

const StatusDetail = ({ status }: { status: number }) => {
  const isSuccess = status >= 200 && status < 300;

  return (
    <div
      className={`flex items-center gap-2 p-3 rounded-md ${
        isSuccess ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
      }`}
    >
      {isSuccess ? (
        <CheckCircle2 className="w-5 h-5" />
      ) : (
        <AlertCircle className="w-5 h-5" />
      )}
      <h2 className="font-medium">
        {isSuccess
          ? "Bukti Potong berhasil diubah!"
          : "Gagal mengubah data bukti potong"}
      </h2>
    </div>
  );
};

type WarningItem = {
  filename: string;
  field: string;
  value: any;
  message: string;
};

const DownloadFileButton = ({
  response,
}: {
  response: AxiosResponse<any, any>;
}) => {
  const isSuccess = response.status >= 200 && response.status < 300;

  if (!isSuccess) return null;

  return (
    <div
      className=" border border-emerald-400 text-emerald-600 bg-white hover:bg-emerald-100 hover:text-emerald-700 py-1 rounded-lg text-center font-medium shadow-sm transition-all duration-200 select-none cursor-pointer"
      onClick={() => {
        triggerDownload(response);
      }}
    >
      Download file again
    </div>
  );
};

const WarningDetails = ({ warnings }: { warnings: WarningItem[] }) => {
  if (!warnings || warnings.length === 0) {
    return (
      <div className="text-sm text-gray-500">
        No warnings were generated during convert.
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <h2 className="font-semibold text-gray-800">Warning details:</h2>
      <div className="border rounded-lg space-y-3 max-h-[400px] overflow-y-auto">
        {warnings.map((w, idx) => (
          <>
            <div
              key={idx}
              className="p-3 flex flex-col gap-1 text-sm bg-yellow-50"
            >
              <div>
                <span className="font-semibold">File:</span> {w.filename}
              </div>
              <div>
                <span className="font-semibold">Field:</span> {w.field}
              </div>
              <div>
                <span className="font-semibold">Value:</span> {String(w.value)}
              </div>
              <div className="text-orange-700">
                <span className="font-semibold">Message:</span> {w.message}
              </div>
            </div>
          </>
        ))}
      </div>
    </div>
  );
};
