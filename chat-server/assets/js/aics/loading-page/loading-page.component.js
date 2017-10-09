angular.module('aics')
  .component('loadingPage', {
  	template: '<div class="loading-animation mt50" align="center">' +
              	'<loader-inner class="ball-pulse">' +
	                '<div></div>' +
	                '<div></div>' +
	                '<div></div>' +
              	'</loader-inner>' +
              '</div>',
    controller: function LoadingPageController() {

    }
  });
