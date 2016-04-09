'use strict';

System.register(['./datasource', './config', './query_editor'], function (_export, _context) {
  var PrometheusPullDatasource, ConfigCtrl, PrometheusPullQueryCtrl;
  return {
    setters: [function (_datasource) {
      PrometheusPullDatasource = _datasource.PrometheusPullDatasource;
    }, function (_config) {
      ConfigCtrl = _config.ConfigCtrl;
    }, function (_query_editor) {
      PrometheusPullQueryCtrl = _query_editor.PrometheusPullQueryCtrl;
    }],
    execute: function () {
      _export('Datasource', PrometheusPullDatasource);

      _export('ConfigCtrl', ConfigCtrl);

      _export('QueryCtrl', PrometheusPullQueryCtrl);
    }
  };
});
//# sourceMappingURL=module.js.map
