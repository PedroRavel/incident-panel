
import moment from 'moment';
import angular from 'angular';
import $ from 'jquery';
import _ from 'lodash';

import kbn from 'app/core/utils/kbn';
import config from 'app/core/config';
import {MetricsPanelCtrl} from 'app/plugins/sdk';



export class IncidentCtrl extends MetricsPanelCtrl {
  constructor($scope,$injector){
    super($scope,$injector);
    const panelDefaults = {
      legend: {
        show: true, // disable/enable legend
        values: true
      },
      width:100,
      height:100,
      fontSize: '25px',
      fontWeight: '10px',
      font: { family: 'Myriad Set Pro, Helvetica Neue, Helvetica, Arial, sans-serif' },
      statData:{},
      message:"",
      json:[],
      rRate:'5s',
      activeInc:[],
      activeInc1:[],
      activeInc2:[],
      activeInc3:[],
      activeInc3c:[],
      refreshRate:5000,
      text:{
        title:'',
        name:'',
        subText:''
      }
    }
    _.defaults(this.panel, panelDefaults);
    _.defaults(this.panel.legend, panelDefaults.legend);
    this.events.on('init-edit-mode',this.onInitEditMode.bind(this));
    this.events.on('data-received', this.onDataReceived.bind(this));
    this.events.on('panel-initialized', this.render.bind(this));

  }
  onInitEditMode() {
    //this.addEditorTab('Options','public/plugins/grafana-incident-panel/editor.html',2);
  }

  onDataReceived(dataList) {
    //receive data from hive datasource
    this.panel.json = dataList;
    this.parseData();
    this.render();
  }

  parseData(){
    //parse data and show info based on logic.
    //status must be in progress, Sev must be 1,2,3 or 3c.
    var self = this;
    var foundInc = false;
    self.panel.activeInc.length = 0;
    self.panel.activeInc1.length = 0;
    self.panel.activeInc2.length = 0;
    self.panel.activeInc3.length = 0;
    self.panel.activeInc3c.length = 0;
    if(self.panel.json.length != 0){
      self.panel.json.forEach(function(incident){
        if(incident.status === "In Progress"){


          var convertedTime = new Date(incident.impactTime);
          var incidentTitle = "Sev " + incident.severity +": " + incident.title+" affecting " + incident.lobs.join();
          var incidentTime = convertedTime.toTimeString();
          var incidentDate = convertedTime.getMonth() + "/" + convertedTime.getDate() + "/" + convertedTime.getFullYear();
          var incidentBridge = incident.incidentTicketNo + " active on Bridge" + incident.bridgeNumber;
          if(incident.severity === "1"){
              foundInc = true;
            self.panel.activeInc1.push({label:incidentTitle,date:incidentDate,time:incidentTime,bridge:incidentBridge})

          }
          else if(incident.severity === "2"){
              foundInc = true;
            self.panel.activeInc2.push({label:incidentTitle,date:incidentDate,time:incidentTime,bridge:incidentBridge})
          }
          else if(incident.severity === "3C"){
              foundInc = true;
            self.panel.activeInc3c.push({label:incidentTitle,date:incidentDate,time:incidentTime,bridge:incidentBridge})
          }
          else if(incident.severity === "3"){
              foundInc = true;
            self.panel.activeInc3.push({label:incidentTitle,date:incidentDate,time:incidentTime,bridge:incidentBridge})
          }
        }
      })
      if(foundInc){

        self.panel.activeInc.push(self.panel.activeInc1);
        self.panel.activeInc.push(self.panel.activeInc2);
        self.panel.activeInc.push(self.panel.activeInc3);
        self.panel.activeInc.push(self.panel.activeInc3c);
      } else {

        self.panel.activeInc1.push({label:"No Active Incidents",date:"N/A",time:"N/A",bridge:"N/A"})
        self.panel.activeInc.push(self.panel.activeInc1);
      }
    }
  }

  link(scope, elem) {
    this.events.on('render', () => {
      const $panelContainer = elem.find('.panel-container');
      if (this.panel.bgColor) {
        $panelContainer.css('background-color', this.panel.bgColor);
      } else {
        $panelContainer.css('background-color', '');
      }

    });

  }
}
IncidentCtrl.templateUrl = 'module.html';
