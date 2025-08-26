import * as XLSX from "xlsx";

export class ExcelProcessor {
  private file: File;
  private headerRowNumber: number; // row number dimulai dari 1
  private workbook: XLSX.WorkBook | null = null;
  private sheet: XLSX.WorkSheet | null = null;
  private headerRowIndex: number = -1;
  private data: any[][] = [];

  constructor(file: File, headerRowNumber: number) {
    this.file = file;
    this.headerRowNumber = headerRowNumber;
  }

  async load(): Promise<void> {
    const data = await fileToArrayBuffer(this.file);
    this.workbook = XLSX.read(data, { type: "array" });

    const sheetName = this.workbook.SheetNames[0];
    this.sheet = this.workbook.Sheets[sheetName];
    this.data = XLSX.utils.sheet_to_json(this.sheet, { header: 1 }) as any[][];

    // convert rowNumber (1-based) ke index array (0-based)
    this.headerRowIndex = this.headerRowNumber - 1;

    if (
      this.headerRowIndex < 0 ||
      this.headerRowIndex >= this.data.length
    ) {
      throw new Error(
        `Header row number ${this.headerRowNumber} tidak valid`
      );
    }
  }

  getHeader(): string[] {
    if (this.headerRowIndex === -1) return [];

    const rawHeader = (this.data[this.headerRowIndex] as string[]).map((h) =>
      typeof h === "string" ? h.trim() : String(h ?? "")
    );

    // buat unique kalau ada duplikat
    const seen: Record<string, number> = {};
    return rawHeader.map((h) => {
      if (!seen[h]) {
        seen[h] = 1;
        return h;
      } else {
        seen[h] += 1;
        return `${h}_${seen[h]}`;
      }
    });
  }

  getRows(): any[][] {
    if (this.headerRowIndex === -1) return [];
    return this.data.slice(this.headerRowIndex + 1);
  }
}

function fileToArrayBuffer(file: File): Promise<ArrayBuffer> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result instanceof ArrayBuffer) {
        resolve(e.target.result);
      } else {
        reject(new Error("Gagal membaca file sebagai ArrayBuffer"));
      }
    };
    reader.onerror = (err) => reject(err);
    reader.readAsArrayBuffer(file);
  });
}
