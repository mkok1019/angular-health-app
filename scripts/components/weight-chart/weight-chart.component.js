import template from './weight-chart.html';
import controller from './weight-chart.controller';
import './weight-chart.scss';

let component = {
  restrict: 'E',
  template,
  controller,
  bindings: {
    updatedAt: '<'
  },
};

export default component;
