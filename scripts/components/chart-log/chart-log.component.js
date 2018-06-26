import template from './chart-log.html';
import controller from './chart-log.controller';
import './chart-log.scss';

let component = {
  restrict: 'E',
  template,
  controller,
  bindings: {
    prop: '<',
    trendDate: '<',
    updatedAt: '<'
  },
};

export default component;
