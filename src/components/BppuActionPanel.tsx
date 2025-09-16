import { Button } from "@/components/ui/button";
import { Play, Download } from "lucide-react";

interface ActionsPanelProps {
  onCheckDuplicate?: () => void;
  onValidate?: () => void;
  onConvert?: () => void;
  onExport?: () => void;
}

export function ActionsPanel({
  onCheckDuplicate,
  onValidate,
  onConvert,
  onExport,
}: ActionsPanelProps) {
  return (
    <div className="border rounded-lg shadow-sm p-4 flex flex-col space-y-4">
      <h2 className="text-lg font-semibold mb-2">Aksi</h2>

      <div className="space-y-2">
        <h3 className="text-sm font-medium text-gray-600">Pengecekan</h3>
        <Button className="flex items-center gap-2" variant={"ghost"} onClick={onCheckDuplicate}>
          <Play className="w-4 h-4" /> Cek Duplikat Nomor Pajak
        </Button>
        <Button className="flex items-center gap-2" variant={"ghost"} onClick={onValidate}>
          <Play className="w-4 h-4" /> Validasi Format PDF
        </Button>
      </div>

      <div className="space-y-2">
        <h3 className="text-sm font-medium text-gray-600">Konversi & Export</h3>
        <Button className="flex items-center gap-2"  onClick={onConvert}>
          <Play className="w-4 h-4" /> Convert ke Excel
        </Button>
        <Button
          variant="outline"
          className="flex items-center gap-2"
          onClick={onExport}
        >
          <Download className="w-4 h-4" /> Export Hasil
        </Button>
      </div>
    </div>
  );
}
