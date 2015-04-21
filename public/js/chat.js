'use strict';

/**
 * Controller for the real-time chat component
 * 
 * @author Giannis Georgalis <jgeorgal@meme.hokudai.ac.jp>
 */
ww3Controllers.controller('ChatCtrl', ['$scope', '$timeout', 'gettext', 'authService', 'socket', '$rootScope',
function ($scope, $timeout, gettext, authService, socket, $rootScope) {

	////////////////////////////////////////////////////////////////////
	// Scope variables
	//
	//$scope.user = authService.loggedInUser; // Let it inherit the user from the parent scope

	$scope.chatDisabled = true;
	$scope.chatVisible = false;

	$scope.messages = [];


	////////////////////////////////////////////////////////////////////
	// Utility functions
	//
	function scrollToEnd() {

		$timeout(function() {

			var elem = document.getElementById('chat-area');
			if (elem)
				elem.scrollTop = elem.scrollHeight;
		}, 100);
	}
	function getAvatarUrl() {

		return $scope.user && $scope.user.image_urls.length ?
			$scope.user.image_urls[0] : 'images/generic_avatar.png';
	}

	////////////////////////////////////////////////////////////////////
	// functions
	//
	$scope.sendMessage = function() {

		var text = $scope.currentTextMessage.trim();
		$scope.currentTextMessage = null;

		if (text.length != 0) {

			socket.emit('chat:message', {

				text: text,
				from: $scope.user ? $scope.user.name.first : gettext("Anonymous Coward"),
				img: getAvatarUrl()
			});

			$scope.messages.push({
				text: text, from: gettext("me"), img: getAvatarUrl(), date: Date.now(), me: true
			});
			scrollToEnd();
		}
	};

	////////////////////////////////////////////////////////////////////
	// Reaction to events...
	//
	socket.on('chat:message', function (msg) {

		$scope.messages.push(msg);
		scrollToEnd();
	});

	$scope.$watch('chatDisabled', function(newValue, oldValue) {

		if (newValue !== oldValue) {

			console.log("Changing chat ENABLED status from:", !oldValue, "to", !newValue);
			socket.emit(newValue ? 'chat:ended' : 'chat:started');
		}
	});

	// Micke probably added this...
    $scope.$on("showChat", function(){
        $scope.chatDisabled = false;
        $scope.chatVisible = true;
    });
}]);

