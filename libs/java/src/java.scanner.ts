import {
  CodeScanResult,
  SourceCodeFeaturBlockingStrategy,
  SourceCodeModel,
} from '@app/core';
import { SyntaxNode, Tree } from 'tree-sitter';

const java = require('tree-sitter-java');
const Parser = require('tree-sitter');

const ALLOWED_PACKAGES = [
  'java.lang',
  'java.io',
  'java.io',
  'java.math',
  'java.nio',
  'java.security',
  'java.text',
  'java.time',
  'java.util',
  'javax.crypto',
];

const NOT_ALLOWED_CLASSES = ['java.io.File', 'File'];

export class Java17Scanner extends SourceCodeFeaturBlockingStrategy {
  private parser = new Parser();

  constructor() {
    super();
    this.parser.setLanguage(java);
  }

  isSecure(code: SourceCodeModel): boolean {
    return this.scan(code).isSucured;
  }
  scan(code: SourceCodeModel): CodeScanResult {
    const tree = this.parser.parse(code.sourcecode);
    const r1 = this.isAllowedPackages(tree);
    if(!r1.isSucured)
      return r1;
    return this.isAllowedClass(tree.rootNode);
  }

  private isAllowedPackages(tree: Tree): CodeScanResult {
    for (let n of tree.rootNode.children) {
      if (!n.type.includes('import')) continue;

      for (let i of n.children) {
        if (
          !i.type.includes('identifier') &&
          !i.type.includes('scoped_identifier')
        )
          continue;

        const pkg = i.text.split('.').slice(0, 2).join('.');
        const isInWiteList = ALLOWED_PACKAGES.includes(pkg);
        if (!isInWiteList)
          return {
            isSucured: false,
            msg: `Package "${pkg}" is not allowed`,
          };
        const isInBlackList = NOT_ALLOWED_CLASSES.includes(i.text);
        if (isInBlackList)
          return {
            isSucured: false,
            msg: `Class "${i.text}" is not allowed`,
          };
      }
    }
    return { isSucured: true };
  }

  private isAllowedClass(node: SyntaxNode):CodeScanResult  {
    if (node.type == 'object_creation_expression') {
      const className = node.children.filter(
        (i) => i.type == 'type_identifier',
      )[0].text;
      for(let i of NOT_ALLOWED_CLASSES){
        if (className.startsWith(i))
          return {
            isSucured: false,
            msg: `Class "${className}" is not allowed`
          };
      }
    }

    for (let n of node.children) {
      const x = this.isAllowedClass(n);
      if (!x.isSucured) {
        return x;
      }
    }
    return {isSucured:true};
  }
}
