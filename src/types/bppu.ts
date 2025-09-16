export type BppuCoretax = {
  id: string,
  name: string;
  status: "pending" | "valid" | "error";
  errors?: BppuError[]
  data?: BppuData;
  file?: File;
};

export type BppuData = {
  nomorBukpot: string;
};

export type BppuError = {
  type: "duplicate" | "format"
  message: string,
  name?: string
  linkToId?: string
}
