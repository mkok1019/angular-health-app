import template from './leaderboard.html';
import controller from './leaderboard.controller';
import './leaderboard.scss';

let leaderboardComponent = {
  restrict: 'E',
  bindings: {
    updateAt: '<'
  },
  template,
  controller
};

export default leaderboardComponent;
