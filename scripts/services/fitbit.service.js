class Fitbit {
  constructor(AppConstants, Auth, $http, $httpParamSerializer, $location, $base64) {
    this.baseAPIURL = AppConstants.api;
    this._AppConstants = AppConstants;
    this._Auth = Auth;
    this._$http = $http;
    this._$httpParamSerializer = $httpParamSerializer;
    this._$location = $location;
    this._$base64 = $base64;

    this.cache = null;
  }

  buildURL(url) {
    return this._AppConstants.fitbit.base_url + url;
  }

  _api(options) {
    return this._$http(options)
      .then(res => {
        return Promise.resolve(res.data);
      })
      .catch(err => {
        return Promise.reject(err.data);
      });
  }

  _post(url, data=null, headers={}) {
    return this._api({
      url: this.buildURL(url),
      method: 'POST',
      data: this._$httpParamSerializer(data),
      headers: headers
    });
  }

  _get(url=null, data=null, headers={}) {
    let qs = data ? '?' + this._$httpParamSerializer(data) : '';

    return this._api({
      url: this.buildURL(url) + qs,
      method: 'GET',
      headers: headers
    });
  }

  getCurrentUrl() {
    return this._$location.absUrl().split('?')[0].split('#')[0];
  }

  getAuthorizationToken() {
    const str = `${this._AppConstants.fitbit.client_id}:${this._AppConstants.fitbit.client_secret}`;
    return `Basic ${this._$base64.encode(str)}`;
  }

  getAuthenticationUrl() {
    const params = {
      response_type: 'code',
      client_id: this._AppConstants.fitbit.client_id,
      redirect_uri: this.getCurrentUrl(),
      scope: this._AppConstants.fitbit.scope
    };

    let qs = _.reduce(params, function(result, value, key) {
            return (!_.isNull(value) && !_.isUndefined(value)) ? (result += key + '=' + value + '&') : result;
        }, '').slice(0, -1);

    return `${this._AppConstants.fitbit.authroization_url}?${qs}`;
  }

  getAccessToken() {
    const code = _.get(this._$location.search(), 'code');
    if (code) {
      const headers = {
        'Authorization': this.getAuthorizationToken(),
        'Content-Type': "application/x-www-form-urlencoded"
      };
      const data = {
        client_id: this._AppConstants.fitbit.client_id,
        grant_type: 'authorization_code',
        redirect_uri: this.getCurrentUrl(),
        code: code,
        expires_in: 31536000
      };

      return this._post('/oauth2/token', data, headers)
        .then(res => {
          return Promise.resolve(res);
        })
        .catch(err => {
          return Promise.resolve(false);
        });
    } else {
      return Promise.resolve(false);
    }
  }

  getHeaders() {
    const info = _.get(this._Auth.me, 'setting.fitbit_info', null);
    const object = JSON.parse(info);

    return object ? {
      'Accept-Language': 'en_US',
      'Authorization': `${_.get(object, 'token_type')} ${_.get(object, 'access_token')}`
    } : null;
  }

  getProfile() {
    const headers = this.getHeaders();
    if (headers) {
      return this._get('/1/user/-/profile.json', null, headers)
        .then(res => {
          return res;
        })
        .catch(err => {
          return err;
        });
    } else {
      return Promise.reject(false);
    }
  }

  getLogData(date) {
    const headers = this.getHeaders();
    if (!headers) return Promise.resolve(null);

    const promises = [
      this._get(`/1/user/-/activities/date/${date}.json`, null, headers),       // steps
      this._get(`/1/user/-/body/log/weight/date/${date}.json`, null, headers),  // weight
      this._get(`/1/user/-/sleep/date/${date}.json`, null, headers),            // sleep_minutes
      this._get(`/1/user/-/foods/log/date/${date}.json`, null, headers)         // protein, carbs, fat
    ];

    return Promise.all(promises)
      .then(args => {
        let data = {
          steps: _.get(args[0], ['summary', 'steps'], 0),
          weight: _.get(_.last(_.get(args[1], 'weight')), 'weight', 0),
          sleep_minutes: _.get(args[2], ['summary', 'totalMinutesAsleep'], 0),
          protein: _.get(args[3], ['summary', 'protein'], 0),
          carbs: _.get(args[3], ['summary', 'carbs'], 0),
          fat: _.get(args[3], ['summary', 'fat'], 0),
          fiber: _.get(args[3], ['summary', 'fiber'], 0),
          sugar: _.get(args[3], ['summary', 'sugar'], 0),
          rhr: 0,
          sodium: _.get(args[3], ['summary', 'sodium'], 0)
        };
        data.calories_burned = data.protein * 4 + data.carbs * 4 + data.fat * 9;

        return Promise.resolve(data);
      })
      .catch(err => { 
        return Promise.reject(err);
      });
  }
}

Fitbit.$inject = ['AppConstants', 'Auth', '$http', '$httpParamSerializer', '$location', '$base64'];

export default Fitbit;
