'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isLinariaTaggedTemplate = isLinariaTaggedTemplate;
exports.shouldTraverseExternalIds = shouldTraverseExternalIds;
exports.isExcluded = isExcluded;

var _utils = require('./utils');

function isLinariaTaggedTemplate(types, path) {
  var isCssTagged = types.isIdentifier(path.node.tag) && path.node.tag.name === 'css';
  var isCssNamedTagged = types.isCallExpression(path.node.tag) && types.isMemberExpression(path.node.tag.callee) && path.node.tag.callee.object.name === 'css' && path.node.tag.callee.property.name === 'named' || types.isMemberExpression(path.node.tag) && path.node.tag.object.name === 'css' && path.node.tag.property.name === 'named';
  var hasArguments = isCssNamedTagged && types.isCallExpression(path.node.tag) && path.node.tag.arguments.length;

  if (isCssTagged || isCssNamedTagged && hasArguments) {
    return true;
  }

  if (isCssNamedTagged && !hasArguments) {
    throw new Error("Linaria's `css.named` must be called with a class name");
  }

  return false;
}

function shouldTraverseExternalIds(path) {
  if (path.isImportDefaultSpecifier() || path.isImportSpecifier()) {
    return false;
  }

  return true;
}

function isExcluded(path) {
  var binding = (0, _utils.getSelfBinding)(path);
  return binding && binding.kind === 'param';
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9iYWJlbC9wcmV2YWwtZXh0cmFjdC92YWxpZGF0b3JzLmpzIl0sIm5hbWVzIjpbImlzTGluYXJpYVRhZ2dlZFRlbXBsYXRlIiwic2hvdWxkVHJhdmVyc2VFeHRlcm5hbElkcyIsImlzRXhjbHVkZWQiLCJ0eXBlcyIsInBhdGgiLCJpc0Nzc1RhZ2dlZCIsImlzSWRlbnRpZmllciIsIm5vZGUiLCJ0YWciLCJuYW1lIiwiaXNDc3NOYW1lZFRhZ2dlZCIsImlzQ2FsbEV4cHJlc3Npb24iLCJpc01lbWJlckV4cHJlc3Npb24iLCJjYWxsZWUiLCJvYmplY3QiLCJwcm9wZXJ0eSIsImhhc0FyZ3VtZW50cyIsImFyZ3VtZW50cyIsImxlbmd0aCIsIkVycm9yIiwiaXNJbXBvcnREZWZhdWx0U3BlY2lmaWVyIiwiaXNJbXBvcnRTcGVjaWZpZXIiLCJiaW5kaW5nIiwia2luZCJdLCJtYXBwaW5ncyI6Ijs7Ozs7UUFVZ0JBLHVCLEdBQUFBLHVCO1FBOEJBQyx5QixHQUFBQSx5QjtRQVFBQyxVLEdBQUFBLFU7O0FBeENoQjs7QUFFTyxTQUFTRix1QkFBVCxDQUNMRyxLQURLLEVBRUxDLElBRkssRUFHSTtBQUNULE1BQU1DLGNBQ0pGLE1BQU1HLFlBQU4sQ0FBbUJGLEtBQUtHLElBQUwsQ0FBVUMsR0FBN0IsS0FBcUNKLEtBQUtHLElBQUwsQ0FBVUMsR0FBVixDQUFjQyxJQUFkLEtBQXVCLEtBRDlEO0FBRUEsTUFBTUMsbUJBQ0hQLE1BQU1RLGdCQUFOLENBQXVCUCxLQUFLRyxJQUFMLENBQVVDLEdBQWpDLEtBQ0NMLE1BQU1TLGtCQUFOLENBQXlCUixLQUFLRyxJQUFMLENBQVVDLEdBQVYsQ0FBY0ssTUFBdkMsQ0FERCxJQUVDVCxLQUFLRyxJQUFMLENBQVVDLEdBQVYsQ0FBY0ssTUFBZCxDQUFxQkMsTUFBckIsQ0FBNEJMLElBQTVCLEtBQXFDLEtBRnRDLElBR0NMLEtBQUtHLElBQUwsQ0FBVUMsR0FBVixDQUFjSyxNQUFkLENBQXFCRSxRQUFyQixDQUE4Qk4sSUFBOUIsS0FBdUMsT0FIekMsSUFJQ04sTUFBTVMsa0JBQU4sQ0FBeUJSLEtBQUtHLElBQUwsQ0FBVUMsR0FBbkMsS0FDQ0osS0FBS0csSUFBTCxDQUFVQyxHQUFWLENBQWNNLE1BQWQsQ0FBcUJMLElBQXJCLEtBQThCLEtBRC9CLElBRUNMLEtBQUtHLElBQUwsQ0FBVUMsR0FBVixDQUFjTyxRQUFkLENBQXVCTixJQUF2QixLQUFnQyxPQVBwQztBQVFBLE1BQU1PLGVBQ0pOLG9CQUNBUCxNQUFNUSxnQkFBTixDQUF1QlAsS0FBS0csSUFBTCxDQUFVQyxHQUFqQyxDQURBLElBRUFKLEtBQUtHLElBQUwsQ0FBVUMsR0FBVixDQUFjUyxTQUFkLENBQXdCQyxNQUgxQjs7QUFLQSxNQUFJYixlQUFnQkssb0JBQW9CTSxZQUF4QyxFQUF1RDtBQUNyRCxXQUFPLElBQVA7QUFDRDs7QUFFRCxNQUFJTixvQkFBb0IsQ0FBQ00sWUFBekIsRUFBdUM7QUFDckMsVUFBTSxJQUFJRyxLQUFKLENBQVUsd0RBQVYsQ0FBTjtBQUNEOztBQUVELFNBQU8sS0FBUDtBQUNEOztBQUVNLFNBQVNsQix5QkFBVCxDQUFtQ0csSUFBbkMsRUFBd0Q7QUFDN0QsTUFBSUEsS0FBS2dCLHdCQUFMLE1BQW1DaEIsS0FBS2lCLGlCQUFMLEVBQXZDLEVBQWlFO0FBQy9ELFdBQU8sS0FBUDtBQUNEOztBQUVELFNBQU8sSUFBUDtBQUNEOztBQUVNLFNBQVNuQixVQUFULENBQW9CRSxJQUFwQixFQUFnRDtBQUNyRCxNQUFNa0IsVUFBVSwyQkFBZWxCLElBQWYsQ0FBaEI7QUFDQSxTQUFPa0IsV0FBV0EsUUFBUUMsSUFBUixLQUFpQixPQUFuQztBQUNEIiwiZmlsZSI6InZhbGlkYXRvcnMuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiBAZmxvdyAqL1xuXG5pbXBvcnQgdHlwZSB7XG4gIEJhYmVsVHlwZXMsXG4gIE5vZGVQYXRoLFxuICBCYWJlbFRhZ2dlZFRlbXBsYXRlRXhwcmVzc2lvbixcbn0gZnJvbSAnLi4vdHlwZXMnO1xuXG5pbXBvcnQgeyBnZXRTZWxmQmluZGluZyB9IGZyb20gJy4vdXRpbHMnO1xuXG5leHBvcnQgZnVuY3Rpb24gaXNMaW5hcmlhVGFnZ2VkVGVtcGxhdGUoXG4gIHR5cGVzOiBCYWJlbFR5cGVzLFxuICBwYXRoOiBOb2RlUGF0aDxCYWJlbFRhZ2dlZFRlbXBsYXRlRXhwcmVzc2lvbjxhbnk+PlxuKTogYm9vbGVhbiB7XG4gIGNvbnN0IGlzQ3NzVGFnZ2VkID1cbiAgICB0eXBlcy5pc0lkZW50aWZpZXIocGF0aC5ub2RlLnRhZykgJiYgcGF0aC5ub2RlLnRhZy5uYW1lID09PSAnY3NzJztcbiAgY29uc3QgaXNDc3NOYW1lZFRhZ2dlZCA9XG4gICAgKHR5cGVzLmlzQ2FsbEV4cHJlc3Npb24ocGF0aC5ub2RlLnRhZykgJiZcbiAgICAgIHR5cGVzLmlzTWVtYmVyRXhwcmVzc2lvbihwYXRoLm5vZGUudGFnLmNhbGxlZSkgJiZcbiAgICAgIHBhdGgubm9kZS50YWcuY2FsbGVlLm9iamVjdC5uYW1lID09PSAnY3NzJyAmJlxuICAgICAgcGF0aC5ub2RlLnRhZy5jYWxsZWUucHJvcGVydHkubmFtZSA9PT0gJ25hbWVkJykgfHxcbiAgICAodHlwZXMuaXNNZW1iZXJFeHByZXNzaW9uKHBhdGgubm9kZS50YWcpICYmXG4gICAgICBwYXRoLm5vZGUudGFnLm9iamVjdC5uYW1lID09PSAnY3NzJyAmJlxuICAgICAgcGF0aC5ub2RlLnRhZy5wcm9wZXJ0eS5uYW1lID09PSAnbmFtZWQnKTtcbiAgY29uc3QgaGFzQXJndW1lbnRzID1cbiAgICBpc0Nzc05hbWVkVGFnZ2VkICYmXG4gICAgdHlwZXMuaXNDYWxsRXhwcmVzc2lvbihwYXRoLm5vZGUudGFnKSAmJlxuICAgIHBhdGgubm9kZS50YWcuYXJndW1lbnRzLmxlbmd0aDtcblxuICBpZiAoaXNDc3NUYWdnZWQgfHwgKGlzQ3NzTmFtZWRUYWdnZWQgJiYgaGFzQXJndW1lbnRzKSkge1xuICAgIHJldHVybiB0cnVlO1xuICB9XG5cbiAgaWYgKGlzQ3NzTmFtZWRUYWdnZWQgJiYgIWhhc0FyZ3VtZW50cykge1xuICAgIHRocm93IG5ldyBFcnJvcihcIkxpbmFyaWEncyBgY3NzLm5hbWVkYCBtdXN0IGJlIGNhbGxlZCB3aXRoIGEgY2xhc3MgbmFtZVwiKTtcbiAgfVxuXG4gIHJldHVybiBmYWxzZTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHNob3VsZFRyYXZlcnNlRXh0ZXJuYWxJZHMocGF0aDogTm9kZVBhdGg8YW55Pikge1xuICBpZiAocGF0aC5pc0ltcG9ydERlZmF1bHRTcGVjaWZpZXIoKSB8fCBwYXRoLmlzSW1wb3J0U3BlY2lmaWVyKCkpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICByZXR1cm4gdHJ1ZTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGlzRXhjbHVkZWQocGF0aDogTm9kZVBhdGg8Kj4pOiBib29sZWFuIHtcbiAgY29uc3QgYmluZGluZyA9IGdldFNlbGZCaW5kaW5nKHBhdGgpO1xuICByZXR1cm4gYmluZGluZyAmJiBiaW5kaW5nLmtpbmQgPT09ICdwYXJhbSc7XG59XG4iXX0=