import { BaseSourceCodeCleaner } from '@app/common';
import { SyntaxNode } from 'tree-sitter';

const c = require('tree-sitter-c');

export class C12Cleaner extends BaseSourceCodeCleaner {

  constructor() {
    super();
    this.parser.setLanguage(c);
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
