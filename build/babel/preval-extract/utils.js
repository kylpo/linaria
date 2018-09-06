'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getSelfBinding = getSelfBinding;
exports.relativeToCwd = relativeToCwd;
exports.makeAbsolute = makeAbsolute;

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function getSelfBinding(nodePath) {
  return nodePath.scope.getBinding(nodePath.node.name);
}

function relativeToCwd(filename) {
  return _path2.default.isAbsolute(filename) ? _path2.default.relative(process.cwd(), filename) : filename;
}

function makeAbsolute(filename) {
  return _path2.default.isAbsolute(filename) ? filename : _path2.default.resolve(filename);
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9iYWJlbC9wcmV2YWwtZXh0cmFjdC91dGlscy5qcyJdLCJuYW1lcyI6WyJnZXRTZWxmQmluZGluZyIsInJlbGF0aXZlVG9Dd2QiLCJtYWtlQWJzb2x1dGUiLCJub2RlUGF0aCIsInNjb3BlIiwiZ2V0QmluZGluZyIsIm5vZGUiLCJuYW1lIiwiZmlsZW5hbWUiLCJpc0Fic29sdXRlIiwicmVsYXRpdmUiLCJwcm9jZXNzIiwiY3dkIiwicmVzb2x2ZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7UUFNZ0JBLGMsR0FBQUEsYztRQUlBQyxhLEdBQUFBLGE7UUFNQUMsWSxHQUFBQSxZOztBQWRoQjs7Ozs7O0FBSU8sU0FBU0YsY0FBVCxDQUF3QkcsUUFBeEIsRUFBaUQ7QUFDdEQsU0FBT0EsU0FBU0MsS0FBVCxDQUFlQyxVQUFmLENBQTBCRixTQUFTRyxJQUFULENBQWNDLElBQXhDLENBQVA7QUFDRDs7QUFFTSxTQUFTTixhQUFULENBQXVCTyxRQUF2QixFQUFpRDtBQUN0RCxTQUFPLGVBQUtDLFVBQUwsQ0FBZ0JELFFBQWhCLElBQ0gsZUFBS0UsUUFBTCxDQUFjQyxRQUFRQyxHQUFSLEVBQWQsRUFBNkJKLFFBQTdCLENBREcsR0FFSEEsUUFGSjtBQUdEOztBQUVNLFNBQVNOLFlBQVQsQ0FBc0JNLFFBQXRCLEVBQWdEO0FBQ3JELFNBQU8sZUFBS0MsVUFBTCxDQUFnQkQsUUFBaEIsSUFBNEJBLFFBQTVCLEdBQXVDLGVBQUtLLE9BQUwsQ0FBYUwsUUFBYixDQUE5QztBQUNEIiwiZmlsZSI6InV0aWxzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyogQGZsb3cgKi9cblxuaW1wb3J0IHBhdGggZnJvbSAncGF0aCc7XG5cbmltcG9ydCB0eXBlIHsgTm9kZVBhdGggfSBmcm9tICcuLi90eXBlcyc7XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRTZWxmQmluZGluZyhub2RlUGF0aDogTm9kZVBhdGg8YW55Pikge1xuICByZXR1cm4gbm9kZVBhdGguc2NvcGUuZ2V0QmluZGluZyhub2RlUGF0aC5ub2RlLm5hbWUpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gcmVsYXRpdmVUb0N3ZChmaWxlbmFtZTogc3RyaW5nKTogc3RyaW5nIHtcbiAgcmV0dXJuIHBhdGguaXNBYnNvbHV0ZShmaWxlbmFtZSlcbiAgICA/IHBhdGgucmVsYXRpdmUocHJvY2Vzcy5jd2QoKSwgZmlsZW5hbWUpXG4gICAgOiBmaWxlbmFtZTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIG1ha2VBYnNvbHV0ZShmaWxlbmFtZTogc3RyaW5nKTogc3RyaW5nIHtcbiAgcmV0dXJuIHBhdGguaXNBYnNvbHV0ZShmaWxlbmFtZSkgPyBmaWxlbmFtZSA6IHBhdGgucmVzb2x2ZShmaWxlbmFtZSk7XG59XG4iXX0=