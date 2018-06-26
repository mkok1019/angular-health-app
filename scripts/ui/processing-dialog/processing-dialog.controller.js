class ProcessingDialogController {
  constructor($rootScope, $scope, $mdDialog) {
    this._$rootScope = $rootScope;
    this._$scope = $scope;
    this._$mdDialog = $mdDialog;
    this.isProcessing = false;
    this.init();
  }


  init () {
    const unbindWatch = this._$scope.$watch(() => this._$rootScope.count_of_connection, (v) => {
      if (v) {
        this.openModal();
      } else {
        this.closeModal();
      }
    });

    this._$rootScope.$on('$destroy', () => {
      unbindWatch();
    });
  }

  openModal() {
    if(!this.isProcessing) {
      this.isProcessing = true;
      this._$mdDialog.show({
        template: '<h4 layout layout-align="center">Processing...</h4>',
        parent: angular.element(document.body)
      });
    }
  }

  closeModal() {
    this._$mdDialog.hide();
    this.isProcessing = false;
  }
}

ProcessingDialogController.$inject = ['$rootScope', '$scope', '$mdDialog']

export default ProcessingDialogController ;
