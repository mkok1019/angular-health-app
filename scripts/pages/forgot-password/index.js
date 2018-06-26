import angular from 'angular';
import uiRouter from 'angular-ui-router';
import ngMaterial from 'angular-material';
import component from './forgot-password.component';

let module = angular.module('forgotPassword', [
  uiRouter, ngMaterial
])

.config(($stateProvider) => {
  "ngInject";
  $stateProvider
    .state('forgot-password', {
      url: '/forgot-password',
      component: 'forgotPassword'
    });
})

.component('forgotPassword', component)
  
.name;

export default module;
