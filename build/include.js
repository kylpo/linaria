'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = include;

var _sheet = require('./sheet');

var _sheet2 = _interopRequireDefault(_sheet);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function include() {
  var styles = _sheet2.default.styles();

  for (var _len = arguments.length, classNames = Array(_len), _key = 0; _key < _len; _key++) {
    classNames[_key] = arguments[_key];
  }

  return classNames.reduce(function (cssText, className) {
    var selector = '.' + className;
    if (selector in styles) {
      return cssText + '\n' + styles[selector];
    }
    throw new Error('Unable to find CSS for the class name: ' + className);
  }, '');
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9pbmNsdWRlLmpzIl0sIm5hbWVzIjpbImluY2x1ZGUiLCJzdHlsZXMiLCJjbGFzc05hbWVzIiwicmVkdWNlIiwiY3NzVGV4dCIsImNsYXNzTmFtZSIsInNlbGVjdG9yIiwiRXJyb3IiXSwibWFwcGluZ3MiOiI7Ozs7O2tCQUl3QkEsTzs7QUFGeEI7Ozs7OztBQUVlLFNBQVNBLE9BQVQsR0FBa0Q7QUFDL0QsTUFBTUMsU0FBUyxnQkFBTUEsTUFBTixFQUFmOztBQUQrRCxvQ0FBOUJDLFVBQThCO0FBQTlCQSxjQUE4QjtBQUFBOztBQUUvRCxTQUFPQSxXQUFXQyxNQUFYLENBQWtCLFVBQUNDLE9BQUQsRUFBVUMsU0FBVixFQUF3QjtBQUMvQyxRQUFNQyxpQkFBZUQsU0FBckI7QUFDQSxRQUFJQyxZQUFZTCxNQUFoQixFQUF3QjtBQUN0QixhQUFVRyxPQUFWLFVBQXNCSCxPQUFPSyxRQUFQLENBQXRCO0FBQ0Q7QUFDRCxVQUFNLElBQUlDLEtBQUosNkNBQW9ERixTQUFwRCxDQUFOO0FBQ0QsR0FOTSxFQU1KLEVBTkksQ0FBUDtBQU9EIiwiZmlsZSI6ImluY2x1ZGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiBAZmxvdyAqL1xuXG5pbXBvcnQgc2hlZXQgZnJvbSAnLi9zaGVldCc7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGluY2x1ZGUoLi4uY2xhc3NOYW1lczogc3RyaW5nW10pOiBzdHJpbmcge1xuICBjb25zdCBzdHlsZXMgPSBzaGVldC5zdHlsZXMoKTtcbiAgcmV0dXJuIGNsYXNzTmFtZXMucmVkdWNlKChjc3NUZXh0LCBjbGFzc05hbWUpID0+IHtcbiAgICBjb25zdCBzZWxlY3RvciA9IGAuJHtjbGFzc05hbWV9YDtcbiAgICBpZiAoc2VsZWN0b3IgaW4gc3R5bGVzKSB7XG4gICAgICByZXR1cm4gYCR7Y3NzVGV4dH1cXG4ke3N0eWxlc1tzZWxlY3Rvcl19YDtcbiAgICB9XG4gICAgdGhyb3cgbmV3IEVycm9yKGBVbmFibGUgdG8gZmluZCBDU1MgZm9yIHRoZSBjbGFzcyBuYW1lOiAke2NsYXNzTmFtZX1gKTtcbiAgfSwgJycpO1xufVxuIl19