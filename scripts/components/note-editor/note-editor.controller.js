class NoteEditorController {
  constructor(Note, WorkoutType, AlertService) {
    this._Note = Note;
    this._WorkoutType = WorkoutType;
    this._AlertService = AlertService;
  }

  $onChanges(changes) {
    this.init();
  }

  init() {
    this.note = {
      content: '',
      workout_type_id: null
    };

    if (this.noteForm) {
      this.noteForm.$setPristine();
      this.noteForm.$setUntouched();
    }

    this._WorkoutType.list()
      .then(res => {
        if (res) {
          this.workout_types = res.workout_types;
        }
      });
  }

  save() {
    this._Note.create(this.note)
      .then(res => {
        if (res && res.success) {
          this.init();
          this._AlertService.success("Note is saved successfully!");
          this.onUpdate();
        }
      });
  }
}

NoteEditorController.$inject = ['Note', 'WorkoutType', 'AlertService'];

export default NoteEditorController;
