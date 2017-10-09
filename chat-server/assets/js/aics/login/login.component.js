angular.module('aics')
  .component('login', {
    templateUrl: './assets/js/aics/login/login.template.html',
    controller: function LoginController($scope, sharedService) {

      const guid = function() {
        function s4() {
          return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
        }
        return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
          s4() + '-' + s4() + s4() + s4();
      };

      $scope.login = function() {
        var name = $scope.name;
        var password = $scope.password;

        if (name === undefined || name === '' ||
          password === undefined || password === '') {
          return;
        }

        if (password !== '12345678') {
          alert('Incorrect password.');
          return;
        }

        sharedService.setProfile({
          agentId: guid(),
          name: name
        });

        sharedService.goToMainPage();
      };

    }
  });
