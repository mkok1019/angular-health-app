import API from './api.service.js';

class MacroGoal extends API {
  constructor(AppConstants, $http, $httpParamSerializer) {
    super(AppConstants, $http, $httpParamSerializer);
  }

  toString() {
    return 'workout_types';
  }

  list() {
    const url = this.toString();
    return this._public_api(url)
      .then(res => {
        return res;
      })
      .catch(err => {
        return false;
      });
  }
}

MacroGoal.$inject = ['AppConstants', '$http', '$httpParamSerializer'];

export default MacroGoal;
