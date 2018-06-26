import angular from 'angular';
import Home from './home';
import Login from './login';
import Register from './register';
import ForgotPassword from './forgot-password';
import Account from './account';
import AccountBio from './account-bio';
import AccountSetting from './account-setting';
import AccountApp from './account-app';

let pageModule = angular.module('app.pages', [
  Register,
  Login,
  ForgotPassword,
  Home,
  Account,
  AccountBio,
  AccountSetting,
  AccountApp
])

.name;

export default pageModule;
