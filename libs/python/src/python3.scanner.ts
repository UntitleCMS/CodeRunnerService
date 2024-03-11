import {
  CodeScanResult,
  SourceCodeFeaturBlockingStrategy,
  SourceCodeModel,
} from '@app/core';
import { SyntaxNode } from 'tree-sitter';

const Parser = require('tree-sitter');
const python = require('tree-sitter-python');

const BLOCK_MODULES = [
  'importlib',
  'pathlib',
  'os.path',
  'fileinput',
  'stat',
  'filecmp',
  'tmpfile',
  'glob',
  'fnmatch',
  'linecache',
  'shutil',
  'pickle',
  'copyreg',
  'shelve',
  'marshal',
  'dbm',
  'sqlite3',
  'zlib',
  'gzip',
  'Bz2',
  'lzma',
  'zipfile',
  'tarfile',
  'wave	',
  'os',
  'argparse',
  'getopt',
  'platform',
  'ctypes',
  'threading',
  'multiprocessing',
  'subprocess',
  'sched',
  '_thred',
  'sys',
  'sysconfig',
  'socket',
  'email',
  'mailbox',
  'webbrowser',
  'wsgiref',
  'urllib',
  'http',
  'ftplib',
  'piplib',
  'imaplib',
  'smtplib',
  'socketserver',
  'xmlrpc',
  'ipaddress',
];

const BLOCK_FUN = ['open'];

export class Python3Scanner extends SourceCodeFeaturBlockingStrategy {
  private parser = new Parser();

  constructor() {
    super();
    this.parser.setLanguage(python);
  }

  isSecure(code: SourceCodeModel): boolean {
    return this.scan(code).isSucured;
  }
  scan(code: SourceCodeModel): CodeScanResult {
    const tree = this.parser.parse(code.sourcecode);
    const moduleScan = this.isAllowedModule(tree.rootNode);
    if (!moduleScan.isSucured) return moduleScan;
    return this.isAllowedFun(tree.rootNode);
  }

  private isAllowedModule(node: SyntaxNode): CodeScanResult {
    if (node.type == 'import_statement') {
      const pkg = node
        .child(1)
        .text.replace(/\s*as\s*.+/, '')
        .split('.');
      for (let p of pkg) {
        if (BLOCK_MODULES.includes(p))
          return {
            isSucured: false,
            msg: `Module "${p}" is not allowed`,
          };
      }
    }

    if (node.type == 'import_from_statement') {
      // console.log(node.childCount, node.text, `(${node.type})`);
      const pkg = node.child(1).text;
      const pkg2 = node.child(3).text;
      if (BLOCK_MODULES.includes(pkg))
        return {
          isSucured: false,
          msg: `Module "${pkg}" is not allowed`,
        };
      if (BLOCK_MODULES.includes(pkg2))
        return {
          isSucured: false,
          msg: `Package "${pkg2}" is not allowed`,
        };
      // console.log([pkg,pkg2]);
    }

    for (let n of node.children) {
      const res = this.isAllowedModule(n);
      if (!res.isSucured) return res;
    }
    return { isSucured: true };
  }

  private isAllowedFun(node: SyntaxNode): CodeScanResult {
    if (node.type == 'call') {
      const fn = node.child(0);
      if (fn.type == 'identifier') {
        const fnName = fn.text;
        if (BLOCK_FUN.includes(fnName))
          return {
            isSucured: false,
            msg: `Function "${fnName}" is not allowed`,
          };
      }
    }

    for (let n of node.children) {
      const res = this.isAllowedFun(n);
      if (!res.isSucured) return res;
    }

    return { isSucured: true };
  }
}
