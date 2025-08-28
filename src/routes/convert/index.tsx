"use client";
import React, { useEffect, useState } from "react";
import { ExcelProcessor } from "@/lib/ExcelProcessor";
import { createFileRoute } from "@tanstack/react-router";
import { HeaderRuleDialog } from "@/components/HeaderRuleDialog";
import { RowRuleDialog } from "@/components/RowRuleDialog";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useRuleStore } from "@/store/useRuleStore";
import { Upload, Plus, Trash2, Import, Download, Play } from "lucide-react";

export const Route = createFileRoute("/convert/")({
  component: RouteComponent,
});

function RouteComponent() {
  const [header, setHeader] = useState<string[]>([]);
  const [bukpotOptions, setBukpotOptions] = useState<string[]>([]);
  const { fieldRules, reset, removeRule } = useRuleStore();

  const [isHeaderDialogOpen, setIsHeaderDialogOpen] = useState(false);
  const [isRowDialogOpen, setIsRowDialogOpen] = useState(false);
  const [selectedHeader, setSelectedHeader] = useState<string | null>(null);

  const [bukpotFile, setBukpotFile] = useState<File | null>(null);

  useEffect(() => {
    if (!bukpotFile) return;
    const loadExcel = async () => {
      const processor = new ExcelProcessor(3); // header row ke-3
      await processor.loadFromUrl("/template.xlsx");
      setHeader(processor.getHeader());

      const bukpotProcessor = new ExcelProcessor(2, bukpotFile);
      await bukpotProcessor.load();
      setBukpotOptions(bukpotProcessor.getHeader());
    };
    loadExcel();
  }, [bukpotFile]);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setBukpotFile(file);
  };

  if (!bukpotFile) {
    return (
      <div className="h-screen flex flex-col items-center justify-center text-center p-6">
        <Upload className="w-12 h-12 text-gray-400 mb-4" />
        <h2 className="text-lg font-semibold mb-2">
          Upload Bukti Potong Excel
        </h2>
        <p className="text-sm text-gray-500 mb-4">
          Silakan upload file Excel bukti potong terlebih dahulu untuk
          melanjutkan.
        </p>
        <input
          type="file"
          accept=".xlsx,.xls"
          onChange={handleUpload}
          className="block text-sm text-gray-600 file:mr-4 file:py-2 file:px-4
                     file:rounded-full file:border-0
                     file:text-sm file:font-semibold
                     file:bg-blue-50 file:text-blue-700
                     hover:file:bg-blue-100"
        />
      </div>
    );
  }

  console.log(fieldRules)

  return (
    <div className="h-screen p-4">
      <ResizablePanelGroup
        direction="horizontal"
        className="w-full h-full rounded-lg border shadow-sm"
      >
        {/* LEFT: Template + Rule editor */}
        <ResizablePanel defaultSize={70} minSize={40}>
          <div className="h-full p-4 flex flex-col gap-4">
            <h2 className="text-lg font-semibold mb-2">
              Template Field Rules
            </h2>
            <div className="overflow-y-auto space-y-3">
              {header.map((h, i) => {
                const ruleSet= fieldRules.find((ruleSet) => ruleSet.header ===  h)

                let rules : any[]
                if (!ruleSet) {
                  rules = []
                } else {
                  rules = ruleSet.rules
                }

                return (
                  <Card
                    key={i}
                    className="p-3 flex flex-col border rounded-lg shadow-sm"
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{h}</span>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                          setSelectedHeader(h);
                          setIsHeaderDialogOpen(true);
                        }}
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>

                    {rules.length === 0 ? (
                      <p className="text-xs text-gray-500 mt-2 italic">
                        Belum ada rule
                      </p>
                    ) : (
                      <ul className="mt-2 space-y-1">
                        {rules.map((r, idx) => (
                          <li
                            key={idx}
                            className="flex items-center justify-between text-sm bg-gray-50 px-2 py-1 rounded"
                          >
                            <span>
                              {r.type === "direct"
                                ? `Direct → ${r.then.type}`
                                : `If ${r.when.field} ${r.when.clause} → ${r.then.type}`}
                            </span>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => removeRule(h, idx)}
                            >
                              <Trash2 className="w-4 h-4 text-red-500" />
                            </Button>
                          </li>
                        ))}
                      </ul>
                    )}
                  </Card>
                );
              })}
            </div>
          </div>
        </ResizablePanel>

        <ResizableHandle />

        {/* RIGHT: Actions */}
        <ResizablePanel defaultSize={30} minSize={20}>
          <div className="h-full p-4 flex flex-col gap-4">
            <h2 className="text-lg font-semibold mb-2">Aksi</h2>
            <div className="flex flex-col gap-2">
              <Button className="flex items-center gap-2">
                <Play className="w-4 h-4" /> Convert
              </Button>
              <Button variant="outline" className="flex items-center gap-2">
                <Import className="w-4 h-4" /> Import Rules
              </Button>
              <Button variant="outline" className="flex items-center gap-2">
                <Download className="w-4 h-4" /> Export Rules
              </Button>
              <Button
                variant="destructive"
                className="flex items-center gap-2 mt-4"
                onClick={reset}
              >
                <Trash2 className="w-4 h-4" /> Reset Rules
              </Button>
            </div>
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>

      {/* Dialogs */}
      {selectedHeader && (
        <HeaderRuleDialog
          isOpen={isHeaderDialogOpen}
          setIsOpen={setIsHeaderDialogOpen}
          header={header}
          headerName={selectedHeader}
          bukpotOptions={bukpotOptions}
        />
      )}

      <RowRuleDialog
        isOpen={isRowDialogOpen}
        setIsOpen={setIsRowDialogOpen}
        bukpotOptions={bukpotOptions}
      />
    </div>
  );
}
