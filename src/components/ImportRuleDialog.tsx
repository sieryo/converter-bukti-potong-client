"use client";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRuleStore } from "@/store/useRuleStore";
import { Import } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";

export const ImportRuleDialog = () => {
  const { importAll } = useRuleStore();
  const [importedData, setImportedData] = useState("");

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith(".json")) {
      toast.error("File harus berformat .json");
      return;
    }

    const text = await file.text();
    setImportedData(text);
  };

  const handleImport = () => {
    try {
      importAll(importedData);
      toast.success("Rules berhasil di-import!");
    } catch (err) {
      console.error("Import rules gagal:", err);
      toast.error("Gagal import rules. Pastikan file valid.");
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <Import className="w-4 h-4" /> Import Rules
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>Import Rules</DialogTitle>
          <DialogDescription>
            Pilih file JSON untuk melakukan import rules.
          </DialogDescription>
        </DialogHeader>

        <div className="relative mt-4">
          <Input
            id="rules-file"
            type="file"
            accept="application/json"
            className="opacity-100 cursor-pointer"
            onChange={handleFileUpload}
          />
        </div>
        <div className=" flex justify-end">
          <Button
            onClick={() => {
              handleImport();
            }}
          >
            Import
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
