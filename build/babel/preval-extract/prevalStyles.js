'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (babel, title, path, state, requirements) {
  var _path$scope$generateU = path.scope.generateUidIdentifier(title),
      name = _path$scope$generateU.name;

  var source = path.getSource() || (0, _babelGenerator2.default)(path.node).code;

  var replacement = (0, _getReplacement2.default)([].concat(_toConsumableArray(requirements), [{
    code: 'module.exports = ' + source.replace(/css(?!\.named)/g, 'css.named(\'' + name + '\', \'' + state.filename + '\')').replace(/css\.named\(([^,]+)\)/, function (input, customName) {
      return 'css.named(' + customName + ', \'' + state.filename + '\')';
    }),
    loc: path.node.loc.start
  }]));

  (0, _moduleSystem.clearLocalModulesFromCache)();

  var _instantiateModule = (0, _moduleSystem.instantiateModule)(replacement, (0, _path.resolve)(state.filename)),
      className = _instantiateModule.exports;

  var minifyClassnames = state.opts.minifyClassnames;


  return babel.types.stringLiteral(minifyClassnames ? getMinifiedClassName(className) : className);
};

var _path = require('path');

var _babelGenerator = require('babel-generator');

var _babelGenerator2 = _interopRequireDefault(_babelGenerator);

var _shortHash = require('short-hash');

var _shortHash2 = _interopRequireDefault(_shortHash);

var _getReplacement = require('./getReplacement');

var _getReplacement2 = _interopRequireDefault(_getReplacement);

var _moduleSystem = require('../lib/moduleSystem');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function getMinifiedClassName(className) {
  return 'ln' + (0, _shortHash2.default)(className);
}

