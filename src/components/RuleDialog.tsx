"use client";
import React, { useState } from "react";
import { useFormulaStore } from "../store/useFormulaStore";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";

// Clause options
const CLAUSES = [
  { id: "empty", label: "Kosong" },
  { id: "not_empty", label: "Tidak Kosong" },
  { id: "lebih_dari_15", label: "Lebih dari 15" },
  { id: "kurang_sama_dengan_15", label: "Kurang / Sama dengan 15" },
];

// Action options
const ACTIONS = [
  { id: "set_value", label: "Set Value" },
  { id: "copy_field", label: "Copy Dari Field" },
  { id: "formula", label: "Formula" },
];

// Formula options
const FORMULAS = [
  { id: "today", label: "Tanggal Hari Ini" },
  { id: "yesterday", label: "Kemarin" },
  { id: "bulan_sekarang", label: "Bulan Sekarang" },
  { id: "bulan_sebelumnya", label: "Bulan Sebelumnya" },
];

interface RuleDialogProps {
  header: string[];
  bukpotHeader: string[];
  globalConfig?: string[]; // contoh: ["tanggal_awal_pajak", "cutoff_date"]
}

export const RuleDialog: React.FC<RuleDialogProps> = ({
  header,
  bukpotHeader,
  globalConfig = ["tanggal_awal_pajak", "cutoff_date"],
}) => {
  const { addFormula } = useFormulaStore();

  const [targetHeader, setTargetHeader] = useState<string>("");
  const [sourceType, setSourceType] = useState<"header" | "bukpot" | "global">(
    "header"
  );
  const [selectedField, setSelectedField] = useState<string>("");
  const [selectedClause, setSelectedClause] = useState<string>("");
  const [selectedAction, setSelectedAction] = useState<string>("");

  // detail aksi
  const [actionValue, setActionValue] = useState<string>("");

  const handleSave = () => {
    if (!targetHeader || !selectedField || !selectedClause || !selectedAction) {
      alert("Lengkapi semua bagian rule dulu");
      return;
    }

    const newRule = {
      header: targetHeader,
      rules: [
        {
          when: [
            {
              source: sourceType,
              field: selectedField,
              clause: selectedClause,
            },
          ],
          then: {
            type: selectedAction,
            value: selectedAction === "set_value" ? actionValue : undefined,
            fromField: selectedAction === "copy_field" ? actionValue : undefined,
            formula: selectedAction === "formula" ? actionValue : undefined,
          },
        },
      ],
    };

    addFormula(newRule);

    // reset
    setTargetHeader("");
    setSourceType("header");
    setSelectedField("");
    setSelectedClause("");
    setSelectedAction("");
    setActionValue("");
  };

  const fieldOptions =
    sourceType === "header"
      ? header
      : sourceType === "bukpot"
      ? bukpotHeader
      : globalConfig;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="default">+ Tambah Rule</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Buat Formula Baru</DialogTitle>
        </DialogHeader>

        {/* Pilih Header Target */}
        <div className="space-y-2">
          <span className="text-sm font-medium">Header Target</span>
          <Select value={targetHeader} onValueChange={setTargetHeader}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Pilih Header Target" />
            </SelectTrigger>
            <SelectContent>
              {header.map((h, i) => (
                <SelectItem key={i} value={h}>
                  {h}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Sentence builder */}
        <div className="mt-4 p-3 border rounded bg-gray-50 space-y-3">
          <div className="flex items-center space-x-2">
            <span>Ketika</span>

            {/* Source Type Select */}
            <Select
              value={sourceType}
              onValueChange={(v: "header" | "bukpot" | "global") =>
                setSourceType(v)
              }
            >
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Sumber" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="header">Header</SelectItem>
                <SelectItem value="bukpot">Bukti Potong</SelectItem>
                <SelectItem value="global">Global</SelectItem>
              </SelectContent>
            </Select>

            {/* Field Select */}
            <Select value={selectedField} onValueChange={setSelectedField}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Pilih Field" />
              </SelectTrigger>
              <SelectContent>
                {fieldOptions.map((f, i) => (
                  <SelectItem key={i} value={f}>
                    {f}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <span>bernilai</span>

            {/* Clause Select */}
            <Select value={selectedClause} onValueChange={setSelectedClause}>
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Pilih Kondisi" />
              </SelectTrigger>
              <SelectContent>
                {CLAUSES.map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center space-x-2">
            <span>Maka</span>
            {/* Action Select */}
            <Select value={selectedAction} onValueChange={setSelectedAction}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Pilih Aksi" />
              </SelectTrigger>
              <SelectContent>
                {ACTIONS.map((a) => (
                  <SelectItem key={a.id} value={a.id}>
                    {a.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Detail Aksi */}
            {selectedAction === "set_value" && (
              <Input
                placeholder="Masukkan nilai"
                value={actionValue}
                onChange={(e) => setActionValue(e.target.value)}
                className="w-[200px]"
              />
            )}

            {selectedAction === "copy_field" && (
              <Select value={actionValue} onValueChange={setActionValue}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Pilih Field Sumber" />
                </SelectTrigger>
                <SelectContent>
                  {header.map((h, i) => (
                    <SelectItem key={i} value={h}>
                      {h}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}

            {selectedAction === "formula" && (
              <Select value={actionValue} onValueChange={setActionValue}>
                <SelectTrigger className="w-[220px]">
                  <SelectValue placeholder="Pilih Formula" />
                </SelectTrigger>
                <SelectContent>
                  {FORMULAS.map((f) => (
                    <SelectItem key={f.id} value={f.id}>
                      {f.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>
        </div>

        {/* Save */}
        <div className="mt-4 flex justify-end">
          <Button variant="default" onClick={handleSave}>
            Simpan
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
