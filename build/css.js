'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _dedent = require('dedent');

var _dedent2 = _interopRequireDefault(_dedent);

var _slugify = require('./slugify');

var _slugify2 = _interopRequireDefault(_slugify);

var _sheet = require('./sheet');

var _sheet2 = _interopRequireDefault(_sheet);

var _errorUtils = require('./babel/lib/errorUtils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var named = function named() {
  var name = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'css';
  var filename = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
  return function (template) {
    for (var _len = arguments.length, expressions = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      expressions[_key - 1] = arguments[_key];
    }

    expressions.forEach(function (expression, index) {
      if (expression === undefined || expression === null) {
        var error = new Error('Expression cannot be undefined or null');

        // Get frames with current (this module) stack without any garbage.
        var foundFrame = false;
        var framesWithCurrentStack = (0, _errorUtils.getFramesFromStack)(error, function (frames) {
          return frames.findIndex(function (frame) {
            var frameMatch = frame.fileName === __filename;
            // There will be 2 frames with this __filename and we need to include them both.
            if (frameMatch && !foundFrame) {
              foundFrame = true;
            } else if (frameMatch) {
              return true;
            }
            return false;
          }) + 1;
        });

        // Get rid of current stack, so there should be only 1 frame pointing to
        // source file.
        var framesWithoutCurrentStack = framesWithCurrentStack.filter(function (frame) {
          return frame.fileName !== __filename;
        });

        var templateLines = template.slice(0, index + 1).join('').split('\n');

        // Get offsets based on how many lines current tagged template expression has.
        var lineOffset = templateLines.length - 1;
        var columnOffset = lineOffset > 0 ? templateLines[templateLines.length - 1].length + 3 : 0;

        // Enhance frames with source maps, since we need to add offsets after it's already
        // processed by enhancer.
        var enhancedFrames = (0, _errorUtils.enhanceFrames)(framesWithoutCurrentStack, require.cache);

        enhancedFrames[0].lineNumber += lineOffset;
        enhancedFrames[0].columnNumber += columnOffset;

        // $FlowFixMe
        error.isEnhanced = true;
        // $FlowFixMe
        error.enhancedFrames = enhancedFrames;

        throw error;
      }
    });

    var styles = _dedent2.default.apply(undefined, [template].concat(_toConsumableArray(expressions))).trim();
    var slug = (0, _slugify2.default)(filename || styles);
    var classname = name + '__' + slug;

    _sheet2.default.insertRaw({ filename: filename, template: template, expressions: expressions, classname: classname });
    _sheet2.default.insert('.' + classname, styles);

    return classname;
  };
};

var css = named();

css.named = named;

