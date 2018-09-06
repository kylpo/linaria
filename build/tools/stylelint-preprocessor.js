'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = linariaStylelintPreprocessor;

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _babelCore = require('babel-core');

var babel = _interopRequireWildcard(_babelCore);

var _sourceMap = require('source-map');

var _moduleSystem = require('../babel/lib/moduleSystem');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function toString(templates, expressions) {
  return templates.reduce(function (acc, template, i) {
    return '' + acc + template + (i >= expressions.length ? '' : expressions[i]);
  }, '');
}

function linariaStylelintPreprocessor() /* options */{
  process.env.LINARIA_BABEL_PRESET_OVERRIDES = JSON.stringify({
    extract: false
  });
  // $FlowFixMe
  process.env.LINARIA_COLLECT_RAW_STYLES = true;

  var cache = {};

  return {
    code: function code(input, filename) {
      var _babel$transform = babel.transform(input, {
        filename: filename,
        sourceMaps: true
      }),
          code = _babel$transform.code,
          map = _babel$transform.map;

      var rawStyles = (0, _moduleSystem.getCachedModule)(require.resolve('../sheet.js')).exports.default.rawStyles();

      var relativeFilename = _path2.default.relative(process.cwd(), filename);

      if (!Object.keys(rawStyles).length || !rawStyles[relativeFilename]) {
        return '';
      }

      var css = rawStyles[relativeFilename].reduce(function (acc, _ref) {
        var template = _ref.template,
            expressions = _ref.expressions,
            classname = _ref.classname;

        var styles = toString(template, expressions.map(function (expression) {
          return String(expression).replace('\n', ' ');
        }));
        return acc + '\n.' + classname + ' {' + styles + '}';
      }, '');

      cache[filename] = { css: css, code: code, map: map, input: input };

      return css;
    },
    result: function result(lintResults, filename) {
      if (!cache[filename]) {
        return;
      }

      var _cache$filename = cache[filename],
          code = _cache$filename.code,
          css = _cache$filename.css,
          map = _cache$filename.map,
          input = _cache$filename.input;
      var warnings = lintResults.warnings;


      warnings.forEach(function (warning) {
        var relevantCss = css.split('\n').slice(1, warning.line);

        var classname = void 0;
        var offset = 0;
        for (var i = relevantCss.length - 1; i >= 0; i--) {
          var match = relevantCss[i].match(/\.(_?[a-zA-Z0-9]+__[a-z0-9]+) {/);
          if (match) {
            classname = match[1];
            offset = relevantCss.length - i - 1;
            break;
          }
        }

        var startLineLocation = code.split('\n').findIndex(function (line) {
          return line.includes(classname);
        });
        // prettier-ignore
        var startColumnLocation = code.split('\n')[startLineLocation].indexOf(classname);

        var consumer = new _sourceMap.SourceMapConsumer(map);
        var originalPos = consumer.originalPositionFor({
          line: startLineLocation + 1,
          column: startColumnLocation
        });

        offset += input.split('\n').slice(originalPos.line - 1).findIndex(function (line) {
          return (/css(\.named\(.+\))?`/.test(line)
          );
        });

        // eslint-disable-next-line no-param-reassign
        warning.line = originalPos.line + offset;
      });
    }
  };
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy90b29scy9zdHlsZWxpbnQtcHJlcHJvY2Vzc29yLmpzIl0sIm5hbWVzIjpbImxpbmFyaWFTdHlsZWxpbnRQcmVwcm9jZXNzb3IiLCJiYWJlbCIsInRvU3RyaW5nIiwidGVtcGxhdGVzIiwiZXhwcmVzc2lvbnMiLCJyZWR1Y2UiLCJhY2MiLCJ0ZW1wbGF0ZSIsImkiLCJsZW5ndGgiLCJwcm9jZXNzIiwiZW52IiwiTElOQVJJQV9CQUJFTF9QUkVTRVRfT1ZFUlJJREVTIiwiSlNPTiIsInN0cmluZ2lmeSIsImV4dHJhY3QiLCJMSU5BUklBX0NPTExFQ1RfUkFXX1NUWUxFUyIsImNhY2hlIiwiY29kZSIsImlucHV0IiwiZmlsZW5hbWUiLCJ0cmFuc2Zvcm0iLCJzb3VyY2VNYXBzIiwibWFwIiwicmF3U3R5bGVzIiwicmVxdWlyZSIsInJlc29sdmUiLCJleHBvcnRzIiwiZGVmYXVsdCIsInJlbGF0aXZlRmlsZW5hbWUiLCJyZWxhdGl2ZSIsImN3ZCIsIk9iamVjdCIsImtleXMiLCJjc3MiLCJjbGFzc25hbWUiLCJzdHlsZXMiLCJTdHJpbmciLCJleHByZXNzaW9uIiwicmVwbGFjZSIsInJlc3VsdCIsImxpbnRSZXN1bHRzIiwid2FybmluZ3MiLCJmb3JFYWNoIiwicmVsZXZhbnRDc3MiLCJzcGxpdCIsInNsaWNlIiwid2FybmluZyIsImxpbmUiLCJvZmZzZXQiLCJtYXRjaCIsInN0YXJ0TGluZUxvY2F0aW9uIiwiZmluZEluZGV4IiwiaW5jbHVkZXMiLCJzdGFydENvbHVtbkxvY2F0aW9uIiwiaW5kZXhPZiIsImNvbnN1bWVyIiwib3JpZ2luYWxQb3MiLCJvcmlnaW5hbFBvc2l0aW9uRm9yIiwiY29sdW1uIiwidGVzdCJdLCJtYXBwaW5ncyI6Ijs7Ozs7a0JBb0J3QkEsNEI7O0FBbEJ4Qjs7OztBQUNBOztJQUFZQyxLOztBQUNaOztBQUVBOzs7Ozs7QUFNQSxTQUFTQyxRQUFULENBQWtCQyxTQUFsQixFQUF1Q0MsV0FBdkMsRUFBOEQ7QUFDNUQs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WUFBWW5DLE1BQVosR0FBcUIsQ0FBbEMsRUFBcUNELEtBQUssQ0FBMUMsRUFBNkNBLEdBQTdDLEVBQWtEO0FBQ2hELGNBQU0wQyxRQUFRTixZQUFZcEMsQ0FBWixFQUFlMEMsS0FBZixDQUFxQixpQ0FBckIsQ0FBZDtBQUNBLGNBQUlBLEtBQUosRUFBVztBQUNUZix3QkFBWWUsTUFBTSxDQUFOLENBQVo7QUFDQUQscUJBQVNMLFlBQVluQyxNQUFaLEdBQXFCRCxDQUFyQixHQUF5QixDQUFsQztBQUNBO0FBQ0Q7QUFDRjs7QUFFRCxZQUFNMkMsb0JBQW9CakMsS0FDdkIyQixLQUR1QixDQUNqQixJQURpQixFQUV2Qk8sU0FGdUIsQ0FFYjtBQUFBLGlCQUFRSixLQUFLSyxRQUFMLENBQWNsQixTQUFkLENBQVI7QUFBQSxTQUZhLENBQTFCO0FBR0E7QUFDQSxZQUFNbUIsc0JBQXNCcEMsS0FBSzJCLEtBQUwsQ0FBVyxJQUFYLEVBQWlCTSxpQkFBakIsRUFDekJJLE9BRHlCLENBQ2pCcEIsU0FEaUIsQ0FBNUI7O0FBR0EsWUFBTXFCLFdBQVcsaUNBQXNCakMsR0FBdEIsQ0FBakI7QUFDQSxZQUFNa0MsY0FBY0QsU0FBU0UsbUJBQVQsQ0FBNkI7QUFDL0NWLGdCQUFNRyxvQkFBb0IsQ0FEcUI7QUFFL0NRLGtCQUFRTDtBQUZ1QyxTQUE3QixDQUFwQjs7QUFLQUwsa0JBQVU5QixNQUNQMEIsS0FETyxDQUNELElBREMsRUFFUEMsS0FGTyxDQUVEVyxZQUFZVCxJQUFaLEdBQW1CLENBRmxCLEVBR1BJLFNBSE8sQ0FHRztBQUFBLGlCQUFRLHdCQUF1QlEsSUFBdkIsQ0FBNEJaLElBQTVCO0FBQVI7QUFBQSxTQUhILENBQVY7O0FBS0E7QUFDQUQsZ0JBQVFDLElBQVIsR0FBZVMsWUFBWVQsSUFBWixHQUFtQkMsTUFBbEM7QUFDRCxPQWxDRDtBQW1DRDtBQTNFSSxHQUFQO0FBNkVEIiwiZmlsZSI6InN0eWxlbGludC1wcmVwcm9jZXNzb3IuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiBAZmxvdyAqL1xuXG5pbXBvcnQgcGF0aCBmcm9tICdwYXRoJztcbmltcG9ydCAqIGFzIGJhYmVsIGZyb20gJ2JhYmVsLWNvcmUnO1xuaW1wb3J0IHsgU291cmNlTWFwQ29uc3VtZXIgfSBmcm9tICdzb3VyY2UtbWFwJztcblxuaW1wb3J0IHsgZ2V0Q2FjaGVkTW9kdWxlIH0gZnJvbSAnLi4vYmFiZWwvbGliL21vZHVsZVN5c3RlbSc7XG5cbnR5cGUgTGludFJlc3VsdHMgPSB7XG4gIHdhcm5pbmdzOiB7IGxpbmU6IG51bWJlciwgY29sdW1uOiBudW1iZXIgfVtdLFxufTtcblxuZnVuY3Rpb24gdG9TdHJpbmcodGVtcGxhdGVzOiBzdHJpbmdbXSwgZXhwcmVzc2lvbnM6IHN0cmluZ1tdKSB7XG4gIHJldHVybiB0ZW1wbGF0ZXMucmVkdWNlKFxuICAgIChhY2MsIHRlbXBsYXRlLCBpKSA9PlxuICAgICAgYCR7YWNjfSR7dGVtcGxhdGV9JHtpID49IGV4cHJlc3Npb25zLmxlbmd0aCA/ICcnIDogZXhwcmVzc2lvbnNbaV19YCxcbiAgICAnJ1xuICApO1xufVxuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBsaW5hcmlhU3R5bGVsaW50UHJlcHJvY2Vzc29yKC8qIG9wdGlvbnMgKi8pIHtcbiAgcHJvY2Vzcy5lbnYuTElOQVJJQV9CQUJFTF9QUkVTRVRfT1ZFUlJJREVTID0gSlNPTi5zdHJpbmdpZnkoe1xuICAgIGV4dHJhY3Q6IGZhbHNlLFxuICB9KTtcbiAgLy8gJEZsb3dGaXhNZVxuICBwcm9jZXNzLmVudi5MSU5BUklBX0NPTExFQ1RfUkFXX1NUWUxFUyA9IHRydWU7XG5cbiAgY29uc3QgY2FjaGUgPSB7fTtcblxuICByZXR1cm4ge1xuICAgIGNvZGUoaW5wdXQ6IHN0cmluZywgZmlsZW5hbWU6IHN0cmluZykge1xuICAgICAgY29uc3QgeyBjb2RlLCBtYXAgfSA9IGJhYmVsLnRyYW5zZm9ybShpbnB1dCwge1xuICAgICAgICBmaWxlbmFtZSxcbiAgICAgICAgc291cmNlTWFwczogdHJ1ZSxcbiAgICAgIH0pO1xuXG4gICAgICBjb25zdCByYXdTdHlsZXMgPSBnZXRDYWNoZWRNb2R1bGUoXG4gICAgICAgIHJlcXVpcmUucmVzb2x2ZSgnLi4vc2hlZXQuanMnKVxuICAgICAgKS5leHBvcnRzLmRlZmF1bHQucmF3U3R5bGVzKCk7XG5cbiAgICAgIGNvbnN0IHJlbGF0aXZlRmlsZW5hbWUgPSBwYXRoLnJlbGF0aXZlKHByb2Nlc3MuY3dkKCksIGZpbGVuYW1lKTtcblxuICAgICAgaWYgKCFPYmplY3Qua2V5cyhyYXdTdHlsZXMpLmxlbmd0aCB8fCAhcmF3U3R5bGVzW3JlbGF0aXZlRmlsZW5hbWVdKSB7XG4gICAgICAgIHJldHVybiAnJztcbiAgICAgIH1cblxuICAgICAgY29uc3QgY3NzID0gcmF3U3R5bGVzW3JlbGF0aXZlRmlsZW5hbWVdLnJlZHVjZShcbiAgICAgICAgKGFjYywgeyB0ZW1wbGF0ZSwgZXhwcmVzc2lvbnMsIGNsYXNzbmFtZSB9KSA9PiB7XG4gICAgICAgICAgY29uc3Qgc3R5bGVzID0gdG9TdHJpbmcoXG4gICAgICAgICAgICB0ZW1wbGF0ZSxcbiAgICAgICAgICAgIGV4cHJlc3Npb25zLm1hcChleHByZXNzaW9uID0+IFN0cmluZyhleHByZXNzaW9uKS5yZXBsYWNlKCdcXG4nLCAnICcpKVxuICAgICAgICAgICk7XG4gICAgICAgICAgcmV0dXJuIGAke2FjY31cXG4uJHtjbGFzc25hbWV9IHske3N0eWxlc319YDtcbiAgICAgICAgfSxcbiAgICAgICAgJydcbiAgICAgICk7XG5cbiAgICAgIGNhY2hlW2ZpbGVuYW1lXSA9IHsgY3NzLCBjb2RlLCBtYXAsIGlucHV0IH07XG5cbiAgICAgIHJldHVybiBjc3M7XG4gICAgfSxcbiAgICByZXN1bHQobGludFJlc3VsdHM6IExpbnRSZXN1bHRzLCBmaWxlbmFtZTogc3RyaW5nKSB7XG4gICAgICBpZiAoIWNhY2hlW2ZpbGVuYW1lXSkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IHsgY29kZSwgY3NzLCBtYXAsIGlucHV0IH0gPSBjYWNoZVtmaWxlbmFtZV07XG4gICAgICBjb25zdCB7IHdhcm5pbmdzIH0gPSBsaW50UmVzdWx0cztcblxuICAgICAgd2FybmluZ3MuZm9yRWFjaCh3YXJuaW5nID0+IHtcbiAgICAgICAgY29uc3QgcmVsZXZhbnRDc3MgPSBjc3Muc3BsaXQoJ1xcbicpLnNsaWNlKDEsIHdhcm5pbmcubGluZSk7XG5cbiAgICAgICAgbGV0IGNsYXNzbmFtZTtcbiAgICAgICAgbGV0IG9mZnNldCA9IDA7XG4gICAgICAgIGZvciAobGV0IGkgPSByZWxldmFudENzcy5sZW5ndGggLSAxOyBpID49IDA7IGktLSkge1xuICAgICAgICAgIGNvbnN0IG1hdGNoID0gcmVsZXZhbnRDc3NbaV0ubWF0Y2goL1xcLihfP1thLXpBLVowLTldK19fW2EtejAtOV0rKSB7Lyk7XG4gICAgICAgICAgaWYgKG1hdGNoKSB7XG4gICAgICAgICAgICBjbGFzc25hbWUgPSBtYXRjaFsxXTtcbiAgICAgICAgICAgIG9mZnNldCA9IHJlbGV2YW50Q3NzLmxlbmd0aCAtIGkgLSAxO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgY29uc3Qgc3RhcnRMaW5lTG9jYXRpb24gPSBjb2RlXG4gICAgICAgICAgLnNwbGl0KCdcXG4nKVxuICAgICAgICAgIC5maW5kSW5kZXgobGluZSA9PiBsaW5lLmluY2x1ZGVzKGNsYXNzbmFtZSkpO1xuICAgICAgICAvLyBwcmV0dGllci1pZ25vcmVcbiAgICAgICAgY29uc3Qgc3RhcnRDb2x1bW5Mb2NhdGlvbiA9IGNvZGUuc3BsaXQoJ1xcbicpW3N0YXJ0TGluZUxvY2F0aW9uXVxuICAgICAgICAgIC5pbmRleE9mKGNsYXNzbmFtZSk7XG5cbiAgICAgICAgY29uc3QgY29uc3VtZXIgPSBuZXcgU291cmNlTWFwQ29uc3VtZXIobWFwKTtcbiAgICAgICAgY29uc3Qgb3JpZ2luYWxQb3MgPSBjb25zdW1lci5vcmlnaW5hbFBvc2l0aW9uRm9yKHtcbiAgICAgICAgICBsaW5lOiBzdGFydExpbmVMb2NhdGlvbiArIDEsXG4gICAgICAgICAgY29sdW1uOiBzdGFydENvbHVtbkxvY2F0aW9uLFxuICAgICAgICB9KTtcblxuICAgICAgICBvZmZzZXQgKz0gaW5wdXRcbiAgICAgICAgICAuc3BsaXQoJ1xcbicpXG4gICAgICAgICAgLnNsaWNlKG9yaWdpbmFsUG9zLmxpbmUgLSAxKVxuICAgICAgICAgIC5maW5kSW5kZXgobGluZSA9PiAvY3NzKFxcLm5hbWVkXFwoLitcXCkpP2AvLnRlc3QobGluZSkpO1xuXG4gICAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1wYXJhbS1yZWFzc2lnblxuICAgICAgICB3YXJuaW5nLmxpbmUgPSBvcmlnaW5hbFBvcy5saW5lICsgb2Zmc2V0O1xuICAgICAgfSk7XG4gICAgfSxcbiAgfTtcbn1cbiJdfQ==