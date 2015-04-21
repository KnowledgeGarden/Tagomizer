'use strict';

/**
 * Controller for the chaotic drawing component.
 * Actually, most of the work is done inside the draw directive
 *
 * @author Giannis Georgalis <jgeorgal@meme.hokudai.ac.jp>
 */
ww3Controllers.controller('DrawCtrl', [ '$scope', 'gettext',
function ($scope, gettext) {

	$scope.title = gettext("Chaotic Multi-User Draw Surface");
}]);
