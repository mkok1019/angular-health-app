import angular from 'angular';
import uiRouter from 'angular-ui-router';
import component from './plan-panel.component';

let module = angular.module('plan-panel', [])

.component('etpPlanPanel', component)
  
.name;

export default module;
