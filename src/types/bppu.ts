export type BppuCoretax = {
  id: string;
  name: string;
  status: "pending" | "valid" | "error";
  errors?: BppuError[];
  data?: BppuData;
  file?: File;
};

export type BppuData = {
  nomorBukpot: string;
};

export type BppuError = {
  type: "duplicate" | "format";
  message: string;
  name?: string;
  linkToId?: string;
};

export type BppuDataApi = {
  id: string;
  name: string;
  nomorBukpot: string;
  error?: BppuError;
};

export type BppuValidation = {
  duplicates: string[];
  results: BppuDataApi[];
  success: boolean
  totalFiles: 9
  uniqueNomorBukpot: string[]
};
