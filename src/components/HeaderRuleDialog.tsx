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

const CLAUSES = [
  { id: "empty", label: "Kosong" },
  { id: "not_empty", label: "Tidak Kosong" },
  { id: "lebih_dari_15", label: "Lebih dari 15" },
  { id: "kurang_sama_dengan_15", label: "Kurang / Sama dengan 15" },
];

const ACTIONS = [
  { id: "set_value", label: "Set Value" },
  { id: "copy_field", label: "Copy Dari Field" },
  { id: "formula", label: "Formula" },
];

const FORMULAS = [
  { id: "today", label: "Tanggal Hari Ini" },
  { id: "yesterday", label: "Kemarin" },
  { id: "bulan_sekarang", label: "Bulan Sekarang" },
  { id: "bulan_sebelumnya", label: "Bulan Sebelumnya" },
];

interface HeaderRuleDialogProps {
  headerName: string; // nama header yg diklik
  header: string[];
  bukpotHeader: string[];
  globalConfig?: string[];
}

export const HeaderRuleDialog: React.FC<HeaderRuleDialogProps> = ({
  headerName,
  header,
  bukpotHeader,
  globalConfig = ["tanggal_awal_pajak", "cutoff_date"],
}) => {
  const { addFormula, formulas } = useFormulaStore();

  const [sourceType, setSourceType] = useState<"header" | "bukpot" | "global">(
    "header"
  );
  const [selectedField, setSelectedField] = useState<string>("");
  const [selectedClause, setSelectedClause] = useState<string>("");
  const [selectedAction, setSelectedAction] = useState<string>("");
  const [actionValue, setActionValue] = useState<string>("");

  const handleSave = () => {
    if (!selectedField || !selectedClause || !selectedAction) {
      alert("Lengkapi semua bagian rule dulu");
      return;
    }

    const newRule = {
      header: headerName,
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
            fromField:
              selectedAction === "copy_field" ? actionValue : undefined,
            formula: selectedAction === "formula" ? actionValue : undefined,
          },
        },
      ],
    };

    addFormula(newRule);

    // reset
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

  // Ambil rules yang sudah ada untuk header ini
  const existingRules = formulas.filter((f) => f.header === headerName);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          {headerName}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Rules untuk {headerName}</DialogTitle>
        </DialogHeader>

        {/* List rule yg sudah ada */}
        <div className="space-y-2 mb-4">
          {existingRules.length === 0 ? (
            <p className="text-sm text-gray-500">Belum ada rule</p>
          ) : (
            existingRules.map((r, i) => (
              <div key={i} className="p-2 border rounded bg-gray-50 text-sm">
                {r.rules.map((rule, j) => (
                  <div key={j}>
                    <strong>When:</strong> {rule.when[0].field} (
                    {rule.when[0].clause}) →<strong> Then:</strong>{" "}
                    {rule.then.type}{" "}
                    {rule.then.value ||
                      rule.then.fromField ||
                      rule.then.formula}
                  </div>
                ))}
              </div>
            ))
          )}
        </div>

        {/* Builder rule baru */}
        <div className="mt-2 p-3 border rounded bg-gray-50 space-y-3">
          <div className="flex items-center space-x-2">
            <span>Ketika</span>
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
                  {fieldOptions.map((f, i) => (
                    <SelectItem key={i} value={f}>
                      {f}
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

        <div className="mt-4 flex justify-end">
          <Button onClick={handleSave}>Tambah Rule</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
