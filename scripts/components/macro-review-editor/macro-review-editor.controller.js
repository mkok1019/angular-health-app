class MaroReviewEditorController {
  constructor(MacroReview, AlertService) {
    this._MacroReview = MacroReview;
    this._AlertService = AlertService;
  }

  $onInit() {
    this.init();
  }

  $onChanges(changes) {
    this.init();
  }

  init() {
    this.macro_review = {
      reason: ''
    };

    if (this.form) {
      this.form.$setPristine();
      this.form.$setUntouched();
    }
  }

  save() {
    this._MacroReview.create(this.macro_review)
      .then(res => {
        if (res && res.success) {
          this.init();
          this._AlertService.success("Review is requested successfully!");
          this.onUpdate();
        }
      })
      .catch(err => {
        this._AlertService.error(err.message || err.messages[0]);
      });
  }
}

MaroReviewEditorController.$inject = ['MacroReview', 'AlertService'];

export default MaroReviewEditorController;
