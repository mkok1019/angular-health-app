class HomeController {
  constructor($state, Auth) {
    this._$state = $state;
    this._Auth = Auth;

    this.init();
  }

  init() {
    this.tabs = [
      {title: 'Daily', value: 'daily'},
      {title: 'Weekly', value: 'weekly'},
      {title: 'ETP Progress Graph', value: 'graph'},
      {title: 'ETP Journal', value: 'note'},
      {title: 'Leaderboard', value: 'leaderboard'},
    ];

    if (_.get(this._Auth.me, 'setting.coach', null)) {
      this.tabs.push({
        title: 'Message a coach',
        value: 'message'
      });
    }

    this.selectedProp = 'protein';
    this.trend_date = new Date();

    this.tabIndex = 0;
  }

  isTab(value) {
    return this.selectedTab === value;
  }

  isNotTab(value) {
    return this.selectedTab !== value;
  }

  selectTab(value) {
    this.selectedTab = value;
  }

  onUpdate() {
    this.updatedAt = new Date();
  }

  onSelectDate($event) {
    this.trend_date = $event;
  } 

  onSelectProp($event) {
    this.selectedProp = $event;
    this.tabIndex = 2;
  }

}

HomeController.$inject = ['$state', 'Auth'];

export default HomeController;
