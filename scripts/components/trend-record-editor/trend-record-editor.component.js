import template from './trend-record-editor.html';
import controller from './trend-record-editor.controller';
import './trend-record-editor.scss';

let component = {
  restrict: 'E',
  bindings: {
    trendDate: '<',
    updatedAt: '<',
    onUpdate: '&',
    onDate: '&'
  },
  template,
  controller
};

export default component;
