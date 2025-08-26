import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ExcelProcessor } from "@/lib/ExcelProcessor";

export const Route = createFileRoute("/")({
  component: App,
});

function App() {
  const [header, setHeader] = useState<string[]>([]);
  const [rows, setRows] = useState<any[][]>([]);

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const processor = new ExcelProcessor(file, 2);
    await processor.load();

    setHeader(processor.getHeader());
    setRows(processor.getRows());
  };

  return (
    <div className="p-4">
      <input type="file" accept=".xlsx, .xls" onChange={handleFile} />

      <h2 className="font-bold mt-4">Header</h2>
      <pre>{JSON.stringify(header, null, 2)}</pre>

      <h2 className="font-bold mt-4">Rows</h2>
      <pre>{JSON.stringify(rows, null, 2)}</pre>
    </div>
  );
}
