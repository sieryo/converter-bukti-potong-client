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
import { useRuleStore, type Rule } from "@/store/useRuleStore";
import {
  Upload,
  Plus,
  Trash2,
  Download,
  Play,
  CheckCircle,
  Circle,
} from "lucide-react";
import PromptAlertDialog from "@/components/PromptAlertDialog";
import { handleExport } from "@/utils/helper";
import { ImportRuleDialog } from "@/components/ImportRuleDialog";
import { toast } from "sonner";

export const Route = createFileRoute("/convert/")({
  component: RouteComponent,
});

enum BukpotHeaderState {
  NOT_VALID,
  VALID,
  PENDING,
}

const REQUIRED_BUKPOT_HEADERS = ["NPWP", "NITKU", "Kode Objek Pajak"];

function RouteComponent() {
  const [header, setHeader] = useState<string[]>([]);
  const [bukpotOptions, setBukpotOptions] = useState<string[]>([]);
  const { fieldRules, rowFilters, removeRule, exportAll, removeFilter } =
    useRuleStore();

  const [isHeaderDialogOpen, setIsHeaderDialogOpen] = useState(false);
  const [isRowDialogOpen, setIsRowDialogOpen] = useState(false);
  const [selectedHeader, setSelectedHeader] = useState<string | null>(null);
  const [isBukpotHeaderValid, setIsBukpotHeaderValid] =
    useState<BukpotHeaderState>(BukpotHeaderState.PENDING);

  const [bukpotFile, setBukpotFile] = useState<File | null>(null);
  const [rowStart, setRowStart] = useState<number | null>(null);

  useEffect(() => {
    const loadTemplate = async () => {
      const processor = new ExcelProcessor(3);
      await processor.loadFromUrl("/template.xlsx");
      setHeader(processor.getHeader());
    };
    loadTemplate();
  }, []);

  useEffect(() => {
    if (!bukpotFile || !rowStart) return;
    const loadExcel = async () => {
      const bukpotProcessor = new ExcelProcessor(rowStart, bukpotFile);
      await bukpotProcessor.load();
      setBukpotOptions(bukpotProcessor.getHeader());
    };
    loadExcel();
  }, [bukpotFile, rowStart]);

  useEffect(() => {
    if (bukpotOptions.length === 0 && !bukpotFile) return;
    const isValid = REQUIRED_BUKPOT_HEADERS.every((req) =>
      bukpotOptions.some((h) => h.toLowerCase() === req.toLowerCase())
    );

    if (isValid) {
      setIsBukpotHeaderValid(BukpotHeaderState.VALID);
      toast.success("Header Bukti Potong Terdeteksi")
    } else {
      setIsBukpotHeaderValid(BukpotHeaderState.NOT_VALID);
    }
  }, [bukpotOptions]);

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

  if (
    !rowStart ||
    isBukpotHeaderValid === BukpotHeaderState.NOT_VALID ||
    isBukpotHeaderValid === BukpotHeaderState.PENDING
  ) {
    return (
      <div className="h-screen flex flex-col items-center justify-center text-center p-6">
        <h2 className="text-lg font-semibold mb-2">Header baris ke-berapa?</h2>
        {isBukpotHeaderValid === BukpotHeaderState.NOT_VALID && (
          <p className="text-sm text-red-500 mb-4">
            Header tidak valid, biasanya file bukti potong akan ada:
            {REQUIRED_BUKPOT_HEADERS.map((h) => {
              return (
                <span key={h} className=" block text-sm text-gray-700">
                  - {h}
                </span>
              );
            })}
          </p>
        )}
        <input
          type="number"
          min={1}
          className="border rounded px-3 py-2 text-sm mb-4"
          placeholder="Contoh: 2"
          onChange={(e) => setRowStart(Number(e.target.value))}
        />
        <p className="text-xs text-gray-500">
          Web ini memerlukan data header bukti potong sebelum bisa memproses
        </p>
      </div>
    );
  }

  return (
    <div className="h-screen p-4">
      <ResizablePanelGroup
        direction="horizontal"
        className="w-full h-full rounded-lg border shadow-sm"
      >
        <ResizablePanel defaultSize={70} minSize={40}>
          <div className="p-4 flex flex-col gap-6 overflow-y-auto">
            <div className="space-y-2">
              <h2 className="text-lg font-semibold mb-2">Progress</h2>
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  {bukpotOptions.length > 0 ? (
                    <CheckCircle className="w-4 h-4 text-green-500" />
                  ) : (
                    <Circle className="w-4 h-4 text-gray-400" />
                  )}
                  <span>Header Bukti Potong terdeteksi</span>
                </div>
                {bukpotOptions.length === 0 && (
                  <label
                    onClick={() => {
                      setBukpotFile(null);
                      setRowStart(null);
                    }}
                    className="text-xs text-blue-600 hover:underline cursor-pointer"
                  >
                    Upload ulang
                  </label>
                )}
              </div>
              <div className="flex items-center gap-2 text-sm">
                {rowFilters.length > 0 ? (
                  <CheckCircle className="w-4 h-4 text-green-500" />
                ) : (
                  <Circle className="w-4 h-4 text-gray-400" />
                )}
                <span>Row Filters dibuat</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                {fieldRules.some((r) => r.rules.length > 0) ? (
                  <CheckCircle className="w-4 h-4 text-green-500" />
                ) : (
                  <Circle className="w-4 h-4 text-gray-400" />
                )}
                <span>Field Rules ditentukan</span>
              </div>
            </div>
          </div>

          <div className=" p-4 flex flex-col gap-6 overflow-y-auto">
            <div>
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-lg font-semibold">Row Filters</h2>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setIsRowDialogOpen(true)}
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              {rowFilters.length === 0 ? (
                <p className="text-xs text-gray-500 italic">Belum ada filter</p>
              ) : (
                <ul className="space-y-1">
                  {rowFilters.map((f, idx) => (
                    <li
                      key={idx}
                      className="flex items-center justify-between text-sm bg-gray-50 px-2 py-1 rounded"
                    >
                      <span>
                        {`${f.source}.${f.field} ${f.clause} ${f.compareWith.type}.${f.compareWith.value ?? ""}`}
                      </span>
                      <PromptAlertDialog
                        title="Apakah kamu yakin untuk menghapus filter ini?"
                        description="Filter yang dihapus tidak akan kembali dan harus dibuat lagi."
                        onAction={() => {
                          removeFilter(idx);
                        }}
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </PromptAlertDialog>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
          <div className="h-full p-4 flex flex-col gap-4 ">
            <h2 className="text-lg font-semibold mb-2">Template Field Rules</h2>
            <div className="overflow-y-auto space-y-3 pb-[300px]">
              {header.map((h, i) => {
                const ruleSet = fieldRules.find(
                  (ruleSet) => ruleSet.header === h
                );

                let rules: Rule[];
                if (!ruleSet) {
                  rules = [];
                } else {
                  rules = ruleSet.rules;
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
                        {rules.map((r, idx) => {
                          let descriptions;

                          if (r.type === "conditional") {
                            descriptions = `When "${r.when.field}" ${r.when.clause}, then ${r.then.action} ${
                              r.then.formula ? `${r.then.formula} ` : ""
                            }${r.then.value ?? ""} ${r.then.from ? `from "${r.then.from.source}.${r.then.from.field}"` : ""}`;
                          } else if (r.type === "direct") {
                            descriptions = `Always ${r.then.action} ${
                              r.then.formula ? `"${r.then.formula}" ` : ""
                            }${r.then.value ? `"${r.then.value}"` : ""} ${r.then.from ? `from "${r.then.from.source}.${r.then.from.field}"` : ""}`;
                          }

                          return (
                            <li
                              key={idx}
                              className="flex items-center justify-between text-sm bg-gray-50 px-2 py-1 rounded"
                            >
                              <span>{descriptions}</span>
                              <PromptAlertDialog
                                title="Apakah kamu yakin untuk menghapus rule ini?"
                                description="Rule yang dihapus tidak akan kembali dan harus dibuat lagi."
                                onAction={() => removeRule(h, idx)}
                              >
                                <Trash2 className="w-4 h-4 text-red-500" />
                              </PromptAlertDialog>
                            </li>
                          );
                        })}
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
              <ImportRuleDialog />
              <Button
                onClick={() => {
                  const exportedRules = exportAll();
                  handleExport(exportedRules);
                }}
                variant="outline"
                className="flex items-center gap-2"
              >
                <Download className="w-4 h-4" /> Export Rules
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
