import angular from 'angular';
import uiRouter from 'angular-ui-router';
import component from './macro-review-editor.component';

let module = angular.module('macro-review-editor', [])

.component('etpMacroReviewEditor', component)
  
.name;

export default module;
