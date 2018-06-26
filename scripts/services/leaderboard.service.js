import API from './api.service.js';

class Leaderboard extends API {
  constructor(AppConstants, $http, $httpParamSerializer) {
    super(AppConstants, $http, $httpParamSerializer);
  }

  toString() {
    return 'leaderboard';
  }

  steps(date) {
    return this._get(this.toString() + '/' + date + '/steps')
      .then(res => {
        return res;
      })
      .catch(err => {
        return Promise.reject(err);
      });
  }

  sleep_minutes(date) {
    return this._get(this.toString() + '/' + date + '/sleep_minutes')
      .then(res => {
        return res;
      })
      .catch(err => {
        return Promise.reject(err);
      });
  }

  props(date) {
    return this._get(this.toString() + '/' + date + '/props')
      .then(res => {
        return res;
      })
      .catch(err => {
        return Promise.reject(err);
      });
  }

  all(date) {
    return this._get(this.toString() + '/' + date + '/all')
      .then(res => {
        return res;
      })
      .catch(err => {
        return Promise.reject(err);
      });
  }
}

Leaderboard.$inject = ['AppConstants', '$http', '$httpParamSerializer'];

export default Leaderboard;
