"use client";
import React, { useEffect, useState } from "react";
import { ExcelProcessor } from "@/lib/ExcelProcessor";
import { createFileRoute } from "@tanstack/react-router";
import { HeaderRuleDialog } from "@/components/HeaderRuleDialog"; // baru
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { cn } from "@/lib/utils";
import { useRuleStore } from "@/store/useRuleStore";

export const Route = createFileRoute("/convert/")({
  component: RouteComponent,
});

function RouteComponent() {
  const [header, setHeader] = useState<string[]>([]);
  const [bukpotHeader, setBukpotHeader] = useState<string[]>([]);
  const [rows, setRows] = useState<any[][]>([]);
  const { rules } = useRuleStore();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [bukpotFile, setBukpotFile] = useState<File | null>(null);

  const [selectedHeader, setSelectedHeader] = useState<string | null>(null);

  useEffect(() => {
    const loadExcel = async () => {
      const processor = new ExcelProcessor(3); // header di row ke-3
      await processor.loadFromUrl("/template.xlsx");
      setHeader(processor.getHeader());
      setRows(processor.getRows());
    };
    loadExcel();
  }, []);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setBukpotFile(file)

    const processor = new ExcelProcessor(2, file);
    await processor.load();
    setBukpotHeader(processor.getHeader());
  };

  console.log(rules);

  return (
    <div className="h-screen p-4">
      <ResizablePanelGroup
        direction="vertical"
        className="w-full h-full rounded-lg border shadow-sm"
      >
        <ResizablePanel defaultSize={60} minSize={40}>
          <div className="h-full p-4 flex flex-col">
            <h2 className="text-lg font-semibold mb-3">Template Headers</h2>
            <div className="overflow-x-auto">
              <table className="border-collapse border border-gray-300 rounded w-full text-sm">
                <thead>
                  <tr>
                    {header.map((h, i) => (
                      <th
                        key={i}
                        onClick={() => {
                          setSelectedHeader(h);
                          setIsDialogOpen(true);
                        }}
                        className={cn(
                          "border px-3 py-2 cursor-pointer hover:bg-blue-50 transition-colors",
                          selectedHeader === h && "bg-blue-100"
                        )}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {rows.slice(0, 5).map((row, i) => (
                    <tr key={i}>
                      {row.map((cell, j) => (
                        <td key={j} className="border px-3 py-2">
                          {cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </ResizablePanel>

        <ResizableHandle />

        {/* BOTTOM PANEL: BUKPOT HEADERS */}
        <ResizablePanel defaultSize={40} minSize={20}>
          <div className="h-full p-4 flex flex-col">
            <h2 className="text-lg font-semibold mb-3">Bukti Potong Headers</h2>

            {!bukpotHeader.length ? (
              <div className="flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-6 text-gray-500">
                <input
                  type="file"
                  accept=".xlsx,.xls"
                  onChange={handleUpload}
                  className="block w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4
                           file:rounded-full file:border-0
                           file:text-sm file:font-semibold
                           file:bg-blue-50 file:text-blue-700
                           hover:file:bg-blue-100"
                />
                <p className="mt-2 text-sm">Upload file bukti potong Excel</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="border-collapse border border-gray-300 rounded w-full text-sm">
                  <thead>
                    <tr>
                      {bukpotHeader.map((h, i) => (
                        <th
                          key={i}
                          className="border px-3 py-2 bg-gray-100 text-gray-600"
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                </table>
              </div>
            )}
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>

      {selectedHeader && (
        <HeaderRuleDialog
          isOpen={isDialogOpen}
          setIsOpen={setIsDialogOpen}
          header={header}
          headerName={selectedHeader}
          bukpotHeader={bukpotHeader}
        />
      )}
    </div>
  );
}
