import angular from 'angular';
import uiRouter from 'angular-ui-router';
import Component from './account.setting.component';

let Module = angular.module('account-setting', [
  uiRouter
])

.config(($stateProvider, $urlRouterProvider) => {
  "ngInject";

  $stateProvider
    .state('account-setting', {
      url: '/account/setting',
      component: 'account.setting',
      title: 'Diet and Activity History',
      resolve: {
        auth: (Auth) => {
          return Auth.ensureAuth();
        }
      }
    });
})

.component('account.setting', Component)
  
.name;

export default Module;
