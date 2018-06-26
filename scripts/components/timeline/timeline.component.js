import template from './timeline.html';
import controller from './timeline.controller';
import './timeline.scss';

let component = {
  restrict: 'E',
  bindings: {
    onUpdate: '&'
  },
  template,
  controller
};

export default component;
