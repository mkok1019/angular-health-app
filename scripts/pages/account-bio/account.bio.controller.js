class AccountBioController {
  constructor($state, Auth, Goal, AlertService) {
    this._$state = $state;
    this._Auth = Auth;
    this._Goal = Goal;
    this._AlertService = AlertService;

    this.init();
  }

  init() {
    this.user = _.cloneDeep(this._Auth.me);
    if (!this.user.bio) {
      this.user.bio = {};
    }

    const weight = this.user.bio.weight || 0;
    this.weight = {
      is_lbs: true,
      k: 0.453592,
      lbs: weight,
      kg: Math.ceil(weight * 0.453592)
    };

    const height = this.user.bio.height || 0;
    this.height = {
      is_ft: true,
      k: 2.54,
      f: 12,
      inches: height % 12,
      foot: parseInt(height / 12),
      meters: parseInt(Math.ceil(height * 2.54) / 100),
      cm: Math.ceil(height * 2.54) % 100
    };

    this.ages = [
      {age: 10, label: "Below 20"},
      {age: 20, label: "20 - 30"},
      {age: 30, label: "31 - 40"},
      {age: 40, label: "41 - 50"},
      {age: 50, label: "Above 50"}
    ];

    this.load();
  }

  load() {
    this._Goal.list()
      .then(res => {
        if (res) {
          this.goals = res.goals;
        }
      });
  }

  save() {
    this.user.bio.weight = this.weight.lbs;
    this.user.bio.height = this.height.foot * 12 + this.height.inches;
    this._Auth.updateBio(this.user.bio)
      .then(result => {
        if (result.success) {
          this.user = result.client;
          this._AlertService.success("Your account is updated.");
          if (!this.user.setting) {
            this._$state.go('account-setting');
          }
        } else {
          this._AlertService.error("Your account is updated.");
        }
      });
  }

  onWeightChange() {
    if (this.weight.is_lbs) {
      this.weight.kg = Math.ceil((this.weight.lbs || 0) * this.weight.k);
    } else {
      this.weight.lbs = Math.ceil((this.weight.kg || 0) / this.weight.k);
    }
  }

  onHeightChange() {
    let height = 0;
    if (this.height.is_ft) {
      height = this.height.foot * 12 + this.height.inches;
      this.height.meters = parseInt(Math.ceil(height * this.height.k) / 100);
      this.height.cm = Math.ceil(height * this.height.k) % 100;
    } else {
      height = Math.ceil((this.height.meters * 100 + this.height.cm) / this.height.k);
      this.height.foot = parseInt(height / 12);
      this.height.inches = height % 12;
    }
  }
}

AccountBioController.$inject = ['$state', 'Auth', 'Goal', 'AlertService'];

export default AccountBioController;
