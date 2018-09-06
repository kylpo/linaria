'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Module = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

/*
 * ==============================================
 * To avoid leakage from evaled code to module cache in current context,
 * for example with `babel-register` we provide our custom module system.
 * It's designed to mimic the native node one, with the exception being
 * that we can transpile every module by default and store source maps
 * for it. As a result we can provide correct error stacktrace and
 * enhanced errors.
 * ==============================================
 */

// $FlowFixMe


exports.instantiateModule = instantiateModule;
exports.ModuleMock = ModuleMock;
exports.getCachedModule = getCachedModule;
exports.clearLocalModulesFromCache = clearLocalModulesFromCache;
exports.clearModulesCache = clearModulesCache;

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _vm = require('vm');

var _vm2 = _interopRequireDefault(_vm);

var _module = require('module');

var _module2 = _interopRequireDefault(_module);

var _babelCore = require('babel-core');

var babel = _interopRequireWildcard(_babelCore);

var _errorUtils = require('./errorUtils');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Separate cache for evaled modules, so that we don't have to worry about
 * babel-register leaking to main context.
 */
var modulesCache = {};

/**
 * Resolve module id (and filename) relatively to parent module if specified.
 */
function resolveModuleId(moduleId, parent) {
  return _module2.default._resolveFilename(moduleId, parent, false);
}

/**
 * Create module instance and store it in cache.
 */
function instantiateModule(code, filename, parent) {
  var moduleInstance = new Module(filename, parent);
  // Store it in cache at this point with loaded: false flag, otherwise
  // we would end up in infinite loop, with cycle dependencies.
  modulesCache[filename] = moduleInstance;

  moduleInstance._compile(code);
  moduleInstance.loaded = true;
  return moduleInstance;
}

/*
 * =====================================
 * Module class used internally and to
 * mock the native Node `module` with
 * exposed methods.
 * =====================================
 */

var Module = exports.Module = function () {
  function Module(filename, parent) {
    _classCallCheck(this, Module);

    this.loaded = false;
    this.exports = {};
    this.paths = [];
    this.children = [];

    this.id = filename;
    this.filename = filename;
    this.parent = parent;
    if (this.parent) {
      this.parent.children.push(this);
    }
  }

  /**
   * Transpile and eval the module.
   */


  _createClass(Module, [{
    key: '_compile',
    value: function _compile(code, altFilename) {
      var filename = altFilename || this.filename;

      if (/\.json$/.test(filename)) {
        try {
          this.exports = JSON.parse(code);
        } catch (error) {
          throw new Error(error.message + ' (' + filename + ')');
        }

        return this.exports;
      }

      // Transpile module implementation.

      var _babel$transform = babel.transform(code, {
        plugins: [require.resolve('babel-plugin-transform-es2015-modules-commonjs')],
        filename: filename,
        sourceMaps: true,
        ignore: /node_modules/
      }),
          moduleBody = _babel$transform.code,
          map = _babel$transform.map;

      this.paths = _module2.default._nodeModulePaths(_path2.default.dirname(filename));
      this.sourceMap = map;

      // Load module.
      try {
        // Create script object with module wrapper.
        var script = new _vm2.default.Script(ModuleMock.wrap(moduleBody), {
          filename: filename
        });

        // Run the script to get the wrapper function.
        var loader = script.runInThisContext();

        // Compile the module with custom module system.
        loader(this.exports, getRequireMock(this), this, filename, _path2.default.dirname(filename));
      } catch (error) {
        if (error.isEnhanced) {
          throw (0, _errorUtils.buildCodeFrameError)(error, error.enhancedFrames);
        } else {
          var errorToThrow = void 0;
          try {
            errorToThrow = (0, _errorUtils.buildCodeFrameError)(error, (0, _errorUtils.enhanceFrames)((0, _errorUtils.getFramesFromStack)(error, function (frames) {
              return frames.findIndex(function (frame) {
                return frame.fileName === filename;
              });
            }), modulesCache));
          } catch (_) {
            errorToThrow = error;
          }
          throw errorToThrow;
        }
      }

      return this.exports;
    }
  }, {
    key: 'load',
    value: function load(altFilename) {
      var filename = altFilename || this.filename;
      var extension = _path2.default.extname(filename) || '.js';
      if (!ModuleMock._extensions[extension]) {
        extension = '.js';
      }
      ModuleMock._extensions[extension](this, filename);
      // Toggle loaded flag.
      this.loaded = true;
    }
  }, {
    key: 'require',
    value: function require(moduleId) {
      return getRequireMock(this)(moduleId);
    }
  }]);

  return Module;
}();

