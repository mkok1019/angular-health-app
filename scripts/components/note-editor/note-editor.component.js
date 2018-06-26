import template from './note-editor.html';
import controller from './note-editor.controller';
import './note-editor.scss';

let component = {
  restrict: 'E',
  bindings: {
    onUpdate: '&'
  },
  template,
  controller
};

export default component;
