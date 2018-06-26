import angular from 'angular';

import Logo from './logo';
import Navbar from './navbar';
import TrackLog from './track-log';
import TrendRecordEditor from './trend-record-editor';
import WeekLog from './week-log';
import MacroReviewEditor from './macro-review-editor';
import NoteEditor from './note-editor';
import ChartLog from './chart-log';
import PlanPanel from './plan-panel';
import MessageEditor from './message-editor';
import Leaderboard from './leaderboard';
import Timeline from './timeline';
import WeightChart from './weight-chart';

let componentModule = angular.module('app.components', [
  Logo,
  Navbar,
  TrackLog,
  TrendRecordEditor,
  WeekLog,
  MacroReviewEditor,
  NoteEditor,
  ChartLog,
  PlanPanel,
  MessageEditor,
  Leaderboard,
  Timeline,
  WeightChart
])
  
.name;

export default componentModule;
