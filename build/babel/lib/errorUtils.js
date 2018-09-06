'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.getFramesFromStack = getFramesFromStack;
exports.enhanceFrames = enhanceFrames;
exports.buildCodeFrameError = buildCodeFrameError;

var _sourceMap = require('source-map');

var _babelCodeFrame = require('babel-code-frame');

var _babelCodeFrame2 = _interopRequireDefault(_babelCodeFrame);

var _errorStackParser = require('error-stack-parser');

var _errorStackParser2 = _interopRequireDefault(_errorStackParser);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function getFramesFromStack(error, findLastFrame) {
  var allFrames = _errorStackParser2.default.parse(error);
  var lastMeaningfulFrame = findLastFrame ? findLastFrame(allFrames) : allFrames.length - 1;
  return allFrames.slice(0, lastMeaningfulFrame + 1);
}

function enhanceFrames(frames, modulesCache) {
  return frames.map(function (frame) {
    var consumer = (0, _sourceMap.SourceMapConsumer)(modulesCache[frame.fileName].sourceMap);

    var originalPosition = consumer.originalPositionFor({
      line: frame.lineNumber,
      column: frame.columnNumber
    });

    return _extends({}, frame, {
      lineNumber: originalPosition.line !== null ? originalPosition.line : frame.lineNumber,
      columnNumber: originalPosition.column !== null ? originalPosition.column : frame.columnNumber,
      originalSource: consumer.sourcesContent[0]
    });
  });
}

