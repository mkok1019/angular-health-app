import API from './api.service.js';

class TrendRecord extends API {
  constructor(AppConstants, $http, $httpParamSerializer) {
    super(AppConstants, $http, $httpParamSerializer);
  }

  toString() {
    return 'trend_records';
  }

  getWeek(trend_date) {
    return this._get(`${this.toString()}/${trend_date}/week`)
      .then(res => {
        return res;
      })
      .catch(err => {
        return Promise.reject(err);
      });
  }

  getPropWeek(trend_date, prop) {
    return this._get(`${this.toString()}/${trend_date}/week/${prop}`)
      .then(res => {
        return res;
      })
      .catch(err => {
        return Promise.reject(err);
      });
  }

  getPropMonth(trend_date, prop) {
    return this._get(`${this.toString()}/${trend_date}/month/${prop}`)
      .then(res => {
        return res;
      })
      .catch(err => {
        return Promise.reject(err);
      });
  }

  weight(start_date) {
    const url = `${this.toString()}/weight`;
    const data = {start_date};

    return this._get(url, data)
      .then(res => {
        return res;
      })
      .catch(err => {
        return false;
      });
  }

  isEqual(a, b) {
    const props = [
      'protein',
      'carbs',
      'fat',
      'sodium',
      'calories_burned',
      'steps',
      'sleep_minutes',
      'weight'
    ];

    if (!a && !b) return true;
    if (!a || !b) return false;

    let result = true;
    for (let i = 0; i < props.length && result; i ++) {
      const prop = props[i];
      result =  result && (a[prop] === b[prop]);
    }

    return result;
  }
}

TrendRecord.$inject = ['AppConstants', '$http', '$httpParamSerializer'];

export default TrendRecord;
