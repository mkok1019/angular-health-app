import API from './api.service.js';

class GoalRecord extends API {
  constructor(AppConstants, $http, $httpParamSerializer) {
    super(AppConstants, $http, $httpParamSerializer);
  }

  toString() {
    return 'goal_records';
  }

  timeline() {
    return this._get(`${this.toString()}/timeline`)
      .then(res => {
        return res;
      })
      .catch(err => {
        return Promise.reject(err);
      });
  }
}

GoalRecord.$inject = ['AppConstants', '$http', '$httpParamSerializer'];

export default GoalRecord;
