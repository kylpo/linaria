/* @flow weak */
/* eslint-disable class-methods-use-this, import/no-extraneous-dependencies */

const babel = require('babel-core');
const { Asset } = require('parcel-bundler');

module.exports = class LinariaAsset extends Asset {
  type = 'js';

  getBabelFile() {
    this.babelFile =
      this.babelFile ||
      new babel.File({ filename: this.name }, new babel.Pipeline());

    return this.babelFile;
  }

  parse(code) {
    return this.getBabelFile().parser(code);
  }

  async pretransform() {
    const { ast, code } = await babel.transformFromAst(
      this.ast,
      this.contents,
      {
        filename: this.name,
        sourceMaps: true,
        presets: [require.resolve('../../../babel.js')],
        parserOpts: this.getBabelFile().parserOpts,
        babelrc: false,
      }
    );

    this.ast = ast;
    this.isAstDirty = true;
    this.outputCode = code;
  }

  collectDependencies() {
    this.ast.comments
      .filter(c => c.value.startsWith('linaria-dependency:'))
      .forEach(c => {
        const dep = c.value.split(':')[1].trim();
        this.addDependency(dep);
      });
  }

  generate() {
    return {
      js: this.outputCode || this.contents,
    };
  }
};
