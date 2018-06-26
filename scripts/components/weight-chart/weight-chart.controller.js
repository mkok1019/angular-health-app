class WeightChartController {
  constructor(TrendRecord) {
    this._TrendRecord = TrendRecord;
  }

  $onChanges(changes) {
    this.load();
  }

  init() {
    this.colors = ['#45b7cd', '#900090', '#EB5446'];

    this.data = [ [], [], [] ];

    this.labels = [];

    this.options = { 
      elements: {
        point: {
          radius: 0
        }
      },
      legend: {
        display: true
      },
      scales: {
        yAxes: [
          {
            id: 'y-axis-weight',
            type: 'linear',
            display: true,
            position: 'left',
            scaleLabel: {
              display: true,
              labelString: 'Weight'
            }

          },
          {
            id: 'y-axis-calorie',
            type: 'linear',
            display: true,
            position: 'right',
            scaleLabel: {
              display: true,
              labelString: 'Calorie'
            }
          }
        ]
      }
    }

    this.dataset = [
      {
        label: 'Your Weight',
        borderWidth: 1,
        type: 'line',
        yAxisID: 'y-axis-weight'
      },
      {
        label: "Goal Weight",
        borderWidth: 1,
        type: 'line',
        yAxisID: 'y-axis-weight'
      },
      {
        label: 'ETP Progress Bar (you want this going up)',
        borderWidth: 2,
        type: 'line',
        fill: false,
        yAxisID: 'y-axis-calorie'
      }
    ];
  }

  load() {
    const start_date = moment().subtract(1, 'years').toString();

    this._TrendRecord.weight(start_date)
      .then(res => {
        if (res.success) {
          const goal_records = res.goal_records.map(r => {
            return {
              weight: r.weight,
              date: moment(r.created_at).format('YYYY-MM-DD')
            };
          });

          this.manipulate(goal_records, res.trend_records);
        }
      });
  }

  manipulate(goal_records, trend_records) {
    this.init();

    const today = moment().format('YYYY-MM-DD');
    if (trend_records.length == 0) {
      return;
    }

    let date = trend_records[0].trend_date;

    let myWeight = 0;
    let goalWeight = 0;
    while (today >= date) {
      const goal_record = _.findLast(goal_records, r => r.date == date);
      const trend_record = _.findLast(trend_records, r => r.trend_date == date);
      if (goal_record && goal_record.weight > 0) {
        goalWeight = goal_record.weight;
      }
      if (trend_record && trend_record.weight > 0) {
        myWeight = trend_record.weight;
      }
      if (myWeight > 0 && goalWeight >0) {
        this.labels.push(date);
        this.data[0].push(myWeight);
        this.data[1].push(goalWeight);
        this.data[2].push(_.get(trend_record, 'calories_burned', 0));
      }

      let [y, m, d] = date.split('-').map(v => parseInt(v));
      let dd = new Date();
      dd.setFullYear(y);
      dd.setMonth(m - 1);
      dd.setDate(d);

      date = moment(new Date(dd)).add(1, 'days').format('YYYY-MM-DD');
    }
  }
}

WeightChartController.$inject = ['TrendRecord'];

export default WeightChartController;
