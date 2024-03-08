export interface SourceCodeModel {
  language: string;
  sourcecode: string;
  file?: string;
}

export interface CodeScanResult {
    isSucured: boolean;
    msg?: string;
}
