import * as XLSX from "xlsx";

export interface Header {
  name: string;
  dataFormat: string | null;
}

export class ExcelProcessor {
  private file: File | null;
  private headerRowNumber: number;
  private workbook: XLSX.WorkBook | null = null;
  private sheet: XLSX.WorkSheet | null = null;
  private headerRowIndex: number = -1;
  private data: any[][] = [];

  constructor(headerRowNumber: number, file?: File) {
    this.file = file ?? null;
    this.headerRowNumber = headerRowNumber;
  }

  async load(): Promise<void> {
    if (!this.file) throw new Error("File tidak tersedia");

    const data = await fileToArrayBuffer(this.file);
    this.processWorkbook(data);
  }

  async loadFromUrl(url: string): Promise<void> {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Gagal fetch file dari ${url}`);
    const buf = await res.arrayBuffer();
    this.processWorkbook(buf);
  }

  private processWorkbook(buf: ArrayBuffer) {
    this.workbook = XLSX.read(buf, { type: "array" });

    const sheetName = this.workbook.SheetNames[0];
    this.sheet = this.workbook.Sheets[sheetName];
    this.data = XLSX.utils.sheet_to_json(this.sheet, { header: 1 }) as any[][];

    this.headerRowIndex = this.headerRowNumber - 1;

    if (this.headerRowIndex < 0 || this.headerRowIndex >= this.data.length) {
      throw new Error(`Header row number ${this.headerRowNumber} tidak valid`);
    }
  }

  getHeader(): Header[] {
    if (this.headerRowIndex === -1) return [];

    const rawHeader = (this.data[this.headerRowIndex] as string[]).map((h) =>
      typeof h === "string" ? h.trim() : String(h ?? "")
    );

    // buat unique kalau ada duplikat
    const seen: Record<string, number> = {};
    const uniqueHeader = rawHeader.map((h) => {
      if (!seen[h]) {
        seen[h] = 1;
        return h;
      } else {
        seen[h] += 1;
        return `${h}_${seen[h]}`;
      }
    });

    return uniqueHeader.map((name, colIdx) => ({
      name,
      dataFormat: this.detectColumnFormat(colIdx),
    }));
  }

  private detectColumnFormat(colIdx: number): string | null {
    const rows = this.getRows();
    const values = rows
      .map((r) => r[colIdx])
      .filter((v) => v != null && v !== "");

    if (values.length === 0) return null;

    let numberCount = 0;
    let dateCount = 0;

    for (const v of values) {
      if (typeof v === "number") {
        const parsed = XLSX.SSF.parse_date_code(v);
        if (parsed) {
          dateCount++;
          continue;
        }
        numberCount++;
        continue;
      }

      if (!isNaN(Number(v))) {
        numberCount++;
        continue;
      }

      const d = new Date(v);
      if (!isNaN(d.getTime())) {
        dateCount++;
      }
    }

    if (dateCount / values.length > 0.7) return "date";
    if (numberCount / values.length > 0.7) return "number";

    return "string";
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
