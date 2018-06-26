class ForgotPasswordController {
  constructor($state, AppMessages, Auth, AlertService) {
    this._$state = $state;
    this._AppMessages = AppMessages;
    this._Auth = Auth;
    this._AlertService = AlertService;

    this.init();
  }

  init() {
    this.email = '';
  }

  reset() {
    this._Auth.resetPasswrod(this.email)
      .then(result => {
        if (result) {
          this._AlertService.success(this._AppMessages.auth.success_to_reset_password);
        } else {
          this._AlertService.error(this._AppMessages.auth.failed_to_reset_password);
        }
      });
  }
}

ForgotPasswordController.$inject = ['$state', 'AppMessages', 'Auth', 'AlertService'];

export default ForgotPasswordController;
