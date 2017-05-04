import angular from 'angular';
import uiRouter from 'angular-ui-router';
import MessageviewComponent from './messageview.component';

let messageviewModule = angular.module('messageview', [
  uiRouter
])

.component('messageView', MessageviewComponent)

.name;

export default messageviewModule;
