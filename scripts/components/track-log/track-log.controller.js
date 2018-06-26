class TrackLogController {
  constructor($scope, Auth, TrendRecord, MacroReview, MacroPlan, Note, GoalRecord, Message) {
    this._$scope = $scope;
    this._Auth = Auth;
    this._TrendRecord = TrendRecord;
    this._MacroReview = MacroReview;
    this._MacroPlan = MacroPlan;
    this._Note = Note;
    this._GoalRecord = GoalRecord;
    this._Message = Message;
  }

  $onInit() {
    this.init();
  }

  $onChanges(changes) {
    this.init();
  }

  init() {
    this.client = this._Auth.me;

    this.query = {
      year: moment(this.trendDate).year(),
      month: moment(this.trendDate).month() + 1
    };
    this.months = moment.monthsShort();

    this.load();
  }

  load() {
    if (!this.client) {
      return;
    }

    let promises = [
      this._TrendRecord.month(this.query),
      this._MacroReview.month(this.query),
      this._MacroPlan.month(this.query),
      this._Note.month(this.query),
      this._GoalRecord.month(this.query)
    ];

    if (this.hasAssignedCoach()) {
      promises.push(this._Message.month(this.query));
    }

    Promise.all(promises)
      .then(args => {
        this.trend_records  = _.get(args[0], 'trend_records', []);
        this.macro_reviews  = _.get(args[1], 'macro_reviews', []);
        this.macro_plans    = _.get(args[2], 'macro_plans', []);
        this.notes          = _.get(args[3], 'notes', []);
        this.goal_records   = _.get(args[4], 'goal_records', []);
        this.messages       = _.get(args[5], 'messages', []);

        this.combine();
      });
  }

  combine() {
    this.dataRows = [];

    this.notes          = _.sortBy(this.notes, 'created_at');
    this.trend_records  = _.sortBy(this.trend_records, 'trend_date');
    this.macro_plans    = _.sortBy(this.macro_plans, 'created_at');
    this.macro_reviews  = _.sortBy(this.macro_reviews, 'created_at');
    this.goal_records   = _.sortBy(this.goal_records, 'created_at');
    this.messages       = _.sortBy(this.messages, 'created_at');

    _.each(this.goal_records, o => {
      const row = _.cloneDeep(o);
      row.date = moment(new Date(o.created_at)).format('YYYY-MM-DD');
      row.type = 'goal-record';
      this.dataRows.push(row);
    });
    _.each(this.macro_reviews, o => {
      const row = _.cloneDeep(o);
      row.date = o.request_date;
      row.type = 'macro-review';
      row.pending = !o.review_date;
      this.dataRows.push(row);
    });
    _.each(this.macro_plans, o => {
      const row = _.cloneDeep(o);
      row.date = o.start_date;
      row.type = 'macro-plan';
      this.dataRows.push(row);
    });
    _.each(this.trend_records, o => {
      const row = _.cloneDeep(o);
      row.date = o.trend_date;
      row.type = 'trend-record';
      this.dataRows.push(row);
    });
    _.each(this.notes, o => {
      const row = _.cloneDeep(o);
      row.date = moment(new Date(o.created_at)).format('YYYY-MM-DD');
      row.type = 'client-note';
      this.dataRows.push(row);
    });
    _.each(this.messages, o => {
      const row = _.cloneDeep(o);
      row.date = moment(new Date(o.created_at)).format('YYYY-MM-DD');
      row.type = 'message';
      this.dataRows.push(row);
    });

    this.dataRows = _.sortBy(this.dataRows, ['date']).reverse();

    this._$scope.$apply();
  }

  prev() {
    this.query.month = this.query.month - 1;
    if (this.query.month == 0) {
      this.query.month = 12;
      this.query.year = this.query.year - 1;
    }
    this.load();
  }

  next() {
    this.query.month = this.query.month + 1;
    if (this.query.month > 12) {
      this.query.month = 1;
      this.query.year = this.query.year + 1;
    }
    this.load();
  }

  togglePlan(item) {
    if (item.isExpanded) {
      item.isExpanded = false;
    } else {
      this.dataRows.forEach(r => {
        if (r.type === 'macro-plan') {
          r.isExpanded = r.id === item.id;
        }
      });
    }
  }

  isTrendRecord(item) {
    return item.type === 'trend-record';
  }

  isMacroReview(item) {
    return item.type === 'macro-review';
  }

  isMacroPlan(item) {
    return item.type === 'macro-plan';
  }

  isClientNote(item) {
    return item.type === 'client-note';
  }

  isGoalRecord(item) {
    return item.type === 'goal-record';
  }

  isMessage(item) {
    return item.type === 'message';
  }

  showGoalPhase(item) {
    let result = item.goal;
    if (item.phase) {
      const phases = 'I II III IV V'.split(' ');
      result += ' - Phase ' + phases[item.phase - 1];
    }
    if (item.weight) {
      result += ` (${item.weight} lbs)`;
    }
    return result;
  }

  hasAssignedCoach() {
    return !!_.get(this._Auth.me, 'setting.coach.id');
  }

  getCellClass(item, prop) {
    const goal = _.get(item, 'macro_goal.title', '').toLowerCase();
    const value = _.get(item, prop, 0);

    let className = '';
    if (prop === 'protein' || prop === 'carbs' || prop === 'fat') {
      const key = goal + '_' + prop;
      const plan = _.get(item, ['macro_plan', key], 0);
      className = 'green';

      if (prop === 'fat') {
        if (value < plan - 5) className = 'orange';
        else if (value > plan + 5) className = 'red';
      } else {
        if (value < plan - 10) className = 'orange';
        else if (value > plan + 10) className = 'red';
      }
    } else if (prop === 'steps') {
      if (value > 8000) className = 'green';
      else if (value < 5000) className = 'red';
      else className = 'orange';
    } else if (prop === 'sleep_minutes') {
      if (value > 7*60) className = 'green';
      else if (value < 6 * 60) className = 'red';
      else className = 'orange';
    } else if (prop === 'calories_burned') {
      const plan = _.get(item, ['macro_plan', `${goal}_protein`], 0) * 4 
                 + _.get(item, ['macro_plan', `${goal}_carbs`], 0) * 4
                 + _.get(item, ['macro_plan', `${goal}_fat`], 0) * 9;
      if (value < plan * 0.95) className = 'orange';
      else if (value > plan * 1.05) className = 'red';
      else className = 'green';
    }

    return className;
  }
}

TrackLogController.$inject = ['$scope', 'Auth', 'TrendRecord', 'MacroReview', 'MacroPlan', 'Note', 'GoalRecord', 'Message'];

export default TrackLogController;
