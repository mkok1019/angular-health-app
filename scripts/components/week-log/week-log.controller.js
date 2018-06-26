class WeekLogController {
  constructor(TrendRecord) {
    this._TrendRecord = TrendRecord;
  }

  $onInit() {
    this.init();
  }

  $onChanges(changes) {
    this.init();
  }

  init() {
    this.trend_records = [];
    this.average = [
      { key: 'protein', label: 'Protein', value: 0, max: 300 },
      { key: 'carbs', label: 'Carbs', value: 0, max: 600 },
      { key: 'fat', label: 'Fat', value: 0, max: 200 },
      { key: 'sodium', label: 'Sodium', value: 0, max: 7500 },
      { key: 'steps', label: 'Steps', value: 0, max: 40000 },
      { key: 'sleep_minutes', label: 'Sleep (minutes)', value: 0, max: 1440 },
      { key: 'calories_burned', label: 'Calories', value: 0, max: 10000 },
      { key: 'weight', label: 'Wegiht (lbs)', value: 0, max: 1000 }
    ];

    this.load();
  }

  load() {
    const trend_date = moment(this.trendDate).format("YYYY-MM-DD");

    this._TrendRecord.getWeek(trend_date)
      .then(result => {
        if (result && result.success) {
          this.trend_records = result.trend_records;
        } else {
          this.trend_records = [];
        }
        this.calculateAverage();
      });
  }

  calculateAverage() {
    this.average = this.average.map(obj => {
      if (this.trend_records.length) {
        obj.value = _.sumBy(this.trend_records, obj.key) / this.trend_records.length;

        if (obj.key === 'weight') {
          obj.value = _.round(obj.value, 1);
        } else {
          obj.value = _.round(obj.value);
        }
      } else {
        obj.value = 0;
      }
      return obj;
    });
  }

  goDetail(prop) {
    this.onProp({$event: prop});
  }

  onSelectDate() {
    this.onDate({$event: this.trendDate})
  }

  showWeekRange() {
    const sun = moment(this.trendDate).day(0).format('MMM DD');
    const sat = moment(this.trendDate).day(6).format('MMM DD');
    return `${sun} - ${sat}`;
  }
}

WeekLogController.$inject = ['TrendRecord'];

export default WeekLogController;
