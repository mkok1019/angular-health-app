import template from './week-log.html';
import controller from './week-log.controller';
import './week-log.scss';

let component = {
  restrict: 'E',
  template,
  controller,
  bindings: {
    onProp: '&',
    onDate: '&',
    trendDate: '<',
    updatedAt: '<'
  },
};

export default component;
