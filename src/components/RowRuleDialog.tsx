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
import { useRuleStore, type RowFilter } from "@/store/useRuleStore";
import { useProfileStore } from "@/store/useProfileStore";
import { mapProfileToLabel } from "@/utils/helper";
import { toast } from "sonner";
import type { Header } from "@/lib/ExcelProcessor";

/* ---------- CLAUSES CONFIG ---------- */
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

interface RowRuleDialogProps {
  bukpotOptions: Header[];
  isOpen: boolean;
  setIsOpen: (val: boolean) => void;
}

export const RowRuleDialog: React.FC<RowRuleDialogProps> = ({
  bukpotOptions,
  isOpen,
  setIsOpen,
}) => {
  const { addRowFilter, rowFilters } = useRuleStore();
  const profile = useProfileStore((s) => s.getActiveProfile)();

  const [sourceType, setSourceType] = useState<"bukpot" | "profil">("bukpot");
  const [selectedField, setSelectedField] = useState("");
  const [selectedClause, setSelectedClause] = useState("");
  const [clauseValue, setClauseValue] = useState("");
  const [compareType, setCompareType] = useState("");
  const [compareValue, setCompareValue] = useState("");

  if (!profile) {
    return null;
  }

  const profileOptions = mapProfileToLabel(profile);
  const fieldOptions = sourceType === "bukpot" ? bukpotOptions : profileOptions;

  const handleSave = () => {
    if (!selectedField || !selectedClause) {
      alert("Lengkapi semua bagian filter dulu");
      return;
    }

    const newFilter: RowFilter = {
      source: sourceType,
      field: selectedField,
      clause: selectedClause,
      compareWith: {
        type: compareType,
        value: compareValue,
      },
    };

    addRowFilter(newFilter);

    // Reset
    setSourceType("bukpot");
    setSelectedField("");
    setSelectedClause("");
    setClauseValue("");
    setCompareType("");
    setCompareValue("");

    toast.success("Filter berhasil ditambahkan!");
  };

  return (
    <Dialog onOpenChange={setIsOpen} open={isOpen}>
      <DialogContent className="max-w-2xl rounded-2xl shadow-lg">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">
            Aturan Filter Row
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-2 mb-6">
          <h3 className="text-sm font-medium text-gray-600">
            Daftar Filter Aktif
          </h3>
          {rowFilters.length === 0 ? (
            <p className="text-sm text-gray-500 italic">
              Belum ada filter row yang dibuat.
            </p>
          ) : (
            rowFilters.map((f, i) => (
              <div
                key={i}
                className="p-3 border rounded-lg bg-gray-50 text-sm space-y-1"
              >
                <span className="font-medium text-gray-700">When:</span>{" "}
                <span>
                  {f.source}.{f.field} ({f.clause}) {f.compareWith.type}.
                  {f.compareWith.value}
                </span>
              </div>
            ))
          )}
        </div>

        <div className="space-y-4">
          <h3 className="text-sm font-medium text-gray-600">
            Tambah Filter Baru
          </h3>
          <div className="p-4 border rounded-xl bg-gray-50 space-y-3">
            <span className="block text-xs uppercase text-gray-500 font-medium">
              Kondisi Filter (WHEN)
            </span>
            <div className=" space-y-3">
              <div className=" ">
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
                        <SelectItem key={i} value={f.name}>
                          {f.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <p className="text-xs text-gray-500 italic pl-2 pb-1">
                  Pilih Kondisi
                </p>
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

              {selectedClause !== "" && (
                <div>
                  <p className="text-xs text-gray-500 italic pl-2 pb-1">
                    Pilih Tipe Pembanding
                  </p>
                  {[
                    "equals",
                    "not_equals",
                    "greater_than",
                    "less_equal",
                  ].includes(selectedClause) && (
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
                          <SelectItem value="bukpot">Bukti Potong</SelectItem>
                          <SelectItem value="profil">Profil</SelectItem>
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

                      {compareType === "bukpot" && (
                        <Select
                          value={compareValue}
                          onValueChange={setCompareValue}
                        >
                          <SelectTrigger className="w-[200px]">
                            <SelectValue placeholder="Pilih Field Bukpot" />
                          </SelectTrigger>
                          <SelectContent>
                            {bukpotOptions.map((f, i) => (
                              <SelectItem key={i} value={f.name}>
                                {f.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}

                      {compareType === "profil" && (
                        <Select
                          value={compareValue}
                          onValueChange={setCompareValue}
                        >
                          <SelectTrigger className="w-[200px]">
                            <SelectValue placeholder="Pilih Field Profil" />
                          </SelectTrigger>
                          <SelectContent>
                            {profileOptions.map((f, i) => (
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
              )}
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <Button onClick={handleSave} className="px-6">
            Tambah Filter
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