/*
 * =====================================
 * Native Node `module` mock.
 * =====================================
 */

function ModuleMock(filename, parent) {
  return new Module(filename, parent);
}

// Copy all function from native node `module`.
Object.keys(_module2.default).forEach(function (key) {
  ModuleMock[key] = _module2.default[key];
});

ModuleMock.wrap = function (code) {
  return '' + _module2.default.wrapper[0] + code + _module2.default.wrapper[1];
};
ModuleMock._cache = modulesCache;
ModuleMock._debug = function () {}; // noop
ModuleMock._load = function (moduleId, parent) {
  return getRequireMock(parent)(moduleId);
};
ModuleMock._preloadModules = function () {}; // noop
ModuleMock.Module = ModuleMock;

var ModuleMockId = resolveModuleId('module');
modulesCache[ModuleMockId] = new Module(ModuleMockId);
modulesCache[ModuleMockId].loaded = true;
modulesCache[ModuleMockId].exports = ModuleMock;

/*
 * =====================================
 * Require and resolve mocks.
 * =====================================
 */

/**
 * Get mocked require function for specific parent,
 * so that it can resolve other modules relative to
 * parent module.
 */
function getRequireMock(parent) {
  function resolveMock(moduleId) {
    return resolveModuleId(moduleId, parent);
  }

  function requireMock(moduleId) {
    /**
     * For non JS/JSON requires, we create a dummy wrapper module and just export
     * the moduleId from it, thus letting the bundler handle the rest.
     */
    if (/\.(?!js)[a-zA-Z0-9]+$/.test(moduleId)) {
      return instantiateModule('module.exports = \'' + moduleId + '\'', moduleId, parent).exports;
    }

    var filename = resolveMock(moduleId);

    // Native Node modules
    if (filename === moduleId && !_path2.default.isAbsolute(moduleId)) {
      // $FlowFixMe
      return require(moduleId); // eslint-disable-line global-require
    }

    // Return cached module if available.
    if (modulesCache[filename]) {
      return modulesCache[filename].exports;
    }

    var code = _fs2.default.readFileSync(filename, 'utf-8');
    return instantiateModule(code, filename, parent).exports;
  }

  // Provide utilities on require function.
  requireMock.resolve = resolveMock;
  // In our case main will never be set to anything other than undefined,
  // because we never run js module directly with `node module.js`.
  requireMock.main = undefined;
  // $FlowFixMe
  requireMock.extensions = require.extensions;
  requireMock.cache = modulesCache;

  return requireMock;
}

/*
 * =====================================
 * Utils for modules cache manipulation.
 * =====================================
 */

/**
 * Get module instance from cache.
 */
function getCachedModule(moduleId) {
  return modulesCache[moduleId];
}

/**
 * Clear modules from cache which are neither from node_modules nor from linaria.
 */
function clearLocalModulesFromCache() {
  Object.keys(modulesCache).filter(function (moduleId) {
    return !/node_modules/.test(moduleId) && !/linaria\/(build|src)/.test(moduleId);
  }).forEach(function (moduleId) {
    delete modulesCache[moduleId];
  });
}