exports.default = css;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9jc3MuanMiXSwibmFtZXMiOlsibmFtZWQiLCJuYW1lIiwiZmlsZW5hbWUiLCJ0ZW1wbGF0ZSIsImV4cHJlc3Npb25zIiwiZm9yRWFjaCIsImV4cHJlc3Npb24iLCJpbmRleCIsInVuZGVmaW5lZCIsImVycm9yIiwiRXJyb3IiLCJmb3VuZEZyYW1lIiwiZnJhbWVzV2l0aEN1cnJlbnRTdGFjayIsImZyYW1lcyIsImZpbmRJbmRleCIsImZyYW1lTWF0Y2giLCJmcmFtZSIsImZpbGVOYW1lIiwiX19maWxlbmFtZSIsImZyYW1lc1dpdGhvdXRDdXJyZW50U3RhY2siLCJmaWx0ZXIiLCJ0ZW1wbGF0ZUxpbmVzIiwic2xpY2UiLCJqb2luIiwic3BsaXQiLCJsaW5lT2Zmc2V0IiwibGVuZ3RoIiwiY29sdW1uT2Zmc2V0IiwiZW5oYW5jZWRGcmFtZXMiLCJyZXF1aXJlIiwiY2FjaGUiLCJsaW5lTnVtYmVyIiwiY29sdW1uTnVtYmVyIiwiaXNFbmhhbmNlZCIsInN0eWxlcyIsInRyaW0iLCJzbHVnIiwiY2xhc3NuYW1lIiwiaW5zZXJ0UmF3IiwiaW5zZXJ0IiwiY3NzIl0sIm1hcHBpbmdzIjoiOzs7Ozs7QUFFQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7Ozs7O0FBRUEsSUFBTUEsUUFBUSxTQUFSQSxLQUFRO0FBQUEsTUFBQ0MsSUFBRCx1RUFBaUIsS0FBakI7QUFBQSxNQUF3QkMsUUFBeEIsdUVBQTRDLElBQTVDO0FBQUEsU0FBcUQsVUFDakVDLFFBRGlFLEVBRzlEO0FBQUEsc0NBREFDLFdBQ0E7QUFEQUEsaUJBQ0E7QUFBQTs7QUFDSEEsZ0JBQVlDLE9BQVosQ0FBb0IsVUFBQ0MsVUFBRCxFQUFhQyxLQUFiLEVBQXVCO0FBQ3pDLFVBQUlELGVBQWVFLFNBQWYsSUFBNEJGLGVBQWUsSUFBL0MsRUFBcUQ7QUFDbkQsWUFBTUcsUUFBUSxJQUFJQyxLQUFKLENBQVUsd0NBQVYsQ0FBZDs7QUFFQTtBQUNBLFlBQUlDLGFBQWEsS0FBakI7QUFDQSxZQUFNQyx5QkFBeUIsb0NBQzdCSCxLQUQ2QixFQUU3QjtBQUFBLGlCQUNFSSxPQUFPQyxTQUFQLENBQWlCLGlCQUFTO0FBQ3hCLGdCQUFNQyxhQUFhQyxNQUFNQyxRQUFOLEtBQW1CQyxVQUF0QztBQUNBO0FBQ0EsZ0JBQUlILGNBQWMsQ0FBQ0osVUFBbkIsRUFBK0I7QUFDN0JBLDJCQUFhLElBQWI7QUFDRCxhQUZELE1BRU8sSUFBSUksVUFBSixFQUFnQjtBQUNyQixxQkFBTyxJQUFQO0FBQ0Q7QUFDRCxtQkFBTyxLQUFQO0FBQ0QsV0FURCxJQVNLLENBVlA7QUFBQSxTQUY2QixDQUEvQjs7QUFlQTtBQUNBO0FBQ0EsWUFBTUksNEJBQTRCUCx1QkFBdUJRLE1BQXZCLENBQ2hDO0FBQUEsaUJBQVNKLE1BQU1DLFFBQU4sS0FBbUJDLFVBQTVCO0FBQUEsU0FEZ0MsQ0FBbEM7O0FBSUEsWUFBTUcsZ0JBQWdCbEIsU0FDbkJtQixLQURtQixDQUNiLENBRGEsRUFDVmYsUUFBUSxDQURFLEVBRW5CZ0IsSUFGbUIsQ0FFZCxFQUZjLEVBR25CQyxLQUhtQixDQUdiLElBSGEsQ0FBdEI7O0FBS0E7QUFDQSxZQUFNQyxhQUFhSixjQUFjSyxNQUFkLEdBQXVCLENBQTFDO0FBQ0EsWUFBTUMsZUFDSkYsYUFBYSxDQUFiLEdBQWlCSixjQUFjQSxjQUFjSyxNQUFkLEdBQXVCLENBQXJDLEVBQXdDQSxNQUF4QyxHQUFpRCxDQUFsRSxHQUFzRSxDQUR4RTs7QUFHQTtBQUNBO0FBQ0EsWUFBTUUsaUJBQWlCLCtCQUNyQlQseUJBRHFCLEVBRXJCVSxRQUFRQyxLQUZhLENBQXZCOztBQUtBRix1QkFBZSxDQUFmLEVBQWtCRyxVQUFsQixJQUFnQ04sVUFBaEM7QUFDQUcsdUJBQWUsQ0FBZixFQUFrQkksWUFBbEIsSUFBa0NMLFlBQWxDOztBQUVBO0FBQ0FsQixjQUFNd0IsVUFBTixHQUFtQixJQUFuQjtBQUNBO0FBQ0F4QixjQUFNbUIsY0FBTixHQUF1QkEsY0FBdkI7O0FBRUEsY0FBTW5CLEtBQU47QUFDRDtBQUNGLEtBdEREOztBQXdEQSxRQUFNeUIsU0FBUyxtQ0FBTy9CLFFBQVAsNEJBQW9CQyxXQUFwQixJQUFpQytCLElBQWpDLEVBQWY7QUFDQSxRQUFNQyxPQUFPLHVCQUFRbEMsWUFBWWdDLE1BQXBCLENBQWI7QUFDQSxRQUFNRyxZQUFlcEMsSUFBZixVQUF3Qm1DLElBQTlCOztBQUVBLG9CQUFNRSxTQUFOLENBQWdCLEVBQUVwQyxrQkFBRixFQUFZQyxrQkFBWixFQUFzQkMsd0JBQXRCLEVBQW1DaUMsb0JBQW5DLEVBQWhCO0FBQ0Esb0JBQU1FLE1BQU4sT0FBaUJGLFNBQWpCLEVBQThCSCxNQUE5Qjs7QUFFQSxXQUFPRyxTQUFQO0FBQ0QsR0FwRWE7QUFBQSxDQUFkOztBQXNFQSxJQUFNRyxNQUFNeEMsT0FBWjs7QUFFQXdDLElBQUl4QyxLQUFKLEdBQVlBLEtBQVo7O2tCQUVld0MsRyIsImZpbGUiOiJjc3MuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiBAZmxvdyAqL1xuXG5pbXBvcnQgZGVkZW50IGZyb20gJ2RlZGVudCc7XG5pbXBvcnQgc2x1Z2lmeSBmcm9tICcuL3NsdWdpZnknO1xuaW1wb3J0IHNoZWV0IGZyb20gJy4vc2hlZXQnO1xuaW1wb3J0IHsgZ2V0RnJhbWVzRnJvbVN0YWNrLCBlbmhhbmNlRnJhbWVzIH0gZnJvbSAnLi9iYWJlbC9saWIvZXJyb3JVdGlscyc7XG5cbmNvbnN0IG5hbWVkID0gKG5hbWU/OiBzdHJpbmcgPSAnY3NzJywgZmlsZW5hbWU6ID9zdHJpbmcgPSBudWxsKSA9PiAoXG4gIHRlbXBsYXRlOiBzdHJpbmdbXSxcbiAgLi4uZXhwcmVzc2lvbnM6IHN0cmluZ1tdXG4pID0+IHtcbiAgZXhwcmVzc2lvbnMuZm9yRWFjaCgoZXhwcmVzc2lvbiwgaW5kZXgpID0+IHtcbiAgICBpZiAoZXhwcmVzc2lvbiA9PT0gdW5kZWZpbmVkIHx8IGV4cHJlc3Npb24gPT09IG51bGwpIHtcbiAgICAgIGNvbnN0IGVycm9yID0gbmV3IEVycm9yKCdFeHByZXNzaW9uIGNhbm5vdCBiZSB1bmRlZmluZWQgb3IgbnVsbCcpO1xuXG4gICAgICAvLyBHZXQgZnJhbWVzIHdpdGggY3VycmVudCAodGhpcyBtb2R1bGUpIHN0YWNrIHdpdGhvdXQgYW55IGdhcmJhZ2UuXG4gICAgICBsZXQgZm91bmRGcmFtZSA9IGZhbHNlO1xuICAgICAgY29uc3QgZnJhbWVzV2l0aEN1cnJlbnRTdGFjayA9IGdldEZyYW1lc0Zyb21TdGFjayhcbiAgICAgICAgZXJyb3IsXG4gICAgICAgIGZyYW1lcyA9PlxuICAgICAgICAgIGZyYW1lcy5maW5kSW5kZXgoZnJhbWUgPT4ge1xuICAgICAgICAgICAgY29uc3QgZnJhbWVNYXRjaCA9IGZyYW1lLmZpbGVOYW1lID09PSBfX2ZpbGVuYW1lO1xuICAgICAgICAgICAgLy8gVGhlcmUgd2lsbCBiZSAyIGZyYW1lcyB3aXRoIHRoaXMgX19maWxlbmFtZSBhbmQgd2UgbmVlZCB0byBpbmNsdWRlIHRoZW0gYm90aC5cbiAgICAgICAgICAgIGlmIChmcmFtZU1hdGNoICYmICFmb3VuZEZyYW1lKSB7XG4gICAgICAgICAgICAgIGZvdW5kRnJhbWUgPSB0cnVlO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChmcmFtZU1hdGNoKSB7XG4gICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgIH0pICsgMVxuICAgICAgKTtcblxuICAgICAgLy8gR2V0IHJpZCBvZiBjdXJyZW50IHN0YWNrLCBzbyB0aGVyZSBzaG91bGQgYmUgb25seSAxIGZyYW1lIHBvaW50aW5nIHRvXG4gICAgICAvLyBzb3VyY2UgZmlsZS5cbiAgICAgIGNvbnN0IGZyYW1lc1dpdGhvdXRDdXJyZW50U3RhY2sgPSBmcmFtZXNXaXRoQ3VycmVudFN0YWNrLmZpbHRlcihcbiAgICAgICAgZnJhbWUgPT4gZnJhbWUuZmlsZU5hbWUgIT09IF9fZmlsZW5hbWVcbiAgICAgICk7XG5cbiAgICAgIGNvbnN0IHRlbXBsYXRlTGluZXMgPSB0ZW1wbGF0ZVxuICAgICAgICAuc2xpY2UoMCwgaW5kZXggKyAxKVxuICAgICAgICAuam9pbignJylcbiAgICAgICAgLnNwbGl0KCdcXG4nKTtcblxuICAgICAgLy8gR2V0IG9mZnNldHMgYmFzZWQgb24gaG93IG1hbnkgbGluZXMgY3VycmVudCB0YWdnZWQgdGVtcGxhdGUgZXhwcmVzc2lvbiBoYXMuXG4gICAgICBjb25zdCBsaW5lT2Zmc2V0ID0gdGVtcGxhdGVMaW5lcy5sZW5ndGggLSAxO1xuICAgICAgY29uc3QgY29sdW1uT2Zmc2V0ID1cbiAgICAgICAgbGluZU9mZnNldCA+IDAgPyB0ZW1wbGF0ZUxpbmVzW3RlbXBsYXRlTGluZXMubGVuZ3RoIC0gMV0ubGVuZ3RoICsgMyA6IDA7XG5cbiAgICAgIC8vIEVuaGFuY2UgZnJhbWVzIHdpdGggc291cmNlIG1hcHMsIHNpbmNlIHdlIG5lZWQgdG8gYWRkIG9mZnNldHMgYWZ0ZXIgaXQncyBhbHJlYWR5XG4gICAgICAvLyBwcm9jZXNzZWQgYnkgZW5oYW5jZXIuXG4gICAgICBjb25zdCBlbmhhbmNlZEZyYW1lcyA9IGVuaGFuY2VGcmFtZXMoXG4gICAgICAgIGZyYW1lc1dpdGhvdXRDdXJyZW50U3RhY2ssXG4gICAgICAgIHJlcXVpcmUuY2FjaGVcbiAgICAgICk7XG5cbiAgICAgIGVuaGFuY2VkRnJhbWVzWzBdLmxpbmVOdW1iZXIgKz0gbGluZU9mZnNldDtcbiAgICAgIGVuaGFuY2VkRnJhbWVzWzBdLmNvbHVtbk51bWJlciArPSBjb2x1bW5PZmZzZXQ7XG5cbiAgICAgIC8vICRGbG93Rml4TWVcbiAgICAgIGVycm9yLmlzRW5oYW5jZWQgPSB0cnVlO1xuICAgICAgLy8gJEZsb3dGaXhNZVxuICAgICAgZXJyb3IuZW5oYW5jZWRGcmFtZXMgPSBlbmhhbmNlZEZyYW1lcztcblxuICAgICAgdGhyb3cgZXJyb3I7XG4gICAgfVxuICB9KTtcblxuICBjb25zdCBzdHlsZXMgPSBkZWRlbnQodGVtcGxhdGUsIC4uLmV4cHJlc3Npb25zKS50cmltKCk7XG4gIGNvbnN0IHNsdWcgPSBzbHVnaWZ5KGZpbGVuYW1lIHx8IHN0eWxlcyk7XG4gIGNvbnN0IGNsYXNzbmFtZSA9IGAke25hbWV9X18ke3NsdWd9YDtcblxuICBzaGVldC5pbnNlcnRSYXcoeyBmaWxlbmFtZSwgdGVtcGxhdGUsIGV4cHJlc3Npb25zLCBjbGFzc25hbWUgfSk7XG4gIHNoZWV0Lmluc2VydChgLiR7Y2xhc3NuYW1lfWAsIHN0eWxlcyk7XG5cbiAgcmV0dXJuIGNsYXNzbmFtZTtcbn07XG5cbmNvbnN0IGNzcyA9IG5hbWVkKCk7XG5cbmNzcy5uYW1lZCA9IG5hbWVkO1xuXG5leHBvcnQgZGVmYXVsdCBjc3M7XG4iXX0=