'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _stylis = require('stylis');

var _stylis2 = _interopRequireDefault(_stylis);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function sheet() {
  var cache = {};
  var rawCache = {};

  var isBrowser = (typeof window === 'undefined' ? 'undefined' : _typeof(window)) === 'object' && window != null && window.document != null;
  // eslint-disable-next-line global-require
  var document = isBrowser ? window.document : require('./document').default;

  var style = document.createElement('style');
  var node = document.createTextNode('');

  style.appendChild(node);
  style.setAttribute('type', 'text/css');

  document.head.appendChild(style);

  if (process.env.NODE_ENV !== 'test' && isBrowser) {
    console.warn('Babel preset for Linaria is not configured. See https://github.com/callstack/linaria/blob/master/docs/BABEL_PRESET.md for instructions.');
  }

  return {
    insertRaw: function insertRaw(_ref) {
      var filename = _ref.filename,
          template = _ref.template,
          expressions = _ref.expressions,
          classname = _ref.classname;

      if (filename && process.env.LINARIA_COLLECT_RAW_STYLES) {
        rawCache[filename] = (rawCache[filename] || []).concat({
          template: template,
          expressions: expressions,
          classname: classname
        });
      }
    },
    insert: function insert(selector, css) {
      if (selector in cache) {
        return;
      }

      var text = (0, _stylis2.default)(selector, css);
      cache[selector] = css;
      node.appendData('\n' + text);
    },
    rawStyles: function rawStyles() {
      return rawCache;
    },
    styles: function styles() {
      return cache;
    },
    dump: function dump() {
      var result = node.textContent;
      cache = {};
      node.textContent = '';
      return result.trim();
    }
  };
}

