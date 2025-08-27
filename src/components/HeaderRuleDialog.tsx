"use client";
import React, { useState } from "react";
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
import { useRuleStore, type Rule } from "@/store/useRuleStore";
import { useProfileStore } from "@/store/useProfileStore";
import { mapProfileToLabel } from "@/utils/helper";

/* ---------- CLAUSES CONFIG ---------- */
const CLAUSES = [
  { id: "empty_or_zero", label: "Kosong atau nol", needsValue: false },
  { id: "not_empty", label: "Tidak Kosong", needsValue: false },
  {
    id: "greater_than",
    label: "Lebih dari ...",
    needsValue: true,
    valueType: "number",
  },
  {
    id: "less_equal",
    label: "Kurang / Sama dengan ...",
    needsValue: true,
    valueType: "number",
  },
] as const;

/* ---------- ACTIONS CONFIG ---------- */
const ACTIONS = [
  { id: "set_value", label: "Set Value", needsValue: true, valueType: "text" },
  {
    id: "copy_field",
    label: "Copy Dari Field",
    needsValue: true,
    valueType: "select",
  },
  { id: "formula", label: "Formula", needsValue: true, valueType: "formula" },
] as const;

/* ---------- FORMULAS CONFIG ---------- */
const FORMULAS = [
  { id: "today", label: "Tanggal Hari Ini" },
  { id: "yesterday", label: "Kemarin" },
  { id: "bulan_sekarang", label: "Bulan Sekarang" },
  { id: "bulan_sebelumnya", label: "Bulan Sebelumnya" },
  { id: "tahun_sekarang", label: "Tahun Sekarang" },
] as const;

interface HeaderRuleDialogProps {
  headerName: string;
  header: string[];
  bukpotHeader: string[];
  isOpen: boolean;
  setIsOpen: (val: boolean) => void;
}

