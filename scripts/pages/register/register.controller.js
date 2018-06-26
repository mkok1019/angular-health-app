class RegisterController {
  constructor($state, AppConstants, AppMessages, Auth, AlertService) {
    this._$state = $state;
    this._AppConstants = AppConstants;
    this._AppMessages = AppMessages;
    this._Auth = Auth;
    this._AlertService = AlertService;

    this.init();
  }

  init() {
    this.user = {};
  }

  register() {
    this._Auth.register(this.user)
      .then(result => {
        if (result) {
          this._$state.go('account-bio');
        } else {
          this._AlertService.error("You have failed to register.");
        }
      });
  }

  queryCountries(search) {
    search = _.lowerCase(search);
    let results = _.map(this._AppConstants.countries, 'name')
                   .filter(c => _.lowerCase(c).indexOf(search) >= 0);
    return results;
  }

  selectCountry() {
  }
}

RegisterController.$inject = ['$state', 'AppConstants', 'AppMessages', 'Auth', 'AlertService'];

export default RegisterController;
