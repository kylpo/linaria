'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = getReplacement;
function getReplacement(requirements) {
  var output = [];

  var addLines = function addLines(lines, startIndex) {
    lines.forEach(function (line, i) {
      output[startIndex + i] = line;
    });
  };

  requirements.forEach(function (requirement) {
    var code = requirement.code,
        line = requirement.loc.line;

    var lineIndex = line - 1;
    var linesToAdd = code.split('\n');
    addLines(linesToAdd, lineIndex);
  });

  output.push('/* linaria-preval */');

  return output.join('\n');
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9iYWJlbC9wcmV2YWwtZXh0cmFjdC9nZXRSZXBsYWNlbWVudC5qcyJdLCJuYW1lcyI6WyJnZXRSZXBsYWNlbWVudCIsInJlcXVpcmVtZW50cyIsIm91dHB1dCIsImFkZExpbmVzIiwibGluZXMiLCJzdGFydEluZGV4IiwiZm9yRWFjaCIsImxpbmUiLCJpIiwiY29kZSIsInJlcXVpcmVtZW50IiwibG9jIiwibGluZUluZGV4IiwibGluZXNUb0FkZCIsInNwbGl0IiwicHVzaCIsImpvaW4iXSwibWFwcGluZ3MiOiI7Ozs7O2tCQUl3QkEsYztBQUFULFNBQVNBLGNBQVQsQ0FDYkMsWUFEYSxFQUVMO0FBQ1IsTUFBTUMsU0FBUyxFQUFmOztBQUVBLE1BQU1DLFdBQVcsU0FBWEEsUUFBVyxDQUFDQyxLQUFELEVBQVFDLFVBQVIsRUFBdUI7QUFDdENELFVBQU1FLE9BQU4sQ0FBYyxVQUFDQyxJQUFELEVBQU9DLENBQVAsRUFBYTtBQUN6Qk4sYUFBT0csYUFBYUcsQ0FBcEIsSUFBeUJELElBQXpCO0FBQ0QsS0FGRDtBQUdELEdBSkQ7O0FBTUFOLGVBQWFLLE9BQWIsQ0FBcUIsdUJBQWU7QUFBQSxRQUMxQkcsSUFEMEIsR0FDRkMsV0FERSxDQUMxQkQsSUFEMEI7QUFBQSxRQUNiRixJQURhLEdBQ0ZHLFdBREUsQ0FDcEJDLEdBRG9CLENBQ2JKLElBRGE7O0FBRWxDLFFBQU1LLFlBQVlMLE9BQU8sQ0FBekI7QUFDQSxRQUFNTSxhQUFhSixLQUFLSyxLQUFMLENBQVcsSUFBWCxDQUFuQjtBQUNBWCxhQUFTVSxVQUFULEVBQXFCRCxTQUFyQjtBQUNELEdBTEQ7O0FBT0FWLFNBQU9hLElBQVAsQ0FBWSxzQkFBWjs7QUFFQSxTQUFPYixPQUFPYyxJQUFQLENBQVksSUFBWixDQUFQO0FBQ0QiLCJmaWxlIjoiZ2V0UmVwbGFjZW1lbnQuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiBAZmxvdyAqL1xuXG5pbXBvcnQgdHlwZSB7IFJlcXVpcmVtZW50U291cmNlIH0gZnJvbSAnLi4vdHlwZXMnO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBnZXRSZXBsYWNlbWVudChcbiAgcmVxdWlyZW1lbnRzOiBSZXF1aXJlbWVudFNvdXJjZVtdXG4pOiBzdHJpbmcge1xuICBjb25zdCBvdXRwdXQgPSBbXTtcblxuICBjb25zdCBhZGRMaW5lcyA9IChsaW5lcywgc3RhcnRJbmRleCkgPT4ge1xuICAgIGxpbmVzLmZvckVhY2goKGxpbmUsIGkpID0+IHtcbiAgICAgIG91dHB1dFtzdGFydEluZGV4ICsgaV0gPSBsaW5lO1xuICAgIH0pO1xuICB9O1xuXG4gIHJlcXVpcmVtZW50cy5mb3JFYWNoKHJlcXVpcmVtZW50ID0+IHtcbiAgICBjb25zdCB7IGNvZGUsIGxvYzogeyBsaW5lIH0gfSA9IHJlcXVpcmVtZW50O1xuICAgIGNvbnN0IGxpbmVJbmRleCA9IGxpbmUgLSAxO1xuICAgIGNvbnN0IGxpbmVzVG9BZGQgPSBjb2RlLnNwbGl0KCdcXG4nKTtcbiAgICBhZGRMaW5lcyhsaW5lc1RvQWRkLCBsaW5lSW5kZXgpO1xuICB9KTtcblxuICBvdXRwdXQucHVzaCgnLyogbGluYXJpYS1wcmV2YWwgKi8nKTtcblxuICByZXR1cm4gb3V0cHV0LmpvaW4oJ1xcbicpO1xufVxuIl19