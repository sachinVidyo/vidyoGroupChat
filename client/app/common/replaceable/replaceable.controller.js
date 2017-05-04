class ReplaceableController {
  constructor() {
    this.user = {};
    this.messageInfo = {};
  }

  addNewUser() {
    this.onAddUser(this.user);
    this.user = {};
  }

  removeUser() {
    this.onRemoveUser(this.user);
    this.user = {};
  }

  sendMessage() {
    this.onSendMessage(this.messageInfo);
    this.messageInfo = {};
  }
}

export default ReplaceableController;
