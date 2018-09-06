'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * It's annoying we have to write this, but document.styleSheets returns an empty array in JSDOM, so we cannot use it
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      *
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * 
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      */

var _cssom = require('cssom');

var _cssom2 = _interopRequireDefault(_cssom);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// eslint-disable-line import/no-extraneous-dependencies

var Text = function () {
  function Text(text) {
    _classCallCheck(this, Text);

    this.textContent = text;
    this.nodeName = '#text';
  }

  _createClass(Text, [{
    key: 'appendData',
    value: function appendData(t) {
      if (this.parentNode instanceof HTMLStyleElement) {
        var _parentNode$__ast$css;

        var ast = _cssom2.default.parse(t);
        (_parentNode$__ast$css = this.parentNode.__ast.cssRules).push.apply(_parentNode$__ast$css, _toConsumableArray(ast.cssRules));
      }

      this.textContent += t;
    }
  }]);

  return Text;
}();

var HTMLElement = function () {
  function HTMLElement(tag) {
    _classCallCheck(this, HTMLElement);

    this.tagName = tag.toUpperCase();
    this.nodeName = tag.toUpperCase();
    this.children = [];
    this.attributes = {};
  }

  _createClass(HTMLElement, [{
    key: 'appendChild',
    value: function appendChild(el) {
      el.parentNode = this; // eslint-disable-line no-param-reassign
      this.children.push(el);
    }
  }, {
    key: 'setAttribute',
    value: function setAttribute(name, value) {
      this.attributes[name] = value;
    }
  }, {
    key: 'textContent',
    get: function get() {
      return this.children.map(function (c) {
        return c.textContent;
      }).join('');
    }
  }]);

  return HTMLElement;
}();

var HTMLStyleElement = function (_HTMLElement) {
  _inherits(HTMLStyleElement, _HTMLElement);

  function HTMLStyleElement(tag) {
    _classCallCheck(this, HTMLStyleElement);

    var _this = _possibleConstructorReturn(this, (HTMLStyleElement.__proto__ || Object.getPrototypeOf(HTMLStyleElement)).call(this, tag));

    _this.__ast = _cssom2.default.parse('');
    return _this;
  }

  return HTMLStyleElement;
}(HTMLElement);

var document = {
  createElement: function createElement(tag) {
    if (tag === 'style') {
      return new HTMLStyleElement(tag);
    }
    return new HTMLElement(tag);
  },
  createTextNode: function createTextNode(text) {
    return new Text(text);
  },

  get styleSheets() {
    return this.head.children.filter(function (el) {
      return el instanceof HTMLStyleElement;
    }).map(function (el) {
      return el.__ast;
    });
  },
  head: new HTMLElement('head')
};

