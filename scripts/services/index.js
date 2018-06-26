import angular from 'angular';

import AuthService from './auth.service';

import ClientService from './client.service';

import MacroReviewService from './macro_review.service';

import MacroPlanService from './macro_plan.service';

import TrendRecordService from './trend_record.service';

import WorkoutTypeService from './workout_type.service';

import NoteService from './note.service';

import GoalService from './goal.service';

import GoalRecordService from './goal_record.service';

import MacroGoalService from './macro_goal.service';

import MessageService from './message.service';

import FitbitService from './fitbit.service';

import LeaderboardService from './leaderboard.service';

// Create the module where our functionality can attach to
let servicesModule = angular.module('app.services', [])

.service('Auth', AuthService)

.service('Client', ClientService)

.service('MacroReview', MacroReviewService)

.service('MacroPlan', MacroPlanService)

.service('MacroGoal', MacroGoalService)

.service('TrendRecord', TrendRecordService)

.service('WorkoutType', WorkoutTypeService)

.service('Note', NoteService)

.service('Goal', GoalService)

.service('GoalRecord', GoalRecordService)

.service('Message', MessageService)

.service('Fitbit', FitbitService)

.service('Leaderboard', LeaderboardService)
  
.name;


export default servicesModule;
