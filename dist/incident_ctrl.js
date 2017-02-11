'use strict';

System.register(['moment', 'angular', 'jquery', 'lodash', 'app/core/utils/kbn', 'app/core/config', 'app/plugins/sdk'], function (_export, _context) {
  "use strict";

  var moment, angular, $, _, kbn, config, MetricsPanelCtrl, _createClass, IncidentCtrl;

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
    setters: [function (_moment) {
      moment = _moment.default;
    }, function (_angular) {
      angular = _angular.default;
    }, function (_jquery) {
      $ = _jquery.default;
    }, function (_lodash) {
      _ = _lodash.default;
    }, function (_appCoreUtilsKbn) {
      kbn = _appCoreUtilsKbn.default;
    }, function (_appCoreConfig) {
      config = _appCoreConfig.default;
    }, function (_appPluginsSdk) {
      MetricsPanelCtrl = _appPluginsSdk.MetricsPanelCtrl;
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

      _export('IncidentCtrl', IncidentCtrl = function (_MetricsPanelCtrl) {
        _inherits(IncidentCtrl, _MetricsPanelCtrl);

        function IncidentCtrl($scope, $injector) {
          _classCallCheck(this, IncidentCtrl);

          var _this = _possibleConstructorReturn(this, (IncidentCtrl.__proto__ || Object.getPrototypeOf(IncidentCtrl)).call(this, $scope, $injector));

          var panelDefaults = {
            legend: {
              show: true, // disable/enable legend
              values: true
            },
            width: 100,
            height: 100,
            fontSize: '25px',
            fontWeight: '10px',
            font: { family: 'Myriad Set Pro, Helvetica Neue, Helvetica, Arial, sans-serif' },
            statData: {},
            message: "",
            json: [],
            rRate: '5s',
            activeInc: [],
            activeInc1: [],
            activeInc2: [],
            activeInc3: [],
            activeInc3c: [],
            refreshRate: 5000,
            text: {
              title: '',
              name: '',
              subText: ''
            }
          };
          _.defaults(_this.panel, panelDefaults);
          _.defaults(_this.panel.legend, panelDefaults.legend);
          _this.events.on('init-edit-mode', _this.onInitEditMode.bind(_this));
          _this.events.on('data-received', _this.onDataReceived.bind(_this));
          _this.events.on('panel-initialized', _this.render.bind(_this));

          return _this;
        }

        _createClass(IncidentCtrl, [{
          key: 'onInitEditMode',
          value: function onInitEditMode() {
            //this.addEditorTab('Options','public/plugins/grafana-incident-panel/editor.html',2);
          }
        }, {
          key: 'onDataReceived',
          value: function onDataReceived(dataList) {
            //receive data from hive datasource
            this.panel.json = dataList;
            this.parseData();
            this.render();
          }
        }, {
          key: 'parseData',
          value: function parseData() {
            //parse data and show info based on logic.
            //status must be in progress, Sev must be 1,2,3 or 3c.
            var self = this;
            var foundInc = false;
            self.panel.activeInc.length = 0;
            self.panel.activeInc1.length = 0;
            self.panel.activeInc2.length = 0;
            self.panel.activeInc3.length = 0;
            self.panel.activeInc3c.length = 0;
            if (self.panel.json.length != 0) {
              self.panel.json.forEach(function (incident) {
                if (incident.status === "In Progress") {

                  var convertedTime = new Date(incident.impactTime);
                  var incidentTitle = "Sev " + incident.severity + ": " + incident.title + " affecting " + incident.lobs.join();
                  var incidentTime = convertedTime.toTimeString();
                  var incidentDate = convertedTime.getMonth() + "/" + convertedTime.getDate() + "/" + convertedTime.getFullYear();
                  var incidentBridge = incident.incidentTicketNo + " active on Bridge" + incident.bridgeNumber;
                  if (incident.severity === "1") {
                    foundInc = true;
                    self.panel.activeInc1.push({ label: incidentTitle, date: incidentDate, time: incidentTime, bridge: incidentBridge });
                  } else if (incident.severity === "2") {
                    foundInc = true;
                    self.panel.activeInc2.push({ label: incidentTitle, date: incidentDate, time: incidentTime, bridge: incidentBridge });
                  } else if (incident.severity === "3C") {
                    foundInc = true;
                    self.panel.activeInc3c.push({ label: incidentTitle, date: incidentDate, time: incidentTime, bridge: incidentBridge });
                  } else if (incident.severity === "3") {
                    foundInc = true;
                    self.panel.activeInc3.push({ label: incidentTitle, date: incidentDate, time: incidentTime, bridge: incidentBridge });
                  }
                }
              });
              if (foundInc) {

                self.panel.activeInc.push(self.panel.activeInc1);
                self.panel.activeInc.push(self.panel.activeInc2);
                self.panel.activeInc.push(self.panel.activeInc3);
                self.panel.activeInc.push(self.panel.activeInc3c);
              } else {

                self.panel.activeInc1.push({ label: "No Active Incidents", date: "N/A", time: "N/A", bridge: "N/A" });
                self.panel.activeInc.push(self.panel.activeInc1);
              }
            }
          }
        }, {
          key: 'link',
          value: function link(scope, elem) {
            var _this2 = this;

            this.events.on('render', function () {
              var $panelContainer = elem.find('.panel-container');
              if (_this2.panel.bgColor) {
                $panelContainer.css('background-color', _this2.panel.bgColor);
              } else {
                $panelContainer.css('background-color', '');
              }
            });
          }
        }]);

        return IncidentCtrl;
      }(MetricsPanelCtrl));

      _export('IncidentCtrl', IncidentCtrl);

      IncidentCtrl.templateUrl = 'module.html';
    }
  };
});
//# sourceMappingURL=incident_ctrl.js.map