function buildCodeFrameError(error, frames) {
  var firstFrame = frames && frames[0];

  if (!firstFrame) {
    return error;
  }

  var codeFrameString = (0, _babelCodeFrame2.default)(firstFrame.originalSource, firstFrame.lineNumber, firstFrame.columnNumber, {
    highlightCode: true,
    linesAbove: 4,
    /* istanbul ignore next line */
    forceColor: !!process.env.CI
  });

  var callStack = frames.map(function (frame) {
    return 'at ' + frame.fileName + ':' + frame.lineNumber + ':' + frame.columnNumber;
  }).join('\n');

  error.stack = 'Error: ' + error.message + '\n' + codeFrameString + '\n' + callStack;
  return error;
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9iYWJlbC9saWIvZXJyb3JVdGlscy5qcyJdLCJuYW1lcyI6WyJnZXRGcmFtZXNGcm9tU3RhY2siLCJlbmhhbmNlRnJhbWVzIiwiYnVpbGRDb2RlRnJhbWVFcnJvciIsImVycm9yIiwiZmluZExhc3RGcmFtZSIsImFsbEZyYW1lcyIsInBhcnNlIiwibGFzdE1lYW5pbmdmdWxGcmFtZSIsImxlbmd0aCIsInNsaWNlIiwiZnJhbWVzIiwibW9kdWxlc0NhY2hlIiwibWFwIiwiY29uc3VtZXIiLCJmcmFtZSIsImZpbGVOYW1lIiwic291cmNlTWFwIiwib3JpZ2luYWxQb3NpdGlvbiIsIm9yaWdpbmFsUG9zaXRpb25Gb3IiLCJsaW5lIiwibGluZU51bWJlciIsImNvbHVtbiIsImNvbHVtbk51bWJlciIsIm9yaWdpbmFsU291cmNlIiwic291cmNlc0NvbnRlbnQiLCJmaXJzdEZyYW1lIiwiY29kZUZyYW1lU3RyaW5nIiwiaGlnaGxpZ2h0Q29kZSIsImxpbmVzQWJvdmUiLCJmb3JjZUNvbG9yIiwicHJvY2VzcyIsImVudiIsIkNJIiwiY2FsbFN0YWNrIiwiam9pbiIsInN0YWNrIiwibWVzc2FnZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7UUFnQmdCQSxrQixHQUFBQSxrQjtRQVdBQyxhLEdBQUFBLGE7UUEyQkFDLG1CLEdBQUFBLG1COztBQXBEaEI7O0FBQ0E7Ozs7QUFDQTs7Ozs7O0FBWU8sU0FBU0Ysa0JBQVQsQ0FDTEcsS0FESyxFQUVMQyxhQUZLLEVBR0k7QUFDVCxNQUFNQyxZQUFZLDJCQUFpQkMsS0FBakIsQ0FBdUJILEtBQXZCLENBQWxCO0FBQ0EsTUFBTUksc0JBQXNCSCxnQkFDeEJBLGNBQWNDLFNBQWQsQ0FEd0IsR0FFeEJBLFVBQVVHLE1BQVYsR0FBbUIsQ0FGdkI7QUFHQSxTQUFPSCxVQUFVSSxLQUFWLENBQWdCLENBQWhCLEVBQW1CRixzQkFBc0IsQ0FBekMsQ0FBUDtBQUNEOztBQUVNLFNBQVNOLGFBQVQsQ0FDTFMsTUFESyxFQUVMQyxZQUZLLEVBR1k7QUFDakIsU0FBT0QsT0FBT0UsR0FBUCxDQUFXLGlCQUFTO0FBQ3pCLFFBQU1DLFdBQVcsa0NBQWtCRixhQUFhRyxNQUFNQyxRQUFuQixFQUE2QkMsU0FBL0MsQ0FBakI7O0FBRUEsUUFBTUMsbUJBQW1CSixTQUFTSyxtQkFBVCxDQUE2QjtBQUNwREMsWUFBTUwsTUFBTU0sVUFEd0M7QUFFcERDLGNBQVFQLE1BQU1RO0FBRnNDLEtBQTdCLENBQXpCOztBQUtBLHdCQUNLUixLQURMO0FBRUVNLGtCQUNFSCxpQkFBaUJFLElBQWpCLEtBQTBCLElBQTFCLEdBQ0lGLGlCQUFpQkUsSUFEckIsR0FFSUwsTUFBTU0sVUFMZDtBQU1FRSxvQkFDRUwsaUJBQWlCSSxNQUFqQixLQUE0QixJQUE1QixHQUNJSixpQkFBaUJJLE1BRHJCLEdBRUlQLE1BQU1RLFlBVGQ7QUFVRUMsc0JBQWdCVixTQUFTVyxjQUFULENBQXdCLENBQXhCO0FBVmxCO0FBWUQsR0FwQk0sQ0FBUDtBQXFCRDs7QUFFTSxTQUFTdEIsbUJBQVQsQ0FDTEMsS0FESyxFQUVMTyxNQUZLLEVBR0U7QUFDUCxNQUFNZSxhQUFhZixVQUFVQSxPQUFPLENBQVAsQ0FBN0I7O0FBRUEsTUFBSSxDQUFDZSxVQUFMLEVBQWlCO0FBQ2YsV0FBT3RCLEtBQVA7QUFDRDs7QUFFRCxNQUFNdUIsa0JBQWtCLDhCQUN0QkQsV0FBV0YsY0FEVyxFQUV0QkUsV0FBV0wsVUFGVyxFQUd0QkssV0FBV0gsWUFIVyxFQUl0QjtBQUNFSyxtQkFBZSxJQURqQjtBQUVFQyxnQkFBWSxDQUZkO0FBR0U7QUFDQUMsZ0JBQVksQ0FBQyxDQUFDQyxRQUFRQyxHQUFSLENBQVlDO0FBSjVCLEdBSnNCLENBQXhCOztBQVlBLE1BQU1DLFlBQVl2QixPQUNmRSxHQURlLENBRWQ7QUFBQSxtQkFBZUUsTUFBTUMsUUFBckIsU0FBaUNELE1BQU1NLFVBQXZDLFNBQXFETixNQUFNUSxZQUEzRDtBQUFBLEdBRmMsRUFJZlksSUFKZSxDQUlWLElBSlUsQ0FBbEI7O0FBTUEvQixRQUFNZ0MsS0FBTixlQUF3QmhDLE1BQU1pQyxPQUE5QixVQUEwQ1YsZUFBMUMsVUFBOERPLFNBQTlEO0FBQ0EsU0FBTzlCLEtBQVA7QUFDRCIsImZpbGUiOiJlcnJvclV0aWxzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyogQGZsb3cgKi9cblxuaW1wb3J0IHsgU291cmNlTWFwQ29uc3VtZXIgfSBmcm9tICdzb3VyY2UtbWFwJztcbmltcG9ydCBjb2RlRnJhbWUgZnJvbSAnYmFiZWwtY29kZS1mcmFtZSc7XG5pbXBvcnQgZXJyb3JTdGFja1BhcnNlciBmcm9tICdlcnJvci1zdGFjay1wYXJzZXInO1xuXG50eXBlIEZyYW1lID0ge1xuICBmdW5jdGlvbk5hbWU6IHN0cmluZyxcbiAgbGluZU51bWJlcjogbnVtYmVyLFxuICBjb2x1bW5OdW1iZXI6IG51bWJlcixcbiAgZmlsZU5hbWU6IHN0cmluZyxcbiAgc291cmNlOiBzdHJpbmcsXG59O1xuXG50eXBlIEVuaGFuY2VkRnJhbWUgPSBGcmFtZSAmIHsgb3JpZ2luYWxTb3VyY2U6IHN0cmluZyB9O1xuXG5leHBvcnQgZnVuY3Rpb24gZ2V0RnJhbWVzRnJvbVN0YWNrKFxuICBlcnJvcjogRXJyb3IsXG4gIGZpbmRMYXN0RnJhbWU/OiAoZnJhbWVzOiBGcmFtZVtdKSA9PiBudW1iZXJcbik6IEZyYW1lW10ge1xuICBjb25zdCBhbGxGcmFtZXMgPSBlcnJvclN0YWNrUGFyc2VyLnBhcnNlKGVycm9yKTtcbiAgY29uc3QgbGFzdE1lYW5pbmdmdWxGcmFtZSA9IGZpbmRMYXN0RnJhbWVcbiAgICA/IGZpbmRMYXN0RnJhbWUoYWxsRnJhbWVzKVxuICAgIDogYWxsRnJhbWVzLmxlbmd0aCAtIDE7XG4gIHJldHVybiBhbGxGcmFtZXMuc2xpY2UoMCwgbGFzdE1lYW5pbmdmdWxGcmFtZSArIDEpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZW5oYW5jZUZyYW1lcyhcbiAgZnJhbWVzOiBGcmFtZVtdLFxuICBtb2R1bGVzQ2FjaGU6IHsgW2tleTogc3RyaW5nXTogT2JqZWN0IH1cbik6IEVuaGFuY2VkRnJhbWVbXSB7XG4gIHJldHVybiBmcmFtZXMubWFwKGZyYW1lID0+IHtcbiAgICBjb25zdCBjb25zdW1lciA9IFNvdXJjZU1hcENvbnN1bWVyKG1vZHVsZXNDYWNoZVtmcmFtZS5maWxlTmFtZV0uc291cmNlTWFwKTtcblxuICAgIGNvbnN0IG9yaWdpbmFsUG9zaXRpb24gPSBjb25zdW1lci5vcmlnaW5hbFBvc2l0aW9uRm9yKHtcbiAgICAgIGxpbmU6IGZyYW1lLmxpbmVOdW1iZXIsXG4gICAgICBjb2x1bW46IGZyYW1lLmNvbHVtbk51bWJlcixcbiAgICB9KTtcblxuICAgIHJldHVybiB7XG4gICAgICAuLi5mcmFtZSxcbiAgICAgIGxpbmVOdW1iZXI6XG4gICAgICAgIG9yaWdpbmFsUG9zaXRpb24ubGluZSAhPT0gbnVsbFxuICAgICAgICAgID8gb3JpZ2luYWxQb3NpdGlvbi5saW5lXG4gICAgICAgICAgOiBmcmFtZS5saW5lTnVtYmVyLFxuICAgICAgY29sdW1uTnVtYmVyOlxuICAgICAgICBvcmlnaW5hbFBvc2l0aW9uLmNvbHVtbiAhPT0gbnVsbFxuICAgICAgICAgID8gb3JpZ2luYWxQb3NpdGlvbi5jb2x1bW5cbiAgICAgICAgICA6IGZyYW1lLmNvbHVtbk51bWJlcixcbiAgICAgIG9yaWdpbmFsU291cmNlOiBjb25zdW1lci5zb3VyY2VzQ29udGVudFswXSxcbiAgICB9O1xuICB9KTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGJ1aWxkQ29kZUZyYW1lRXJyb3IoXG4gIGVycm9yOiBFcnJvcixcbiAgZnJhbWVzOiBFbmhhbmNlZEZyYW1lW11cbik6IEVycm9yIHtcbiAgY29uc3QgZmlyc3RGcmFtZSA9IGZyYW1lcyAmJiBmcmFtZXNbMF07XG5cbiAgaWYgKCFmaXJzdEZyYW1lKSB7XG4gICAgcmV0dXJuIGVycm9yO1xuICB9XG5cbiAgY29uc3QgY29kZUZyYW1lU3RyaW5nID0gY29kZUZyYW1lKFxuICAgIGZpcnN0RnJhbWUub3JpZ2luYWxTb3VyY2UsXG4gICAgZmlyc3RGcmFtZS5saW5lTnVtYmVyLFxuICAgIGZpcnN0RnJhbWUuY29sdW1uTnVtYmVyLFxuICAgIHtcbiAgICAgIGhpZ2hsaWdodENvZGU6IHRydWUsXG4gICAgICBsaW5lc0Fib3ZlOiA0LFxuICAgICAgLyogaXN0YW5idWwgaWdub3JlIG5leHQgbGluZSAqL1xuICAgICAgZm9yY2VDb2xvcjogISFwcm9jZXNzLmVudi5DSSxcbiAgICB9XG4gICk7XG5cbiAgY29uc3QgY2FsbFN0YWNrID0gZnJhbWVzXG4gICAgLm1hcChcbiAgICAgIGZyYW1lID0+IGBhdCAke2ZyYW1lLmZpbGVOYW1lfToke2ZyYW1lLmxpbmVOdW1iZXJ9OiR7ZnJhbWUuY29sdW1uTnVtYmVyfWBcbiAgICApXG4gICAgLmpvaW4oJ1xcbicpO1xuXG4gIGVycm9yLnN0YWNrID0gYEVycm9yOiAke2Vycm9yLm1lc3NhZ2V9XFxuJHtjb2RlRnJhbWVTdHJpbmd9XFxuJHtjYWxsU3RhY2t9YDtcbiAgcmV0dXJuIGVycm9yO1xufVxuIl19