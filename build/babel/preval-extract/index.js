'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.cssTaggedTemplateRequirementsVisitor = exports.externalRequirementsVisitor = undefined;

var _validators = require('./validators');

var _utils = require('./utils');

var _prevalStyles = require('./prevalStyles');

var _prevalStyles2 = _interopRequireDefault(_prevalStyles);

var _resolveSource = require('./resolveSource');

var _resolveSource2 = _interopRequireDefault(_resolveSource);

var _extractStyles = require('./extractStyles');

var _extractStyles2 = _interopRequireDefault(_extractStyles);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var externalRequirementsVisitor = exports.externalRequirementsVisitor = {
  Identifier: function Identifier(path) {
    if (path.isReferenced() && (0, _utils.getSelfBinding)(path) && !(0, _validators.isExcluded)(path)) {
      var source = (0, _resolveSource2.default)(this.types, path);
      if (source && !this.requirements.find(function (item) {
        return item.code === source.code;
      })) {
        this.requirements.splice(this.addBeforeIndex, 0, source);
        var binding = (0, _utils.getSelfBinding)(path);
        if ((0, _validators.shouldTraverseExternalIds)(binding.path)) {
          binding.path.traverse(externalRequirementsVisitor, this);
        }
      }
    }
  }
};

var cssTaggedTemplateRequirementsVisitor = exports.cssTaggedTemplateRequirementsVisitor = {
  Identifier: function Identifier(path) {
    if (path.isReferenced() && !(0, _validators.isExcluded)(path)) {
      var source = (0, _resolveSource2.default)(this.types, path);
      if (source && !this.requirements.find(function (item) {
        return item.code === source.code;
      })) {
        this.requirements.push(source);
        this.addBeforeIndex = this.requirements.length - 1;
        var binding = (0, _utils.getSelfBinding)(path);
        if ((0, _validators.shouldTraverseExternalIds)(binding.path)) {
          binding.path.traverse(externalRequirementsVisitor, this);
        }
      }
    }
  }
};

