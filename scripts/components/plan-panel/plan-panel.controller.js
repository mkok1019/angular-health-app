class PlanPanelController {
  constructor(MacroPlan, MacroGoal, AlertService) {
    this._MacroPlan = MacroPlan;
    this._MacroGoal = MacroGoal;
    this._AlertService = AlertService;

    this.init();
  }

  init() {
    this.weekdays = moment.weekdays();
    this.isExpanded = true;

    this._MacroGoal.list()
      .then(res => {
        this.macro_goals = res.macro_goals;
      });

    this.load();
  }

  load() {
    Promise.all([
      this._MacroPlan.date(moment().format('YYYY-MM-DD')),
      this._MacroPlan.weekly_goals()
    ]).then(([mp, wg]) => {
      this.macro_plan = mp.macro_plan;
      this.weekly_goals = wg.weekly_goals;

      const weekday = this.weekdays[this.macro_plan.weekly_goals.indexOf('S')]
      const current_weeekly_goals = _.find(this.weekly_goals, {weekday});

      if (current_weeekly_goals) {
        this.current_weeekly_goals = current_weeekly_goals.goals;
      }
    });
  }

  getValues(weekday) {
    const goal = _.get(this.getGoal(weekday), 'title', '').toLowerCase();
    const props = ['protein', 'carbs', 'fat'];
    let values = {}

    _.forEach(props, prop => {
      const key = `${goal}_${prop}`;
      values[prop] = _.get(this.macro_plan, key, 0);
    });
    values['calories'] = values.protein * 4 + values.carbs * 4 + values.fat * 9;

    return values;
  }

  isActive(weekday) {
    return moment().format('dddd') === weekday;
  }

  toggle() {
    this.isExpanded = !this.isExpanded;
  }

  getGoal(weekday) {
    if (this.macro_plan && this.macro_goals) {
      const key = this.macro_plan.weekly_goals[this.weekdays.indexOf(weekday)];
      const macro_goal = _.find(this.macro_goals, {key});
      return macro_goal;
    }
    return {};
  }

  update() {
    this._MacroPlan.update(this.macro_plan.id, {
      weekly_goals: this.current_weeekly_goals
    })
      .then(res => {
        if (res && res.success) {
          this._AlertService.success("Your macro plan is updated successfully!");
          this.load();
          this.onUpdate();
        } else {
          this._AlertService.error("Failed to update your macro plan.");
        }
      });
  }
}

PlanPanelController.$inject = ['MacroPlan', 'MacroGoal', 'AlertService'];

export default PlanPanelController;
