class VideoRendererController {
  constructor($timeout, $rootScope) {
    this.$timeout = $timeout;
    this.$rootScope = $rootScope;
    this.listenEvent();
    this.listenConnectionChangeOrder();
  }

  listenConnectionChangeOrder() {
    this.$rootScope.$on('connection:on', () => {
      if (!this.$rootScope.vidyoConnector) {
        this.loadVidyoClientLibrary();
      } else {
        this.connectVidyo(this.$rootScope.vidyoConnector);
      }
    });

    this.$rootScope.$on('connection:off', () => {
      this.disconnectVidyo(this.$rootScope.vidyoConnector);
    });
  }

  listenEvent() {
    document.addEventListener('vidyoclient:ready', (e) => {
      this.renderVideo(e.detail);
    });
  }

  renderVideo(VC) {
    this.$timeout(() => {
      VC.CreateVidyoConnector({
        viewId: "renderer",                            // Div ID where the composited video will be rendered, see VidyoConnector.html
        viewStyle: "VIDYO_CONNECTORVIEWSTYLE_Default", // Visual style of the composited renderer
        remoteParticipants: 16,                        // Maximum number of participants
        logFileFilter: "warning all@VidyoConnector info@VidyoClient",
        logFileName:"",
        userData:""
      }).then((vidyoConnector) => {
        this.$rootScope.vidyoConnector = vidyoConnector;
        this.connectVidyo(vidyoConnector);
      }).catch(() => {
        console.error("CreateVidyoConnector Failed");
      });
    });
  }

  loadVidyoClientLibrary() {
		var script = document.createElement('script');
		script.type = 'text/javascript';
		script.src = 'https://static.vidyo.io/4.1.11.4/javascript/VidyoClient/VidyoClient.js?onload=onVidyoClientLoaded';
		document.getElementsByTagName('head')[0].appendChild(script);
	}

  disconnectVidyo(vidyoConnector) {
    vidyoConnector.Disconnect();
  }

  connectVidyo(vidyoConnector) {
    vidyoConnector.Connect({
      host: "prod.vidyo.io",
      token: "cHJvdmlzaW9uAHNhY2hpbkBlOGQ5YTMudmlkeW8uaW8ANjM2NjE3NTIzNzYAADUxNzg5NDk2NWM5NmM3NmM5N2UzOWEzNTdjYTIyY2VjZDQ5Mzc3NzRmMzIyODk0YzQ3NmVmNjkzMjM4ZTM5YTQyODkxMzQyZDUyOWZhMGJlNDY5OTMzZDQ3YTQzMzRkMw==",
      displayName: "User2",
      resourceId: "SachinRoom",

      onSuccess: () => {
        /* Connected */
        console.log('connected!');
        this.$rootScope.$broadcast('connectedStatus', { isConnected: true });
      },
      onFailure: (reason) => {
        /* Failed */
        console.log('failed! The reason: ', reason);
      },
      onDisconnected: (reason) => {
        /* Disconnected */
        console.log('disconnected! Reason: ', reason);
        this.$rootScope.$broadcast('connectedStatus', { isConnected: false });
      }
    }).then((status) => {
      if (status) {
        this.handlePaticipants(vidyoConnector);
        this.receiveMessage(vidyoConnector);
      } else {
        console.error("ConnectCall Failed");
      }
    }).catch(() => {
      console.error("ConnectCall Failed");
    });
  }

  receiveMessage(vidyoConnector) {
    vidyoConnector.RegisterMessageEventListener({
      onChatMessageReceived: (participant, chatMessage) => {
        console.log('********', chatMessage);
        this.onSendMessage({ id: participant.id, name: participant.name, content: chatMessage.body });
      }
    }).then(() => {
      console.log("RegisterParticipantEventListener Success");
    }).catch(() => {
      console.err("RegisterParticipantEventListener Failed");
    });
  }

  handlePaticipants(vidyoConnector) {
    vidyoConnector.RegisterParticipantEventListener(
      {
        onJoined: (participant) => {
          console.log('Joined', participant);
          this.onAddUser({ id:participant.id, name:participant.name });
        },
        onLeft: (participant) => {
          console.log('Left', participant);
          this.onRemoveUser({ id:participant.id, name:participant.name });
        },
        onDynamicChanged: (participants, cameras) => { /* Ordered array of participants according to rank */ },
        onLoudestChanged: (participant, audioOnly) => { /* Current loudest speaker */ }
      }
    ).then(() => {
      console.log("RegisterParticipantEventListener Success");
    }).catch(() => {
      console.err("RegisterParticipantEventListener Failed");
    });
  }
}

VideoRendererController.$inject = ['$timeout', '$rootScope'];

export default VideoRendererController;
