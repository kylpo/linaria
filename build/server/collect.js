'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _postcss = require('postcss');

var _postcss2 = _interopRequireDefault(_postcss);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var collect = function collect(html, css, globalCSS) {
  var animations = new Set();
  var other = _postcss2.default.root();
  var critical = _postcss2.default.root();
  var stylesheet = _postcss2.default.parse(css);
  var htmlClassesRegExp = extractClassesFromHtml(html);

  var handleAtRule = function handleAtRule(rule) {
    var addedToCritical = false;

    rule.each(function (childRule) {
      if (childRule.selector.match(htmlClassesRegExp)) {
        critical.append(rule.clone());
        addedToCritical = true;
      }
    });

    if (rule.name === 'keyframes') {
      return;
    }

    if (addedToCritical) {
      rule.remove();
    } else {
      other.append(rule);
    }
  };

  stylesheet.walkRules(function (rule) {
    if (rule.parent.name === 'keyframes') {
      return;
    }

    if (rule.parent.type === 'atrule') {
      handleAtRule(rule.parent);
      return;
    }

    if (rule.selector.match(htmlClassesRegExp)) {
      critical.append(rule);
    } else {
      other.append(rule);
    }
  });

  critical.walkDecls(/animation/, function (decl) {
    animations.add(decl.value.split(' ')[0]);
  });

  stylesheet.walkAtRules('keyframes', function (rule) {
    if (animations.has(rule.params)) {
      critical.append(rule);
    }
  });

  return {
    critical: (globalCSS || '') + critical.toString(),
    other: other.toString()
  };
};

var extractClassesFromHtml = function extractClassesFromHtml(html) {
  var htmlClasses = [];
  var regex = /\s+class="([^"]*)"/gm;
  var match = regex.exec(html);

  while (match !== null) {
    match[1].split(' ').forEach(function (className) {
      return htmlClasses.push(className);
    });
    match = regex.exec(html);
  }

  return new RegExp(htmlClasses.join('|'), 'gm');
};

