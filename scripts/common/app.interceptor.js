import localStorage from 'localStorage';

let authInterceptor = function (AppConstants, $q, $rootScope) {

  return {
    // automatically attach Authorization header
    request: function(config) {
      if (config.url.indexOf(AppConstants.api) === 0) {
        config.headers['Content-Type'] = 'application/json';
        
        const token = localStorage.getItem(AppConstants.appKey);
        if (token) {
          config.headers.Authorization = 'Token token=' + token;
        }
      }
      $rootScope.count_of_connection = ($rootScope.count_of_connection || 0) + 1;
      return config;
    },

    response : function(response) {
      $rootScope.count_of_connection = ($rootScope.count_of_connection || 1) - 1;
      return response || $q.when(response);
    },

    // Handle 401
    responseError: function(rejection) {
      $rootScope.count_of_connection = ($rootScope.count_of_connection || 1) - 1;
      return $q.reject(rejection);
    }

  }
}

authInterceptor.$inject = ['AppConstants', '$q', '$rootScope'];

export default authInterceptor;
