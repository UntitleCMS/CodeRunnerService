import { SourceCodeCleaningStrategy, SourceCodeModel } from '@app/core';
import { SyntaxNode } from 'tree-sitter';
const Parser = require('tree-sitter');

export abstract class BaseSourceCodeCleaner
  implements SourceCodeCleaningStrategy
{
  protected parser = new Parser();

  constructor() {}

  Clean(code: SourceCodeModel): SourceCodeModel {
    const tree = this.parser.parse(code.sourcecode);
    const x = this.clearCommentAndSpace(tree.rootNode);
    console.log(x);
    return {
      ...code,
      sourcecode: x,
    };
  }

  protected clearCommentAndSpace(node: SyntaxNode) {
    const cleanedCode: SyntaxNode[] = [];

    for (let n of node.children) {
      if (n.type != 'comment') {
        cleanedCode.push(n);
      }
    }

    const x = cleanedCode.reduce((acc, n) => acc + n.text + '\n', '');
    return x;
  }

  protected hasComment(node: SyntaxNode) {
    if (node.type.includes('comment')) return true;

    for (let n of node.children) {
      if (this.hasComment(n)) return true;
    }
    return false;
  }
}
