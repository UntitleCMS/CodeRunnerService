import { ProcessSubject, SourceCodeModel } from "@app/core";

export abstract class CodeRunnerStrategy {
  /**
   * @param code code to run
   * @return progress I/O subject
   */
  abstract execute(code:SourceCodeModel): ProcessSubject;
}
