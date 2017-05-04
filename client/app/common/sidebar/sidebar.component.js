import template from './sidebar.html';
import controller from './sidebar.controller';
import './sidebar.scss';

let sidebarComponent = {
  restrict: 'E',
  bindings: {
    users: '=',
    onOpenChat: '&'
  },
  template,
  controller
};

export default sidebarComponent;
