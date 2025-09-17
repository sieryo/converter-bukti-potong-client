"use client";
import React, { useEffect, useState } from "react";
import { ExcelProcessor, type Header } from "@/lib/ExcelProcessor";
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
import { ProfilePreview } from "@/components/ProfilePreview";
import RuleDescription from "@/components/RuleDescription";
import { type Profile, useProfileStore } from "@/store/useProfileStore";
import { convertBukpot } from "@/utils/api";
import type { ExportedRules } from "@/utils/rule";
import { useFullScreenLoadingStore } from "@/store/useFullScreenLoadingStore";
import { FullscreenLoader } from "@/components/FullScreenLoader";
import type { AxiosResponse } from "axios";
import { DialogDetailExport } from "@/components/ConvertDetailDialog";
import ProfileSwitcher from "@/components/ProfileSwitcher";
import { BASE_API_PATH } from "@/lib/constants";
import FileUploader from "@/components/FileUploader";

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
  const [header, setHeader] = useState<Header[]>([]);
  const [bukpotOptions, setBukpotOptions] = useState<Header[]>([]);
  const { fieldRules, rowFilters, removeRule, exportAll, removeFilter } =
    useRuleStore();

  const [isHeaderDialogOpen, setIsHeaderDialogOpen] = useState(false);
  const [isRowDialogOpen, setIsRowDialogOpen] = useState(false);
  const [selectedHeader, setSelectedHeader] = useState<Header | null>(null);
  const [isBukpotHeaderValid, setIsBukpotHeaderValid] =
    useState<BukpotHeaderState>(BukpotHeaderState.PENDING);

  const { getActiveProfile } = useProfileStore();
  const [bukpotFile, setBukpotFile] = useState<File | null>(null);
  const [rowStart, setRowStart] = useState<number | null>(null);
  const { setIsLoading } = useFullScreenLoadingStore();
  const [response, setResponse] = useState<AxiosResponse<any, any>>();
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  useEffect(() => {
    console.log(BASE_API_PATH);
  }, []);

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
      // console.log(bukpotProcessor.getHeader())
    };
    loadExcel();
  }, [bukpotFile, rowStart]);

  useEffect(() => {
    if (bukpotOptions.length === 0 && !bukpotFile) return;
    const isValid = REQUIRED_BUKPOT_HEADERS.every((req) =>
      bukpotOptions.some((h) => h.name.toLowerCase() === req.toLowerCase())
    );

    if (isValid) {
      setIsBukpotHeaderValid(BukpotHeaderState.VALID);
      toast.success("Header Bukti Potong Terdeteksi");
    } else {
      setIsBukpotHeaderValid(BukpotHeaderState.NOT_VALID);
    }
  }, [bukpotOptions]);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setBukpotFile(file);
  };

  const handleConvert = async () => {
    try {
      if (!bukpotFile) {
        toast.error("File Bukti potong belum diupload");
        return;
      }

      if (rowFilters.length == 0) {
        return;
      }

      if (fieldRules.length == 0) {
        return;
      }

      const r: ExportedRules = {
        fieldRules: fieldRules,
        rowFilters: rowFilters,
      };

      const profile: Profile | null = getActiveProfile();

      if (!profile) {
        return;
      }

      const result = await convertBukpot(
        bukpotFile,
        r,
        profile,
        () => {
          setIsLoading(true);
        },
        (response) => {
          setResponse(response);
          setIsDetailOpen(true);
        }
      );

      console.log("Result:", result);
    } catch (err: any) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  if (!getActiveProfile()) {
    return <ProfileSwitcher />;
  }

  if (!bukpotFile) {
    return (
      <FileUploader
        title="Upload Bukti Potong Excel"
        description="Silakan upload file Excel bukti potong terlebih dahulu untuk
          melanjutkan."
        onUpload={handleUpload}
      />
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
      <DialogDetailExport
        isOpen={isDetailOpen}
        setIsOpen={setIsDetailOpen}
        response={response}
      />
      <FullscreenLoader />

      <div className="w-full pb-3">
        <h1 className=" text-xl">Converter Bukti Potong</h1>
      </div>
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
                <span>Header Field Rules ditentukan</span>
              </div>
            </div>
          </div>

          <div className=" p-4 flex flex-col gap-6 overflow-y-auto">
            <div>
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-lg font-semibold">Bukpot Row Filters</h2>
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
                      className="flex items-center justify-between rounded bg-gray-50 px-2 py-1 text-sm"
                    >
                      <span className="leading-relaxed">
                        <span className="font-semibold text-gray-700">
                          Include rows
                        </span>{" "}
                        from <span className="text-blue-600">{f.source}</span>{" "}
                        <span className="font-semibold text-gray-700">
                          where
                        </span>{" "}
                        <span className="text-blue-600">{f.field}</span>{" "}
                        <span className="text-gray-700">{f.clause}</span>{" "}
                        {f.compareWith?.value && (
                          <span className="text-green-600">
                            {f.compareWith.type} - {f.compareWith.value}
                          </span>
                        )}
                      </span>

                      <PromptAlertDialog
                        title="Are you sure you want to delete this filter?"
                        description="Once deleted, the filter cannot be restored and must be created again."
                        onAction={() => {
                          removeFilter(idx);
                        }}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </PromptAlertDialog>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
          <div className="h-full p-4 flex flex-col gap-4 ">
            <h2 className="text-lg font-semibold mb-2">
              Template Header Field Rules
            </h2>
            <div className="overflow-y-auto space-y-3 pb-[300px]">
              {header.map((h, i) => {
                const ruleSet = fieldRules.find(
                  (ruleSet) => ruleSet.header === h.name
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
                      <span className="font-medium">{h.name}</span>
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
                          return (
                            <li
                              key={idx}
                              className="flex items-center justify-between text-sm bg-gray-50 px-2 py-1 rounded"
                            >
                              <RuleDescription rule={r} />
                              <PromptAlertDialog
                                title="Apakah kamu yakin untuk menghapus rule ini?"
                                description="Rule yang dihapus tidak akan kembali dan harus dibuat lagi."
                                onAction={() => removeRule(h.name, idx)}
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
          <div className="h-full p-4 flex flex-col">
            <div className="flex flex-col gap-4">
              <h2 className="text-lg font-semibold mb-2">Aksi</h2>
              <div className="flex flex-col gap-2">
                <Button
                  className="flex items-center gap-2"
                  onClick={handleConvert}
                >
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

            <div className="mt-auto">
              <ProfilePreview />
            </div>
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>

      {/* Dialogs */}
      {selectedHeader && (
        <HeaderRuleDialog
          isOpen={isHeaderDialogOpen}
          setIsOpen={setIsHeaderDialogOpen}
          header={selectedHeader}
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
