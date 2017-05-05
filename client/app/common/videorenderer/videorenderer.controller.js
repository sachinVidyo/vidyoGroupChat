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

    this.$rootScope.$on('micMute:on', () => {
      this.$rootScope.vidyoConnector.SetMicrophonePrivacy(true);
    });

    this.$rootScope.$on('micMute:off', () => {
      this.$rootScope.vidyoConnector.SetMicrophonePrivacy(false);
    });

    this.$rootScope.$on('cameraMute:on', () => {
      this.$rootScope.vidyoConnector.SetCameraPrivacy(true);
    });

    this.$rootScope.$on('cameraMute:off', () => {
      this.$rootScope.vidyoConnector.SetCameraPrivacy(false);
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
    console.log('tttt',this.$rootScope.user.token);
    console.log('tttt',this.$rootScope.user.name);
    console.log('tttt',this.$rootScope.user.roomId);

    vidyoConnector.Connect({
      host: "prod.vidyo.io",
      token: this.$rootScope.user.token ||"cHJvdmlzaW9uAHRlc3R1c2VyQGU4ZDlhMy52aWR5by5pbwA2MzY2MTgzMDM1MwAAYmJlNjIwMzU1YjlkOWFhMmVmMjYxODZmYjYyMDRmYzI1NjJmMTdjNTU5YzgxNGMxNDkwMmU0N2FhYzI2ZjJiNWI0ZGM0MWFmNmM4Y2I1Y2Y5ZTkxZmMxZTA2Njc1OTY2",
      displayName: this.$rootScope.user.name || 'testuser',
      resourceId: this.$rootScope.user.roomId || 'KPDemoRoom',

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
