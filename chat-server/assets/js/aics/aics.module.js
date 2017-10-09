var app = angular.module('aics', ['ui.bootstrap']);

app.controller('ModalInstanceCtrl', function($scope, $uibModalInstance, items) {

  $scope.dismiss = function() {
    $uibModalInstance.close();
  };

});

app.service('sharedService', function($location) {

  var mainController = {};

  // setup
  var loadingPage = '';

  // errors
  var errorState = '';
  var errorMessage = '';

  // state
  var userProfile = null;

  return {
    goToMainPage: function() {
      $location.path('/main');
      mainController.currentPage = 'dashboard';
    },
    goToLogin: function() {
      $location.path('/login');
      mainController.currentPage = 'login';
    },
    logout: function() {
      userProfile = null;
      $location.path('/login');
      mainController.currentPage = 'login';
    },
    setProfile: function(profile) {
      userProfile = profile;
    },
    getProfile: function() {
      return userProfile;
    },
    getCurrentPage: function() {
      return mainController.currentPage;
    },
    setCurrentPage: function(page) {
      mainController.currentPage = page;
    },
    setMainController: function(controller) {
      mainController = controller;
    },
    showLoading: function() {
      loadingPage = mainController.currentPage;
      mainController.currentPage = 'isLoading';
    },
    hideLoading: function() {
      mainController.currentPage = loadingPage;
    }
  };

});

app.directive('loaderInner', [
  function() {
    return {
      restrict: 'C',
      scope: true,
      template: '<div ng-repeat="d in mkArray(divs) track by $index"></div>',
      link: function(scope, element) {
        scope.divs = 0;

        scope.mkArray = function(n) {
          return new Array(n);
        };

        scope.$watch(function() {
          return element.attr('class');
        }, function() {
          if (element.hasClass('ball-pulse')) {
            scope.divs = 3;
          }
        });
      }
    };
  }
]);

app.controller('PagesController', function($location, $scope, sharedService) {

  this.currentPage = 'isLoading';

  // give pointer to sharedService
  sharedService.setMainController(this);

  $scope.profile = sharedService.getProfile();

  if ($scope.profile) {
    sharedService.goToMainPage();
  } else {
    $location.path('/login');
    this.currentPage = 'login';
  }

  $scope.logout = function() {
    sharedService.logout();
  };

  $scope.getProfile = function() {
    return sharedService.getProfile();
  };

});
