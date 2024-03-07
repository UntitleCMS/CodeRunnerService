import { BaseSourceCodeCleaner } from '@app/common';
import { SourceCodeModel } from '@app/core';
import { SyntaxNode } from 'tree-sitter';

const java = require('tree-sitter-java');

export class JavaCleaner extends BaseSourceCodeCleaner {
  constructor() {
    super();
    this.parser.setLanguage(java);
  }

  override clearCommentAndSpace(node:SyntaxNode) {
    if (!this.hasComment(node)) {
      return node.text + ' ';
    }

    if (node.type.includes('comment')) {
      return '';
    }

    let x = '';
    for (let n of node.children) {
      x += this.clearCommentAndSpace(n);
    }

    return x;
  }
}
