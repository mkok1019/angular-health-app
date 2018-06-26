class ChartLogController {
  constructor(TrendRecord) {
    this._TrendRecord = TrendRecord;

    this.title = {
      protein: "Proteins",
      carbs: "Carbs",
      fat: "Fats",
      sodium: "Sodium",
      steps: "Steps",
      sleep_minutes: "Sleep (minutes)",
      calories_burned: "Calories",
      weight: "Weight (lbs)"
    };

    this.props = _.keys(this.title);

    this.colors = ['#58C07E', '#45b7cd'];
  }

  $onInit() {
    this.init();
  }

  $onChanges(changes) {
    this.init();
  }

  init() {
    this.labels = [];
    this.data = [];
    this.duration = 'week';

    this.load();
  }

  load() {
    const date = moment(this.trendDate).format('YYYY-MM-DD');
    let promise = this.duration === 'week' ? 
      this._TrendRecord.getPropWeek(date, this.prop) :
      this._TrendRecord.getPropMonth(date, this.prop);
    
    promise
      .then(res => {
        this.trend_records = res.trend_records;
        this.buildGraph();
      });
  }

  setProp(item) {
    this.prop = item;
    this.load();
  }

  buildGraph() {
    this.dataset = this.isMixed() ? [
      {
        label: this.prop,
        borderWidth: 2,
        type: 'bar'
      },
      {
        label: "Plan",
        borderWidth: 3,
        type: 'line'
      }
    ] : [
      {
        label: this.prop,
        borderWidth: 3,
        type: 'line'
      }
    ];

    this.labels = this.trend_records.map(record => record.trend_date.slice(-2));

    let values = this.trend_records.map(record => record[this.prop] || 0);
    values.push(0);
    this.data = [values];

    if (this.isMixed()) {
      const plans = this.trend_records.map(record => record.plan);
      this.data.push(plans);
    }
  }

  isMixed () {
    return _.includes(['protein', 'carbs', 'fat'], this.prop);
  }

  setDuration(duration) {
    this.duration = duration;
    this.load();
  }
}

ChartLogController.$inject = ['TrendRecord', '$mdMenu'];

export default ChartLogController;
