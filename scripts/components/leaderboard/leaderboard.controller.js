class LeaderboardController {
  constructor(Leaderboard) {
    this._Leaderboard = Leaderboard;
  }

  $onChanges(changes) {
    this.init();
  }

  init() {
    this.unit = 0;
    this.prop = 'all';

    this.load();
  }

  load() {
    const today = moment().format('YYYY-MM-DD');

    this._Leaderboard[this.prop](today)
      .then(res => {
        const count = res.clients.length;
        const unit = _.ceil(count / 4);

        this.clients = _.chunk(res.clients, unit);
        this.unit = unit;
      });
  }
}

LeaderboardController.$inject = ['Leaderboard'];

export default LeaderboardController;
