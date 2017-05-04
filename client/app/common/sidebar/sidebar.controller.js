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

  toggleConnect() {
    if (!this.isConnected) {
      this.isWorking = true;
      this.$rootScope.$broadcast('connection:on');
    } else {
      this.isWorking = true;
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
      this.$rootScope.$broadcast('micCamera:on');
    } else {
      this.$rootScope.$broadcast('micCamera:off');
    }
    this.muteCamera = !this.muteCamera;
  }
}

SidebarController.$inject = ['$rootScope', '$timeout'];

export default SidebarController;
