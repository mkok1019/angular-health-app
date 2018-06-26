import template from './macro-review-editor.html';
import controller from './macro-review-editor.controller';
import './macro-review-editor.scss';

let component = {
  restrict: 'E',
  bindings: {
    onUpdate: '&'
  },
  template,
  controller
};

export default component;
