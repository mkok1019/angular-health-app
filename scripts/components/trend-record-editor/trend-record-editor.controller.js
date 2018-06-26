// import PlanDiagCtrl from './plan-diag.controller';

class TrendRecordEditorController {
  constructor(Auth, TrendRecord, MacroPlan, Fitbit, AlertService, $mdDialog) {
    this._Auth = Auth;
    this._TrendRecord = TrendRecord;
    this._MacroPlan = MacroPlan;
    this._Fitbit = Fitbit;
    this._AlertService = AlertService;
    this._$mdDialog = $mdDialog;

    this.init();
  }

  $onChanges(changes) {
    this.load();
  }

  init() {
    this.membership = _.get(this._Auth.me, 'clients_membership', null);
    this.props = [
      { key: 'protein',         label: 'Protein',         max: 300    },
      { key: 'carbs',           label: 'Carbs',           max: 999    },
      { key: 'fat',             label: 'Fat',             max: 200    },
      { key: 'sodium',          label: 'Sodium',          max: 7500   },
      { key: 'sugar',           label: 'Sugar',           max: 200    },
      { key: 'rhr',             label: 'RHR',             max: 200    },
      { key: 'fiber',           label: 'Fiber',           max: 120    },
      { key: 'steps',           label: 'Steps',           max: 40000  },
      { key: 'sleep_minutes',   label: 'Sleep (minutes)', max: 1440   },
      { key: 'calories_burned', label: 'Calories',        max: 10000,   disabled: true },
      { key: 'weight',          label: 'Weight (lbs)',    max: 1000   }
    ];

    this.default_trend_record = {};
    this.props.map(prop => {
      this.default_trend_record[prop.key] = 0;
    });

    this._MacroPlan.weekly_goals()
      .then(result => {
        this.weekly_goals = _.get(result, 'weekly_goals', []);
      });
  }

  load() {
    this.trend_date = this.trendDate;

    const trend_date = moment(this.trend_date).format('YYYY-MM-DD');

    this._MacroPlan.date(trend_date)
      .then(result => {
        this.macro_plan = result.macro_plan;
        this.macro_goal = result.macro_goal;
      });

    this.loadTrendData();
  }

  loadTrendData() {
    const trend_date = moment(this.trend_date).format('YYYY-MM-DD');

    this._TrendRecord.get(trend_date)
      .then(result => {
        if (result && result.success && result.trend_record) {
          return Promise.resolve(result.trend_record);
        } else {
          return Promise.resolve(null)
        }
      })
      .then(trend_record => {
        let result = [trend_record];
        if (!trend_record || !trend_record.is_manual_input) result.push(this._Fitbit.getLogData(trend_date));

        return Promise.all(result);
      })
      .then(args => {
        if (args[0] || args[1]) {
          if (args[0] && args[0].is_manual_input) {
            this.trend_record = args[0];
          } else {
            if (args[1]) {
              this.trend_record = args[1];
              if (!this._TrendRecord.isEqual(args[0], args[1])) {
                this.save(false);
              }
            } else {
              this.trend_record = args[0];
            }
          }
        } else {
          this.trend_record = this.default_trend_record;
        }
      })
      .catch(err => {
        this.trend_record = this.default_trend_record;
      });
  }

  hasPermission() {
    if (!this.membership) {
      this._AlertService.error("Please upgrade your membership, you can't use this function now");
      return false;
    }
    return true;
  }

  save(manual = true) {
    if (!this.hasPermission()) return;

    this.trend_record.trend_date = moment(this.trend_date).format('YYYY-MM-DD');
    this.trend_record.is_manual_input = manual;

    this._TrendRecord.create(this.trend_record)
      .then(result => {
        if (result && result.success) {
          this._AlertService.success("You trend data is saved successfully!");
          this.onUpdate();
        } else {
          this._AlertService.error("Failed to save your trend data, please try again!");
        }
      })
  }

  onChange() {
    this.trend_record.calories_burned = this.trend_record.protein * 4 + this.trend_record.carbs * 4 + this.trend_record.fat * 9;
  }

  onSelectDate() {
    this.onDate({$event: this.trend_date});
  }

  isFitbitData() {
    return !(this.trend_record && this.trend_record.is_manual_input) && _.get(this._Auth.me, 'setting.fitbit_info');
  }

  getClassOf(prop) {
    const C = {
      NORMAL: 'normal',
      WARN: 'warn',
      ALERT: 'alert'
    };

    let className = C.NORMAL;
    const value = _.get(this.trend_record, prop, 0);

    if (prop === 'protein' || prop === 'carbs' || prop === 'fat') {
      const goal = _.get(this.macro_goal, 'title', 'low').toLowerCase();
      const plan = _.get(this.macro_plan, `${goal}_${prop}`, 0);

      if (prop === 'fat') {
        if (value < plan - 5) className = C.WARN;
        else if (value > plan + 5) className = C.ALERT;
      } else {
        if (value < plan - 10) className = C.WARN;
        else if (value > plan + 10) className = C.ALERT;
      }
    } else if (prop === 'steps') {
      if (value > 8000) className = C.NORMAL;
      else if (value < 5000) className = C.ALERT;
      else className = C.WARN;
    } else if (prop === 'sleep_minutes') {
      if (value > 7*60) className = C.NORMAL;
      else if (value < 6 * 60) className = C.ALERT;
      else className = C.WARN;
    } else if (prop === 'calories_burned') {
      const goal = _.get(this.macro_goal, 'title', 'low').toLowerCase();
      const plan = _.get(this.macro_plan, `${goal}_protein`, 0) * 4 
                 + _.get(this.macro_plan, `${goal}_carbs`, 0) * 4
                 + _.get(this.macro_plan, `${goal}_fat`, 0) * 9;
      if (value < plan * 0.95) className = C.WARN;
      else if (value > plan * 1.05) className = C.ALERT;
      else className = C.NORMAL;
    }
    return className;
  }
}

TrendRecordEditorController.$inject = ['Auth', 'TrendRecord', 'MacroPlan', 'Fitbit', 'AlertService', '$mdDialog'];

export default TrendRecordEditorController;
