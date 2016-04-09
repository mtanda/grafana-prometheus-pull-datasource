'use strict';

System.register(['app/plugins/sdk', 'lodash'], function (_export, _context) {
  var QueryCtrl, _, _createClass, PrometheusPullQueryCtrl;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _possibleConstructorReturn(self, call) {
    if (!self) {
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }

    return call && (typeof call === "object" || typeof call === "function") ? call : self;
  }

  function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
      throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
    }

    subClass.prototype = Object.create(superClass && superClass.prototype, {
      constructor: {
        value: subClass,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
    if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
  }

  return {
    setters: [function (_appPluginsSdk) {
      QueryCtrl = _appPluginsSdk.QueryCtrl;
    }, function (_lodash) {
      _ = _lodash.default;
    }],
    execute: function () {
      _createClass = function () {
        function defineProperties(target, props) {
          for (var i = 0; i < props.length; i++) {
            var descriptor = props[i];
            descriptor.enumerable = descriptor.enumerable || false;
            descriptor.configurable = true;
            if ("value" in descriptor) descriptor.writable = true;
            Object.defineProperty(target, descriptor.key, descriptor);
          }
        }

        return function (Constructor, protoProps, staticProps) {
          if (protoProps) defineProperties(Constructor.prototype, protoProps);
          if (staticProps) defineProperties(Constructor, staticProps);
          return Constructor;
        };
      }();

      _export('PrometheusPullQueryCtrl', PrometheusPullQueryCtrl = function (_QueryCtrl) {
        _inherits(PrometheusPullQueryCtrl, _QueryCtrl);

        function PrometheusPullQueryCtrl($scope, $injector, uiSegmentSrv) {
          _classCallCheck(this, PrometheusPullQueryCtrl);

          var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(PrometheusPullQueryCtrl).call(this, $scope, $injector));

          _this.uiSegmentSrv = uiSegmentSrv;
          _this.removeMetricOption = _this.uiSegmentSrv.newSegment({ fake: true, value: '-- remove metric --' });

          _this.target.metrics = _this.target.metrics || [];
          _this.target.interval = _this.target.interval || '1s';

          _this.metricSegments = _this.target.metrics.map(function (item) {
            return _this.uiSegmentSrv.newSegment({ value: item.name, cssClass: 'last' });
          });

          _this.metricSegments.push(_this.uiSegmentSrv.newPlusButton());
          return _this;
        }

        _createClass(PrometheusPullQueryCtrl, [{
          key: 'getMetricSegments',
          value: function getMetricSegments(segment) {
            var _this2 = this;

            return this.datasource.getMetrics().then(function (metrics) {
              var elements = metrics.map(function (item) {
                return _this2.uiSegmentSrv.newSegment({ value: item.value });
              });

              if (!segment.fake) {
                elements.unshift(_.clone(_this2.removeMetricOption));
              }

              return elements;
            });
          }
        }, {
          key: 'metricSegmentChanged',
          value: function metricSegmentChanged(segment, index) {
            if (segment.value === this.removeMetricOption.value) {
              this.metricSegments.splice(index, 1);
            } else {
              if (segment.type === 'plus-button') {
                segment.type = '';
              }

              if (index + 1 === this.metricSegments.length) {
                this.metricSegments.push(this.uiSegmentSrv.newPlusButton());
              }
            }

            if (this.metricSegments.length > 0) {
              this.panelCtrl.dataStream.start();
            } else {
              this.panelCtrl.dataStream.stop();
            }

            this.target.metrics = this.metricSegments.reduce(function (memo, item) {
              if (!item.fake) {
                memo.push({ name: item.value });
              }
              return memo;
            }, []);
          }
        }]);

        return PrometheusPullQueryCtrl;
      }(QueryCtrl));

      PrometheusPullQueryCtrl.templateUrl = './query_editor.html';

      _export('PrometheusPullQueryCtrl', PrometheusPullQueryCtrl);
    }
  };
});
//# sourceMappingURL=query_editor.js.map
