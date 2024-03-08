import { CodeScanResult, SourceCodeModel } from "@app/core";

export abstract class SourceCodeFeaturBlockingStrategy {
  abstract isSecure(code:SourceCodeModel):boolean;
  abstract scan(code:SourceCodeModel):CodeScanResult;
}
