import API from './api.service.js';

class MacroPlan extends API {
  constructor(AppConstants, $http, $httpParamSerializer) {
    super(AppConstants, $http, $httpParamSerializer);
  }

  toString() {
    return 'macro_plans';
  }

  date(plan_date) {
    return this._get(`${this.toString()}/date/${plan_date}`)
      .then(res => {
        return res;
      })
      .catch(err => {
        return false;
      });
  }

  weekly_goals() {
    const url = this.toString() + '/weekly_goals';
    return this._public_api(url)
      .then(res => {
        return res;
      })
      .catch(err => {
        return false;
      });
  }
}

MacroPlan.$inject = ['AppConstants', '$http', '$httpParamSerializer'];

export default MacroPlan;
