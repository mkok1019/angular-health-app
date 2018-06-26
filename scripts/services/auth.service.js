import API from './api.service.js';
import localStorage from 'localStorage';

class Auth extends API {
  constructor(AppConstants, $http, $httpParamSerializer, $state) {
    super(AppConstants, $http, $httpParamSerializer);
    this._$state = $state;
  }

  login(user) {
    return this._post('auth/login', user)
      .then(result => {
        const token = _.get(result, 'client.token', null);
        this.setToken(token);

        return result;
      })
      .catch(err => {
        return false;
      });
  }

  resetPasswrod(email) {
    return this._post('auth/forgot', {email})
      .then(result => {
        return result.success;
      })
      .catch(err => {
        return false;
      });
  }

  logout() {
    return this._delete('auth/logout')
      .then(result => {
        this.clearToken();
        this.me = null;
        return true;
      })
      .catch(err => {
        return false;
      });
  }

  setToken(token = null) {
    localStorage.setItem(this._AppConstants.appKey, token)
  }

  clearToken() {
    this.setToken(null);
  }

  register(user) {
    user.password_confirmation = user.password;

    return this._post('auth', user)
      .then(result => {
        const token = _.get(result, 'client.token', null);
        this.setToken(token);

        return true;
      })
      .catch(err => {
        return false;
      });
  }

  getProfile() {
    return this._get('profile')
      .then(res => {
        this.me = res.client;
        return true;
      })
      .catch(err => {
        return Promise.reject(err);
      })
  }

  updateProfile(profile) {
    return this._put('profile', profile)
      .then(res => {
        this.me = res.client;
        return res;
      })
      .catch(err => {
        return err;
      });
  }

  updateBio(bio) {
    return this._put('profile/bio', bio)
      .then(res => {
        this.me = res.client;
        return res;
      })
      .catch(err => {
        return err;
      });
  }

  updateSetting(setting) {
    return this._put('profile/setting', setting)
      .then(res => {
        this.me = res.client;
        return res;
      })
      .catch(err => {
        return err;
      });
  }

  updatePassword(password) {
    return this._put('profile/password', password)
      .then(res => {
        return true;
      })
      .catch(err => {
        return false;
      });
  }

  ensureAuth() {
    const self = this;

    return new Promise((resolve, reject) => {
      if ( self.me ) {
        return resolve(self.me);
      } else {
        this.getProfile()
          .then(res => {
            return resolve(this.me);
          })
          .catch(err => {
            self._$state.go('login');
          });
      }
    });
  }
}

Auth.$inject = ['AppConstants', '$http', '$httpParamSerializer', '$state'];

export default Auth;
