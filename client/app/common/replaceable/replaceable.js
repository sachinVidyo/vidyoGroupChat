import angular from 'angular';
import uiRouter from 'angular-ui-router';
import replaceableComponent from './replaceable.component';

let replaceableModule = angular.module('replaceable', [
  uiRouter
])

.component('replaceable', replaceableComponent)
  
.name;

export default replaceableModule;
