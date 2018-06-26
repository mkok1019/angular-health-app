class API {
  constructor(AppConstants, $http, $httpParamSerializer) {
    this.baseAPIURL = AppConstants.api;
    this._AppConstants = AppConstants;
    this._$http = $http;
    this._$httpParamSerializer = $httpParamSerializer;
    this.cache = null;
  }

  toString() {
    return "";
  }

  buildURL(url=null) {
    let fullUrl = this.baseAPIURL;
    if (url) {
      fullUrl += url;
    }
    fullUrl += '.json';

    return fullUrl;
  }

  _api(options) {
    return this._$http(options)
      .then(res => {
        if (res.data.success) {
          return Promise.resolve(res.data);
        } else {
          return Promise.reject(res.data);
        };
      })
      .catch(err => {
        return Promise.reject(err.data);
      });
  }

  _public_api(url) {
    return this._api({
      url: this._AppConstants.public_api + url + '.json',
      method: 'GET'
    });
  }

  _post(url, data=null) {
    return this._api({
      url: this.buildURL(url),
      method: 'POST',
      data: data
    });
  }

  _put(url, data=null) {
    return this._api({
      url: this.buildURL(url),
      method: 'PUT',
      data: data
    });
  }

  _get(url=null, data=null) {
    let qs = data ? '?' + this._$httpParamSerializer(data) : '';

    return this._api({
      url: this.buildURL(url) + qs,
      method: 'GET'
    });
  }

  _delete(url=null, data=null) {
    let qs = data ? '?' + this._$httpParamSerializer(data) : '';

    return this._api({
      url: this.buildURL(url) + qs,
      method: 'DELETE'
    });
  }

  list(query) {
    const params = this.getQueryParams(query);

    return this._get(this.toString(), params)
      .then(res => {
        return res;
      })
      .catch(err => {
        return Promise.reject(err);
      });
  }

  get(id) {
    return this._get(this.toString() + '/' + id)
      .then(res => {
        return res;
      })
      .catch(err => {
        return Promise.reject(err);
      });
  }

  create(object) {
    return this._post(this.toString(), object)
      .then(res => {
        return res;
      })
      .catch(err => {
        return Promise.reject(err);
      });
  }

  update(id, object) {
    return this._put(this.toString() + '/' + id, object)
      .then(res => {
        return res;
      })
      .catch(err => {
        return Promise.reject(err);
      })
  }

  month(query) {
    return this._get(`${this.toString()}/month`, query)
      .then(res => {
        return res;
      })
      .catch(err => {
        return Promise.reject(err);
      });
  }

  getQueryParams(query) {
    query = query || {};
    let params = _.clone(query);
    params.sort = null;

    if (query.sort) {
      if (query.sort[0] === '-') {
        params.order = query.sort.substring(1) + ' DESC';
      } else {
        params.order = query.sort + ' ASC';
      }
    }
    return params;
  }

}

export default API;
