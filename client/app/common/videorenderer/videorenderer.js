import angular from 'angular';
import videorendererComponent from './videorenderer.component';

let videorendererModule = angular.module('videorenderer', [])

.component('videoRenderer', videorendererComponent)
  
.name;

export default videorendererModule;
