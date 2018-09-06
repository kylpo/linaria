'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.default = linariaLoader;

var _babelCore = require('babel-core');

var babel = _interopRequireWildcard(_babelCore);

var _loaderUtils = require('loader-utils');

var _loaderUtils2 = _interopRequireDefault(_loaderUtils);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function shouldRunLinaria(source) {
  return (/import .+ from ['"]linaria['"]/g.test(source) || /require\(['"]linaria['"]\)/g.test(source)) && /css(\.named)?\s*`/g.test(source);
}

function transpile(source, map, filename, loaderOptions, babelLoaderOptions) {
  var file = new babel.File(_extends({
    filename: filename,
    sourceMaps: true,
    inputSourceMap: map
  }, babelLoaderOptions), new babel.Pipeline());

  // `transformFromAst` is synchronous in Babel 6, but async in Babel 7 hence
  // the `transformFromAstSync`.
  return (babel.transformFromAstSync || babel.transformFromAst)(file.parse(source), source, {
    filename: filename,
    sourceMaps: true,
    inputSourceMap: map,
    presets: [[require.resolve('../../babel.js'), loaderOptions]],
    parserOpts: file.parserOpts,
    babelrc: false
  });
}

function getLinariaParentModules(fs, module) {
  var parentModules = [];

  function findLinariaModules(reasons) {
    reasons.forEach(function (reason) {
      if (!reason.module.resource) {
        return;
      }

      var source = fs.readFileSync(reason.module.resource, 'utf8');
      if (shouldRunLinaria(source)) {
        parentModules.push({ source: source, filename: reason.module.resource });
      }

      findLinariaModules(reason.module.reasons);
    });
  }

  findLinariaModules(module.reasons);

  return parentModules;
}

function getBabelLoaderOptions(loaders) {
  var babelLoader = loaders.find(function (loader) {
    return loader.path.includes('babel-loader');
  });
  if (!babelLoader) {
    return {};
  }

  var _ref = babelLoader.options || {},
      cacheDirectory = _ref.cacheDirectory,
      cacheIdentifier = _ref.cacheIdentifier,
      forceEnv = _ref.forceEnv,
      babelCoreOptions = _objectWithoutProperties(_ref, ['cacheDirectory', 'cacheIdentifier', 'forceEnv']);

  return babelCoreOptions;
}

var builtLinariaModules = [];

function linariaLoader(source, inputMap, meta) {
  var _this = this;

  var options = _loaderUtils2.default.getOptions(this) || {};
  try {
    // If the module has linaria styles, we build it and we're done here.
    if (shouldRunLinaria(source)) {
      var _transpile = transpile(source, inputMap, this.resourcePath, options, getBabelLoaderOptions(this.loaders)),
          code = _transpile.code,
          map = _transpile.map;

      builtLinariaModules.push(this.resourcePath);
      this.callback(null, code, map, meta);
      return;
    }

    // Otherwise, we check for parent modules, which use this one
    // and if they have linaria styles, we build them.
    var parentModuleToTranspile = getLinariaParentModules(this.fs.fileSystem, this._module);

    parentModuleToTranspile.forEach(function (item) {
      // We only care about modules which was previously built.
      if (builtLinariaModules.indexOf(item.filename) > -1) {
        transpile(item.source, null, item.filename, options, getBabelLoaderOptions(_this.loaders));
      }
    });

    this.callback(null, source, inputMap, meta);
  } catch (error) {
    this.callback(error);
  }
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy90b29scy93ZWJwYWNrLWxvYWRlci5qcyJdLCJuYW1lcyI6WyJsaW5hcmlhTG9hZGVyIiwiYmFiZWwiLCJzaG91bGRSdW5MaW5hcmlhIiwic291cmNlIiwidGVzdCIsInRyYW5zcGlsZSIsIm1hcCIsImZpbGVuYW1lIiwibG9hZGVyT3B0aW9ucyIsImJhYmVsTG9hZGVyT3B0aW9ucyIsImZpbGUiLCJGaWxlIiwic291cmNlTWFwcyIsImlucHV0U291cmNlTWFwIiwiUGlwZWxpbmUiLCJ0cmFuc2Zvcm1Gcm9tQXN0U3luYyIsInRyYW5zZm9ybUZyb21Bc3QiLCJwYXJzZSIsInByZXNldHMiLCJyZXF1aXJlIiwicmVzb2x2ZSIsInBhcnNlck9wdHMiLCJiYWJlbHJjIiwiZ2V0TGluYXJpYVBhcmVudE1vZHVsZXMiLCJmcyIsIm1vZHVsZSIsInBhcmVudE1vZHVsZXMiLCJmaW5kTGluYXJpYU1vZHVsZXMiLCJyZWFzb25zIiwiZm9yRWFjaCIsInJlYXNvbiIsInJlc291cmNlIiwicmVhZEZpbGVTeW5jIiwicHVzaCIsImdldEJhYmVsTG9hZGVyT3B0aW9ucyIsImxvYWRlcnMiLCJiYWJlbExvYWRlciIsImZpbmQiLCJsb2FkZXIiLCJwYXRoIiwiaW5jbHVkZXMiLCJvcHRpb25zIiwiY2FjaGVEaXJlY3RvcnkiLCJjYWNoZUlkZW50aWZpZXIiLCJmb3JjZUVudiIsImJhYmVsQ29yZU9wdGlvbnMiLCJidWlsdExpbmFyaWFNb2R1bGVzIiwiaW5wdXRNYXAiLCJtZXRhIiwiZ2V0T3B0aW9ucyIsInJlc291cmNlUGF0aCIsImNvZGUiLCJjYWxsYmFjayIsInBhcmVudE1vZHVsZVRvVHJhbnNwaWxlIiwiZmlsZVN5c3RlbSIsIl9tb2R1bGUiLCJpbmRleE9mIiwiaXRlbSIsImVycm9yIl0sIm1hcHBpbmdzIjoiOzs7Ozs7OztrQkFvRndCQSxhOztBQWxGeEI7O0lBQVlDLEs7O0FBQ1o7Ozs7Ozs7Ozs7QUFFQSxTQUFTQyxnQkFBVCxDQUEwQkMsTUFB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QUNwQkEsSUFEb0I7QUFBQSxVQUNkN0MsR0FEYyxjQUNkQSxHQURjOztBQVE1QndDLDBCQUFvQmIsSUFBcEIsQ0FBeUIsS0FBS2lCLFlBQTlCO0FBQ0EsV0FBS0UsUUFBTCxDQUFjLElBQWQsRUFBb0JELElBQXBCLEVBQTBCN0MsR0FBMUIsRUFBK0IwQyxJQUEvQjtBQUNBO0FBQ0Q7O0FBRUQ7QUFDQTtBQUNBLFFBQU1LLDBCQUEwQjlCLHdCQUM5QixLQUFLQyxFQUFMLENBQVE4QixVQURzQixFQUU5QixLQUFLQyxPQUZ5QixDQUFoQzs7QUFLQUYsNEJBQXdCeEIsT0FBeEIsQ0FBZ0MsZ0JBQVE7QUFDdEM7QUFDQSxVQUFJaUIsb0JBQW9CVSxPQUFwQixDQUE0QkMsS0FBS2xELFFBQWpDLElBQTZDLENBQUMsQ0FBbEQsRUFBcUQ7QUFDbkRGLGtCQUNFb0QsS0FBS3RELE1BRFAsRUFFRSxJQUZGLEVBR0VzRCxLQUFLbEQsUUFIUCxFQUlFa0MsT0FKRixFQUtFUCxzQkFBc0IsTUFBS0MsT0FBM0IsQ0FMRjtBQU9EO0FBQ0YsS0FYRDs7QUFhQSxTQUFLaUIsUUFBTCxDQUFjLElBQWQsRUFBb0JqRCxNQUFwQixFQUE0QjRDLFFBQTVCLEVBQXNDQyxJQUF0QztBQUNELEdBcENELENBb0NFLE9BQU9VLEtBQVAsRUFBYztBQUNkLFNBQUtOLFFBQUwsQ0FBY00sS0FBZDtBQUNEO0FBQ0YiLCJmaWxlIjoid2VicGFjay1sb2FkZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiBAZmxvdyAqL1xuXG5pbXBvcnQgKiBhcyBiYWJlbCBmcm9tICdiYWJlbC1jb3JlJztcbmltcG9ydCBsb2FkZXJVdGlscyBmcm9tICdsb2FkZXItdXRpbHMnO1xuXG5mdW5jdGlvbiBzaG91bGRSdW5MaW5hcmlhKHNvdXJjZTogc3RyaW5nKSB7XG4gIHJldHVybiAoXG4gICAgKC9pbXBvcnQgLisgZnJvbSBbJ1wiXWxpbmFyaWFbJ1wiXS9nLnRlc3Qoc291cmNlKSB8fFxuICAgICAgL3JlcXVpcmVcXChbJ1wiXWxpbmFyaWFbJ1wiXVxcKS9nLnRlc3Qoc291cmNlKSkgJiZcbiAgICAvY3NzKFxcLm5hbWVkKT9cXHMqYC9nLnRlc3Qoc291cmNlKVxuICApO1xufVxuXG5mdW5jdGlvbiB0cmFuc3BpbGUoXG4gIHNvdXJjZTogc3RyaW5nLFxuICBtYXA6IGFueSxcbiAgZmlsZW5hbWU6IHN0cmluZyxcbiAgbG9hZGVyT3B0aW9uczogT2JqZWN0LFxuICBiYWJlbExvYWRlck9wdGlvbnM6IE9iamVjdFxuKSB7XG4gIGNvbnN0IGZpbGUgPSBuZXcgYmFiZWwuRmlsZShcbiAgICB7XG4gICAgICBmaWxlbmFtZSxcbiAgICAgIHNvdXJjZU1hcHM6IHRydWUsXG4gICAgICBpbnB1dFNvdXJjZU1hcDogbWFwLFxuICAgICAgLi4uYmFiZWxMb2FkZXJPcHRpb25zLFxuICAgIH0sXG4gICAgbmV3IGJhYmVsLlBpcGVsaW5lKClcbiAgKTtcblxuICAvLyBgdHJhbnNmb3JtRnJvbUFzdGAgaXMgc3luY2hyb25vdXMgaW4gQmFiZWwgNiwgYnV0IGFzeW5jIGluIEJhYmVsIDcgaGVuY2VcbiAgLy8gdGhlIGB0cmFuc2Zvcm1Gcm9tQXN0U3luY2AuXG4gIHJldHVybiAoYmFiZWwudHJhbnNmb3JtRnJvbUFzdFN5bmMgfHwgYmFiZWwudHJhbnNmb3JtRnJvbUFzdCkoXG4gICAgZmlsZS5wYXJzZShzb3VyY2UpLFxuICAgIHNvdXJjZSxcbiAgICB7XG4gICAgICBmaWxlbmFtZSxcbiAgICAgIHNvdXJjZU1hcHM6IHRydWUsXG4gICAgICBpbnB1dFNvdXJjZU1hcDogbWFwLFxuICAgICAgcHJlc2V0czogW1tyZXF1aXJlLnJlc29sdmUoJy4uLy4uL2JhYmVsLmpzJyksIGxvYWRlck9wdGlvbnNdXSxcbiAgICAgIHBhcnNlck9wdHM6IGZpbGUucGFyc2VyT3B0cyxcbiAgICAgIGJhYmVscmM6IGZhbHNlLFxuICAgIH1cbiAgKTtcbn1cblxuZnVuY3Rpb24gZ2V0TGluYXJpYVBhcmVudE1vZHVsZXMoZnM6IGFueSwgbW9kdWxlOiBhbnkpIHtcbiAgY29uc3QgcGFyZW50TW9kdWxlcyA9IFtdO1xuXG4gIGZ1bmN0aW9uIGZpbmRMaW5hcmlhTW9kdWxlcyhyZWFzb25zKSB7XG4gICAgcmVhc29ucy5mb3JFYWNoKHJlYXNvbiA9PiB7XG4gICAgICBpZiAoIXJlYXNvbi5tb2R1bGUucmVzb3VyY2UpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBjb25zdCBzb3VyY2UgPSBmcy5yZWFkRmlsZVN5bmMocmVhc29uLm1vZHVsZS5yZXNvdXJjZSwgJ3V0ZjgnKTtcbiAgICAgIGlmIChzaG91bGRSdW5MaW5hcmlhKHNvdXJjZSkpIHtcbiAgICAgICAgcGFyZW50TW9kdWxlcy5wdXNoKHsgc291cmNlLCBmaWxlbmFtZTogcmVhc29uLm1vZHVsZS5yZXNvdXJjZSB9KTtcbiAgICAgIH1cblxuICAgICAgZmluZExpbmFyaWFNb2R1bGVzKHJlYXNvbi5tb2R1bGUucmVhc29ucyk7XG4gICAgfSk7XG4gIH1cblxuICBmaW5kTGluYXJpYU1vZHVsZXMobW9kdWxlLnJlYXNvbnMpO1xuXG4gIHJldHVybiBwYXJlbnRNb2R1bGVzO1xufVxuXG5mdW5jdGlvbiBnZXRCYWJlbExvYWRlck9wdGlvbnMobG9hZGVyczogeyBwYXRoOiBzdHJpbmcsIG9wdGlvbnM/OiBPYmplY3QgfVtdKSB7XG4gIGNvbnN0IGJhYmVsTG9hZGVyID0gbG9hZGVycy5maW5kKGxvYWRlciA9PlxuICAgIGxvYWRlci5wYXRoLmluY2x1ZGVzKCdiYWJlbC1sb2FkZXInKVxuICApO1xuICBpZiAoIWJhYmVsTG9hZGVyKSB7XG4gICAgcmV0dXJuIHt9O1xuICB9XG5cbiAgY29uc3QgeyBjYWNoZURpcmVjdG9yeSwgY2FjaGVJZGVudGlmaWVyLCBmb3JjZUVudiwgLi4uYmFiZWxDb3JlT3B0aW9ucyB9ID1cbiAgICBiYWJlbExvYWRlci5vcHRpb25zIHx8IHt9O1xuICByZXR1cm4gYmFiZWxDb3JlT3B0aW9ucztcbn1cblxuY29uc3QgYnVpbHRMaW5hcmlhTW9kdWxlcyA9IFtdO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBsaW5hcmlhTG9hZGVyKFxuICBzb3VyY2U6IHN0cmluZyxcbiAgaW5wdXRNYXA6IGFueSxcbiAgbWV0YTogYW55XG4pIHtcbiAgY29uc3Qgb3B0aW9ucyA9IGxvYWRlclV0aWxzLmdldE9wdGlvbnModGhpcykgfHwge307XG4gIHRyeSB7XG4gICAgLy8gSWYgdGhlIG1vZHVsZSBoYXMgbGluYXJpYSBzdHlsZXMsIHdlIGJ1aWxkIGl0IGFuZCB3ZSdyZSBkb25lIGhlcmUuXG4gICAgaWYgKHNob3VsZFJ1bkxpbmFyaWEoc291cmNlKSkge1xuICAgICAgY29uc3QgeyBjb2RlLCBtYXAgfSA9IHRyYW5zcGlsZShcbiAgICAgICAgc291cmNlLFxuICAgICAgICBpbnB1dE1hcCxcbiAgICAgICAgdGhpcy5yZXNvdXJjZVBhdGgsXG4gICAgICAgIG9wdGlvbnMsXG4gICAgICAgIGdldEJhYmVsTG9hZGVyT3B0aW9ucyh0aGlzLmxvYWRlcnMpXG4gICAgICApO1xuICAgICAgYnVpbHRMaW5hcmlhTW9kdWxlcy5wdXNoKHRoaXMucmVzb3VyY2VQYXRoKTtcbiAgICAgIHRoaXMuY2FsbGJhY2sobnVsbCwgY29kZSwgbWFwLCBtZXRhKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICAvLyBPdGhlcndpc2UsIHdlIGNoZWNrIGZvciBwYXJlbnQgbW9kdWxlcywgd2hpY2ggdXNlIHRoaXMgb25lXG4gICAgLy8gYW5kIGlmIHRoZXkgaGF2ZSBsaW5hcmlhIHN0eWxlcywgd2UgYnVpbGQgdGhlbS5cbiAgICBjb25zdCBwYXJlbnRNb2R1bGVUb1RyYW5zcGlsZSA9IGdldExpbmFyaWFQYXJlbnRNb2R1bGVzKFxuICAgICAgdGhpcy5mcy5maWxlU3lzdGVtLFxuICAgICAgdGhpcy5fbW9kdWxlXG4gICAgKTtcblxuICAgIHBhcmVudE1vZHVsZVRvVHJhbnNwaWxlLmZvckVhY2goaXRlbSA9PiB7XG4gICAgICAvLyBXZSBvbmx5IGNhcmUgYWJvdXQgbW9kdWxlcyB3aGljaCB3YXMgcHJldmlvdXNseSBidWlsdC5cbiAgICAgIGlmIChidWlsdExpbmFyaWFNb2R1bGVzLmluZGV4T2YoaXRlbS5maWxlbmFtZSkgPiAtMSkge1xuICAgICAgICB0cmFuc3BpbGUoXG4gICAgICAgICAgaXRlbS5zb3VyY2UsXG4gICAgICAgICAgbnVsbCxcbiAgICAgICAgICBpdGVtLmZpbGVuYW1lLFxuICAgICAgICAgIG9wdGlvbnMsXG4gICAgICAgICAgZ2V0QmFiZWxMb2FkZXJPcHRpb25zKHRoaXMubG9hZGVycylcbiAgICAgICAgKTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIHRoaXMuY2FsbGJhY2sobnVsbCwgc291cmNlLCBpbnB1dE1hcCwgbWV0YSk7XG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgdGhpcy5jYWxsYmFjayhlcnJvcik7XG4gIH1cbn1cbiJdfQ==