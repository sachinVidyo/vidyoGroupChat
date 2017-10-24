class SidebarController {
  constructor($rootScope, $timeout) {
    this.$rootScope = $rootScope;
    this.$timeout = $timeout;
    this.isConnected = false;
    this.muteCamera = false;
    this.muteMic = false;
    this.isWorking = false;
    this.updateConnectedStatus();
  }

  updateConnectedStatus() {
    this.$rootScope.$on('connectedStatus', (event, data) => {
      this.$timeout(() => {
        this.isWorking = false;
        this.isConnected = data.isConnected;
      });
    });
  }

  openChatWindow() {
    this.onOpenChat();
  }

  requestImage() {
    if (!this.$rootScope.vidyoConnector) {
      alert('You are not connected to Group chat yet!');
    } else {
      var message = '{ "type": "SnapshotRequest",' +
                      '"targetId": "Sachin@e8d9a3.vidyo.io", ' +
                      '"sourceId": "xyz" }';
      this.$rootScope.vidyoConnector.SendChatMessage(message);
    }
  }

  toggleConnect() {
    if (!this.isConnected) {
      this.isWorking = true;
      this.$rootScope.$broadcast('connection:on');
    } else {
      this.isWorking = true;
      var message = '{ "type": "Control",' +
                      '"subType": "DisconnectAll"}';
      this.$rootScope.vidyoConnector.SendChatMessage(message);
      this.$rootScope.$broadcast('connection:off');
    }
  }

  toggleMic() {
    if (!this.muteMic) {
      this.$rootScope.$broadcast('micMute:on');
    } else {
      this.$rootScope.$broadcast('micMute:off');
    }
    this.muteMic = !this.muteMic;
  }

  toggleCamera() {
    if (!this.muteCamera) {
      this.$rootScope.$broadcast('cameraMute:on');
    } else {
      this.$rootScope.$broadcast('cameraMute:off');
    }
    this.muteCamera = !this.muteCamera;
  }
}

SidebarController.$inject = ['$rootScope', '$timeout'];

export default SidebarController;