exports.default = document;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9kb2N1bWVudC5qcyJdLCJuYW1lcyI6WyJUZXh0IiwidGV4dCIsInRleHRDb250ZW50Iiwibm9kZU5hbWUiLCJ0IiwicGFyZW50Tm9kZSIsIkhUTUxTdHlsZUVsZW1lbnQiLCJhc3QiLCJwYXJzZSIsIl9fYXN0IiwiY3NzUnVsZXMiLCJwdXNoIiwiSFRNTEVsZW1lbnQiLCJ0YWciLCJ0YWdOYW1lIiwidG9VcHBlckNhc2UiLCJjaGlsZHJlbiIsImF0dHJpYnV0ZXMiLCJlbCIsIm5hbWUiLCJ2YWx1ZSIsIm1hcCIsImMiLCJqb2luIiwiZG9jdW1lbnQiLCJjcmVhdGVFbGVtZW50IiwiY3JlYXRlVGV4dE5vZGUiLCJzdHlsZVNoZWV0cyIsImhlYWQiLCJmaWx0ZXIiXSwibWFwcGluZ3MiOiI7Ozs7OztxakJBQUE7Ozs7OztBQU1BOzs7Ozs7Ozs7Ozs7OztBQUEyQjs7SUFFckJBLEk7QUFDSixnQkFBWUMsSUFBWixFQUEwQjtBQUFBOztBQUN4QixTQUFLQyxXQUFMLEdBQW1CRCxJQUFuQjtBQUNBLFNBQUtFLFFBQUwsR0FBZ0IsT0FBaEI7QUFDRDs7OzsrQkFNVUMsQyxFQUFXO0FBQ3BCLFVBQUksS0FBS0MsVUFBTCxZQUEyQkMsZ0JBQS9CLEVBQWlEO0FBQUE7O0FBQy9DLFlBQU1DLE1BQU0sZ0JBQU1DLEtBQU4sQ0FBWUosQ0FBWixDQUFaO0FBQ0Esc0NBQUtDLFVBQUwsQ0FBZ0JJLEtBQWhCLENBQXNCQyxRQUF0QixFQUErQkMsSUFBL0IsaURBQXVDSixJQUFJRyxRQUEzQztBQUNEOztBQUVELFdBQUtSLFdBQUwsSUFBb0JFLENBQXBCO0FBQ0Q7Ozs7OztJQUdHUSxXO0FBQ0osdUJBQVlDLEdBQVosRUFBeUI7QUFBQTs7QUFDdkIsU0FBS0MsT0FBTCxHQUFlRCxJQUFJRSxXQUFKLEVBQWY7QUFDQSxTQUFLWixRQUFMLEdBQWdCVSxJQUFJRSxXQUFKLEVBQWhCO0FBQ0EsU0FBS0MsUUFBTCxHQUFnQixFQUFoQjtBQUNBLFNBQUtDLFVBQUwsR0FBa0IsRUFBbEI7QUFDRDs7OztnQ0FXV0MsRSxFQUFPO0FBQ2pCQSxTQUFHYixVQUFILEdBQWdCLElBQWhCLENBRGlCLENBQ0s7QUFDdEIsV0FBS1csUUFBTCxDQUFjTCxJQUFkLENBQW1CTyxFQUFuQjtBQUNEOzs7aUNBRVlDLEksRUFBY0MsSyxFQUFlO0FBQ3hDLFdBQUtILFVBQUwsQ0FBZ0JFLElBQWhCLElBQXdCQyxLQUF4QjtBQUNEOzs7d0JBWHlCO0FBQ3hCLGFBQU8sS0FBS0osUUFBTCxDQUFjSyxHQUFkLENBQWtCO0FBQUEsZUFBS0MsRUFBRXBCLFdBQVA7QUFBQSxPQUFsQixFQUFzQ3FCLElBQXRDLENBQTJDLEVBQTNDLENBQVA7QUFDRDs7Ozs7O0lBWUdqQixnQjs7O0FBQ0osNEJBQVlPLEdBQVosRUFBeUI7QUFBQTs7QUFBQSxvSUFDakJBLEdBRGlCOztBQUV2QixVQUFLSixLQUFMLEdBQWEsZ0JBQU1ELEtBQU4sQ0FBWSxFQUFaLENBQWI7QUFGdUI7QUFHeEI7OztFQUo0QkksVzs7QUFTL0IsSUFBTVksV0FBVztBQUNmQyxlQURlLHlCQUNEWixHQURDLEVBQ1k7QUFDekIsUUFBSUEsUUFBUSxPQUFaLEVBQXFCO0FBQ25CLGFBQU8sSUFBSVAsZ0JBQUosQ0FBcUJPLEdBQXJCLENBQVA7QUFDRDtBQUNELFdBQU8sSUFBSUQsV0FBSixDQUFnQkMsR0FBaEIsQ0FBUDtBQUNELEdBTmM7QUFPZmEsZ0JBUGUsMEJBT0F6QixJQVBBLEVBT2M7QUFDM0IsV0FBTyxJQUFJRCxJQUFKLENBQVNDLElBQVQsQ0FBUDtBQUNELEdBVGM7O0FBVWYsTUFBSTBCLFdBQUosR0FBa0I7QUFDaEIsV0FBTyxLQUFLQyxJQUFMLENBQVVaLFFBQVYsQ0FDSmEsTUFESSxDQUNHO0FBQUEsYUFBTVgsY0FBY1osZ0JBQXBCO0FBQUEsS0FESCxFQUVKZSxHQUZJLENBRUE7QUFBQSxhQUFNSCxHQUFHVCxLQUFUO0FBQUEsS0FGQSxDQUFQO0FBR0QsR0FkYztBQWVmbUIsUUFBTSxJQUFJaEIsV0FBSixDQUFnQixNQUFoQjtBQWZTLENBQWpCOztrQkFrQmVZLFEiLCJmaWxlIjoiZG9jdW1lbnQuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEl0J3MgYW5ub3lpbmcgd2UgaGF2ZSB0byB3cml0ZSB0aGlzLCBidXQgZG9jdW1lbnQuc3R5bGVTaGVldHMgcmV0dXJucyBhbiBlbXB0eSBhcnJheSBpbiBKU0RPTSwgc28gd2UgY2Fubm90IHVzZSBpdFxuICpcbiAqIEBmbG93XG4gKi9cblxuaW1wb3J0IENTU09NIGZyb20gJ2Nzc29tJzsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBpbXBvcnQvbm8tZXh0cmFuZW91cy1kZXBlbmRlbmNpZXNcblxuY2xhc3MgVGV4dCB7XG4gIGNvbnN0cnVjdG9yKHRleHQ6IHN0cmluZykge1xuICAgIHRoaXMudGV4dENvbnRlbnQgPSB0ZXh0O1xuICAgIHRoaXMubm9kZU5hbWUgPSAnI3RleHQnO1xuICB9XG5cbiAgdGV4dENvbnRlbnQ6IHN0cmluZztcbiAgcGFyZW50Tm9kZTogYW55O1xuICBub2RlTmFtZTogc3RyaW5nO1xuXG4gIGFwcGVuZERhdGEodDogc3RyaW5nKSB7XG4gICAgaWYgKHRoaXMucGFyZW50Tm9kZSBpbnN0YW5jZW9mIEhUTUxTdHlsZUVsZW1lbnQpIHtcbiAgICAgIGNvbnN0IGFzdCA9IENTU09NLnBhcnNlKHQpO1xuICAgICAgdGhpcy5wYXJlbnROb2RlLl9fYXN0LmNzc1J1bGVzLnB1c2goLi4uYXN0LmNzc1J1bGVzKTtcbiAgICB9XG5cbiAgICB0aGlzLnRleHRDb250ZW50ICs9IHQ7XG4gIH1cbn1cblxuY2xhc3MgSFRNTEVsZW1lbnQge1xuICBjb25zdHJ1Y3Rvcih0YWc6IHN0cmluZykge1xuICAgIHRoaXMudGFnTmFtZSA9IHRhZy50b1VwcGVyQ2FzZSgpO1xuICAgIHRoaXMubm9kZU5hbWUgPSB0YWcudG9VcHBlckNhc2UoKTtcbiAgICB0aGlzLmNoaWxkcmVuID0gW107XG4gICAgdGhpcy5hdHRyaWJ1dGVzID0ge307XG4gIH1cblxuICB0YWdOYW1lOiBzdHJpbmc7XG4gIG5vZGVOYW1lOiBzdHJpbmc7XG4gIGNoaWxkcmVuOiBhbnk7XG4gIGF0dHJpYnV0ZXM6IE9iamVjdDtcblxuICBnZXQgdGV4dENvbnRlbnQoKTogc3RyaW5nIHtcbiAgICByZXR1cm4gdGhpcy5jaGlsZHJlbi5tYXAoYyA9PiBjLnRleHRDb250ZW50KS5qb2luKCcnKTtcbiAgfVxuXG4gIGFwcGVuZENoaWxkKGVsOiAqKSB7XG4gICAgZWwucGFyZW50Tm9kZSA9IHRoaXM7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tcGFyYW0tcmVhc3NpZ25cbiAgICB0aGlzLmNoaWxkcmVuLnB1c2goZWwpO1xuICB9XG5cbiAgc2V0QXR0cmlidXRlKG5hbWU6IHN0cmluZywgdmFsdWU6IHN0cmluZykge1xuICAgIHRoaXMuYXR0cmlidXRlc1tuYW1lXSA9IHZhbHVlO1xuICB9XG59XG5cbmNsYXNzIEhUTUxTdHlsZUVsZW1lbnQgZXh0ZW5kcyBIVE1MRWxlbWVudCB7XG4gIGNvbnN0cnVjdG9yKHRhZzogc3RyaW5nKSB7XG4gICAgc3VwZXIodGFnKTtcbiAgICB0aGlzLl9fYXN0ID0gQ1NTT00ucGFyc2UoJycpO1xuICB9XG5cbiAgX19hc3Q6IE9iamVjdDtcbn1cblxuY29uc3QgZG9jdW1lbnQgPSB7XG4gIGNyZWF0ZUVsZW1lbnQodGFnOiBzdHJpbmcpIHtcbiAgICBpZiAodGFnID09PSAnc3R5bGUnKSB7XG4gICAgICByZXR1cm4gbmV3IEhUTUxTdHlsZUVsZW1lbnQodGFnKTtcbiAgICB9XG4gICAgcmV0dXJuIG5ldyBIVE1MRWxlbWVudCh0YWcpO1xuICB9LFxuICBjcmVhdGVUZXh0Tm9kZSh0ZXh0OiBzdHJpbmcpIHtcbiAgICByZXR1cm4gbmV3IFRleHQodGV4dCk7XG4gIH0sXG4gIGdldCBzdHlsZVNoZWV0cygpIHtcbiAgICByZXR1cm4gdGhpcy5oZWFkLmNoaWxkcmVuXG4gICAgICAuZmlsdGVyKGVsID0+IGVsIGluc3RhbmNlb2YgSFRNTFN0eWxlRWxlbWVudClcbiAgICAgIC5tYXAoZWwgPT4gZWwuX19hc3QpO1xuICB9LFxuICBoZWFkOiBuZXcgSFRNTEVsZW1lbnQoJ2hlYWQnKSxcbn07XG5cbmV4cG9ydCBkZWZhdWx0IGRvY3VtZW50O1xuIl19