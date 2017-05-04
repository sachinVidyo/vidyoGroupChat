class MessageviewController {
  constructor($rootScope) {
    this.$rootScope = $rootScope;
    this.name = 'messageview';
    this.messageInfo = {};
  }

  closeChatWindow() {
    this.onCloseChat();
  }

  sendMessage() {
    if (!this.$rootScope.vidyoConnector) {
      alert('You are not connected to Group chat yet!');
    } else {
      this.$rootScope.vidyoConnector.SendChatMessage(this.messageInfo.content);
      this.onSendMessage(this.messageInfo);
      this.messageInfo = {};
    }
  }
}

MessageviewController.$inject = ['$rootScope'];

export default MessageviewController;
