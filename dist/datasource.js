'use strict';

System.register(['lodash', './stream_handler'], function (_export, _context) {
  var _, StreamHandler, _createClass, PrometheusPullDatasource;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  return {
    setters: [function (_lodash) {
      _ = _lodash.default;
    }, function (_stream_handler) {
      StreamHandler = _stream_handler.StreamHandler;
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

      _export('PrometheusPullDatasource', PrometheusPullDatasource = function () {
        function PrometheusPullDatasource(instanceSettings, $http, backendSrv) {
          _classCallCheck(this, PrometheusPullDatasource);

          this.instanceSettings = instanceSettings;
          this.url = instanceSettings.url;
          this.withCredentials = instanceSettings.withCredentials;
          this.$http = $http;
          this.backendSrv = backendSrv;
          this.streamHandlers = {};
        }

        _createClass(PrometheusPullDatasource, [{
          key: 'request',
          value: function request(options) {
            options.url = this.url + options.url;
            if (this.withCredentials) {
              options.withCredentials = true;
            }
            return this.backendSrv.datasourceRequest(options);
          }
        }, {
          key: 'query',
          value: function query(options) {
            var handler = this.streamHandlers[options.panelId];
            if (handler) {
              return Promise.resolve(handler);
            }

            this.streamHandlers[options.panelId] = handler = new StreamHandler(options, this);
            handler.start();

            return Promise.resolve(handler);
          }
        }, {
          key: 'getMetrics',
          value: function getMetrics() {
            var _this = this;

            if (this.metricsCache) {
              return Promise.resolve(this.metricsCache);
            }

            return this.request({ method: 'get', url: '/metrics' }).then(function (res) {
              if (!res.data) {
                return [];
              }

              _this.metricsCache = _.chain(res.data.split(/\n/)).filter(function (l) {
                return l.indexOf('#') !== 0;
              }).map(function (l) {
                var metric = l.split(/[{ ]/)[0];
                return { text: metric, value: metric };
              }).uniq(function (m) {
                return m.value;
              }).value();

              return _this.metricsCache;
            });
          }
        }]);

        return PrometheusPullDatasource;
      }());

      _export('PrometheusPullDatasource', PrometheusPullDatasource);
    }
  };
});
//# sourceMappingURL=datasource.js.map
