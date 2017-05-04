import template from './videorenderer.html';
import controller from './videorenderer.controller';
import './videorenderer.scss';

let videorendererComponent = {
  restrict: 'E',
  bindings: {
    isChatOpened: '=',
    onAddUser: '&',
    onRemoveUser: '&',
    onSendMessage: '&'
  },
  template,
  controller
};

export default videorendererComponent;
