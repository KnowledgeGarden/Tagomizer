'use strict';

/**
 * Enables an element to move (be dragged) freely inside its containing page
 *
 * @author Giannis Georgalis <jgeorgal@meme.hokudai.ac.jp>
 */
ww3Directives.directive('closeable', ['$window', '$document', function($window, $document) {
	return {
		restrict: 'C',
		link: function(scope, element, attrs) {

			// Close element
			//
			var closeElement = angular.element('<div class="navigate-elem"><span class="fa fa-2x fa-times-circle"></span></div>');
			closeElement.addClass('show');

			closeElement.bind('click', function() {

				scope.$apply(function() {
					scope.$dismiss();
				});
			});

			// Scroll element
			//
			var scrollElement = angular.element('<div class="navigate-elem"><span class="fa fa-2x fa-arrow-circle-up"></span></div>');
			scrollElement.css('right', '70px');

			scrollElement.bind('click', function() {

				scope.$apply(function() {
					$window.scrollTo(0, element[0].offsetTop - 100);
				});
			});
			element.append(closeElement).append(scrollElement);

			// Control the appearance-disappearance of the navigational elements
			//
			$document.on('scroll', function() {

				if ($window.pageYOffset > 200)
					scrollElement.addClass('show');
				else
					scrollElement.removeClass('show');
			});

/*
			//var foo = element.find('h1');
			var foo = angular.element(document).find('h1');

			console.log("LALALALAL", foo);

			 var closeElement = angular.element('<button class="navigate-wrapper btn btn-sm btn-danger pull-right"><span class="fa fa-times"></span> <span translate>Close</span></button>');
			 closeElement.bind('click', function() {

			 scope.$apply(function() {
				 scope.$dismiss();
				 });
			 });

			angular.forEach(foo, function(rawElement) {
				angular.element(rawElement).wrap('<div></div>').parent().prepend(closeElement); //.copy()
			});
*/
		}
	}
}]);
