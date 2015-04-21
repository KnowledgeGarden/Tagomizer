'use strict';

/**
 * Assures that a specific value is equal to another one
 *
 * @author Giannis Georgalis <jgeorgal@meme.hokudai.ac.jp>
 */
angular.module('wblwrld3App').directive('confirmValue', function () {
	return {
		restrict: 'A',
		require: "ngModel",
		scope: {
			myValue: '=ngModel',
			confirmValue: '='
		},
		link: function(scope, element, attrs, ctrl) {

			// Watch this directive's model
			//
			scope.$watch('myValue', function(val) {
				ctrl.$setValidity('confirmValue', val === scope.confirmValue);
			});

			// Watch the other model set with the confirm-value attribute
			//
			scope.$watch('confirmValue', function(val) {
				ctrl.$setValidity('confirmValue', val === scope.myValue);
			});
		}
	};
});
