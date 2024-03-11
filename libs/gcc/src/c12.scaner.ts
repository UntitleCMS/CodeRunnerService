import { CodeScanResult, SourceCodeFeaturBlockingStrategy, SourceCodeModel } from '@app/core';
import { SyntaxNode, Tree } from 'tree-sitter';

const ALLOWED_HEADERS = [
  'assert.h',
  'complex.h',
  'ctype.h',
  'errno.h',
  'fenv.h',
  'float.h',
  'inttypes.h',
  'iso646.h',
  'limits.h',
  'locale.h',
  'math.h',
  'setjmp.h',
  'signal.h',
  'stdalign.h',
  'stdarg.h',
  'stdatomic.h',
  'stdbit.h',
  'stdbool.h',
  'stdckdint.h',
  'stddef.h',
  'stdint.h',
  'stdio.h',
  'stdlib.h',
  'stdnoreturn.h',
  'string.h',
  'tgmath.h',
  'threads.h',
  'time.h',
  'uchar.h',
  'wchar.h',
  'wctype.h',
  'unistd.h'
];

const BLOCK_FUN = [
  'fopen',
  'fopen_s',
  'ftell',
  'fgetops',
  'fseek',
  'fsetpos',
  'rewind',
  'remove',
  'rename',
  'tmpfile',
  'tempfile_s',
  'tmpname',
  'tmpname_s',
  'system',
  'getenv',
];

const c = require('tree-sitter-c');
const Parser = require('tree-sitter');

export class C12Scaner extends SourceCodeFeaturBlockingStrategy {
  private parser = new Parser();

  constructor() {
    super();
    this.parser.setLanguage(c);
  }

  isSecure(code: SourceCodeModel): boolean {
    return this.scan(code).isSucured;
  }

  scan(code: SourceCodeModel): CodeScanResult {
    const tree = this.parser.parse(code.sourcecode);

    const hd = this.isAllowedHeaders(tree);
    if (!hd.isSucured) return hd;

    const fn = this.isAllowedFn(tree.rootNode);
    return fn;
  }

  protected isAllowedFn(node: SyntaxNode): CodeScanResult {
    if (node.type.includes('call_expression')) {
      const fnName = node.child(0).text;
      if( BLOCK_FUN.includes(fnName) ){
        return {
          isSucured: false,
          msg: `Function "${fnName}" is not allowed`
        }
      }
    }

    if (node.type == 'declaration') {
      const pointer = node.text.match(/&\w+/);
      for (let p of pointer || []) {
        if (BLOCK_FUN.includes(p.slice(1, p.length))){
          return {
            isSucured: false,
            msg:`Not Allowed to point to "${p}"`
          };
        }
      }
    }

    for (let n of node.children) {
      const scanResult = this.isAllowedFn(n);
      if (!scanResult.isSucured) return scanResult;
    }
    return {
      isSucured: true
    };
  }

  protected isAllowedHeaders(tree: Tree): CodeScanResult {
    for (let n of tree.rootNode.children) {
      if (!n.type.includes('include')) continue;

      const lib = n.child(1).text.slice(1, -1);
      if (!ALLOWED_HEADERS.includes(lib)) {
        return {
          isSucured: false,
          msg: `Header file "${lib}" is not allowed`
        };
      }
    }

    return {
      isSucured: true
    };
  }
}
