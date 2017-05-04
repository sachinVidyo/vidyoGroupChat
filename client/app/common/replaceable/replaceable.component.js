import template from './replaceable.html';
import controller from './replaceable.controller';
import './replaceable.scss';

let replaceableComponent = {
  restrict: 'E',
  bindings: {
      onAddUser: '&',
      onRemoveUser: '&',
      onSendMessage: '&',
      isChatOpened: '='
  },
  template,
  controller
};

export default replaceableComponent;
