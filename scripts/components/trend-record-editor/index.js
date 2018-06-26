import angular from 'angular';
import uiRouter from 'angular-ui-router';
import component from './trend-record-editor.component';

let module = angular.module('trend-record-editor', [])

.component('etpTrendRecordEditor', component)
  
.name;

export default module;