exports.default = collect;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9zZXJ2ZXIvY29sbGVjdC5qcyJdLCJuYW1lcyI6WyJjb2xsZWN0IiwiaHRtbCIsImNzcyIsImdsb2JhbENTUyIsImFuaW1hdGlvbnMiLCJTZXQiLCJvdGhlciIsInJvb3QiLCJjcml0aWNhbCIsInN0eWxlc2hlZXQiLCJwYXJzZSIsImh0bWxDbGFzc2VzUmVnRXhwIiwiZXh0cmFjdENsYXNzZXNGcm9tSHRtbCIsImhhbmRsZUF0UnVsZSIsImFkZGVkVG9Dcml0aWNhbCIsInJ1bGUiLCJlYWNoIiwiY2hpbGRSdWxlIiwic2VsZWN0b3IiLCJtYXRjaCIsImFwcGVuZCIsImNsb25lIiwibmFtZSIsInJlbW92ZSIsIndhbGtSdWxlcyIsInBhcmVudCIsInR5cGUiLCJ3YWxrRGVjbHMiLCJhZGQiLCJkZWNsIiwidmFsdWUiLCJzcGxpdCIsIndhbGtBdFJ1bGVzIiwiaGFzIiwicGFyYW1zIiwidG9TdHJpbmciLCJodG1sQ2xhc3NlcyIsInJlZ2V4IiwiZXhlYyIsImZvckVhY2giLCJwdXNoIiwiY2xhc3NOYW1lIiwiUmVnRXhwIiwiam9pbiJdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBRUE7Ozs7OztBQU9BLElBQU1BLFVBQVUsU0FBVkEsT0FBVSxDQUNkQyxJQURjLEVBRWRDLEdBRmMsRUFHZEMsU0FIYyxFQUlJO0FBQ2xCLE1BQU1DLGFBQWEsSUFBSUMsR0FBSixFQUFuQjtBQUNBLE1BQU1DLFFBQVEsa0JBQVFDLElBQVIsRUFBZDtBQUNBLE1BQU1DLFdBQVcsa0JBQVFELElBQVIsRUFBakI7QUFDQSxNQUFNRSxhQUFhLGtCQUFRQyxLQUFSLENBQWNSLEdBQWQsQ0FBbkI7QUFDQSxNQUFNUyxvQkFBb0JDLHVCQUF1QlgsSUFBdkIsQ0FBMUI7O0FBRUEsTUFBTVksZUFBZSxTQUFmQSxZQUFlLE9BQVE7QUFDM0IsUUFBSUMsa0JBQWtCLEtBQXRCOztBQUVBQyxTQUFLQyxJQUFMLENBQVUscUJBQWE7QUFDckIsVUFBSUMsVUFBVUMsUUFBVixDQUFtQkMsS0FBbkIsQ0FBeUJSLGlCQUF6QixDQUFKLEVBQWlEO0FBQy9DSCxpQkFBU1ksTUFBVCxDQUFnQkwsS0FBS00sS0FBTCxFQUFoQjtBQUNBUCwwQkFBa0IsSUFBbEI7QUFDRDtBQUNGLEtBTEQ7O0FBT0EsUUFBSUMsS0FBS08sSUFBTCxLQUFjLFdBQWxCLEVBQStCO0FBQzdCO0FBQ0Q7O0FBRUQsUUFBSVIsZUFBSixFQUFxQjtBQUNuQkMsV0FBS1EsTUFBTDtBQUNELEtBRkQsTUFFTztBQUNMakIsWUFBTWMsTUFBTixDQUFhTCxJQUFiO0FBQ0Q7QUFDRixHQW5CRDs7QUFxQkFOLGFBQVdlLFNBQVgsQ0FBcUIsZ0JBQVE7QUFDM0IsUUFBSVQsS0FBS1UsTUFBTCxDQUFZSCxJQUFaLEtBQXFCLFdBQXpCLEVBQXNDO0FBQ3BDO0FBQ0Q7O0FBRUQsUUFBSVAsS0FBS1UsTUFBTCxDQUFZQyxJQUFaLEtBQXFCLFFBQXpCLEVBQW1DO0FBQ2pDYixtQkFBYUUsS0FBS1UsTUFBbEI7QUFDQTtBQUNEOztBQUVELFFBQUlWLEtBQUtHLFFBQUwsQ0FBY0MsS0FBZCxDQUFvQlIsaUJBQXBCLENBQUosRUFBNEM7QUFDMUNILGVBQVNZLE1BQVQsQ0FBZ0JMLElBQWhCO0FBQ0QsS0FGRCxNQUVPO0FBQ0xULFlBQU1jLE1BQU4sQ0FBYUwsSUFBYjtBQUNEO0FBQ0YsR0FmRDs7QUFpQkFQLFdBQVNtQixTQUFULENBQW1CLFdBQW5CLEVBQWdDLGdCQUFRO0FBQ3RDdkIsZUFBV3dCLEdBQVgsQ0FBZUMsS0FBS0MsS0FBTCxDQUFXQyxLQUFYLENBQWlCLEdBQWpCLEVBQXNCLENBQXRCLENBQWY7QUFDRCxHQUZEOztBQUlBdEIsYUFBV3VCLFdBQVgsQ0FBdUIsV0FBdkIsRUFBb0MsZ0JBQVE7QUFDMUMsUUFBSTVCLFdBQVc2QixHQUFYLENBQWVsQixLQUFLbUIsTUFBcEIsQ0FBSixFQUFpQztBQUMvQjFCLGVBQVNZLE1BQVQsQ0FBZ0JMLElBQWhCO0FBQ0Q7QUFDRixHQUpEOztBQU1BLFNBQU87QUFDTFAsY0FBVSxDQUFDTCxhQUFhLEVBQWQsSUFBb0JLLFNBQVMyQixRQUFULEVBRHpCO0FBRUw3QixXQUFPQSxNQUFNNkIsUUFBTjtBQUZGLEdBQVA7QUFJRCxDQS9ERDs7QUFpRUEsSUFBTXZCLHlCQUF5QixTQUF6QkEsc0JBQXlCLENBQUNYLElBQUQsRUFBMEI7QUFDdkQsTUFBTW1DLGNBQWMsRUFBcEI7QUFDQSxNQUFNQyxRQUFRLHNCQUFkO0FBQ0EsTUFBSWxCLFFBQVFrQixNQUFNQyxJQUFOLENBQVdyQyxJQUFYLENBQVo7O0FBRUEsU0FBT2tCLFVBQVUsSUFBakIsRUFBdUI7QUFDckJBLFVBQU0sQ0FBTixFQUFTWSxLQUFULENBQWUsR0FBZixFQUFvQlEsT0FBcEIsQ0FBNEI7QUFBQSxhQUFhSCxZQUFZSSxJQUFaLENBQWlCQyxTQUFqQixDQUFiO0FBQUEsS0FBNUI7QUFDQXRCLFlBQVFrQixNQUFNQyxJQUFOLENBQVdyQyxJQUFYLENBQVI7QUFDRDs7QUFFRCxTQUFPLElBQUl5QyxNQUFKLENBQVdOLFlBQVlPLElBQVosQ0FBaUIsR0FBakIsQ0FBWCxFQUFrQyxJQUFsQyxDQUFQO0FBQ0QsQ0FYRDs7a0JBYWUzQyxPIiwiZmlsZSI6ImNvbGxlY3QuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiBAZmxvdyAqL1xuXG5pbXBvcnQgcG9zdGNzcyBmcm9tICdwb3N0Y3NzJztcblxudHlwZSBDb2xsZWN0UmVzdWx0ID0ge1xuICBjcml0aWNhbDogc3RyaW5nLFxuICBvdGhlcjogc3RyaW5nLFxufTtcblxuY29uc3QgY29sbGVjdCA9IChcbiAgaHRtbDogc3RyaW5nLFxuICBjc3M6IHN0cmluZyxcbiAgZ2xvYmFsQ1NTPzogc3RyaW5nXG4pOiBDb2xsZWN0UmVzdWx0ID0+IHtcbiAgY29uc3QgYW5pbWF0aW9ucyA9IG5ldyBTZXQoKTtcbiAgY29uc3Qgb3RoZXIgPSBwb3N0Y3NzLnJvb3QoKTtcbiAgY29uc3QgY3JpdGljYWwgPSBwb3N0Y3NzLnJvb3QoKTtcbiAgY29uc3Qgc3R5bGVzaGVldCA9IHBvc3Rjc3MucGFyc2UoY3NzKTtcbiAgY29uc3QgaHRtbENsYXNzZXNSZWdFeHAgPSBleHRyYWN0Q2xhc3Nlc0Zyb21IdG1sKGh0bWwpO1xuXG4gIGNvbnN0IGhhbmRsZUF0UnVsZSA9IHJ1bGUgPT4ge1xuICAgIGxldCBhZGRlZFRvQ3JpdGljYWwgPSBmYWxzZTtcblxuICAgIHJ1bGUuZWFjaChjaGlsZFJ1bGUgPT4ge1xuICAgICAgaWYgKGNoaWxkUnVsZS5zZWxlY3Rvci5tYXRjaChodG1sQ2xhc3Nlc1JlZ0V4cCkpIHtcbiAgICAgICAgY3JpdGljYWwuYXBwZW5kKHJ1bGUuY2xvbmUoKSk7XG4gICAgICAgIGFkZGVkVG9Dcml0aWNhbCA9IHRydWU7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICBpZiAocnVsZS5uYW1lID09PSAna2V5ZnJhbWVzJykge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmIChhZGRlZFRvQ3JpdGljYWwpIHtcbiAgICAgIHJ1bGUucmVtb3ZlKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIG90aGVyLmFwcGVuZChydWxlKTtcbiAgICB9XG4gIH07XG5cbiAgc3R5bGVzaGVldC53YWxrUnVsZXMocnVsZSA9PiB7XG4gICAgaWYgKHJ1bGUucGFyZW50Lm5hbWUgPT09ICdrZXlmcmFtZXMnKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKHJ1bGUucGFyZW50LnR5cGUgPT09ICdhdHJ1bGUnKSB7XG4gICAgICBoYW5kbGVBdFJ1bGUocnVsZS5wYXJlbnQpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmIChydWxlLnNlbGVjdG9yLm1hdGNoKGh0bWxDbGFzc2VzUmVnRXhwKSkge1xuICAgICAgY3JpdGljYWwuYXBwZW5kKHJ1bGUpO1xuICAgIH0gZWxzZSB7XG4gICAgICBvdGhlci5hcHBlbmQocnVsZSk7XG4gICAgfVxuICB9KTtcblxuICBjcml0aWNhbC53YWxrRGVjbHMoL2FuaW1hdGlvbi8sIGRlY2wgPT4ge1xuICAgIGFuaW1hdGlvbnMuYWRkKGRlY2wudmFsdWUuc3BsaXQoJyAnKVswXSk7XG4gIH0pO1xuXG4gIHN0eWxlc2hlZXQud2Fsa0F0UnVsZXMoJ2tleWZyYW1lcycsIHJ1bGUgPT4ge1xuICAgIGlmIChhbmltYXRpb25zLmhhcyhydWxlLnBhcmFtcykpIHtcbiAgICAgIGNyaXRpY2FsLmFwcGVuZChydWxlKTtcbiAgICB9XG4gIH0pO1xuXG4gIHJldHVybiB7XG4gICAgY3JpdGljYWw6IChnbG9iYWxDU1MgfHwgJycpICsgY3JpdGljYWwudG9TdHJpbmcoKSxcbiAgICBvdGhlcjogb3RoZXIudG9TdHJpbmcoKSxcbiAgfTtcbn07XG5cbmNvbnN0IGV4dHJhY3RDbGFzc2VzRnJvbUh0bWwgPSAoaHRtbDogc3RyaW5nKTogUmVnRXhwID0+IHtcbiAgY29uc3QgaHRtbENsYXNzZXMgPSBbXTtcbiAgY29uc3QgcmVnZXggPSAvXFxzK2NsYXNzPVwiKFteXCJdKilcIi9nbTtcbiAgbGV0IG1hdGNoID0gcmVnZXguZXhlYyhodG1sKTtcblxuICB3aGlsZSAobWF0Y2ggIT09IG51bGwpIHtcbiAgICBtYXRjaFsxXS5zcGxpdCgnICcpLmZvckVhY2goY2xhc3NOYW1lID0+IGh0bWxDbGFzc2VzLnB1c2goY2xhc3NOYW1lKSk7XG4gICAgbWF0Y2ggPSByZWdleC5leGVjKGh0bWwpO1xuICB9XG5cbiAgcmV0dXJuIG5ldyBSZWdFeHAoaHRtbENsYXNzZXMuam9pbignfCcpLCAnZ20nKTtcbn07XG5cbmV4cG9ydCBkZWZhdWx0IGNvbGxlY3Q7XG4iXX0=