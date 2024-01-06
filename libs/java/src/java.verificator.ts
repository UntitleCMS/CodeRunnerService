import { BaseSourceCodeVerificator } from '@app/common';

const java = require('tree-sitter-java');

export class JavaVerificator extends BaseSourceCodeVerificator {

  constructor() {
    super();
    this.parser.setLanguage(java);
  }

  protected isValid(code: string): boolean {
    const isValid = !this.hasErrorNode(this.parser.parse(code).rootNode);
    return isValid;
  }
}
