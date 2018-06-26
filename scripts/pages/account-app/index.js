import angular from 'angular';
import uiRouter from 'angular-ui-router';
import Component from './account.app.component';

let Module = angular.module('account-app', [
  uiRouter
])

.config(($stateProvider, $urlRouterProvider) => {
  "ngInject";

  $stateProvider
    .state('account-app', {
      url: '/account/app',
      component: 'account.app',
      title: 'Trends Applications Setup',
      resolve: {
        auth: (Auth) => {
          return Auth.ensureAuth();
        }
      }
    });
})

.component('account.app', Component)
  
.name;

export default Module;
