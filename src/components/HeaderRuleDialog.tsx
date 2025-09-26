"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
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
import { toast } from "sonner";
import type { Header } from "@/lib/ExcelProcessor";

/* ---------- CONFIG ---------- */
const CLAUSES = [
  { id: "equals", label: "Sama dengan", needsValue: true, valueType: "text" },
  {
    id: "not_equals",
    label: "Tidak sama dengan",
    needsValue: true,
    valueType: "text",
  },
  { id: "empty", label: "Kosong", needsValue: false },
  { id: "not_empty", label: "Tidak kosong", needsValue: false },
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

const FORMULAS = [
  { id: "today", label: "Tanggal Hari Ini" },
  { id: "yesterday", label: "Kemarin" },
  { id: "get_bulan_sekarang_field", label: "Bulan Sekarang dari Field" },
  { id: "get_bulan_sebelumnya_field", label: "Bulan Sebelumnya dari Field" },
  { id: "get_tahun_sekarang_field", label: "Tahun Sekarang dari Field" },
] as const;

const ConditionForm = ({
  sourceType,
  setSourceType,
  selectedField,
  setSelectedField,
  selectedClause,
  setSelectedClause,
  compareType,
  setCompareType,
  clauseValue,
  setClauseValue,
  bukpotOptions,
  profileOptions,
}: any) => {
  const fieldOptions = sourceType === "bukpot" ? bukpotOptions : profileOptions;

  console.log

  return (
    <div className="p-4 border rounded-xl bg-gray-50 space-y-3">
      <span className="block text-xs uppercase text-gray-500 font-medium">
        Kondisi (WHEN)
      </span>

      {/* Pilih Field */}
      <div className="flex flex-wrap gap-2">
        <Select value={sourceType} onValueChange={setSourceType}>
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
            {fieldOptions.map((f: any, i: number) => (
              <SelectItem key={i} value={f.name}>
                {f.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Pilih Clause */}
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

      {/* Compare Type */}
      {selectedClause &&
        ["greater_than", "less_equal", "equals", "not_equals"].includes(selectedClause) && (
          <div className="flex flex-wrap gap-2 items-center">
            <Select value={compareType} onValueChange={setCompareType}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Tipe Pembanding" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="set_value">Set Value</SelectItem>
                <SelectItem value="bukpot">Bukti Potong</SelectItem>
                <SelectItem value="profil">Profil</SelectItem>
              </SelectContent>
            </Select>

            {compareType === "set_value" && (
              <Input
                type="text"
                placeholder="Masukkan nilai"
                value={clauseValue}
                onChange={(e) => setClauseValue(e.target.value)}
                className="w-[140px]"
              />
            )}

            {["bukpot", "profil"].includes(compareType) && (
              <Select value={clauseValue} onValueChange={setClauseValue}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder={`Pilih Field ${compareType}`} />
                </SelectTrigger>
                <SelectContent>
                  {(compareType === "bukpot"
                    ? bukpotOptions
                    : profileOptions
                  ).map((f: any, i: number) => (
                    <SelectItem key={i} value={f.name}>
                      {f.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>
        )}
    </div>
  );
};

const ActionForm = ({
  selectedAction,
  setSelectedAction,
  actionValue,
  setActionValue,
  actionSourceType,
  setActionSourceType,
  actionFieldOptions,
  actionField,
  setActionField,
}: any) => {
  const actionCfg = ACTIONS.find((a) => a.id === selectedAction);

  const allowedFormats = ["date"];

  return (
    <div className="p-4 border rounded-xl bg-gray-50 space-y-3">
      <span className="block text-xs uppercase text-gray-500 font-medium">
        Aksi (THEN)
      </span>

      {/* Pilih Action */}
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

      {/* Action Value */}
      {actionCfg?.needsValue && (
        <>
          {actionCfg.valueType === "text" && (
            <Input
              placeholder="Masukkan nilai"
              value={actionValue}
              onChange={(e) => setActionValue(e.target.value)}
              className="w-[220px]"
            />
          )}

          {actionCfg.valueType === "select" && (
            <div className="flex gap-3">
              <Select
                value={actionSourceType}
                onValueChange={setActionSourceType}
              >
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Section" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bukpot">Bukti Potong</SelectItem>
                  <SelectItem value="profil">Profil</SelectItem>
                </SelectContent>
              </Select>

              <Select value={actionValue} onValueChange={setActionValue}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Pilih Field" />
                </SelectTrigger>
                <SelectContent>
                  {actionFieldOptions.map((f: any, i: number) => (
                    <SelectItem key={i} value={f.name}>
                      {f.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {actionCfg.valueType === "formula" && (
            <>
              {/* Dropdown pilih formula */}
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

              {actionValue?.includes("field") && (
                <div className="flex gap-3">
                  <Select
                    value={actionSourceType}
                    onValueChange={setActionSourceType}
                  >
                    <SelectTrigger className="w-[200px]">
                      <SelectValue placeholder="Section" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="bukpot">Bukti Potong</SelectItem>
                      <SelectItem value="profil">Profil</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={actionField} onValueChange={setActionField}>
                    <SelectTrigger className="w-[200px]">
                      <SelectValue placeholder="Pilih Field" />
                    </SelectTrigger>
                    <SelectContent>
                      {actionFieldOptions
                        .filter((f: Header) =>
                          allowedFormats.includes(f.dataFormat || "string")
                        )
                        .map((f: any, i: number) => (
                          <SelectItem key={i} value={f.name}>
                            {f.name}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
};

export const HeaderRuleDialog: React.FC<{
  header: Header;
  bukpotOptions: Header[];
  isOpen: boolean;
  setIsOpen: (val: boolean) => void;
}> = ({ header, bukpotOptions, isOpen, setIsOpen }) => {
  const { fieldRules, addFieldRule } = useRuleStore();
  const profile = useProfileStore((s) => s.getActiveProfile)();

  console.log(fieldRules);

  const [ruleType, setRuleType] = useState<"conditional" | "direct">(
    "conditional"
  );
  const [sourceType, setSourceType] = useState<"bukpot" | "profil">("bukpot");
  const [selectedField, setSelectedField] = useState("");
  const [selectedClause, setSelectedClause] = useState("");
  const [clauseValue, setClauseValue] = useState("");
  const [compareType, setCompareType] = useState("");
  const [selectedAction, setSelectedAction] = useState("");
  const [actionValue, setActionValue] = useState("");
  const [actionSourceType, setActionSourceType] = useState<"bukpot" | "profil">(
    "bukpot"
  );
  const [actionField, setActionField] = useState("");

  if (!profile) return null;

  const profileOptions = mapProfileToLabel(profile);
  const actionFieldOptions =
    actionSourceType === "bukpot" ? bukpotOptions : profileOptions;

  const resetForm = () => {
    setRuleType("conditional");
    setSourceType("bukpot");
    setSelectedField("");
    setSelectedClause("");
    setClauseValue("");
    setCompareType("");
    setSelectedAction("");
    setActionValue("");
    setActionSourceType("bukpot");
  };

  const handleSave = () => {
    if (!selectedAction) return alert("Pilih aksi dulu");

    const actionCfg = ACTIONS.find((a) => a.id === selectedAction);

    let fromField: any;

    if (actionCfg?.id === "copy_field") {
      fromField = { source: actionSourceType, field: actionValue };
    }

    if (actionCfg?.id === "formula") {
      if (actionField) {
        fromField = { source: actionSourceType, field: actionField };
      }
    }

    const newRule: Rule =
      ruleType === "conditional"
        ? {
            type: "conditional",
            when: {
              source: sourceType,
              field: selectedField,
              clause: selectedClause,
              compareWith: { type: compareType, value: clauseValue },
            },
            then: {
              action: selectedAction,
              value: actionCfg?.id === "set_value" ? actionValue : undefined,
              from: fromField,
              formula: actionCfg?.id === "formula" ? actionValue : undefined,
            },
          }
        : {
            type: "direct",
            then: {
              action: selectedAction,
              value: actionCfg?.id === "set_value" ? actionValue : undefined,
              from: fromField,
              formula: actionCfg?.id === "formula" ? actionValue : undefined,
            },
          };

    addFieldRule(header.name, newRule);
    resetForm();
    toast.success("Rule berhasil ditambahkan!");
  };

  return (
    <Dialog onOpenChange={setIsOpen} open={isOpen}>
      <DialogContent className="max-w-2xl rounded-2xl shadow-lg">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">
            Aturan untuk <span className="text-primary">{header.name}</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <h3 className="text-sm font-medium text-gray-600">
            Tambah Rule Baru
          </h3>
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

          {ruleType === "conditional" && (
            <ConditionForm
              sourceType={sourceType}
              setSourceType={setSourceType}
              selectedField={selectedField}
              setSelectedField={setSelectedField}
              selectedClause={selectedClause}
              setSelectedClause={setSelectedClause}
              compareType={compareType}
              setCompareType={setCompareType}
              clauseValue={clauseValue}
              setClauseValue={setClauseValue}
              bukpotOptions={bukpotOptions}
              profileOptions={profileOptions}
            />
          )}

          <ActionForm
            selectedAction={selectedAction}
            setSelectedAction={setSelectedAction}
            actionValue={actionValue}
            setActionValue={setActionValue}
            actionSourceType={actionSourceType}
            setActionSourceType={setActionSourceType}
            actionFieldOptions={actionFieldOptions}
            actionField={actionField}
            setActionField={setActionField}
          />
        </div>

        <div className="mt-6 flex justify-end">
          <Button onClick={handleSave} className="px-6">
            Tambah Rule
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
