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
    label: "Copy Value dari Field",
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
  bukpotOptions: string[];
  isOpen: boolean;
  setIsOpen: (val: boolean) => void;
}

export const HeaderRuleDialog: React.FC<HeaderRuleDialogProps> = ({
  headerName,
  bukpotOptions,
  isOpen,
  setIsOpen,
}) => {
  const { fieldRules, addFieldRule } = useRuleStore();
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
  const [compareType, setCompareType] = useState("");
  const [actionSourceType, setActionSourceType] = useState<"bukpot" | "profil">(
    "bukpot"
  );

  if (!profile) {
    return null;
  }

  console.log(profile);

  const profileOptions = mapProfileToLabel(profile);

  const fieldOptions = sourceType === "bukpot" ? bukpotOptions : profileOptions;
  const actionFieldOptions =
    actionSourceType === "bukpot" ? bukpotOptions : profileOptions;
  const existingRules = fieldRules.filter((f) => f.header === headerName);

  const handleSave = () => {
    if (ruleType === "conditional") {
      if (!selectedField || !selectedClause || !selectedAction) {
        alert("Lengkapi semua bagian rule dulu");
        return;
      }

      const actionConfig = ACTIONS.find((a) => a.id === selectedAction);

      const newRule: Rule = {
        type: "conditional",
        when: {
          source: sourceType,
          field: selectedField,
          clause: selectedClause,
          compareWith: {
            type: compareType,
            value: clauseValue,
          },
        },
        then: {
          type: selectedAction,
          value: actionConfig?.id === "set_value" ? actionValue : undefined,
          fromField:
            actionConfig?.id === "copy_field" ? actionValue : undefined,
          formula: actionConfig?.id === "formula" ? actionValue : undefined,
        },
      };

      addFieldRule(headerName, newRule);
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

      addFieldRule(headerName, newRule);
    }

    // Reset
    setSourceType("bukpot");
    setSelectedField("");
    setSelectedClause("");
    setClauseValue("");
    setSelectedAction("");
    setActionValue("");
    setCompareType("");
    setActionSourceType("bukpot");
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
                          {rule.when.compareWith.value
                            ? ` ${rule.when.compareWith.value}`
                            : ""}
                          )
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

        <div className="space-y-4">
          <h3 className="text-sm font-medium text-gray-600">
            Tambah Rule Baru
          </h3>
          <p className="text-xs text-gray-500 italic">
            Field sumber aksi akan menyesuaikan saat section diganti dari Bukti
            Potong menjadi Profil.
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
              <div>
                <p className="text-xs text-gray-500 italic pl-2 pb-1">
                  Pilih Field sumber
                </p>
                <div className=" flex flex-wrap gap-2">
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

                  <Select
                    value={selectedField}
                    onValueChange={setSelectedField}
                  >
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
                </div>

                <div className=" ">
                  <p className="text-xs text-gray-500 italic pl-2 pb-1">
                    Pilih Kondisi
                  </p>
                  <div className=" flex flex-wrap gap-2">
                    <div>
                      <Select
                        value={selectedClause}
                        onValueChange={setSelectedClause}
                      >
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
                    </div>
                  </div>
                </div>
              </div>
              {selectedClause !== "" && (
                <div>
                  {[
                    "equals",
                    "not_equals",
                    "greater_than",
                    "less_equal",
                  ].includes(selectedClause) && (
                    <div>
                      <p className="text-xs text-gray-500 italic pl-2 pb-1">
                        Pilih Tipe Pembanding
                      </p>
                      <div className="flex flex-wrap gap-2 items-center">
                        <Select
                          value={compareType}
                          onValueChange={(value) => {
                            const v: any = value;
                            setCompareType(v);
                          }}
                        >
                          <SelectTrigger className="w-[200px]">
                            <SelectValue placeholder="Tipe Pembanding" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="set_value">Set Value</SelectItem>
                            <SelectItem value="bukpot_field">
                              Bukti Potong
                            </SelectItem>
                            <SelectItem value="profil_field">Profil</SelectItem>
                          </SelectContent>
                        </Select>

                        {(() => {
                          const clauseCfg = CLAUSES.find(
                            (c) => c.id === selectedClause
                          );
                          if (!clauseCfg?.needsValue) return null;
                          if (compareType !== "set_value") return null;
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

                        {compareType === "bukpot_field" && (
                          <Select
                            value={clauseValue}
                            onValueChange={setClauseValue}
                          >
                            <SelectTrigger className="w-[200px]">
                              <SelectValue placeholder="Pilih Field Bukpot" />
                            </SelectTrigger>
                            <SelectContent>
                              {bukpotOptions.map((f, i) => (
                                <SelectItem key={i} value={f}>
                                  {f}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        )}

                        {compareType === "profil_field" && (
                          <Select
                            value={clauseValue}
                            onValueChange={setClauseValue}
                          >
                            <SelectTrigger className="w-[200px]">
                              <SelectValue placeholder="Pilih Field Profil" />
                            </SelectTrigger>
                            <SelectContent>
                              {profileOptions.map((f, i) => (
                                <SelectItem key={i} value={f}>
                                  {f}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* THEN */}
          <div className="p-4 border rounded-xl bg-gray-50 space-y-3">
            <span className="block text-xs uppercase text-gray-500 font-medium">
              Aksi (THEN)
            </span>
            <div className=" space-y-3">
              <div>
                <div>
                  <Select
                    value={selectedAction}
                    onValueChange={setSelectedAction}
                  >
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
                </div>
              </div>

              {(() => {
                const actionCfg = ACTIONS.find((a) => a.id === selectedAction);
                if (!actionCfg?.needsValue) return null;

                if (actionCfg.valueType === "text") {
                  return (
                    <div>
                      <p className="text-xs text-gray-500 italic pl-2 pb-1">
                        Value
                      </p>
                      <Input
                        placeholder="Masukkan nilai"
                        value={actionValue}
                        onChange={(e) => setActionValue(e.target.value)}
                        className="w-[220px]"
                      />
                    </div>
                  );
                }

                if (actionCfg.valueType === "select") {
                  return (
                    <div>
                      <p className="text-xs text-gray-500 italic pl-2 pb-1">
                        Value
                      </p>
                      <div className=" flex   gap-3">
                        <Select
                          value={actionSourceType}
                          onValueChange={(v: "bukpot" | "profil") =>
                            setActionSourceType(v)
                          }
                        >
                          <SelectTrigger className="w-[200px]">
                            <SelectValue placeholder="Pilih Section Sumber" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="bukpot">Bukti Potong</SelectItem>
                            <SelectItem value="profil">Profil</SelectItem>
                          </SelectContent>
                        </Select>

                        <Select
                          value={actionValue}
                          onValueChange={setActionValue}
                        >
                          <SelectTrigger className="w-[200px]">
                            <SelectValue placeholder="Pilih Field Sumber" />
                          </SelectTrigger>
                          <SelectContent>
                            {actionFieldOptions.map((f, i) => (
                              <SelectItem key={i} value={f}>
                                {f}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  );
                }

                if (actionCfg.valueType === "formula") {
                  return (
                    <div>
                      <p className="text-xs text-gray-500 italic pl-2 pb-1">
                        Value
                      </p>
                      <Select
                        value={actionValue}
                        onValueChange={setActionValue}
                      >
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
                    </div>
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