export const HeaderRuleDialog: React.FC<HeaderRuleDialogProps> = ({
  headerName,
  bukpotHeader,
  isOpen,
  setIsOpen,
}) => {
  const { addRule, rules } = useRuleStore();
  const profile = useProfileStore((s) => s.getActiveProfile)();

  const [sourceType, setSourceType] = useState<"bukpot" | "profil">("bukpot");
  const [selectedField, setSelectedField] = useState("");
  const [selectedClause, setSelectedClause] = useState("");
  const [clauseValue, setClauseValue] = useState("");
  const [selectedAction, setSelectedAction] = useState("");
  const [actionValue, setActionValue] = useState("");
  const [ruleType, setRuleType] = useState<"conditional" | "direct">(
    "conditional"
  );

  if (!profile) {
    return null;
  }

  console.log(profile);

  const profileOptions = mapProfileToLabel(profile);

  const fieldOptions = sourceType === "bukpot" ? bukpotHeader : profileOptions;
  const existingRules = rules.filter((f) => f.header === headerName);

  const handleSave = () => {
    if (ruleType === "conditional") {
      if (!selectedField || !selectedClause || !selectedAction) {
        alert("Lengkapi semua bagian rule dulu");
        return;
      }

      const clauseConfig = CLAUSES.find((c) => c.id === selectedClause);
      const actionConfig = ACTIONS.find((a) => a.id === selectedAction);

      const newRule: Rule = {
        type: "conditional",
        when: {
          source: sourceType,
          field: selectedField,
          clause: selectedClause,
          value: clauseConfig?.needsValue ? clauseValue : undefined,
        },
        then: {
          type: selectedAction,
          value: actionConfig?.id === "set_value" ? actionValue : undefined,
          fromField:
            actionConfig?.id === "copy_field" ? actionValue : undefined,
          formula: actionConfig?.id === "formula" ? actionValue : undefined,
        },
      };

      addRule(headerName, newRule);
    } else {
      if (!selectedAction) {
        alert("Pilih aksi dulu");
        return;
      }

      const actionConfig = ACTIONS.find((a) => a.id === selectedAction);

      const newRule: Rule = {
        type: "direct",
        then: {
          type: selectedAction,
          value: actionConfig?.id === "set_value" ? actionValue : undefined,
          fromField:
            actionConfig?.id === "copy_field" ? actionValue : undefined,
          formula: actionConfig?.id === "formula" ? actionValue : undefined,
        },
      };

      addRule(headerName, newRule);
    }

    // Reset
    setSourceType("bukpot");
    setSelectedField("");
    setSelectedClause("");
    setClauseValue("");
    setSelectedAction("");
    setActionValue("");
  };

  return (
    <Dialog onOpenChange={setIsOpen} open={isOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="rounded-lg shadow-sm">
          {headerName}
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-2xl rounded-2xl shadow-lg">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">
            Aturan untuk <span className="text-primary">{headerName}</span>
          </DialogTitle>
        </DialogHeader>

        {/* Existing rules */}
        <div className="space-y-2 mb-6">
          <h3 className="text-sm font-medium text-gray-600">
            Daftar Rules Aktif
          </h3>
          {existingRules.length === 0 ? (
            <p className="text-sm text-gray-500 italic">
              Belum ada rule yang dibuat.
            </p>
          ) : (
            existingRules.map((r, i) => (
              <div
                key={i}
                className="p-3 border rounded-lg bg-gray-50 text-sm space-y-1"
              >
                {r.rules.map((rule, j) => (
                  <div key={j} className="flex items-start gap-1">
                    {rule.type === "conditional" ? (
                      <>
                        <span className="font-medium text-gray-700">When:</span>
                        <span>
                          {rule.when.field} ({rule.when.clause}
                          {rule.when.value ? ` ${rule.when.value}` : ""})
                        </span>
                        <span className="mx-1 text-gray-400">→</span>
                        <span className="font-medium text-gray-700">Then:</span>
                        <span>
                          {rule.then.type}{" "}
                          {rule.then.value ||
                            rule.then.fromField ||
                            rule.then.formula}
                        </span>
                      </>
                    ) : (
                      <>
                        <span className="font-medium text-gray-700">Then:</span>
                        <span>
                          {rule.then.type}{" "}
                          {rule.then.value ||
                            rule.then.fromField ||
                            rule.then.formula}
                        </span>
                      </>
                    )}
                  </div>
                ))}
              </div>
            ))
          )}
        </div>

        {/* New rule builder */}
        <div className="space-y-4">
          <h3 className="text-sm font-medium text-gray-600">
            Tambah Rule Baru
          </h3>
          <p className="text-xs text-gray-500 italic">
            Mengganti section dari bukti potong menjadi profil akan mengubah
            field sumber aksi.
          </p>
          <div className="flex items-center gap-4 mb-4">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                checked={ruleType === "conditional"}
                onChange={() => setRuleType("conditional")}
              />
              Dengan Kondisi (WHEN/THEN)
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                checked={ruleType === "direct"}
                onChange={() => setRuleType("direct")}
              />
              Tanpa Kondisi (Direct THEN)
            </label>
          </div>

          {/* WHEN */}
          <div className="p-4 border rounded-xl bg-gray-50 space-y-3">
            <span className="block text-xs uppercase text-gray-500 font-medium">
              Kondisi (WHEN)
            </span>
            <div className="flex flex-wrap gap-2 items-center">
              <Select
                value={sourceType}
                onValueChange={(v: "bukpot" | "profil") => setSourceType(v)}
              >
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Sumber" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bukpot">Bukti Potong</SelectItem>
                  <SelectItem value="profil">Profil</SelectItem>
                </SelectContent>
              </Select>

              <Select value={selectedField} onValueChange={setSelectedField}>
                <SelectTrigger className="w-[200px]">
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

              <Select value={selectedClause} onValueChange={setSelectedClause}>
                <SelectTrigger className="w-[220px]">
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

              {/* Dynamic input */}
              {(() => {
                const clauseCfg = CLAUSES.find((c) => c.id === selectedClause);
                if (!clauseCfg?.needsValue) return null;
                return (
                  <Input
                    type={clauseCfg.valueType}
                    placeholder="Masukkan nilai"
                    value={clauseValue}
                    onChange={(e) => setClauseValue(e.target.value)}
                    className="w-[140px]"
                  />
                );
              })()}
            </div>
          </div>

          {/* THEN */}
          <div className="p-4 border rounded-xl bg-gray-50 space-y-3">
            <span className="block text-xs uppercase text-gray-500 font-medium">
              Aksi (THEN)
            </span>
            <div className="flex flex-wrap gap-2 items-center">
              <Select value={selectedAction} onValueChange={setSelectedAction}>
                <SelectTrigger className="w-[200px]">
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

              {(() => {
                const actionCfg = ACTIONS.find((a) => a.id === selectedAction);
                if (!actionCfg?.needsValue) return null;

                if (actionCfg.valueType === "text") {
                  return (
                    <Input
                      placeholder="Masukkan nilai"
                      value={actionValue}
                      onChange={(e) => setActionValue(e.target.value)}
                      className="w-[220px]"
                    />
                  );
                }

                if (actionCfg.valueType === "select") {
                  return (
                    <Select value={actionValue} onValueChange={setActionValue}>
                      <SelectTrigger className="w-[220px]">
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
                  );
                }

                if (actionCfg.valueType === "formula") {
                  return (
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
                  );
                }

                return null;
              })()}
            </div>
          </div>
        </div>

        {/* Save */}
        <div className="mt-6 flex justify-end">
          <Button onClick={handleSave} className="px-6">
            Tambah Rule
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
