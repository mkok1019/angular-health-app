import template from './track-log.html';
import controller from './track-log.controller';
import './track-log.scss';

let trackLogComponent = {
  restrict: 'E',
  template,
  controller,
  bindings: {
    trendDate: '<',
    updatedAt: '<'
  },
};

export default trackLogComponent;
