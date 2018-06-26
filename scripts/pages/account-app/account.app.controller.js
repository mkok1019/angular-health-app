class AccountAppController {
  constructor(Auth, AlertService, Fitbit) {
    this._Auth = Auth;
    this._AlertService = AlertService;
    this._Fitbit = Fitbit;

    this.init();
  }

  init() {
    const info = _.get(this._Auth.me, 'setting.fitbit_info');
    this.fitbit = info ? JSON.parse(info) : null;
    this.healthkit = _.get(this._Auth.me, 'setting.healthkit', false);
    this.auth_url = this._Fitbit.getAuthenticationUrl();

    if (!this.fitbit) {
      this._Fitbit.getAccessToken()
        .then(result => {
          if (result) {
            this.updateSetting(result);
          }
        })
        .catch(err => {
          console.log(err);
        });
    }
  }

  updateSetting(fitbit) {
    const data = {
      fitbit_info: fitbit ? JSON.stringify(fitbit) : null
    };
    this._Auth.updateSetting(data)
      .then(res => {
        if (res && res.success) {
          this.init();
        }
      });
  }

  signout() {
    this.updateSetting(null);
  }
}

AccountAppController.$inject = ['Auth', 'AlertService', 'Fitbit'];

export default AccountAppController;
