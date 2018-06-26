class AccountController {
  constructor(Auth, AlertService, AppMessages, AppConstants) {
    this._Auth = Auth;
    this._AlertService = AlertService;
    this._AppMessages = AppMessages;
    this._AppConstants = AppConstants;
    this.init();
  }

  init() {
    this.resetAccount();
    this.resetPassword();
  }

  updateAccount() {
    this._Auth.updateProfile(this.user)
      .then(res => {
        if (res.success) {
          this._AlertService.success(this._AppMessages.account.success_to_update_account);
          this.resetAccount();
        } else {
          this._AlertService.error(this._AppMessages.account.fiiled_to_update_account);
        }
      });
  }

  resetAccount() {
    this.user = _.cloneDeep(this._Auth.me);
    if (this.accountForm) {
      this.accountForm.$setPristine();
      this.accountForm.$setUntouched();
    }
  }

  updatePassword() {
    this._Auth.updatePassword(this.accountPassword)
      .then(res => {
        if (res) {
          this._AlertService.success(this._AppMessages.account.success_to_update_password);
        } else {
          this._AlertService.error(this._AppMessages.account.failed_to_update_password);
        }
        this.resetPassword();
      });
  }

  queryCountries(search) {
    search = _.lowerCase(search);
    let results = _.map(this._AppConstants.countries, 'name')
                   .filter(c => _.lowerCase(c).indexOf(search) >= 0);
    return results;
  }

  resetPassword() {
    this.accountPassword = {
      password: "",
      password_confirmation: ""
    };
    if (this.passwordForm) {
      this.passwordForm.$setPristine();
      this.passwordForm.$setUntouched();
    }
  }
}

AccountController.$inject = ['Auth', 'AlertService', 'AppMessages', 'AppConstants'];

export default AccountController;
