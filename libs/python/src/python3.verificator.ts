import { BaseSourceCodeVerificator } from '@app/common';

const python = require('tree-sitter-python');

export class Python3Verificator extends BaseSourceCodeVerificator {

  constructor() {
    super();
    this.parser.setLanguage(python);
  }

  protected isValid(code: string): boolean {
    const isValid = !this.hasErrorNode(this.parser.parse(code).rootNode);
    return isValid;
  }
}