function clearModulesCache() {
  Object.keys(modulesCache).forEach(function (moduleId) {
    delete modulesCache[moduleId];
  });
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9iYWJlbC9saWIvbW9kdWxlU3lzdGVtLmpzIl0sIm5hbWVzIjpbImluc3RhbnRpYXRlTW9kdWxlIiwiTW9kdWxlTW9jayIsImdldENhY2hlZE1vZHVsZSIsImNsZWFyTG9jYWxNb2R1bGVzRnJvbUNhY2hlIiwiY2xlYXJNb2R1bGVzQ2FjaGUiLCJiYWJlbCIsIm1vZHVsZXNDYWNoZSIsInJlc29sdmVNb2R1bGVJZCIsIm1vZHVsZUlkIiwicGFyZW50IiwiX3Jlc29sdmVGaWxlbmFtZSIsImNvZGUiLCJmaWxlbmFtZSIsIm1vZHVsZUluc3RhbmNlIiwiTW9kdWxlIiwiX2NvbXBpbGUiLCJsb2FkZWQiLCJleHBvcnRzIiwicGF0aHMiLCJjaGlsZHJlbiIsImlkIiwicHVzaCIsImFsdEZpbGVuYW1lIiwidGVzdCIsIkpTT04iLCJwYXJzZSIsImVycm9yIiwiRXJyb3IiLCJtZXNzYWdlIiwidHJhbnNmb3JtIiwicGx1Z2lucyIsInJlcXVpcmUiLCJyZXNvbHZlIiwic291cmNlTWFwcyIsImlnbm9yZSIsIm1vZHVsZUJvZHkiLCJtYXAiLCJfbm9kZU1vZHVsZVBhdGhzIiwiZGlybmFtZSIsInNvdXJjZU1hcCIsInNjcmlwdCIsIlNjcmlwdCIsIndyYXAiLCJsb2FkZXIiLCJydW5JblRoaXNDb250ZXh0IiwiZ2V0UmVxdWlyZU1vY2siLCJpc0VuaGFuY2VkIiwiZW5oYW5jZWRGcmFtZXMiLCJlcnJvclRvVGhyb3ciLCJmcmFtZXMiLCJmaW5kSW5kZXgiLCJmcmFtZSIsImZpbGVOYW1lIiwiXyIsImV4dGVuc2lvbiIsImV4dG5hbWUiLCJfZXh0ZW5zaW9ucyIsIk9iamVjdCIsImtleXMiLCJmb3JFYWNoIiwia2V5Iiwid3JhcHBlciIsIl9jYWNoZSIsIl9kZWJ1ZyIsIl9sb2FkIiwiX3ByZWxvYWRNb2R1bGVzIiwiTW9kdWxlTW9ja0lkIiwicmVzb2x2ZU1vY2siLCJyZXF1aXJlTW9jayIsImlzQWJzb2x1dGUiLCJyZWFkRmlsZVN5bmMiLCJt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LENBQVlwRCxZQUFaLEVBQ0dxRSxNQURILENBRUk7QUFBQSxXQUNFLENBQUMsZUFBZXBELElBQWYsQ0FBb0JmLFFBQXBCLENBQUQsSUFBa0MsQ0FBQyx1QkFBdUJlLElBQXZCLENBQTRCZixRQUE1QixDQURyQztBQUFBLEdBRkosRUFLR21ELE9BTEgsQ0FLVyxvQkFBWTtBQUNuQixXQUFPckQsYUFBYUUsUUFBYixDQUFQO0FBQ0QsR0FQSDtBQVFEOztBQUVNLFNBQVNKLGlCQUFULEdBQTZCO0FBQ2xDcUQsU0FBT0MsSUFBUCxDQUFZcEQsWUFBWixFQUEwQnFELE9BQTFCLENBQWtDLG9CQUFZO0FBQzVDLFdBQU9yRCxhQUFhRSxRQUFiLENBQVA7QUFDRCxHQUZEO0FBR0QiLCJmaWxlIjoibW9kdWxlU3lzdGVtLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyogQGZsb3cgKi9cblxuLypcbiAqID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAqIFRvIGF2b2lkIGxlYWthZ2UgZnJvbSBldmFsZWQgY29kZSB0byBtb2R1bGUgY2FjaGUgaW4gY3VycmVudCBjb250ZXh0LFxuICogZm9yIGV4YW1wbGUgd2l0aCBgYmFiZWwtcmVnaXN0ZXJgIHdlIHByb3ZpZGUgb3VyIGN1c3RvbSBtb2R1bGUgc3lzdGVtLlxuICogSXQncyBkZXNpZ25lZCB0byBtaW1pYyB0aGUgbmF0aXZlIG5vZGUgb25lLCB3aXRoIHRoZSBleGNlcHRpb24gYmVpbmdcbiAqIHRoYXQgd2UgY2FuIHRyYW5zcGlsZSBldmVyeSBtb2R1bGUgYnkgZGVmYXVsdCBhbmQgc3RvcmUgc291cmNlIG1hcHNcbiAqIGZvciBpdC4gQXMgYSByZXN1bHQgd2UgY2FuIHByb3ZpZGUgY29ycmVjdCBlcnJvciBzdGFja3RyYWNlIGFuZFxuICogZW5oYW5jZWQgZXJyb3JzLlxuICogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICovXG5cbmltcG9ydCBwYXRoIGZyb20gJ3BhdGgnO1xuaW1wb3J0IGZzIGZyb20gJ2ZzJztcbmltcG9ydCB2bSBmcm9tICd2bSc7XG4vLyAkRmxvd0ZpeE1lXG5pbXBvcnQgTmF0aXZlTW9kdWxlIGZyb20gJ21vZHVsZSc7XG5pbXBvcnQgKiBhcyBiYWJlbCBmcm9tICdiYWJlbC1jb3JlJztcblxuaW1wb3J0IHtcbiAgYnVpbGRDb2RlRnJhbWVFcnJvcixcbiAgZW5oYW5jZUZyYW1lcyxcbiAgZ2V0RnJhbWVzRnJvbVN0YWNrLFxufSBmcm9tICcuL2Vycm9yVXRpbHMnO1xuXG50eXBlIEV4cG9ydHMgPSBhbnk7XG5cbi8qKlxuICogU2VwYXJhdGUgY2FjaGUgZm9yIGV2YWxlZCBtb2R1bGVzLCBzbyB0aGF0IHdlIGRvbid0IGhhdmUgdG8gd29ycnkgYWJvdXRcbiAqIGJhYmVsLXJlZ2lzdGVyIGxlYWtpbmcgdG8gbWFpbiBjb250ZXh0LlxuICovXG5jb25zdCBtb2R1bGVzQ2FjaGU6IHsgW2tleTogc3RyaW5nXTogTW9kdWxlIH0gPSB7fTtcblxuLyoqXG4gKiBSZXNvbHZlIG1vZHVsZSBpZCAoYW5kIGZpbGVuYW1lKSByZWxhdGl2ZWx5IHRvIHBhcmVudCBtb2R1bGUgaWYgc3BlY2lmaWVkLlxuICovXG5mdW5jdGlvbiByZXNvbHZlTW9kdWxlSWQobW9kdWxlSWQ6IHN0cmluZywgcGFyZW50OiA/TW9kdWxlKTogc3RyaW5nIHtcbiAgcmV0dXJuIE5hdGl2ZU1vZHVsZS5fcmVzb2x2ZUZpbGVuYW1lKG1vZHVsZUlkLCBwYXJlbnQsIGZhbHNlKTtcbn1cblxuLyoqXG4gKiBDcmVhdGUgbW9kdWxlIGluc3RhbmNlIGFuZCBzdG9yZSBpdCBpbiBjYWNoZS5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGluc3RhbnRpYXRlTW9kdWxlKFxuICBjb2RlOiBzdHJpbmcsXG4gIGZpbGVuYW1lOiBzdHJpbmcsXG4gIHBhcmVudDogP01vZHVsZVxuKTogTW9kdWxlIHtcbiAgY29uc3QgbW9kdWxlSW5zdGFuY2UgPSBuZXcgTW9kdWxlKGZpbGVuYW1lLCBwYXJlbnQpO1xuICAvLyBTdG9yZSBpdCBpbiBjYWNoZSBhdCB0aGlzIHBvaW50IHdpdGggbG9hZGVkOiBmYWxzZSBmbGFnLCBvdGhlcndpc2VcbiAgLy8gd2Ugd291bGQgZW5kIHVwIGluIGluZmluaXRlIGxvb3AsIHdpdGggY3ljbGUgZGVwZW5kZW5jaWVzLlxuICBtb2R1bGVzQ2FjaGVbZmlsZW5hbWVdID0gbW9kdWxlSW5zdGFuY2U7XG5cbiAgbW9kdWxlSW5zdGFuY2UuX2NvbXBpbGUoY29kZSk7XG4gIG1vZHVsZUluc3RhbmNlLmxvYWRlZCA9IHRydWU7XG4gIHJldHVybiBtb2R1bGVJbnN0YW5jZTtcbn1cblxuLypcbiAqID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAqIE1vZHVsZSBjbGFzcyB1c2VkIGludGVybmFsbHkgYW5kIHRvXG4gKiBtb2NrIHRoZSBuYXRpdmUgTm9kZSBgbW9kdWxlYCB3aXRoXG4gKiBleHBvc2VkIG1ldGhvZHMuXG4gKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gKi9cblxuZXhwb3J0IGNsYXNzIE1vZHVsZSB7XG4gIGlkOiBzdHJpbmc7XG4gIGZpbGVuYW1lOiBzdHJpbmc7XG4gIGxvYWRlZDogYm9vbGVhbiA9IGZhbHNlO1xuICBleHBvcnRzOiBFeHBvcnRzID0ge307XG4gIHBhcmVudDogP01vZHVsZTtcbiAgcGF0aHM6IHN0cmluZ1tdID0gW107XG4gIGNoaWxkcmVuOiBNb2R1bGVbXSA9IFtdO1xuICBzb3VyY2VNYXA6ID9PYmplY3Q7XG5cbiAgY29uc3RydWN0b3IoZmlsZW5hbWU6IHN0cmluZywgcGFyZW50OiA/TW9kdWxlKSB7XG4gICAgdGhpcy5pZCA9IGZpbGVuYW1lO1xuICAgIHRoaXMuZmlsZW5hbWUgPSBmaWxlbmFtZTtcbiAgICB0aGlzLnBhcmVudCA9IHBhcmVudDtcbiAgICBpZiAodGhpcy5wYXJlbnQpIHtcbiAgICAgIHRoaXMucGFyZW50LmNoaWxkcmVuLnB1c2godGhpcyk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFRyYW5zcGlsZSBhbmQgZXZhbCB0aGUgbW9kdWxlLlxuICAgKi9cbiAgX2NvbXBpbGUoY29kZTogc3RyaW5nLCBhbHRGaWxlbmFtZT86IHN0cmluZyk6IEV4cG9ydHMge1xuICAgIGNvbnN0IGZpbGVuYW1lID0gYWx0RmlsZW5hbWUgfHwgdGhpcy5maWxlbmFtZTtcblxuICAgIGlmICgvXFwuanNvbiQvLnRlc3QoZmlsZW5hbWUpKSB7XG4gICAgICB0cnkge1xuICAgICAgICB0aGlzLmV4cG9ydHMgPSBKU09OLnBhcnNlKGNvZGUpO1xuICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGAke2Vycm9yLm1lc3NhZ2V9ICgke2ZpbGVuYW1lfSlgKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHRoaXMuZXhwb3J0cztcbiAgICB9XG5cbiAgICAvLyBUcmFuc3BpbGUgbW9kdWxlIGltcGxlbWVudGF0aW9uLlxuICAgIGNvbnN0IHsgY29kZTogbW9kdWxlQm9keSwgbWFwIH0gPSBiYWJlbC50cmFuc2Zvcm0oY29kZSwge1xuICAgICAgcGx1Z2luczogW1xuICAgICAgICByZXF1aXJlLnJlc29sdmUoJ2JhYmVsLXBsdWdpbi10cmFuc2Zvcm0tZXMyMDE1LW1vZHVsZXMtY29tbW9uanMnKSxcbiAgICAgIF0sXG4gICAgICBmaWxlbmFtZSxcbiAgICAgIHNvdXJjZU1hcHM6IHRydWUsXG4gICAgICBpZ25vcmU6IC9ub2RlX21vZHVsZXMvLFxuICAgIH0pO1xuXG4gICAgdGhpcy5wYXRocyA9IE5hdGl2ZU1vZHVsZS5fbm9kZU1vZHVsZVBhdGhzKHBhdGguZGlybmFtZShmaWxlbmFtZSkpO1xuICAgIHRoaXMuc291cmNlTWFwID0gbWFwO1xuXG4gICAgLy8gTG9hZCBtb2R1bGUuXG4gICAgdHJ5IHtcbiAgICAgIC8vIENyZWF0ZSBzY3JpcHQgb2JqZWN0IHdpdGggbW9kdWxlIHdyYXBwZXIuXG4gICAgICBjb25zdCBzY3JpcHQgPSBuZXcgdm0uU2NyaXB0KE1vZHVsZU1vY2sud3JhcChtb2R1bGVCb2R5KSwge1xuICAgICAgICBmaWxlbmFtZSxcbiAgICAgIH0pO1xuXG4gICAgICAvLyBSdW4gdGhlIHNjcmlwdCB0byBnZXQgdGhlIHdyYXBwZXIgZnVuY3Rpb24uXG4gICAgICBjb25zdCBsb2FkZXIgPSBzY3JpcHQucnVuSW5UaGlzQ29udGV4dCgpO1xuXG4gICAgICAvLyBDb21waWxlIHRoZSBtb2R1bGUgd2l0aCBjdXN0b20gbW9kdWxlIHN5c3RlbS5cbiAgICAgIGxvYWRlcihcbiAgICAgICAgdGhpcy5leHBvcnRzLFxuICAgICAgICBnZXRSZXF1aXJlTW9jayh0aGlzKSxcbiAgICAgICAgdGhpcyxcbiAgICAgICAgZmlsZW5hbWUsXG4gICAgICAgIHBhdGguZGlybmFtZShmaWxlbmFtZSlcbiAgICAgICk7XG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIGlmIChlcnJvci5pc0VuaGFuY2VkKSB7XG4gICAgICAgIHRocm93IGJ1aWxkQ29kZUZyYW1lRXJyb3IoZXJyb3IsIGVycm9yLmVuaGFuY2VkRnJhbWVzKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGxldCBlcnJvclRvVGhyb3c7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgZXJyb3JUb1Rocm93ID0gYnVpbGRDb2RlRnJhbWVFcnJvcihcbiAgICAgICAgICAgIGVycm9yLFxuICAgICAgICAgICAgZW5oYW5jZUZyYW1lcyhcbiAgICAgICAgICAgICAgZ2V0RnJhbWVzRnJvbVN0YWNrKGVycm9yLCBmcmFtZXMgPT5cbiAgICAgICAgICAgICAgICBmcmFtZXMuZmluZEluZGV4KGZyYW1lID0+IGZyYW1lLmZpbGVOYW1lID09PSBmaWxlbmFtZSlcbiAgICAgICAgICAgICAgKSxcbiAgICAgICAgICAgICAgbW9kdWxlc0NhY2hlXG4gICAgICAgICAgICApXG4gICAgICAgICAgKTtcbiAgICAgICAgfSBjYXRjaCAoXykge1xuICAgICAgICAgIGVycm9yVG9UaHJvdyA9IGVycm9yO1xuICAgICAgICB9XG4gICAgICAgIHRocm93IGVycm9yVG9UaHJvdztcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5leHBvcnRzO1xuICB9XG5cbiAgbG9hZChhbHRGaWxlbmFtZT86IHN0cmluZykge1xuICAgIGNvbnN0IGZpbGVuYW1lID0gYWx0RmlsZW5hbWUgfHwgdGhpcy5maWxlbmFtZTtcbiAgICBsZXQgZXh0ZW5zaW9uID0gcGF0aC5leHRuYW1lKGZpbGVuYW1lKSB8fCAnLmpzJztcbiAgICBpZiAoIU1vZHVsZU1vY2suX2V4dGVuc2lvbnNbZXh0ZW5zaW9uXSkge1xuICAgICAgZXh0ZW5zaW9uID0gJy5qcyc7XG4gICAgfVxuICAgIE1vZHVsZU1vY2suX2V4dGVuc2lvbnNbZXh0ZW5zaW9uXSh0aGlzLCBmaWxlbmFtZSk7XG4gICAgLy8gVG9nZ2xlIGxvYWRlZCBmbGFnLlxuICAgIHRoaXMubG9hZGVkID0gdHJ1ZTtcbiAgfVxuXG4gIHJlcXVpcmUobW9kdWxlSWQ6IHN0cmluZyk6IEV4cG9ydHMge1xuICAgIHJldHVybiBnZXRSZXF1aXJlTW9jayh0aGlzKShtb2R1bGVJZCk7XG4gIH1cbn1cblxuLypcbiAqID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAqIE5hdGl2ZSBOb2RlIGBtb2R1bGVgIG1vY2suXG4gKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gKi9cblxuZXhwb3J0IGZ1bmN0aW9uIE1vZHVsZU1vY2soZmlsZW5hbWU6IHN0cmluZywgcGFyZW50OiA/TW9kdWxlKTogTW9kdWxlIHtcbiAgcmV0dXJuIG5ldyBNb2R1bGUoZmlsZW5hbWUsIHBhcmVudCk7XG59XG5cbi8vIENvcHkgYWxsIGZ1bmN0aW9uIGZyb20gbmF0aXZlIG5vZGUgYG1vZHVsZWAuXG5PYmplY3Qua2V5cyhOYXRpdmVNb2R1bGUpLmZvckVhY2goa2V5ID0+IHtcbiAgTW9kdWxlTW9ja1trZXldID0gTmF0aXZlTW9kdWxlW2tleV07XG59KTtcblxuTW9kdWxlTW9jay53cmFwID0gY29kZSA9PlxuICBgJHtOYXRpdmVNb2R1bGUud3JhcHBlclswXX0ke2NvZGV9JHtOYXRpdmVNb2R1bGUud3JhcHBlclsxXX1gO1xuTW9kdWxlTW9jay5fY2FjaGUgPSBtb2R1bGVzQ2FjaGU7XG5Nb2R1bGVNb2NrLl9kZWJ1ZyA9ICgpID0+IHt9OyAvLyBub29wXG5Nb2R1bGVNb2NrLl9sb2FkID0gKG1vZHVsZUlkOiBzdHJpbmcsIHBhcmVudDogP01vZHVsZSkgPT5cbiAgZ2V0UmVxdWlyZU1vY2socGFyZW50KShtb2R1bGVJZCk7XG5Nb2R1bGVNb2NrLl9wcmVsb2FkTW9kdWxlcyA9ICgpID0+IHt9OyAvLyBub29wXG5Nb2R1bGVNb2NrLk1vZHVsZSA9IE1vZHVsZU1vY2s7XG5cbmNvbnN0IE1vZHVsZU1vY2tJZCA9IHJlc29sdmVNb2R1bGVJZCgnbW9kdWxlJyk7XG5tb2R1bGVzQ2FjaGVbTW9kdWxlTW9ja0lkXSA9IG5ldyBNb2R1bGUoTW9kdWxlTW9ja0lkKTtcbm1vZHVsZXNDYWNoZVtNb2R1bGVNb2NrSWRdLmxvYWRlZCA9IHRydWU7XG5tb2R1bGVzQ2FjaGVbTW9kdWxlTW9ja0lkXS5leHBvcnRzID0gTW9kdWxlTW9jaztcblxuLypcbiAqID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAqIFJlcXVpcmUgYW5kIHJlc29sdmUgbW9ja3MuXG4gKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gKi9cblxuLyoqXG4gKiBHZXQgbW9ja2VkIHJlcXVpcmUgZnVuY3Rpb24gZm9yIHNwZWNpZmljIHBhcmVudCxcbiAqIHNvIHRoYXQgaXQgY2FuIHJlc29sdmUgb3RoZXIgbW9kdWxlcyByZWxhdGl2ZSB0b1xuICogcGFyZW50IG1vZHVsZS5cbiAqL1xuZnVuY3Rpb24gZ2V0UmVxdWlyZU1vY2socGFyZW50OiA/TW9kdWxlKSB7XG4gIGZ1bmN0aW9uIHJlc29sdmVNb2NrKG1vZHVsZUlkOiBzdHJpbmcpOiBzdHJpbmcge1xuICAgIHJldHVybiByZXNvbHZlTW9kdWxlSWQobW9kdWxlSWQsIHBhcmVudCk7XG4gIH1cblxuICBmdW5jdGlvbiByZXF1aXJlTW9jayhtb2R1bGVJZDogc3RyaW5nKTogRXhwb3J0cyB7XG4gICAgLyoqXG4gICAgICogRm9yIG5vbiBKUy9KU09OIHJlcXVpcmVzLCB3ZSBjcmVhdGUgYSBkdW1teSB3cmFwcGVyIG1vZHVsZSBhbmQganVzdCBleHBvcnRcbiAgICAgKiB0aGUgbW9kdWxlSWQgZnJvbSBpdCwgdGh1cyBsZXR0aW5nIHRoZSBidW5kbGVyIGhhbmRsZSB0aGUgcmVzdC5cbiAgICAgKi9cbiAgICBpZiAoL1xcLig/IWpzKVthLXpBLVowLTldKyQvLnRlc3QobW9kdWxlSWQpKSB7XG4gICAgICByZXR1cm4gaW5zdGFudGlhdGVNb2R1bGUoXG4gICAgICAgIGBtb2R1bGUuZXhwb3J0cyA9ICcke21vZHVsZUlkfSdgLFxuICAgICAgICBtb2R1bGVJZCxcbiAgICAgICAgcGFyZW50XG4gICAgICApLmV4cG9ydHM7XG4gICAgfVxuXG4gICAgY29uc3QgZmlsZW5hbWUgPSByZXNvbHZlTW9jayhtb2R1bGVJZCk7XG5cbiAgICAvLyBOYXRpdmUgTm9kZSBtb2R1bGVzXG4gICAgaWYgKGZpbGVuYW1lID09PSBtb2R1bGVJZCAmJiAhcGF0aC5pc0Fic29sdXRlKG1vZHVsZUlkKSkge1xuICAgICAgLy8gJEZsb3dGaXhNZVxuICAgICAgcmV0dXJuIHJlcXVpcmUobW9kdWxlSWQpOyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIGdsb2JhbC1yZXF1aXJlXG4gICAgfVxuXG4gICAgLy8gUmV0dXJuIGNhY2hlZCBtb2R1bGUgaWYgYXZhaWxhYmxlLlxuICAgIGlmIChtb2R1bGVzQ2FjaGVbZmlsZW5hbWVdKSB7XG4gICAgICByZXR1cm4gbW9kdWxlc0NhY2hlW2ZpbGVuYW1lXS5leHBvcnRzO1xuICAgIH1cblxuICAgIGNvbnN0IGNvZGUgPSBmcy5yZWFkRmlsZVN5bmMoZmlsZW5hbWUsICd1dGYtOCcpO1xuICAgIHJldHVybiBpbnN0YW50aWF0ZU1vZHVsZShjb2RlLCBmaWxlbmFtZSwgcGFyZW50KS5leHBvcnRzO1xuICB9XG5cbiAgLy8gUHJvdmlkZSB1dGlsaXRpZXMgb24gcmVxdWlyZSBmdW5jdGlvbi5cbiAgcmVxdWlyZU1vY2sucmVzb2x2ZSA9IHJlc29sdmVNb2NrO1xuICAvLyBJbiBvdXIgY2FzZSBtYWluIHdpbGwgbmV2ZXIgYmUgc2V0IHRvIGFueXRoaW5nIG90aGVyIHRoYW4gdW5kZWZpbmVkLFxuICAvLyBiZWNhdXNlIHdlIG5ldmVyIHJ1biBqcyBtb2R1bGUgZGlyZWN0bHkgd2l0aCBgbm9kZSBtb2R1bGUuanNgLlxuICByZXF1aXJlTW9jay5tYWluID0gdW5kZWZpbmVkO1xuICAvLyAkRmxvd0ZpeE1lXG4gIHJlcXVpcmVNb2NrLmV4dGVuc2lvbnMgPSByZXF1aXJlLmV4dGVuc2lvbnM7XG4gIHJlcXVpcmVNb2NrLmNhY2hlID0gbW9kdWxlc0NhY2hlO1xuXG4gIHJldHVybiByZXF1aXJlTW9jaztcbn1cblxuLypcbiAqID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAqIFV0aWxzIGZvciBtb2R1bGVzIGNhY2hlIG1hbmlwdWxhdGlvbi5cbiAqID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAqL1xuXG4vKipcbiAqIEdldCBtb2R1bGUgaW5zdGFuY2UgZnJvbSBjYWNoZS5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGdldENhY2hlZE1vZHVsZShtb2R1bGVJZDogc3RyaW5nKTogTW9kdWxlIHtcbiAgcmV0dXJuIG1vZHVsZXNDYWNoZVttb2R1bGVJZF07XG59XG5cbi8qKlxuICogQ2xlYXIgbW9kdWxlcyBmcm9tIGNhY2hlIHdoaWNoIGFyZSBuZWl0aGVyIGZyb20gbm9kZV9tb2R1bGVzIG5vciBmcm9tIGxpbmFyaWEuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBjbGVhckxvY2FsTW9kdWxlc0Zyb21DYWNoZSgpIHtcbiAgT2JqZWN0LmtleXMobW9kdWxlc0NhY2hlKVxuICAgIC5maWx0ZXIoXG4gICAgICBtb2R1bGVJZCA9PlxuICAgICAgICAhL25vZGVfbW9kdWxlcy8udGVzdChtb2R1bGVJZCkgJiYgIS9saW5hcmlhXFwvKGJ1aWxkfHNyYykvLnRlc3QobW9kdWxlSWQpXG4gICAgKVxuICAgIC5mb3JFYWNoKG1vZHVsZUlkID0+IHtcbiAgICAgIGRlbGV0ZSBtb2R1bGVzQ2FjaGVbbW9kdWxlSWRdO1xuICAgIH0pO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gY2xlYXJNb2R1bGVzQ2FjaGUoKSB7XG4gIE9iamVjdC5rZXlzKG1vZHVsZXNDYWNoZSkuZm9yRWFjaChtb2R1bGVJZCA9PiB7XG4gICAgZGVsZXRlIG1vZHVsZXNDYWNoZVttb2R1bGVJZF07XG4gIH0pO1xufVxuIl19