class MessageEditorController {
  constructor(Message, AlertService) {
    this._Message = Message;
    this._AlertService = AlertService;
  }

  $onChanges(changes) {
    this.init();
  }

  init() {
    this.message = {
      content: ''
    };

    if (this.messageForm) {
      this.messageForm.$setPristine();
      this.messageForm.$setUntouched();
    }
  }

  save() {
    this._Message.create(this.message)
      .then(res => {
        if (res && res.success) {
          this.init();
          this._AlertService.success("Message is saved successfully!");
          this.onUpdate();
        }
      })
      .catch(err => {
        if (!err.success && err.message)
          this._AlertService.error(err.message);
        else
          this._AlertService.error("Failed to send the message.");
      });
  }
}

MessageEditorController.$inject = ['Message', 'AlertService'];

export default MessageEditorController;