exports.default = sheet();
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9zaGVldC5qcyJdLCJuYW1lcyI6WyJzaGVldCIsImNhY2hlIiwicmF3Q2FjaGUiLCJpc0Jyb3dzZXIiLCJ3aW5kb3ciLCJkb2N1bWVudCIsInJlcXVpcmUiLCJkZWZhdWx0Iiwic3R5bGUiLCJjcmVhdGVFbGVtZW50Iiwibm9kZSIsImNyZWF0ZVRleHROb2RlIiwiYXBwZW5kQ2hpbGQiLCJzZXRBdHRyaWJ1dGUiLCJoZWFkIiwicHJvY2VzcyIsImVudiIsIk5PREVfRU5WIiwiY29uc29sZSIsIndhcm4iLCJpbnNlcnRSYXciLCJmaWxlbmFtZSIsInRlbXBsYXRlIiwiZXhwcmVzc2lvbnMiLCJjbGFzc25hbWUiLCJMSU5BUklBX0NPTExFQ1RfUkFXX1NUWUxFUyIsImNvbmNhdCIsImluc2VydCIsInNlbGVjdG9yIiwiY3NzIiwidGV4dCIsImFwcGVuZERhdGEiLCJyYXdTdHlsZXMiLCJzdHlsZXMiLCJkdW1wIiwicmVzdWx0IiwidGV4dENvbnRlbnQiLCJ0cmltIl0sIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUVBOzs7Ozs7QUFRQSxTQUFTQSxLQUFULEdBQWlCO0FBQ2YsTUFBSUMsUUFBd0MsRUFBNUM7QUFDQSxNQUFNQyxXQUFnRCxFQUF0RDs7QUFFQSxNQUFNQyxZQUNKLFFBQU9DLE1BQVAseUNBQU9BLE1BQVAsT0FBa0IsUUFBbEIsSUFBOEJBLFVBQVUsSUFBeEMsSUFBZ0RBLE9BQU9DLFFBQVAsSUFBbUIsSUFEckU7QUFFQTtBQUNBLE1BQU1BLFdBQVdGLFlBQVlDLE9BQU9DLFFBQW5CLEdBQThCQyxRQUFRLFlBQVIsRUFBc0JDLE9BQXJFOztBQUVBLE1BQU1DLFFBQVFILFNBQVNJLGFBQVQsQ0FBdUIsT0FBdkIsQ0FBZDtBQUNBLE1BQU1DLE9BQU9MLFNBQVNNLGNBQVQsQ0FBd0IsRUFBeEIsQ0FBYjs7QUFFQUgsUUFBTUksV0FBTixDQUFrQkYsSUFBbEI7QUFDQUYsUUFBTUssWUFBTixDQUFtQixNQUFuQixFQUEyQixVQUEzQjs7QUFFQVIsV0FBU1MsSUFBVCxDQUFjRixXQUFkLENBQTBCSixLQUExQjs7QUFFQSxNQUFJTyxRQUFRQyxHQUFSLENBQVlDLFFBQVosS0FBeUIsTUFBekIsSUFBbUNkLFNBQXZDLEVBQWtEO0FBQ2hEZSxZQUFRQyxJQUFSLENBQ0UseUlBREY7QUFHRDs7QUFFRCxTQUFPO0FBQ0xDLGFBREssMkJBTWlDO0FBQUEsVUFKcENDLFFBSW9DLFFBSnBDQSxRQUlvQztBQUFBLFVBSHBDQyxRQUdvQyxRQUhwQ0EsUUFHb0M7QUFBQSxVQUZwQ0MsV0FFb0MsUUFGcENBLFdBRW9DO0FBQUEsVUFEcENDLFNBQ29DLFFBRHBDQSxTQUNvQzs7QUFDcEMsVUFBSUgsWUFBWU4sUUFBUUMsR0FBUixDQUFZUywwQkFBNUIsRUFBd0Q7QUFDdER2QixpQkFBU21CLFFBQVQsSUFBcUIsQ0FBQ25CLFNBQVNtQixRQUFULEtBQXNCLEVBQXZCLEVBQTJCSyxNQUEzQixDQUFrQztBQUNyREosNEJBRHFEO0FBRXJEQyxrQ0FGcUQ7QUFHckRDO0FBSHFELFNBQWxDLENBQXJCO0FBS0Q7QUFDRixLQWRJO0FBZUxHLFVBZkssa0JBZUVDLFFBZkYsRUFlb0JDLEdBZnBCLEVBZWlDO0FBQ3BDLFVBQUlELFlBQVkzQixLQUFoQixFQUF1QjtBQUNyQjtBQUNEOztBQUVELFVBQU02QixPQUFPLHNCQUFPRixRQUFQLEVBQWlCQyxHQUFqQixDQUFiO0FBQ0E1QixZQUFNMkIsUUFBTixJQUFrQkMsR0FBbEI7QUFDQW5CLFdBQUtxQixVQUFMLFFBQXFCRCxJQUFyQjtBQUNELEtBdkJJO0FBd0JMRSxhQXhCSyx1QkF3Qk87QUFDVixhQUFPOUIsUUFBUDtBQUNELEtBMUJJO0FBMkJMK0IsVUEzQkssb0JBMkJJO0FBQ1AsYUFBT2hDLEtBQVA7QUFDRCxLQTdCSTtBQThCTGlDLFFBOUJLLGtCQThCRTtBQUNMLFVBQU1DLFNBQVN6QixLQUFLMEIsV0FBcEI7QUFDQW5DLGNBQVEsRUFBUjtBQUNBUyxXQUFLMEIsV0FBTCxHQUFtQixFQUFuQjtBQUNBLGFBQU9ELE9BQU9FLElBQVAsRUFBUDtBQUNEO0FBbkNJLEdBQVA7QUFxQ0Q7O2tCQUVjckMsTyIsImZpbGUiOiJzaGVldC5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qIEBmbG93ICovXG5cbmltcG9ydCBzdHlsaXMgZnJvbSAnc3R5bGlzJztcblxudHlwZSBSYXdTdHlsZXMgPSB7XG4gIHRlbXBsYXRlOiBzdHJpbmdbXSxcbiAgZXhwcmVzc2lvbnM6IHN0cmluZ1tdLFxuICBjbGFzc25hbWU6IHN0cmluZyxcbn07XG5cbmZ1bmN0aW9uIHNoZWV0KCkge1xuICBsZXQgY2FjaGU6IHsgW3NlbGVjdG9yOiBzdHJpbmddOiBzdHJpbmcgfSA9IHt9O1xuICBjb25zdCByYXdDYWNoZTogeyBbc2VsZWN0b3I6IHN0cmluZ106IFJhd1N0eWxlc1tdIH0gPSB7fTtcblxuICBjb25zdCBpc0Jyb3dzZXIgPVxuICAgIHR5cGVvZiB3aW5kb3cgPT09ICdvYmplY3QnICYmIHdpbmRvdyAhPSBudWxsICYmIHdpbmRvdy5kb2N1bWVudCAhPSBudWxsO1xuICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgZ2xvYmFsLXJlcXVpcmVcbiAgY29uc3QgZG9jdW1lbnQgPSBpc0Jyb3dzZXIgPyB3aW5kb3cuZG9jdW1lbnQgOiByZXF1aXJlKCcuL2RvY3VtZW50JykuZGVmYXVsdDtcblxuICBjb25zdCBzdHlsZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3N0eWxlJyk7XG4gIGNvbnN0IG5vZGUgPSBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZSgnJyk7XG5cbiAgc3R5bGUuYXBwZW5kQ2hpbGQobm9kZSk7XG4gIHN0eWxlLnNldEF0dHJpYnV0ZSgndHlwZScsICd0ZXh0L2NzcycpO1xuXG4gIGRvY3VtZW50LmhlYWQuYXBwZW5kQ2hpbGQoc3R5bGUpO1xuXG4gIGlmIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Rlc3QnICYmIGlzQnJvd3Nlcikge1xuICAgIGNvbnNvbGUud2FybihcbiAgICAgICdCYWJlbCBwcmVzZXQgZm9yIExpbmFyaWEgaXMgbm90IGNvbmZpZ3VyZWQuIFNlZSBodHRwczovL2dpdGh1Yi5jb20vY2FsbHN0YWNrL2xpbmFyaWEvYmxvYi9tYXN0ZXIvZG9jcy9CQUJFTF9QUkVTRVQubWQgZm9yIGluc3RydWN0aW9ucy4nXG4gICAgKTtcbiAgfVxuXG4gIHJldHVybiB7XG4gICAgaW5zZXJ0UmF3KHtcbiAgICAgIGZpbGVuYW1lLFxuICAgICAgdGVtcGxhdGUsXG4gICAgICBleHByZXNzaW9ucyxcbiAgICAgIGNsYXNzbmFtZSxcbiAgICB9OiBSYXdTdHlsZXMgJiB7IGZpbGVuYW1lOiA/c3RyaW5nIH0pIHtcbiAgICAgIGlmIChmaWxlbmFtZSAmJiBwcm9jZXNzLmVudi5MSU5BUklBX0NPTExFQ1RfUkFXX1NUWUxFUykge1xuICAgICAgICByYXdDYWNoZVtmaWxlbmFtZV0gPSAocmF3Q2FjaGVbZmlsZW5hbWVdIHx8IFtdKS5jb25jYXQoe1xuICAgICAgICAgIHRlbXBsYXRlLFxuICAgICAgICAgIGV4cHJlc3Npb25zLFxuICAgICAgICAgIGNsYXNzbmFtZSxcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfSxcbiAgICBpbnNlcnQoc2VsZWN0b3I6IHN0cmluZywgY3NzOiBzdHJpbmcpIHtcbiAgICAgIGlmIChzZWxlY3RvciBpbiBjYWNoZSkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IHRleHQgPSBzdHlsaXMoc2VsZWN0b3IsIGNzcyk7XG4gICAgICBjYWNoZVtzZWxlY3Rvcl0gPSBjc3M7XG4gICAgICBub2RlLmFwcGVuZERhdGEoYFxcbiR7dGV4dH1gKTtcbiAgICB9LFxuICAgIHJhd1N0eWxlcygpIHtcbiAgICAgIHJldHVybiByYXdDYWNoZTtcbiAgICB9LFxuICAgIHN0eWxlcygpIHtcbiAgICAgIHJldHVybiBjYWNoZTtcbiAgICB9LFxuICAgIGR1bXAoKSB7XG4gICAgICBjb25zdCByZXN1bHQgPSBub2RlLnRleHRDb250ZW50O1xuICAgICAgY2FjaGUgPSB7fTtcbiAgICAgIG5vZGUudGV4dENvbnRlbnQgPSAnJztcbiAgICAgIHJldHVybiByZXN1bHQudHJpbSgpO1xuICAgIH0sXG4gIH07XG59XG5cbmV4cG9ydCBkZWZhdWx0IHNoZWV0KCk7XG4iXX0=