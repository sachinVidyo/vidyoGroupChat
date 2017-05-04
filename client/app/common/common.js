import angular from 'angular';
import Sidebar from './sidebar/sidebar';
import Replaceable from './replaceable/replaceable';
import Messageview from './messageview/messageview';
import VideoRenderer from './videorenderer/videorenderer';
import User from './user/user';

let commonModule = angular.module('app.common', [
  Sidebar,
  Replaceable,
  Messageview,
  VideoRenderer,
  User
])
  
.name;

export default commonModule;
