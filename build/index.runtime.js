'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _names = require('./names');

Object.defineProperty(exports, 'names', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_names).default;
  }
});

var _styles = require('./styles');

Object.defineProperty(exports, 'styles', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_styles).default;
  }
});
exports.css = css;
exports.include = include;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var createError = function createError(id) {
  return new Error('Looks like you tried to use ' + id + ' from \'linaria\' in runtime, but it\'s not supported.');
};

function css() {
  throw createError('css');
}

css.named = function () {
  throw createError('css.named');
};

css.include = function () {
  throw createError('css.include');
};

function include() {
  throw createError('include');
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9pbmRleC5ydW50aW1lLmpzIl0sIm5hbWVzIjpbImRlZmF1bHQiLCJjc3MiLCJpbmNsdWRlIiwiY3JlYXRlRXJyb3IiLCJFcnJvciIsImlkIiwibmFtZWQiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OzBDQUVTQSxPOzs7Ozs7Ozs7MkNBQ0FBLE87OztRQVNPQyxHLEdBQUFBLEc7UUFZQUMsTyxHQUFBQSxPOzs7O0FBbkJoQixJQUFNQyxjQUFjLFNBQWRBLFdBQWM7QUFBQSxTQUNsQixJQUFJQyxLQUFKLGtDQUVJQyxFQUZKLDREQURrQjtBQUFBLENBQXBCOztBQU9PLFNBQVNKLEdBQVQsR0FBZTtBQUNwQixRQUFNRSxZQUFZLEtBQVosQ0FBTjtBQUNEOztBQUVERixJQUFJSyxLQUFKLEdBQVksWUFBTTtBQUNoQixRQUFNSCxZQUFZLFdBQVosQ0FBTjtBQUNELENBRkQ7O0FBSUFGLElBQUlDLE9BQUosR0FBYyxZQUFNO0FBQ2xCLFFBQU1DLFlBQVksYUFBWixDQUFOO0FBQ0QsQ0FGRDs7QUFJTyxTQUFTRCxPQUFULEdBQW1CO0FBQ3hCLFFBQU1DLFlBQVksU0FBWixDQUFOO0FBQ0QiLCJmaWxlIjoiaW5kZXgucnVudGltZS5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qIEBmbG93ICovXG5cbmV4cG9ydCB7IGRlZmF1bHQgYXMgbmFtZXMgfSBmcm9tICcuL25hbWVzJztcbmV4cG9ydCB7IGRlZmF1bHQgYXMgc3R5bGVzIH0gZnJvbSAnLi9zdHlsZXMnO1xuXG5jb25zdCBjcmVhdGVFcnJvciA9IGlkID0+XG4gIG5ldyBFcnJvcihcbiAgICBgTG9va3MgbGlrZSB5b3UgdHJpZWQgdG8gdXNlICR7XG4gICAgICBpZFxuICAgIH0gZnJvbSAnbGluYXJpYScgaW4gcnVudGltZSwgYnV0IGl0J3Mgbm90IHN1cHBvcnRlZC5gXG4gICk7XG5cbmV4cG9ydCBmdW5jdGlvbiBjc3MoKSB7XG4gIHRocm93IGNyZWF0ZUVycm9yKCdjc3MnKTtcbn1cblxuY3NzLm5hbWVkID0gKCkgPT4ge1xuICB0aHJvdyBjcmVhdGVFcnJvcignY3NzLm5hbWVkJyk7XG59O1xuXG5jc3MuaW5jbHVkZSA9ICgpID0+IHtcbiAgdGhyb3cgY3JlYXRlRXJyb3IoJ2Nzcy5pbmNsdWRlJyk7XG59O1xuXG5leHBvcnQgZnVuY3Rpb24gaW5jbHVkZSgpIHtcbiAgdGhyb3cgY3JlYXRlRXJyb3IoJ2luY2x1ZGUnKTtcbn1cbiJdfQ==