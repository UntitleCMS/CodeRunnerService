import { SourceCodeModel, SourceCodeVerificatorStrategy } from "@app/core";
import { SyntaxNode } from "tree-sitter";

export abstract class BaseSourceCodeVerificator implements SourceCodeVerificatorStrategy {

  constructor(){}

  protected abstract isValid(code: string): boolean

  verify(code: SourceCodeModel) {
    return this.isValid(code.sourcecode);
  }

  protected hasErrorNode(node: SyntaxNode) {
    if (node.hasError()) return true;
    for (const child of node.children) {
      if (this.hasErrorNode(child)) return true;
    }
    return false;
  }

}
