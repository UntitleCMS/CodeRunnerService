import { BaseSourceCodeCleaner, BaseSourceCodeVerificator } from '@app/common';
import { SourceCodeModel } from '@app/core';

const python = require('tree-sitter-python');

export class Python3Cleaner extends BaseSourceCodeCleaner {

  constructor() {
    super();
    this.parser.setLanguage(python);
  }
}
