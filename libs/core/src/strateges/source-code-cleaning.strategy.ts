import { SourceCodeModel } from "@app/core";

export abstract class SourceCodeCleaningStrategy {
  /**
   * @param code code to validate systax
   */
  abstract Clean(code:SourceCodeModel):SourceCodeModel;
}
