export interface SourceCodeModel {
  language: string;
  sourcecode: string;
  file?: string;
  disableCache?: boolean;
}

export interface CodeScanResult {
    isSucured: boolean;
    msg?: string;
}
