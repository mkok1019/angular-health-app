import angular from 'angular';
import uiRouter from 'angular-ui-router';
import component from './note-editor.component';

let module = angular.module('note-editor', [])

.component('etpNoteEditor', component)
  
.name;

export default module;
