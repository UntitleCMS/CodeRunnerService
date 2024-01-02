import { SourceCodeModel } from "@app/core";

export abstract class SourceCodeVerificatorStrategy {
  /**
   * @param code code to validate systax
   */
  abstract verify(code:SourceCodeModel):boolean;
}