exports.default = function (babel) {
  var types = babel.types;


  return {
    visitor: {
      Program: {
        enter: function enter(path, state) {
          state.skipFile =
          // $FlowFixMe
          path.container.tokens.some(function (token) {
            return token.type === 'CommentBlock' && token.value.trim() === 'linaria-preval';
          });
          state.foundLinariaTaggedLiterals = false;
          state.filename = (0, _utils.relativeToCwd)(state.file.opts.filename);
        },
        exit: function exit(path, state) {
          if (state.skipFile) {
            return;
          }

          if (state.foundLinariaTaggedLiterals) {
            (0, _extractStyles2.default)(types, path, state.filename, state.opts);
          }
        }
      },
      TaggedTemplateExpression: function TaggedTemplateExpression(path, state) {
        if (!state.skipFile && (0, _validators.isLinariaTaggedTemplate)(types, path)) {
          var title = void 0;

          var parent = path.findParent(function (p) {
            return types.isObjectProperty(p) || types.isJSXOpeningElement(p) || types.isVariableDeclarator(p);
          });

          if (parent) {
            if (types.isObjectProperty(parent)) {
              title = parent.node.key.name || parent.node.key.value;
            } else if (types.isJSXOpeningElement(parent)) {
              title = parent.node.name.name;
            } else if (types.isVariableDeclarator(parent)) {
              title = parent.node.id.name;
            }
          }

          if (!title) {
            throw path.buildCodeFrameError("Couldn't determine the class name for CSS template literal. Ensure that it's either:\n" + '- Assigned to a variable\n' + '- Is an object property\n' + '- Is a prop in a JSX element\n');
          }

          state.foundLinariaTaggedLiterals = true;

          var requirements = [];

          path.traverse(cssTaggedTemplateRequirementsVisitor, {
            requirements: requirements,
            types: types
          });

          var className = (0, _prevalStyles2.default)(babel, title, path, state, requirements);

          path.replaceWith(className);
          path.addComment('leading', 'linaria-output');
        }
      }
    }
  };
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9iYWJlbC9wcmV2YWwtZXh0cmFjdC9pbmRleC5qcyJdLCJuYW1lcyI6WyJleHRlcm5hbFJlcXVpcmVtZW50c1Zpc2l0b3IiLCJJZGVudGlmaWVyIiwicGF0aCIsImlzUmVmZXJlbmNlZCIsInNvdXJjZSIsInR5cGVzIiwicmVxdWlyZW1lbnRzIiwiZmluZCIsIml0ZW0iLCJjb2RlIiwic3BsaWNlIiwiYWRkQmVmb3JlSW5kZXgiLCJiaW5kaW5nIiwidHJhdmVyc2UiLCJjc3NUYWdnZWRUZW1wbGF0ZVJlcXVpcmVtZW50c1Zpc2l0b3IiLCJwdXNoIiwibGVuZ3RoIiwiYmFiZWwiLCJ2aXNpdG9yIiwiUHJvZ3JhbSIsImVudGVyIiwic3RhdGUiLCJza2lwRmlsZSIsImNvbnRhaW5lciIsInRva2VucyIsInNvbWUiLCJ0b2tlbiIsInR5cGUiLCJ2YWx1ZSIsInRyaW0iLCJmb3VuZExpbmFyaWFUYWdnZWRMaXRlcmFscyIsImZpbGVuYW1lIiwiZmlsZSIsIm9wdHMiLCJleGl0IiwiVGFnZ2VkVGVtcGxhdGVFeHByZXNzaW9uIiwidGl0bGUiLCJwYXJlbnQiLCJmaW5kUGFyZW50IiwiaXNPYmplY3RQcm9wZXJ0eSIsInAiLCJpc0pTWE9wZW5pbmdFbGVtZW50IiwiaXNWYXJpYWJsZURlY2xhcmF0b3IiLCJub2RlIiwia2V5IiwibmFtZSIsImlkIiwiYnVpbGRDb2RlRnJhbWVFcnJvciIsImNsYXNzTmFtZSIsInJlcGxhY2VXaXRoIiwiYWRkQ29tbWVudCJdLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQVlBOztBQUtBOztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7Ozs7O0FBRU8sSUFBTUEsb0VBQThCO0FBQ3pDQyxZQUR5QyxzQkFDOUJDLElBRDhCLEVBQ0c7QUFDMUMsUUFBSUEsS0FBS0MsWUFBTCxNQUF1QiwyQkFBZUQsSUFBZixDQUF2QixJQUErQyxDQUFDLDRCQUFXQSxJQUFYLENBQXBELEVBQXNFO0FBQ3BFLFVBQU1FLFNBQTZCLDZCQUFjLEtB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b250ZW50IjpbIi8qIEBmbG93ICovXG5cbmltcG9ydCB0eXBlIHtcbiAgQmFiZWxDb3JlLFxuICBCYWJlbFR5cGVzLFxuICBOb2RlUGF0aCxcbiAgU3RhdGUsXG4gIEJhYmVsVGFnZ2VkVGVtcGxhdGVFeHByZXNzaW9uLFxuICBCYWJlbElkZW50aWZpZXIsXG4gIFJlcXVpcmVtZW50U291cmNlLFxufSBmcm9tICcuLi90eXBlcyc7XG5cbmltcG9ydCB7XG4gIHNob3VsZFRyYXZlcnNlRXh0ZXJuYWxJZHMsXG4gIGlzTGluYXJpYVRhZ2dlZFRlbXBsYXRlLFxuICBpc0V4Y2x1ZGVkLFxufSBmcm9tICcuL3ZhbGlkYXRvcnMnO1xuaW1wb3J0IHsgZ2V0U2VsZkJpbmRpbmcsIHJlbGF0aXZlVG9Dd2QgfSBmcm9tICcuL3V0aWxzJztcbmltcG9ydCBwcmV2YWxTdHlsZXMgZnJvbSAnLi9wcmV2YWxTdHlsZXMnO1xuaW1wb3J0IHJlc29sdmVTb3VyY2UgZnJvbSAnLi9yZXNvbHZlU291cmNlJztcbmltcG9ydCBleHRyYWN0U3R5bGVzIGZyb20gJy4vZXh0cmFjdFN0eWxlcyc7XG5cbmV4cG9ydCBjb25zdCBleHRlcm5hbFJlcXVpcmVtZW50c1Zpc2l0b3IgPSB7XG4gIElkZW50aWZpZXIocGF0aDogTm9kZVBhdGg8QmFiZWxJZGVudGlmaWVyPikge1xuICAgIGlmIChwYXRoLmlzUmVmZXJlbmNlZCgpICYmIGdldFNlbGZCaW5kaW5nKHBhdGgpICYmICFpc0V4Y2x1ZGVkKHBhdGgpKSB7XG4gICAgICBjb25zdCBzb3VyY2U6ID9SZXF1aXJlbWVudFNvdXJjZSA9IHJlc29sdmVTb3VyY2UodGhpcy50eXBlcywgcGF0aCk7XG4gICAgICBpZiAoXG4gICAgICAgIHNvdXJjZSAmJlxuICAgICAgICAhdGhpcy5yZXF1aXJlbWVudHMuZmluZChpdGVtID0+IGl0ZW0uY29kZSA9PT0gc291cmNlLmNvZGUpXG4gICAgICApIHtcbiAgICAgICAgdGhpcy5yZXF1aXJlbWVudHMuc3BsaWNlKHRoaXMuYWRkQmVmb3JlSW5kZXgsIDAsIHNvdXJjZSk7XG4gICAgICAgIGNvbnN0IGJpbmRpbmcgPSBnZXRTZWxmQmluZGluZyhwYXRoKTtcbiAgICAgICAgaWYgKHNob3VsZFRyYXZlcnNlRXh0ZXJuYWxJZHMoYmluZGluZy5wYXRoKSkge1xuICAgICAgICAgIGJpbmRpbmcucGF0aC50cmF2ZXJzZShleHRlcm5hbFJlcXVpcmVtZW50c1Zpc2l0b3IsIHRoaXMpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9LFxufTtcblxuZXhwb3J0IGNvbnN0IGNzc1RhZ2dlZFRlbXBsYXRlUmVxdWlyZW1lbnRzVmlzaXRvciA9IHtcbiAgSWRlbnRpZmllcihwYXRoOiBOb2RlUGF0aDxCYWJlbElkZW50aWZpZXI+KSB7XG4gICAgaWYgKHBhdGguaXNSZWZlcmVuY2VkKCkgJiYgIWlzRXhjbHVkZWQocGF0aCkpIHtcbiAgICAgIGNvbnN0IHNvdXJjZTogP1JlcXVpcmVtZW50U291cmNlID0gcmVzb2x2ZVNvdXJjZSh0aGlzLnR5cGVzLCBwYXRoKTtcbiAgICAgIGlmIChcbiAgICAgICAgc291cmNlICYmXG4gICAgICAgICF0aGlzLnJlcXVpcmVtZW50cy5maW5kKGl0ZW0gPT4gaXRlbS5jb2RlID09PSBzb3VyY2UuY29kZSlcbiAgICAgICkge1xuICAgICAgICB0aGlzLnJlcXVpcmVtZW50cy5wdXNoKHNvdXJjZSk7XG4gICAgICAgIHRoaXMuYWRkQmVmb3JlSW5kZXggPSB0aGlzLnJlcXVpcmVtZW50cy5sZW5ndGggLSAxO1xuICAgICAgICBjb25zdCBiaW5kaW5nID0gZ2V0U2VsZkJpbmRpbmcocGF0aCk7XG4gICAgICAgIGlmIChzaG91bGRUcmF2ZXJzZUV4dGVybmFsSWRzKGJpbmRpbmcucGF0aCkpIHtcbiAgICAgICAgICBiaW5kaW5nLnBhdGgudHJhdmVyc2UoZXh0ZXJuYWxSZXF1aXJlbWVudHNWaXNpdG9yLCB0aGlzKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfSxcbn07XG5cbmV4cG9ydCBkZWZhdWx0IChiYWJlbDogQmFiZWxDb3JlKSA9PiB7XG4gIGNvbnN0IHsgdHlwZXMgfTogeyB0eXBlczogQmFiZWxUeXBlcyB9ID0gYmFiZWw7XG5cbiAgcmV0dXJuIHtcbiAgICB2aXNpdG9yOiB7XG4gICAgICBQcm9ncmFtOiB7XG4gICAgICAgIGVudGVyKHBhdGg6IE5vZGVQYXRoPCo+LCBzdGF0ZTogU3RhdGUpIHtcbiAgICAgICAgICBzdGF0ZS5za2lwRmlsZSA9XG4gICAgICAgICAgICAvLyAkRmxvd0ZpeE1lXG4gICAgICAgICAgICBwYXRoLmNvbnRhaW5lci50b2tlbnMuc29tZShcbiAgICAgICAgICAgICAgdG9rZW4gPT5cbiAgICAgICAgICAgICAgICB0b2tlbi50eXBlID09PSAnQ29tbWVudEJsb2NrJyAmJlxuICAgICAgICAgICAgICAgIHRva2VuLnZhbHVlLnRyaW0oKSA9PT0gJ2xpbmFyaWEtcHJldmFsJ1xuICAgICAgICAgICAgKTtcbiAgICAgICAgICBzdGF0ZS5mb3VuZExpbmFyaWFUYWdnZWRMaXRlcmFscyA9IGZhbHNlO1xuICAgICAgICAgIHN0YXRlLmZpbGVuYW1lID0gcmVsYXRpdmVUb0N3ZChzdGF0ZS5maWxlLm9wdHMuZmlsZW5hbWUpO1xuICAgICAgICB9LFxuICAgICAgICBleGl0KHBhdGg6IE5vZGVQYXRoPCo+LCBzdGF0ZTogU3RhdGUpIHtcbiAgICAgICAgICBpZiAoc3RhdGUuc2tpcEZpbGUpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBpZiAoc3RhdGUuZm91bmRMaW5hcmlhVGFnZ2VkTGl0ZXJhbHMpIHtcbiAgICAgICAgICAgIGV4dHJhY3RTdHlsZXModHlwZXMsIHBhdGgsIHN0YXRlLmZpbGVuYW1lLCBzdGF0ZS5vcHRzKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgICAgVGFnZ2VkVGVtcGxhdGVFeHByZXNzaW9uKFxuICAgICAgICBwYXRoOiBOb2RlUGF0aDxCYWJlbFRhZ2dlZFRlbXBsYXRlRXhwcmVzc2lvbjxhbnk+PixcbiAgICAgICAgc3RhdGU6IFN0YXRlXG4gICAgICApIHtcbiAgICAgICAgaWYgKCFzdGF0ZS5za2lwRmlsZSAmJiBpc0xpbmFyaWFUYWdnZWRUZW1wbGF0ZSh0eXBlcywgcGF0aCkpIHtcbiAgICAgICAgICBsZXQgdGl0bGU7XG5cbiAgICAgICAgICBjb25zdCBwYXJlbnQgPSBwYXRoLmZpbmRQYXJlbnQoXG4gICAgICAgICAgICBwID0+XG4gICAgICAgICAgICAgIHR5cGVzLmlzT2JqZWN0UHJvcGVydHkocCkgfHxcbiAgICAgICAgICAgICAgdHlwZXMuaXNKU1hPcGVuaW5nRWxlbWVudChwKSB8fFxuICAgICAgICAgICAgICB0eXBlcy5pc1ZhcmlhYmxlRGVjbGFyYXRvcihwKVxuICAgICAgICAgICk7XG5cbiAgICAgICAgICBpZiAocGFyZW50KSB7XG4gICAgICAgICAgICBpZiAodHlwZXMuaXNPYmplY3RQcm9wZXJ0eShwYXJlbnQpKSB7XG4gICAgICAgICAgICAgIHRpdGxlID0gcGFyZW50Lm5vZGUua2V5Lm5hbWUgfHwgcGFyZW50Lm5vZGUua2V5LnZhbHVlO1xuICAgICAgICAgICAgfSBlbHNlIGlmICh0eXBlcy5pc0pTWE9wZW5pbmdFbGVtZW50KHBhcmVudCkpIHtcbiAgICAgICAgICAgICAgdGl0bGUgPSBwYXJlbnQubm9kZS5uYW1lLm5hbWU7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKHR5cGVzLmlzVmFyaWFibGVEZWNsYXJhdG9yKHBhcmVudCkpIHtcbiAgICAgICAgICAgICAgdGl0bGUgPSBwYXJlbnQubm9kZS5pZC5uYW1lO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cblxuICAgICAgICAgIGlmICghdGl0bGUpIHtcbiAgICAgICAgICAgIHRocm93IHBhdGguYnVpbGRDb2RlRnJhbWVFcnJvcihcbiAgICAgICAgICAgICAgXCJDb3VsZG4ndCBkZXRlcm1pbmUgdGhlIGNsYXNzIG5hbWUgZm9yIENTUyB0ZW1wbGF0ZSBsaXRlcmFsLiBFbnN1cmUgdGhhdCBpdCdzIGVpdGhlcjpcXG5cIiArXG4gICAgICAgICAgICAgICAgJy0gQXNzaWduZWQgdG8gYSB2YXJpYWJsZVxcbicgK1xuICAgICAgICAgICAgICAgICctIElzIGFuIG9iamVjdCBwcm9wZXJ0eVxcbicgK1xuICAgICAgICAgICAgICAgICctIElzIGEgcHJvcCBpbiBhIEpTWCBlbGVtZW50XFxuJ1xuICAgICAgICAgICAgKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBzdGF0ZS5mb3VuZExpbmFyaWFUYWdnZWRMaXRlcmFscyA9IHRydWU7XG5cbiAgICAgICAgICBjb25zdCByZXF1aXJlbWVudHM6IFJlcXVpcmVtZW50U291cmNlW10gPSBbXTtcblxuICAgICAgICAgIHBhdGgudHJhdmVyc2UoY3NzVGFnZ2VkVGVtcGxhdGVSZXF1aXJlbWVudHNWaXNpdG9yLCB7XG4gICAgICAgICAgICByZXF1aXJlbWVudHMsXG4gICAgICAgICAgICB0eXBlcyxcbiAgICAgICAgICB9KTtcblxuICAgICAgICAgIGNvbnN0IGNsYXNzTmFtZSA9IHByZXZhbFN0eWxlcyhcbiAgICAgICAgICAgIGJhYmVsLFxuICAgICAgICAgICAgdGl0bGUsXG4gICAgICAgICAgICBwYXRoLFxuICAgICAgICAgICAgc3RhdGUsXG4gICAgICAgICAgICByZXF1aXJlbWVudHNcbiAgICAgICAgICApO1xuXG4gICAgICAgICAgcGF0aC5yZXBsYWNlV2l0aChjbGFzc05hbWUpO1xuICAgICAgICAgIHBhdGguYWRkQ29tbWVudCgnbGVhZGluZycsICdsaW5hcmlhLW91dHB1dCcpO1xuICAgICAgICB9XG4gICAgICB9LFxuICAgIH0sXG4gIH07XG59O1xuIl19