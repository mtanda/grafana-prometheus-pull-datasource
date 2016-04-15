'use strict';

System.register(['moment', 'vendor/npm/rxjs/Rx', 'vendor/npm/rxjs/add/observable/interval', 'vendor/npm/rxjs/Subject'], function (_export, _context) {
  var moment, Observable, Subject, _createClass, StreamHandler;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  return {
    setters: [function (_moment) {
      moment = _moment.default;
    }, function (_vendorNpmRxjsRx) {
      Observable = _vendorNpmRxjsRx.Observable;
    }, function (_vendorNpmRxjsAddObservableInterval) {}, function (_vendorNpmRxjsSubject) {
      Subject = _vendorNpmRxjsSubject.Subject;
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

      _export('StreamHandler', StreamHandler = function () {
        function StreamHandler(options, datasource) {
          _classCallCheck(this, StreamHandler);

          this.options = options;
          this.ds = datasource;
          this.subject = new Subject();
        }

        _createClass(StreamHandler, [{
          key: 'start',
          value: function start() {
            if (this.source) {
              return;
            }

            var target = this.options.targets[0];

            console.log('StreamHandler: start()');

            var interval = moment.duration(parseInt(target.interval, 10), 'seconds').asMilliseconds();
            if (interval < 1000) {
              interval = 1000;
            }

            var self = this;
            this.source = Observable.interval(interval).flatMap(function () {
              var promise = new Promise(function (resolve) {
                if (target.metrics.length === 0) {
                  return resolve([]);
                }

                self.ds.request({ method: 'get', url: '/metrics' }).then(function (res) {
                  var targetMetrics = target.metrics.map(function (m) {
                    return m.name;
                  });
                  var result = res.data.split(/\n/).filter(function (l) {
                    return l.indexOf('#') !== 0;
                  }).map(function (l) {
                    return l.split(/[{ ]/);
                  }).filter(function (m) {
                    return targetMetrics.includes(m[0]);
                  });
                  return resolve(result);
                });
              });
              return Observable.fromPromise(promise);
            }).subscribe(function (data) {
              self.onNext.bind(self)(data);
            }, function (error) {
              self.onError.bind(self)(error);
            }, function () {
              self.onCompleted.bind(self)();
            });

            this.metrics = {};
          }
        }, {
          key: 'onNext',
          value: function onNext(data) {
            this.processMetricEvent(data);
          }
        }, {
          key: 'onError',
          value: function onError(error) {
            console.log('stream error', error);
          }
        }, {
          key: 'onCompleted',
          value: function onCompleted() {
            console.log('stream completed');
          }
        }, {
          key: 'stop',
          value: function stop() {
            console.log('Forcing event stream stop');
            if (this.source) {
              this.source.unsubscribe();
            }
            this.source = null;
          }
        }, {
          key: 'subscribe',
          value: function subscribe(options) {
            return this.subject.subscribe(options);
          }
        }, {
          key: 'processMetricEvent',
          value: function processMetricEvent(data) {
            var endTime = new Date().getTime();
            var startTime = endTime - 60 * 1 * 1000;
            var seriesList = [];

            for (var i = 0; i < data.length; i++) {
              var point = data[i];
              var series = this.metrics[point[0]];
              if (!series) {
                series = { target: point[0], datapoints: [] };
                this.metrics[point[0]] = series;
              }

              var time = new Date().getTime();
              series.datapoints.push([point[1], time]);
              seriesList.push(series);
            }

            this.subject.next({
              data: seriesList,
              range: { from: moment(startTime), to: moment(endTime) }
            });
          }
        }]);

        return StreamHandler;
      }());

      _export('StreamHandler', StreamHandler);
    }
  };
});
//# sourceMappingURL=stream_handler.js.map
