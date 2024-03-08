import { SourceCodeModel } from "@app/core";

export abstract class SourceCodeFeaturBlockingStrategy {
  abstract scan(code:SourceCodeModel):boolean;
}
