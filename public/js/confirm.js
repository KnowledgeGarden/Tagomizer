'use strict';

/**
 * A convience service for enabling components to request verification from the user
 *
 * @author Giannis Georgalis <jgeorgal@meme.hokudai.ac.jp>
 */
ww3Services.factory('confirm', ['$rootScope', '$modal', 'gettext', function($rootScope, $modal, gettext) {
	return {

		show: function(title, message, confirmText, cancelText) {

			var modalInstance = $modal.open({
				template: '<div class="modal-header" style="background-color:#333333;"><h3 style="color:#ffffff;" class="modal-title"><span class="fa fa-check-square-o"></span> {{title}}</h3></div>' +
					'<div class="modal-body"><p style="padding:25px;">{{message}}</p></div>' +
					'<div class="modal-footer"><button class="btn btn-primary" ng-click="$dismiss()">{{cancelText}}</button>' +
					'<button class="btn btn-default" ng-click="$close()">{{confirmText}}</button></div>',
				controller: ['$scope', function($scope) {
					$scope.title = title;
					$scope.message = message;
					$scope.confirmText = confirmText;
					$scope.cancelText = cancelText;
				}],
				backdrop: 'static',
				keyboard: true
				/*,
				size: 'lg' */
			});
			return modalInstance.result;
		}
	};
}]);
