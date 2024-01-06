import { BaseSourceCodeVerificator } from '@app/common';

const c = require('tree-sitter-c');

export class C12Verificator extends BaseSourceCodeVerificator {

  constructor() {
    super();
    this.parser.setLanguage(c);
  }

  protected isValid(code: string): boolean {
    const isValid = !this.hasErrorNode(this.parser.parse(code).rootNode);
    return isValid;
  }
}
