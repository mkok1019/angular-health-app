import angular from 'angular';
import uiRouter from 'angular-ui-router';
import component from './leaderboard.component';

let module = angular.module('leaderboard', [])

.component('etpLeaderboard', component)
  
.name;

export default module;
