import template from './plan-panel.html';
import controller from './plan-panel.controller';
import './plan-panel.scss';

let component = {
  restrict: 'E',
  bindings: {
    trendDate: '<',
    onUpdate: '&'
  },
  template,
  controller
};

export default component;
