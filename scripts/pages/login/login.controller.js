class LoginController {
  constructor($state, AppMessages, Auth, AlertService) {
    this._$state = $state;
    this._AppMessages = AppMessages;
    this._Auth = Auth;
    this._AlertService = AlertService;

    this.init();
  }

  init() {
    this.user = {};
  }

  login() {
    this._Auth.login(this.user)
      .then(result => {
        if (result) {
          if (!_.get(result, 'client.bio')) {
            this._$state.go('account-bio');
          } else if (!_.get(result, 'client.setting')) {
            this._$state.go('account-setting');
          } else {
            this._$state.go('home');
          }
        } else {
          this._AlertService.error(this._AppMessages.auth.login_failed);
        }
      })
      .catch(err => this._AlertService.error(this._AppMessages.auth.login_failed));
  }
}

LoginController.$inject = ['$state', 'AppMessages', 'Auth', 'AlertService'];

export default LoginController;
