'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _templateObject = _taggedTemplateLiteral(['\n  /**\n   * THIS FILE IS AUTOGENERATED. DO NOT EDIT IT DIRECTLY OR COMMIT IT TO VERSION CONTROL.\n   * SOURCE: ', '\n   */\n\n  ', '\n  '], ['\n  /**\n   * THIS FILE IS AUTOGENERATED. DO NOT EDIT IT DIRECTLY OR COMMIT IT TO VERSION CONTROL.\n   * SOURCE: ', '\n   */\n\n  ', '\n  ']);

exports.default = extractStyles;
exports.clearCache = clearCache;

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _mkdirp = require('mkdirp');

var _mkdirp2 = _interopRequireDefault(_mkdirp);

var _dedent = require('dedent');

var _dedent2 = _interopRequireDefault(_dedent);

var _moduleSystem = require('../lib/moduleSystem');

var _utils = require('./utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _taggedTemplateLiteral(strings, raw) { return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

var withPreamble = function withPreamble(filename, data) {
  return (0, _dedent2.default)(_templateObject, filename, data);
};

/**
 * Get output filename with directory structure from source preserved inside
 * custom outDir.
 */
function getOutputFilename(relativeFilename, absOutDir) {
  var basename = /(.+)\..+$/.exec(_path2.default.basename(relativeFilename))[1];
  var relativeOutputFilename = _path2.default.join(_path2.default.dirname(relativeFilename), basename + '.css');
  return _path2.default.join(absOutDir, relativeOutputFilename);
}

var stylesCache = {};

function hasCachedStyles(filename, styles) {
  return stylesCache[filename] && stylesCache[filename] === styles;
}

function createCssFromCache(filename) {
  return withPreamble(filename, Object.keys(stylesCache).reduce(function (acc, file) {
    return acc + '\n' + stylesCache[file];
  }, ''));
}

function addRequireForCss(types, program, filename) {
  program.node.body.unshift(types.expressionStatement(types.callExpression(types.identifier('require'), [types.stringLiteral(filename)])));
}

/**
 * Write styles to file and create directory if needed.
 */
function outputStylesToFile(filename, styles) {
  var throwImmediately = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

  try {
    _fs2.default.writeFileSync(filename, styles);
  } catch (error) {
    if (!throwImmediately && (error.code === 'ENOENT' || /ENOENT/.test(error.message))) {
      _mkdirp2.default.sync(_path2.default.dirname(filename));
      outputStylesToFile(filename, styles, true);
    } else {
      throw error;
    }
  }
}

function extractStyles(types, program, currentFilename, options) {
  // Normalize current filename path.
  var relativeCurrentFilename = (0, _utils.relativeToCwd)(currentFilename);
  var absCurrentFilename = (0, _utils.makeAbsolute)(currentFilename);

  var _options$single = options.single,
      single = _options$single === undefined ? false : _options$single,
      _options$cache = options.cache,
      cache = _options$cache === undefined ? true : _options$cache,
      _options$extract = options.extract,
      extract = _options$extract === undefined ? true : _options$extract,
      _options$outDir = options.outDir,
      outDir = _options$outDir === undefined ? '.linaria-cache' : _options$outDir,
      _options$filename = options.filename,
      basename = _options$filename === undefined ? 'styles.css' : _options$filename;


  var absOutDir = _path2.default.isAbsolute(outDir) ? outDir : _path2.default.join(process.cwd(), outDir);

  // If single === true, we compute filename from outDir and filename options,
  // since there will be only one file, otherwise we need to reconstruct directory
  // structure inside outDir. In that case filename option is discard.
  var filename = single ? _path2.default.join(absOutDir, basename) : getOutputFilename(relativeCurrentFilename, absOutDir);
  var importPath = './' + _path2.default.relative(_path2.default.dirname(absCurrentFilename), filename);

  if (!extract) {
    return;
  }

  var sheet = (0, _moduleSystem.getCachedModule)(require.resolve('../../sheet.js'));
  var data = sheet ? sheet.exports.default.dump() : '';

  if (!data.length) {
    return;
  }

  if (cache) {
    if (single) {
      // If single === true, we cannot rely on filename since it will
      // always be the same, so we need to use absCurrentFilename.
      if (hasCachedStyles(absCurrentFilename, data)) {
        return;
      }
      stylesCache[absCurrentFilename] = data;
    } else {
      if (hasCachedStyles(filename, data)) {
        addRequireForCss(types, program, importPath);
        return;
      }
      stylesCache[filename] = data;
    }
  }

  if (single) {
    outputStylesToFile(filename, cache ? createCssFromCache(relativeCurrentFilename) : withPreamble(relativeCurrentFilename, data));
  } else {
    outputStylesToFile(filename, withPreamble(relativeCurrentFilename, data));
    addRequireForCss(types, program, importPath);
  }
}

function clearCache() {
  stylesCache = {};
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9iYWJlbC9wcmV2YWwtZXh0cmFjdC9leHRyYWN0U3R5bGVzLmpzIl0sIm5hbWVzIjpbImV4dHJhY3RTdHlsZXMiLCJjbGVhckNhY2hlIiwid2l0aFByZWFtYmxlIiwiZmlsZW5hbWUiLCJkYXRhIiwiZ2V0T3V0cHV0RmlsZW5hbWUiLCJyZWxhdGl2ZUZpbGVuYW1lIiwiYWJzT3V0RGlyIiwiYmFzZW5hbWUiLCJleGVjIiwicmVsYXRpdmVPdXRwdXRGaWxlbmFtZSIsImpvaW4iLCJkaXJuYW1lIiwic3R5bGVzQ2FjaGUiLCJoYXNDYWNoZWRTdHlsZXMiLCJzdHlsZXMiLCJjcmVhdGVDc3NGcm9tQ2FjaGUiLCJPYmplY3QiLCJrZXlzIiwicmVkdWNlIiwiYWNjIiwiZmlsZSIsImFkZFJlcXVpcmVGb3JDc3MiLCJ0eXBlcyIsInByb2dyYW0iLCJub2RlIiwiYm9keSIsInVuc2hpZnQiLCJleHByZXNzaW9uU3RhdGVtZW50IiwiY2FsbEV4cHJlc3Npb24iLCJpZGVudGlmaWVyIiwic3RyaW5nTGl0ZXJhbCIsIm91dHB1dFN0eWxlc1RvRmlsZSIsInRocm93SW1tZWRpYXRlbHkiLCJ3cml0ZUZpbGVTeW5jIiwiZXJyb3IiLCJjb2RlIiwidGVzdCIsIm1lc3NhZ2UiLCJzeW5jIiwiY3VycmVudEZpbGVuYW1lIiwib3B0aW9ucyIsInJlbGF0aXZlQ3VycmVudEZpbGVuYW1lIiwiYWJzQ3VycmVudEZpbGVuYW1lIiwic2luZ2xlIiwiY2FjaGUiLCJleHRyYWN0Iiwib3V0RGlyIiwiaXNBYnNvbHV0ZSIsInByb2Nlc3MiLCJjd2QiLCJpbXBvcnRQYXRoIiwicmVsYXRpdmUiLCJzaGVldCIsInJlcXVpcmUiLCJyZXNvbHZlIiwiZXhwb3J0cyIsImRlZmF1bHQiLCJkdW1wIiwibGVuZ3RoIl0sIm1hcHBpbmdzIjoiOzs7Ozs7OztrQkEyRndCQSxhO1FBZ0ZSQyxVLEdBQUFBLFU7O0FBektoQjs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUlB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N0IsbUJBQW1CMEIsdUJBQW5CLENBREosR0FFSXhDLGFBQWF3Qyx1QkFBYixFQUFzQ3RDLElBQXRDLENBSk47QUFNRCxHQVBELE1BT087QUFDTDRCLHVCQUFtQjdCLFFBQW5CLEVBQTZCRCxhQUFhd0MsdUJBQWIsRUFBc0N0QyxJQUF0QyxDQUE3QjtBQUNBa0IscUJBQWlCQyxLQUFqQixFQUF3QkMsT0FBeEIsRUFBaUMyQixVQUFqQztBQUNEO0FBQ0Y7O0FBRU0sU0FBU2xELFVBQVQsR0FBc0I7QUFDM0JZLGdCQUFjLEVBQWQ7QUFDRCIsImZpbGUiOiJleHRyYWN0U3R5bGVzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyogQGZsb3cgKi9cblxuaW1wb3J0IGZzIGZyb20gJ2ZzJztcbmltcG9ydCBwYXRoIGZyb20gJ3BhdGgnO1xuaW1wb3J0IG1rZGlycCBmcm9tICdta2RpcnAnO1xuaW1wb3J0IGRlZGVudCBmcm9tICdkZWRlbnQnO1xuXG5pbXBvcnQgdHlwZSB7IEJhYmVsVHlwZXMsIE5vZGVQYXRoIH0gZnJvbSAnLi4vdHlwZXMnO1xuXG5pbXBvcnQgeyBnZXRDYWNoZWRNb2R1bGUgfSBmcm9tICcuLi9saWIvbW9kdWxlU3lzdGVtJztcbmltcG9ydCB7IHJlbGF0aXZlVG9Dd2QsIG1ha2VBYnNvbHV0ZSB9IGZyb20gJy4vdXRpbHMnO1xuXG5jb25zdCB3aXRoUHJlYW1ibGUgPSAoZmlsZW5hbWUsIGRhdGEpID0+XG4gIGRlZGVudGBcbiAgLyoqXG4gICAqIFRISVMgRklMRSBJUyBBVVRPR0VORVJBVEVELiBETyBOT1QgRURJVCBJVCBESVJFQ1RMWSBPUiBDT01NSVQgSVQgVE8gVkVSU0lPTiBDT05UUk9MLlxuICAgKiBTT1VSQ0U6ICR7ZmlsZW5hbWV9XG4gICAqL1xuXG4gICR7ZGF0YX1cbiAgYDtcblxuLyoqXG4gKiBHZXQgb3V0cHV0IGZpbGVuYW1lIHdpdGggZGlyZWN0b3J5IHN0cnVjdHVyZSBmcm9tIHNvdXJjZSBwcmVzZXJ2ZWQgaW5zaWRlXG4gKiBjdXN0b20gb3V0RGlyLlxuICovXG5mdW5jdGlvbiBnZXRPdXRwdXRGaWxlbmFtZShcbiAgcmVsYXRpdmVGaWxlbmFtZTogc3RyaW5nLFxuICBhYnNPdXREaXI6IHN0cmluZ1xuKTogc3RyaW5nIHtcbiAgY29uc3QgYmFzZW5hbWUgPSAvKC4rKVxcLi4rJC8uZXhlYyhwYXRoLmJhc2VuYW1lKHJlbGF0aXZlRmlsZW5hbWUpKVsxXTtcbiAgY29uc3QgcmVsYXRpdmVPdXRwdXRGaWxlbmFtZSA9IHBhdGguam9pbihcbiAgICBwYXRoLmRpcm5hbWUocmVsYXRpdmVGaWxlbmFtZSksXG4gICAgYCR7YmFzZW5hbWV9LmNzc2BcbiAgKTtcbiAgcmV0dXJuIHBhdGguam9pbihhYnNPdXREaXIsIHJlbGF0aXZlT3V0cHV0RmlsZW5hbWUpO1xufVxuXG5sZXQgc3R5bGVzQ2FjaGUgPSB7fTtcblxuZnVuY3Rpb24gaGFzQ2FjaGVkU3R5bGVzKGZpbGVuYW1lOiBzdHJpbmcsIHN0eWxlczogc3RyaW5nKSB7XG4gIHJldHVybiBzdHlsZXNDYWNoZVtmaWxlbmFtZV0gJiYgc3R5bGVzQ2FjaGVbZmlsZW5hbWVdID09PSBzdHlsZXM7XG59XG5cbmZ1bmN0aW9uIGNyZWF0ZUNzc0Zyb21DYWNoZShmaWxlbmFtZSkge1xuICByZXR1cm4gd2l0aFByZWFtYmxlKFxuICAgIGZpbGVuYW1lLFxuICAgIE9iamVjdC5rZXlzKHN0eWxlc0NhY2hlKS5yZWR1Y2UoXG4gICAgICAoYWNjLCBmaWxlKSA9PiBgJHthY2N9XFxuJHtzdHlsZXNDYWNoZVtmaWxlXX1gLFxuICAgICAgJydcbiAgICApXG4gICk7XG59XG5cbmZ1bmN0aW9uIGFkZFJlcXVpcmVGb3JDc3MoXG4gIHR5cGVzOiBCYWJlbFR5cGVzLFxuICBwcm9ncmFtOiBOb2RlUGF0aDwqPixcbiAgZmlsZW5hbWU6IHN0cmluZ1xuKSB7XG4gIHByb2dyYW0ubm9kZS5ib2R5LnVuc2hpZnQoXG4gICAgdHlwZXMuZXhwcmVzc2lvblN0YXRlbWVudChcbiAgICAgIHR5cGVzLmNhbGxFeHByZXNzaW9uKHR5cGVzLmlkZW50aWZpZXIoJ3JlcXVpcmUnKSwgW1xuICAgICAgICB0eXBlcy5zdHJpbmdMaXRlcmFsKGZpbGVuYW1lKSxcbiAgICAgIF0pXG4gICAgKVxuICApO1xufVxuXG4vKipcbiAqIFdyaXRlIHN0eWxlcyB0byBmaWxlIGFuZCBjcmVhdGUgZGlyZWN0b3J5IGlmIG5lZWRlZC5cbiAqL1xuZnVuY3Rpb24gb3V0cHV0U3R5bGVzVG9GaWxlKFxuICBmaWxlbmFtZTogc3RyaW5nLFxuICBzdHlsZXM6IHN0cmluZyxcbiAgdGhyb3dJbW1lZGlhdGVseTogYm9vbGVhbiA9IGZhbHNlXG4pIHtcbiAgdHJ5IHtcbiAgICBmcy53cml0ZUZpbGVTeW5jKGZpbGVuYW1lLCBzdHlsZXMpO1xuICB9IGNhdGNoIChlcnJvcikge1xuICAgIGlmIChcbiAgICAgICF0aHJvd0ltbWVkaWF0ZWx5ICYmXG4gICAgICAoZXJyb3IuY29kZSA9PT0gJ0VOT0VOVCcgfHwgL0VOT0VOVC8udGVzdChlcnJvci5tZXNzYWdlKSlcbiAgICApIHtcbiAgICAgIG1rZGlycC5zeW5jKHBhdGguZGlybmFtZShmaWxlbmFtZSkpO1xuICAgICAgb3V0cHV0U3R5bGVzVG9GaWxlKGZpbGVuYW1lLCBzdHlsZXMsIHRydWUpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aHJvdyBlcnJvcjtcbiAgICB9XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gZXh0cmFjdFN0eWxlcyhcbiAgdHlwZXM6IEJhYmVsVHlwZXMsXG4gIHByb2dyYW06IE5vZGVQYXRoPCo+LFxuICBjdXJyZW50RmlsZW5hbWU6IHN0cmluZyxcbiAgb3B0aW9uczoge1xuICAgIHNpbmdsZT86IGJvb2xlYW4sXG4gICAgZmlsZW5hbWU/OiBzdHJpbmcsXG4gICAgb3V0RGlyPzogc3RyaW5nLFxuICAgIGNhY2hlPzogYm9vbGVhbixcbiAgICBleHRyYWN0PzogYm9vbGVhbixcbiAgfVxuKSB7XG4gIC8vIE5vcm1hbGl6ZSBjdXJyZW50IGZpbGVuYW1lIHBhdGguXG4gIGNvbnN0IHJlbGF0aXZlQ3VycmVudEZpbGVuYW1lID0gcmVsYXRpdmVUb0N3ZChjdXJyZW50RmlsZW5hbWUpO1xuICBjb25zdCBhYnNDdXJyZW50RmlsZW5hbWUgPSBtYWtlQWJzb2x1dGUoY3VycmVudEZpbGVuYW1lKTtcblxuICBjb25zdCB7XG4gICAgc2luZ2xlID0gZmFsc2UsXG4gICAgY2FjaGUgPSB0cnVlLFxuICAgIGV4dHJhY3QgPSB0cnVlLFxuICAgIG91dERpciA9ICcubGluYXJpYS1jYWNoZScsXG4gICAgZmlsZW5hbWU6IGJhc2VuYW1lID0gJ3N0eWxlcy5jc3MnLFxuICB9ID0gb3B0aW9ucztcblxuICBjb25zdCBhYnNPdXREaXIgPSBwYXRoLmlzQWJzb2x1dGUob3V0RGlyKVxuICAgID8gb3V0RGlyXG4gICAgOiBwYXRoLmpvaW4ocHJvY2Vzcy5jd2QoKSwgb3V0RGlyKTtcblxuICAvLyBJZiBzaW5nbGUgPT09IHRydWUsIHdlIGNvbXB1dGUgZmlsZW5hbWUgZnJvbSBvdXREaXIgYW5kIGZpbGVuYW1lIG9wdGlvbnMsXG4gIC8vIHNpbmNlIHRoZXJlIHdpbGwgYmUgb25seSBvbmUgZmlsZSwgb3RoZXJ3aXNlIHdlIG5lZWQgdG8gcmVjb25zdHJ1Y3QgZGlyZWN0b3J5XG4gIC8vIHN0cnVjdHVyZSBpbnNpZGUgb3V0RGlyLiBJbiB0aGF0IGNhc2UgZmlsZW5hbWUgb3B0aW9uIGlzIGRpc2NhcmQuXG4gIGNvbnN0IGZpbGVuYW1lID0gc2luZ2xlXG4gICAgPyBwYXRoLmpvaW4oYWJzT3V0RGlyLCBiYXNlbmFtZSlcbiAgICA6IGdldE91dHB1dEZpbGVuYW1lKHJlbGF0aXZlQ3VycmVudEZpbGVuYW1lLCBhYnNPdXREaXIpO1xuICBjb25zdCBpbXBvcnRQYXRoID0gYC4vJHtwYXRoLnJlbGF0aXZlKFxuICAgIHBhdGguZGlybmFtZShhYnNDdXJyZW50RmlsZW5hbWUpLFxuICAgIGZpbGVuYW1lXG4gICl9YDtcblxuICBpZiAoIWV4dHJhY3QpIHtcbiAgICByZXR1cm47XG4gIH1cblxuICBjb25zdCBzaGVldCA9IGdldENhY2hlZE1vZHVsZShyZXF1aXJlLnJlc29sdmUoJy4uLy4uL3NoZWV0LmpzJykpO1xuICBjb25zdCBkYXRhID0gc2hlZXQgPyBzaGVldC5leHBvcnRzLmRlZmF1bHQuZHVtcCgpIDogJyc7XG5cbiAgaWYgKCFkYXRhLmxlbmd0aCkge1xuICAgIHJldHVybjtcbiAgfVxuXG4gIGlmIChjYWNoZSkge1xuICAgIGlmIChzaW5nbGUpIHtcbiAgICAgIC8vIElmIHNpbmdsZSA9PT0gdHJ1ZSwgd2UgY2Fubm90IHJlbHkgb24gZmlsZW5hbWUgc2luY2UgaXQgd2lsbFxuICAgICAgLy8gYWx3YXlzIGJlIHRoZSBzYW1lLCBzbyB3ZSBuZWVkIHRvIHVzZSBhYnNDdXJyZW50RmlsZW5hbWUuXG4gICAgICBpZiAoaGFzQ2FjaGVkU3R5bGVzKGFic0N1cnJlbnRGaWxlbmFtZSwgZGF0YSkpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgc3R5bGVzQ2FjaGVbYWJzQ3VycmVudEZpbGVuYW1lXSA9IGRhdGE7XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmIChoYXNDYWNoZWRTdHlsZXMoZmlsZW5hbWUsIGRhdGEpKSB7XG4gICAgICAgIGFkZFJlcXVpcmVGb3JDc3ModHlwZXMsIHByb2dyYW0sIGltcG9ydFBhdGgpO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBzdHlsZXNDYWNoZVtmaWxlbmFtZV0gPSBkYXRhO1xuICAgIH1cbiAgfVxuXG4gIGlmIChzaW5nbGUpIHtcbiAgICBvdXRwdXRTdHlsZXNUb0ZpbGUoXG4gICAgICBmaWxlbmFtZSxcbiAgICAgIGNhY2hlXG4gICAgICAgID8gY3JlYXRlQ3NzRnJvbUNhY2hlKHJlbGF0aXZlQ3VycmVudEZpbGVuYW1lKVxuICAgICAgICA6IHdpdGhQcmVhbWJsZShyZWxhdGl2ZUN1cnJlbnRGaWxlbmFtZSwgZGF0YSlcbiAgICApO1xuICB9IGVsc2Uge1xuICAgIG91dHB1dFN0eWxlc1RvRmlsZShmaWxlbmFtZSwgd2l0aFByZWFtYmxlKHJlbGF0aXZlQ3VycmVudEZpbGVuYW1lLCBkYXRhKSk7XG4gICAgYWRkUmVxdWlyZUZvckNzcyh0eXBlcywgcHJvZ3JhbSwgaW1wb3J0UGF0aCk7XG4gIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGNsZWFyQ2FjaGUoKSB7XG4gIHN0eWxlc0NhY2hlID0ge307XG59XG4iXX0=