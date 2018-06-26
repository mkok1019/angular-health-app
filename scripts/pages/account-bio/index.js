import angular from 'angular';
import uiRouter from 'angular-ui-router';
import Component from './account.bio.component';

let Module = angular.module('account-bio', [
  uiRouter
])

.config(($stateProvider, $urlRouterProvider) => {
  "ngInject";

  $stateProvider
    .state('account-bio', {
      url: '/account/bio',
      component: 'account.bio',
      title: 'Health and Program Specific Info',
      resolve: {
        auth: (Auth) => {
          return Auth.ensureAuth();
        }
      }
    });
})

.component('account.bio', Component)
  
.name;

export default Module;
