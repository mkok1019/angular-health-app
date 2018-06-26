class TimelineController {
  constructor($mdDialog, GoalRecord) {
    this._$mdDialog = $mdDialog;
    this._GoalRecord = GoalRecord;
    this.isExpanded = true;
  }

  $onChanges() {
    this.load();
  }

  load() {
    this._GoalRecord.timeline()
      .then(res => {
        this.convert(res.goal_records);
      });
  }

  convert(goal_records) {
    let prev = null;
    let days = {
      fat_loss: 0,
      non_fat_loss: 0
    };

    goal_records = goal_records.reverse().map(goal_record => {
      let d = 0;
      if (prev) {
        d = moment(goal_record.created_at).diff(moment(prev.created_at), 'days');
      }

      if (prev && prev.goal == 'Fat Loss') days.fat_loss += d;
      else if (prev && prev.goal != 'Training Room') days.non_fat_loss += d;

      if (goal_record.goal == 'Fat Loss') goal_record.time_in_goal = days.fat_loss + 1;
      else if (goal_record.goal == 'Training Room') goal_record.time_in_goal = 1;
      else goal_record.time_in_goal = days.non_fat_loss + 1;

      prev = goal_record;
      
      goal_record.date = moment(goal_record.created_at).format('M/D/YYYY');
      return goal_record;
    });

    const results = {};
    for (var i = 0; i < goal_records.length; i++) {
      results[goal_records[i].date] = goal_records[i];
    }

    this.goal_records = _.values(results);
  }

  toggle() {
    this.isExpanded = !this.isExpanded;
  }

  showDescription($event) {
    $event.preventDefault();
    $event.stopPropagation();
    this._$mdDialog.show(
      this._$mdDialog.alert()
        .parent(angular.element(document.body))
        .clickOutsideToClose(true)
        .title('More Information')
        .textContent('This is your timeline. It will help you look back and see your journey through Eat to Perform. You can see how long you have spent in each of the phases and what your average calories are at each goalpost along the way')
        .ariaLabel('timeline-info-dialog')
        .ok('OK')
    );
  }
}

TimelineController.$inject = ['$mdDialog', 'GoalRecord'];

export default TimelineController;