/**
 * const header = css`
 *   color: ${header.color};
 * `;
 *
 * const header = preval`
 *   module.exports = css.named('header_slug')`
 *     color: ${header.color}
 *   `;
 * `;
 */
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9iYWJlbC9wcmV2YWwtZXh0cmFjdC9wcmV2YWxTdHlsZXMuanMiXSwibmFtZXMiOlsiYmFiZWwiLCJ0aXRsZSIsInBhdGgiLCJzdGF0ZSIsInJlcXVpcmVtZW50cyIsInNjb3BlIiwiZ2VuZXJhdGVVaWRJZGVudGlmaWVyIiwibmFtZSIsInNvdXJjZSIsImdldFNvdXJjZSIsIm5vZGUiLCJjb2RlIiwicmVwbGFjZW1lbnQiLCJyZXBsYWNlIiwiZmlsZW5hbWUiLCJpbnB1dCIsImN1c3RvbU5hbWUiLCJsb2MiLCJzdGFydCIsImNsYXNzTmFtZSIsImV4cG9ydHMiLCJtaW5pZnlDbGFzc25hbWVzIiwib3B0cyIsInR5cGVzIiwic3RyaW5nTGl0ZXJhbCIsImdldE1pbmlmaWVkQ2xhc3NOYW1lIl0sIm1hcHBpbmdzIjoiOzs7Ozs7a0JBc0NlLFVBQ2JBLEtBRGEsRUFFYkMsS0FGYSxFQUdiQyxJQUhhLEVBTWJDLEtBTmEsRUFPYkMsWUFQYSxFQVFiO0FBQUEsOEJBQ2lCRixLQUFLRyxLQUFMLENBQVdDLHFCQUFYLENBQWlDTCxLQUFqQyxDQURqQjtBQUFBLE1BQ1FNLElBRFIseUJBQ1FBLElBRFI7O0FBRUEsTUFBTUMsU0FBU04sS0FBS08sU0FBTCxNQUFvQiw4QkFBU1AsS0FBS1EsSUFBZCxFQUFvQkMsSUFBdkQ7O0FBRUEsTUFBTUMsY0FBYywyREFDZlIsWUFEZSxJQUVsQjtBQUNFTyxnQ0FBMEJILE9BQ3ZCSyxPQUR1QixDQUNmLGlCQURlLG1CQUNrQk4sSUFEbEIsY0FDNkJKLE1BQU1XLFFBRG5DLFVBRXZCRCxPQUZ1QixDQUd0Qix1QkFIc0IsRUFJdEIsVUFBQ0UsS0FBRCxFQUFRQyxVQUFSO0FBQUEsNEJBQW9DQSxVQUFwQyxZQUFvRGIsTUFBTVcsUUFBMUQ7QUFBQSxLQUpzQixDQUQ1QjtBQU9FRyxTQUFLZixLQUFLUSxJQUFMLENBQVVPLEdBQVYsQ0FBY0M7QUFQckIsR0FGa0IsR0FBcEI7O0FBYUE7O0FBakJBLDJCQWtCK0IscUNBQzdCTixXQUQ2QixFQUU3QixtQkFBUVQsTUFBTVcsUUFBZCxDQUY2QixDQWxCL0I7QUFBQSxNQWtCaUJLLFNBbEJqQixzQkFrQlFDLE9BbEJSOztBQUFBLE1BdUJRQyxnQkF2QlIsR0F1QjZCbEIsTUFBTW1CLElBdkJuQyxDQXVCUUQsZ0JBdkJSOzs7QUF5QkEsU0FBT3JCLE1BQU11QixLQUFOLENBQVlDLGFBQVosQ0FDTEgsbUJBQW1CSSxxQkFBcUJOLFNBQXJCLENBQW5CLEdBQXFEQSxTQURoRCxDQUFQO0FBR0QsQzs7QUF4RUQ7O0FBQ0E7Ozs7QUFDQTs7OztBQVlBOzs7O0FBQ0E7Ozs7OztBQUtBLFNBQVNNLG9CQUFULENBQThCTixTQUE5QixFQUFpRDtBQUMvQyxnQkFBWSx5QkFBVUEsU0FBVixDQUFaO0FBQ0Q7O0FBRUQiLCJmaWxlIjoicHJldmFsU3R5bGVzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyogQGZsb3cgKi9cblxuaW1wb3J0IHsgcmVzb2x2ZSB9IGZyb20gJ3BhdGgnO1xuaW1wb3J0IGdlbmVyYXRlIGZyb20gJ2JhYmVsLWdlbmVyYXRvcic7XG5pbXBvcnQgc2hvcnRIYXNoIGZyb20gJ3Nob3J0LWhhc2gnO1xuXG5pbXBvcnQgdHlwZSB7XG4gIEJhYmVsQ29yZSxcbiAgU3RhdGUsXG4gIE5vZGVQYXRoLFxuICBCYWJlbFRhZ2dlZFRlbXBsYXRlRXhwcmVzc2lvbixcbiAgQmFiZWxJZGVudGlmaWVyLFxuICBCYWJlbENhbGxFeHByZXNzaW9uLFxuICBSZXF1aXJlbWVudFNvdXJjZSxcbn0gZnJvbSAnLi4vdHlwZXMnO1xuXG5pbXBvcnQgZ2V0UmVwbGFjZW1lbnQgZnJvbSAnLi9nZXRSZXBsYWNlbWVudCc7XG5pbXBvcnQge1xuICBpbnN0YW50aWF0ZU1vZHVsZSxcbiAgY2xlYXJMb2NhbE1vZHVsZXNGcm9tQ2FjaGUsXG59IGZyb20gJy4uL2xpYi9tb2R1bGVTeXN0ZW0nO1xuXG5mdW5jdGlvbiBnZXRNaW5pZmllZENsYXNzTmFtZShjbGFzc05hbWU6IHN0cmluZykge1xuICByZXR1cm4gYGxuJHtzaG9ydEhhc2goY2xhc3NOYW1lKX1gO1xufVxuXG4vKipcbiAqIGNvbnN0IGhlYWRlciA9IGNzc2BcbiAqICAgY29sb3I6ICR7aGVhZGVyLmNvbG9yfTtcbiAqIGA7XG4gKlxuICogY29uc3QgaGVhZGVyID0gcHJldmFsYFxuICogICBtb2R1bGUuZXhwb3J0cyA9IGNzcy5uYW1lZCgnaGVhZGVyX3NsdWcnKWBcbiAqICAgICBjb2xvcjogJHtoZWFkZXIuY29sb3J9XG4gKiAgIGA7XG4gKiBgO1xuICovXG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKFxuICBiYWJlbDogQmFiZWxDb3JlLFxuICB0aXRsZTogc3RyaW5nLFxuICBwYXRoOiBOb2RlUGF0aDxcbiAgICBCYWJlbFRhZ2dlZFRlbXBsYXRlRXhwcmVzc2lvbjxCYWJlbElkZW50aWZpZXIgfCBCYWJlbENhbGxFeHByZXNzaW9uPlxuICA+LFxuICBzdGF0ZTogU3RhdGUsXG4gIHJlcXVpcmVtZW50czogUmVxdWlyZW1lbnRTb3VyY2VbXVxuKSB7XG4gIGNvbnN0IHsgbmFtZSB9ID0gcGF0aC5zY29wZS5nZW5lcmF0ZVVpZElkZW50aWZpZXIodGl0bGUpO1xuICBjb25zdCBzb3VyY2UgPSBwYXRoLmdldFNvdXJjZSgpIHx8IGdlbmVyYXRlKHBhdGgubm9kZSkuY29kZTtcblxuICBjb25zdCByZXBsYWNlbWVudCA9IGdldFJlcGxhY2VtZW50KFtcbiAgICAuLi5yZXF1aXJlbWVudHMsXG4gICAge1xuICAgICAgY29kZTogYG1vZHVsZS5leHBvcnRzID0gJHtzb3VyY2VcbiAgICAgICAgLnJlcGxhY2UoL2Nzcyg/IVxcLm5hbWVkKS9nLCBgY3NzLm5hbWVkKCcke25hbWV9JywgJyR7c3RhdGUuZmlsZW5hbWV9JylgKVxuICAgICAgICAucmVwbGFjZShcbiAgICAgICAgICAvY3NzXFwubmFtZWRcXCgoW14sXSspXFwpLyxcbiAgICAgICAgICAoaW5wdXQsIGN1c3RvbU5hbWUpID0+IGBjc3MubmFtZWQoJHtjdXN0b21OYW1lfSwgJyR7c3RhdGUuZmlsZW5hbWV9JylgXG4gICAgICAgICl9YCxcbiAgICAgIGxvYzogcGF0aC5ub2RlLmxvYy5zdGFydCxcbiAgICB9LFxuICBdKTtcblxuICBjbGVhckxvY2FsTW9kdWxlc0Zyb21DYWNoZSgpO1xuICBjb25zdCB7IGV4cG9ydHM6IGNsYXNzTmFtZSB9ID0gaW5zdGFudGlhdGVNb2R1bGUoXG4gICAgcmVwbGFjZW1lbnQsXG4gICAgcmVzb2x2ZShzdGF0ZS5maWxlbmFtZSlcbiAgKTtcblxuICBjb25zdCB7IG1pbmlmeUNsYXNzbmFtZXMgfSA9IHN0YXRlLm9wdHM7XG5cbiAgcmV0dXJuIGJhYmVsLnR5cGVzLnN0cmluZ0xpdGVyYWwoXG4gICAgbWluaWZ5Q2xhc3NuYW1lcyA/IGdldE1pbmlmaWVkQ2xhc3NOYW1lKGNsYXNzTmFtZSkgOiBjbGFzc05hbWVcbiAgKTtcbn1cbiJdfQ==