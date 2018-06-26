class AccountSettingController {
  constructor($state, Auth, AlertService) {
    this._$state = $state;
    this._Auth = Auth;
    this._AlertService = AlertService;

    this.init();
  }

  init() {
    this.user = _.cloneDeep(this._Auth.me);
    if (!this.user.setting) {
      this.user.setting = {};
    }

    this.load();
  }

  load() {
  }

  save() {
    this._Auth.updateSetting(this.user.setting)
      .then(result => {
        if (result.success) {
          this.user = result.client;
          this._AlertService.success("Your account is updated.");
        } else {
          this._AlertService.error("Your account is updated.");
        }
      });
  }

}

AccountSettingController.$inject = ['$state', 'Auth', 'AlertService'];

export default AccountSettingController;
